#!/usr/bin/env node
/* W2b art site — local archive/reassignment admin tool.
   LOCAL ONLY. Never deployed, never public, never touches git.
   Run:  node .admin/server.js
   Then open the URL it prints (default http://127.0.0.1:4848).
   See .admin/README.md for the full explanation of what this can do
   and the architecture behind it. */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const GALLERY_DATA_PATH = path.join(ROOT, 'js', 'gallery-data.js');
const TRUNK_DATA_PATH = path.join(ROOT, 'js', 'trunk-data.js');
const CONFIG_PATH = path.join(__dirname, 'config.json');
const IMAGES_ROOT = path.join(ROOT, 'images');
const ARCHIVE_ROOT = path.join(IMAGES_ROOT, '_archive');
const UPLOAD_TMP_ROOT = path.join(__dirname, '_upload_tmp');
const COMPRESS_SCRIPT = path.join(ROOT, '.build', 'compress.js');
const RESPONSIVE_SCRIPT = path.join(ROOT, '.build', 'responsive.js');

const te = require('./lib/textedit');
const {
  setArchived, setMetaField, trilingualLiteral, yearLiteral,
  placeImage, insertNewImage, createGallery,
  reorderTrunkAnchor, createTrunkAnchor, addRelated, removeRelated, reorderRelated, detachBranch,
  findGallerySpan, findTrunkAnchor
} = te;

const PORT = process.env.PORT ? Number(process.env.PORT) : 4848;

// ---------------------------------------------------------------------
// Config / auth
// ---------------------------------------------------------------------
function ensureConfig() {
  if (fs.existsSync(CONFIG_PATH)) return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  const password = crypto.randomBytes(9).toString('base64url');
  const cfg = { password };
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2));
  console.log('\nGenerated a new local admin password (saved to .admin/config.json, gitignored):');
  console.log('  ' + password);
  console.log('Change it any time by editing .admin/config.json.\n');
  return cfg;
}
let config = ensureConfig();

const sessions = new Set(); // in-memory tokens; cleared on restart
function isAuthed(req) {
  const cookie = req.headers.cookie || '';
  const m = cookie.match(/w2bsession=([a-f0-9]+)/);
  return !!(m && sessions.has(m[1]));
}

// ---------------------------------------------------------------------
// Reading current state (read-only: vm-sandboxed eval of the real files,
// never a write path)
// ---------------------------------------------------------------------
function loadDataFiles() {
  const gsrc = fs.readFileSync(GALLERY_DATA_PATH, 'utf8');
  const tsrc = fs.readFileSync(TRUNK_DATA_PATH, 'utf8');
  // top-level `const`/`let` in a vm-run script do not become own
  // properties of the sandbox object (only `var` does) — these files are
  // read-only here anyway, so `var` vs `const` makes no behavioral
  // difference for this purpose.
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(gsrc.replace(/^const /gm, 'var '), ctx, { filename: 'gallery-data.js' });
  vm.runInContext(tsrc.replace(/^const /gm, 'var '), ctx, { filename: 'trunk-data.js' });
  return { gsrc, tsrc, GALLERY_DATA: ctx.GALLERY_DATA, GALLERY_ORDER: ctx.GALLERY_ORDER,
    TRUNK_MANIFEST_CURRENT: ctx.TRUNK_MANIFEST_CURRENT, TRUNK_MANIFEST_OTHER: ctx.TRUNK_MANIFEST_OTHER };
}

function buildState() {
  const { GALLERY_DATA, TRUNK_MANIFEST_CURRENT, TRUNK_MANIFEST_OTHER } = loadDataFiles();
  const galleries = Object.keys(GALLERY_DATA).map((id) => {
    const g = GALLERY_DATA[id];
    return {
      id,
      title: g.title,
      folder: g.folder,
      images: (g.images || []).map((im, idx) => ({
        idx, file: im.file, archived: !!im.archived,
        alt: im.alt && (im.alt.fr || im.alt.en) || '',
        title: im.title || null, medium: im.medium || null, year: im.year || null
      }))
    };
  });
  const mapManifest = (arr) => arr.map((e) => ({
    id: e.id, file: e.file,
    related: (e.related || []).map((r) => ({ series: r.series, file: r.file })),
    hasStatement: !!e.statement
  }));
  return {
    galleries,
    trunk: {
      current: mapManifest(TRUNK_MANIFEST_CURRENT),
      other: mapManifest(TRUNK_MANIFEST_OTHER)
    }
  };
}

// ---------------------------------------------------------------------
// Physical file moves (image + its responsive siblings, if any)
// ---------------------------------------------------------------------
function siblingsOf(dir, filename) {
  const ext = path.extname(filename);
  const base = filename.slice(0, -ext.length);
  if (!fs.existsSync(dir)) return [filename];
  return fs.readdirSync(dir).filter((f) => f === filename || f.startsWith(base + '-'));
}

function moveFiles(fromDir, toDir, filename) {
  if (!fs.existsSync(fromDir)) throw new Error('source folder does not exist: ' + fromDir);
  const names = siblingsOf(fromDir, filename);
  const missing = names.filter((n) => !fs.existsSync(path.join(fromDir, n)));
  if (missing.length) throw new Error('file(s) not found on disk: ' + missing.join(', '));
  fs.mkdirSync(toDir, { recursive: true });
  const moved = [];
  try {
    for (const n of names) {
      fs.renameSync(path.join(fromDir, n), path.join(toDir, n));
      moved.push(n);
    }
  } catch (e) {
    // best-effort rollback of whatever already moved
    for (const n of moved) {
      try { fs.renameSync(path.join(toDir, n), path.join(fromDir, n)); } catch (e2) { /* ignore */ }
    }
    throw e;
  }
  return names;
}

function folderFor(GALLERY_DATA, galleryId) {
  const g = GALLERY_DATA[galleryId];
  if (!g) throw new Error('unknown gallery: ' + galleryId);
  return path.join(ROOT, g.folder.replace(/\//g, path.sep));
}

// ---------------------------------------------------------------------
// Upload pipeline: reuses .build/compress.js + .build/responsive.js
// exactly as Guillaume would run them by hand (see .admin/README.md —
// this is the one explicit, designed exception to "never run the image
// pipeline": it's the admin tool's own job for a NEW upload, never run
// against existing content). Writes to a scratch dir first so a failed
// compress/responsive run never leaves a half-processed file sitting in
// images/.
// ---------------------------------------------------------------------
function runUploadPipeline(filename, dataBuffer, targetDir) {
  if (!/^[\w.-]+\.jpe?g$/i.test(filename)) throw new Error('upload: only .jpg/.jpeg files are accepted (filename: ' + filename + ')');
  const tmpDir = path.join(UPLOAD_TMP_ROOT, crypto.randomBytes(6).toString('hex'));
  fs.mkdirSync(tmpDir, { recursive: true });
  const tmpFile = path.join(tmpDir, filename);
  try {
    fs.writeFileSync(tmpFile, dataBuffer);
    execFileSync(process.execPath, [COMPRESS_SCRIPT, tmpFile], { cwd: ROOT, stdio: 'pipe' });
    execFileSync(process.execPath, [RESPONSIVE_SCRIPT, tmpFile], { cwd: ROOT, stdio: 'pipe' });
    // responsive.js also rewrote js/responsive-manifest.js with a path
    // keyed to tmpFile's location — that entry is meaningless (scratch
    // path) and must not leak into the real manifest. Undo just that one
    // spurious key by re-running responsive.js again below, on the FINAL
    // destination path, after moving the files — see caller.
    fs.mkdirSync(targetDir, { recursive: true });
    const produced = fs.readdirSync(tmpDir);
    const destPaths = [];
    for (const f of produced) {
      const dest = path.join(targetDir, f);
      fs.renameSync(path.join(tmpDir, f), dest);
      destPaths.push(dest);
    }
    return destPaths;
  } finally {
    try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch (e) { /* best effort */ }
  }
}

const RESPONSIVE_MANIFEST_PATH = path.join(ROOT, 'js', 'responsive-manifest.js');

/* responsive.js keys js/responsive-manifest.js by the path it was GIVEN,
   so running it against the scratch tmp path (required — compress.js must
   run in a scratch dir first, see runUploadPipeline) bakes in a bogus
   scratch-path manifest key. Re-run responsive.js a second time directly
   against the real destination path (cheap — sharp re-encodes in well
   under a second) so the manifest also gets a correctly-keyed entry, then
   strip the earlier scratch-path entry — the net result is exactly what
   the real manifest would look like if Guillaume had run responsive.js
   once, directly, against the final location. */
function fixResponsiveManifestKey(finalJpegPath) {
  execFileSync(process.execPath, [RESPONSIVE_SCRIPT, finalJpegPath], { cwd: ROOT, stdio: 'pipe' });

  const src = fs.readFileSync(RESPONSIVE_MANIFEST_PATH, 'utf8');
  const m = src.match(/const RESPONSIVE_MANIFEST = (\{[\s\S]*\});/);
  if (!m) return; // unexpected shape — leave it alone rather than guess
  const manifest = JSON.parse(m[1]);
  const tmpPrefix = path.relative(ROOT, UPLOAD_TMP_ROOT).split(path.sep).join('/') + '/';
  let changed = false;
  for (const key of Object.keys(manifest)) {
    if (key.startsWith(tmpPrefix)) { delete manifest[key]; changed = true; }
  }
  if (!changed) return;
  const header =
    '/* Auto-generated by .build/responsive.js — do not hand-edit.\n' +
    '   Lists which images have AVIF/WebP derivatives and at which\n' +
    '   widths, keyed by the same relative path used in the room\n' +
    '   system\'s <img src>. js/responsive-img.js only emits <picture>\n' +
    '   markup for images listed here; everything else stays a plain\n' +
    '   <img> — so this file starting empty/partial is always safe. */\n';
  fs.writeFileSync(RESPONSIVE_MANIFEST_PATH, header + 'const RESPONSIVE_MANIFEST = ' + JSON.stringify(manifest, null, 1) + ';\n');
}

// ---------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------
function requireAltFields(alt) {
  if (!alt || !alt.en || !alt.fr || !alt.es) throw new Error('alt text (en/fr/es) is required');
}

function applyAction(action) {
  const { gsrc, tsrc, GALLERY_DATA } = loadDataFiles();

  if (action.type === 'archive' || action.type === 'unarchive') {
    const { gallery, file } = action;
    const archived = action.type === 'archive';
    const newG = setArchived(gsrc, gallery, file, archived);
    const srcFolder = folderFor(GALLERY_DATA, gallery);
    const archFolder = path.join(ARCHIVE_ROOT, gallery);
    if (archived) moveFiles(srcFolder, archFolder, file);
    else moveFiles(archFolder, srcFolder, file);
    fs.writeFileSync(GALLERY_DATA_PATH, newG);
    return { ok: true };
  }

  if (action.type === 'move' || action.type === 'place') {
    // 'move' = legacy name, always appends; 'place' takes an optional
    // explicit `position` (0-based) within the target gallery's array.
    const { from, to, file, position } = action;
    if (from === to && position == null) throw new Error('place: give a position to reorder within the same gallery');
    const newG = placeImage(gsrc, from, to, file, position == null ? undefined : Number(position));
    if (from !== to) {
      const fromFolder = folderFor(GALLERY_DATA, from);
      const toFolder = folderFor(GALLERY_DATA, to);
      moveFiles(fromFolder, toFolder, file);
    }
    fs.writeFileSync(GALLERY_DATA_PATH, newG);
    return { ok: true };
  }

  if (action.type === 'set-meta') {
    // field: 'title' | 'medium' | 'year'; value: {en,fr,es} object, a
    // year number, or null to clear.
    const { gallery, file, field, value } = action;
    let literal = null;
    if (value != null) {
      literal = field === 'year' ? yearLiteral(value) : trilingualLiteral(value);
    }
    const newG = setMetaField(gsrc, gallery, file, field, literal);
    fs.writeFileSync(GALLERY_DATA_PATH, newG);
    return { ok: true };
  }

  if (action.type === 'create-gallery') {
    const { id, folder, title } = action;
    if (!/^branch-[\w-]+$/.test(id)) throw new Error('create-gallery: id must look like "branch-your-name" (lowercase, hyphens)');
    const newG = createGallery(gsrc, id, folder || ('images/' + id + '/'), title);
    fs.writeFileSync(GALLERY_DATA_PATH, newG);
    fs.mkdirSync(path.join(ROOT, (folder || ('images/' + id + '/')).replace(/\//g, path.sep)), { recursive: true });
    return { ok: true };
  }

  if (action.type === 'upload') {
    const { gallery, filename, dataBase64, position, alt, title, medium, year, attachToTrunkId } = action;
    requireAltFields(alt);
    const g = GALLERY_DATA[gallery];
    if (!g) throw new Error('upload: unknown gallery ' + gallery);
    const buf = Buffer.from(dataBase64, 'base64');
    if (buf.length === 0) throw new Error('upload: empty file');
    if (buf.length > 40 * 1024 * 1024) throw new Error('upload: file too large (>40MB) — pick the original, not an export');
    const targetDir = folderFor(GALLERY_DATA, gallery);

    // collision check up front — never silently overwrite an existing photo
    if (fs.existsSync(path.join(targetDir, filename))) {
      throw new Error('upload: "' + filename + '" already exists in ' + gallery + ' — rename the file and try again');
    }

    const produced = runUploadPipeline(filename, buf, targetDir);
    const finalJpeg = produced.find((p) => p.toLowerCase().endsWith('.jpg') || p.toLowerCase().endsWith('.jpeg'));
    fixResponsiveManifestKey(finalJpeg);

    let newG = insertNewImage(gsrc, gallery, position == null ? undefined : Number(position), {
      file: filename, alt, title: title || null, medium: medium || null, year: year || null
    });
    fs.writeFileSync(GALLERY_DATA_PATH, newG);

    let trunkMsg = '';
    if (attachToTrunkId) {
      // attach this freshly-uploaded branch photo to an existing anchor's
      // related[] in one step, so "upload into a branch" can also mean
      // "...and make it show up" without a second manual action.
      const newT = addRelated(tsrc, attachToTrunkId, gallery, filename, undefined);
      fs.writeFileSync(TRUNK_DATA_PATH, newT);
      trunkMsg = ' and attached to ' + attachToTrunkId;
    }
    return { ok: true, message: 'Uploaded ' + filename + ' into ' + gallery + trunkMsg };
  }

  if (action.type === 'trunk-move') {
    // legacy name: append-only move between the two pages
    const { id, toSet } = action;
    const newT = reorderTrunkAnchor(tsrc, id, toSet, undefined);
    fs.writeFileSync(TRUNK_DATA_PATH, newT);
    return { ok: true };
  }

  if (action.type === 'trunk-reorder') {
    const { id, toSet, position } = action;
    const newT = reorderTrunkAnchor(tsrc, id, toSet, position == null ? undefined : Number(position));
    fs.writeFileSync(TRUNK_DATA_PATH, newT);
    return { ok: true };
  }

  if (action.type === 'trunk-create-anchor') {
    const { toSet, file, position } = action;
    if (!GALLERY_DATA.trunk.images.some((im) => im.file === file)) {
      throw new Error('trunk-create-anchor: "' + file + '" is not in gallery-data.js\'s trunk.images — insert/upload it there first');
    }
    const { src: newT, id } = createTrunkAnchor(tsrc, toSet, file, position == null ? undefined : Number(position));
    fs.writeFileSync(TRUNK_DATA_PATH, newT);
    return { ok: true, id };
  }

  if (action.type === 'branch-add-related') {
    const { trunkId, branchSeries, file, position } = action;
    if (!GALLERY_DATA[branchSeries] || !GALLERY_DATA[branchSeries].images.some((im) => im.file === file)) {
      throw new Error('branch-add-related: "' + file + '" is not in ' + branchSeries + "'s images — upload/place it there first");
    }
    const newT = addRelated(tsrc, trunkId, branchSeries, file, position == null ? undefined : Number(position));
    fs.writeFileSync(TRUNK_DATA_PATH, newT);
    return { ok: true };
  }

  if (action.type === 'branch-remove-related') {
    const { trunkId, file } = action;
    const newT = removeRelated(tsrc, trunkId, file);
    fs.writeFileSync(TRUNK_DATA_PATH, newT);
    return { ok: true };
  }

  if (action.type === 'branch-reorder-related') {
    const { trunkId, branchSeries, file, position } = action;
    const newT = reorderRelated(tsrc, trunkId, branchSeries, file, Number(position));
    fs.writeFileSync(TRUNK_DATA_PATH, newT);
    return { ok: true };
  }

  if (action.type === 'branch-detach') {
    const { trunkId } = action;
    const newT = detachBranch(tsrc, trunkId);
    fs.writeFileSync(TRUNK_DATA_PATH, newT);
    return { ok: true };
  }

  throw new Error('unknown action type: ' + action.type);
}

// ---------------------------------------------------------------------
// HTTP plumbing (no framework, no deps)
// ---------------------------------------------------------------------
function send(res, status, body, headers) {
  res.writeHead(status, Object.assign({ 'Cache-Control': 'no-store' }, headers || {}));
  res.end(body);
}
function sendJson(res, status, obj) {
  send(res, status, JSON.stringify(obj), { 'Content-Type': 'application/json' });
}
function readBody(req, limit) {
  return new Promise((resolve, reject) => {
    let chunks = [];
    let len = 0;
    req.on('data', (c) => {
      len += c.length;
      if (len > (limit || 2e6)) { req.destroy(); reject(new Error('body too large')); return; }
      chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

const LOGIN_PAGE = `<!doctype html><html><head><meta charset="utf-8">
<title>W2b admin — sign in</title>
<style>body{font:15px system-ui;background:#111;color:#eee;display:flex;align-items:center;
justify-content:center;height:100vh;margin:0} form{background:#1b1b1b;padding:32px;border-radius:10px}
input{display:block;margin:12px 0;padding:8px;width:220px;font-size:15px}
button{padding:8px 16px;font-size:15px;cursor:pointer}</style></head>
<body><form method="post" action="/login">
<h2>W2b local admin</h2>
<input type="password" name="password" placeholder="password (see .admin/config.json)" autofocus>
<button>Enter</button>
</form></body></html>`;

const server = http.createServer(async (req, res) => {
  try {
    const u = new URL(req.url, 'http://localhost');

    if (req.method === 'POST' && u.pathname === '/login') {
      const body = (await readBody(req, 1e4)).toString('utf8');
      const params = new URLSearchParams(body);
      if (params.get('password') === config.password) {
        const token = crypto.randomBytes(16).toString('hex');
        sessions.add(token);
        send(res, 302, '', { Location: '/', 'Set-Cookie': 'w2bsession=' + token + '; HttpOnly; SameSite=Strict' });
      } else {
        send(res, 401, LOGIN_PAGE.replace('<h2>', '<p style="color:#f66">Wrong password.</p><h2>'), { 'Content-Type': 'text/html' });
      }
      return;
    }

    if (!isAuthed(req)) {
      send(res, 200, LOGIN_PAGE, { 'Content-Type': 'text/html' });
      return;
    }

    if (req.method === 'GET' && u.pathname === '/') {
      send(res, 200, fs.readFileSync(path.join(__dirname, 'admin.html')), { 'Content-Type': 'text/html' });
      return;
    }

    if (req.method === 'GET' && u.pathname === '/api/state') {
      sendJson(res, 200, buildState());
      return;
    }

    if (req.method === 'POST' && u.pathname === '/api/action') {
      // uploads (base64 JSON) can be large; everything else is tiny
      const body = (await readBody(req, 60e6)).toString('utf8');
      let action;
      try { action = JSON.parse(body); } catch (e) { sendJson(res, 400, { ok: false, error: 'bad JSON' }); return; }
      try {
        const result = applyAction(action);
        sendJson(res, 200, Object.assign(result, { state: buildState() }));
      } catch (e) {
        sendJson(res, 400, { ok: false, error: e.message });
      }
      return;
    }

    // serve a live image (from images/ or images/_archive/) for thumbnails
    if (req.method === 'GET' && u.pathname.startsWith('/img/')) {
      const rel = decodeURIComponent(u.pathname.slice('/img/'.length));
      const abs = path.join(IMAGES_ROOT, rel);
      if (!abs.startsWith(IMAGES_ROOT) || !fs.existsSync(abs)) { send(res, 404, 'not found'); return; }
      const ext = path.extname(abs).toLowerCase();
      const type = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif' }[ext] || 'application/octet-stream';
      send(res, 200, fs.readFileSync(abs), { 'Content-Type': type, 'Cache-Control': 'no-store' });
      return;
    }

    send(res, 404, 'not found');
  } catch (e) {
    sendJson(res, 500, { ok: false, error: e.message, stack: e.stack });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('W2b local admin tool running at http://127.0.0.1:' + PORT);
  console.log('(local only — bound to 127.0.0.1, never git/commit/push, never deployed)');
});
