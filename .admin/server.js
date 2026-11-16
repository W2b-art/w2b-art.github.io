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
  placeImage, insertNewImage, createGallery, setGalleryTitle, deleteGallery,
  reorderTrunkAnchor, createTrunkAnchor, addRelated, removeRelated, reorderRelated, detachBranch, deleteTrunkAnchor,
  setTrunkAnchorFile, setTrunkStatement,
  findGallerySpan, findTrunkAnchor
} = te;

const PORT = process.env.PORT ? Number(process.env.PORT) : 4848;

// ---------------------------------------------------------------------
// Publish (scoped git add+commit+push) — 2026-11-13, Guillaume's explicit
// request, overriding this tool's original "never touches git" design
// for exactly this narrow scope. Still never touches anything outside
// images/, the two data files, and the responsive manifest — the admin
// tool has no way to edit site code/templates, so there was nothing else
// to scope out in practice. Deliberately NOT a blanket `git add -A`:
// everything is staged by explicit path, and what actually got staged is
// re-checked against the same whitelist before committing, so a stray
// change sitting in the working tree for an unrelated reason (this is a
// shared git worktree) never rides along.
// ---------------------------------------------------------------------
const GIT_SCOPE = ['images', 'js/gallery-data.js', 'js/trunk-data.js', 'js/responsive-manifest.js'];

function git(args) {
  return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8' });
}

function gitStatusScoped() {
  let out;
  try {
    out = git(['status', '--porcelain', '--'].concat(GIT_SCOPE));
  } catch (e) {
    throw new Error('git status failed: ' + (e.stderr || e.message));
  }
  return out.split(/\r?\n/).filter(Boolean).map((line) => {
    const status = line.slice(0, 2).trim();
    let file = line.slice(3);
    const arrow = file.indexOf(' -> ');
    if (arrow !== -1) file = file.slice(arrow + 4);
    return { status, file };
  });
}

function gitPublish(message) {
  const pending = gitStatusScoped();
  if (!pending.length) throw new Error('nothing to publish — no pending changes in images/, gallery-data.js, trunk-data.js or responsive-manifest.js');

  git(['add', '--'].concat(GIT_SCOPE));

  const staged = git(['diff', '--cached', '--name-only']).split(/\r?\n/).filter(Boolean);
  const unexpected = staged.filter((f) => !GIT_SCOPE.some((p) => f === p || f.startsWith(p + '/')));
  if (unexpected.length) {
    try { git(['reset', '--']); } catch (e) { /* best effort unstage */ }
    throw new Error('refusing to publish: file(s) outside this tool\'s scope got staged (not committed) — ' + unexpected.join(', '));
  }

  const commitMessage = (message && message.trim()) || ('Admin: ' + staged.length + ' file(s) updated via local admin tool');
  try {
    git(['commit', '-m', commitMessage]);
  } catch (e) {
    throw new Error('git commit failed: ' + (e.stderr || e.message));
  }

  const sha = git(['rev-parse', '--short', 'HEAD']).trim();
  const branch = git(['rev-parse', '--abbrev-ref', 'HEAD']).trim();

  try {
    git(['push', 'origin', branch]);
  } catch (e) {
    throw new Error('committed locally (' + sha + ' on ' + branch + ') but the push failed — nothing is lost, fix the issue and hit Publish again: ' + (e.stderr || e.message));
  }

  return { sha, branch, filesCount: staged.length };
}

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
        alt: im.alt && (im.alt.fr || im.alt.en) || '', altFull: im.alt || null,
        title: im.title || null, medium: im.medium || null, year: im.year || null
      }))
    };
  });
  const mapManifest = (arr) => arr.map((e) => ({
    id: e.id, file: e.file,
    related: (e.related || []).map((r) => ({ series: r.series, file: r.file })),
    hasStatement: !!e.statement, statement: e.statement || null
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
// Title auto-translate (museum-label `title` field only — `medium`
// wording differs per language on purpose, see .admin/README.md, so it
// stays manual). Uses DeepL if `deeplApiKey` is set in .admin/config.json
// (optional, gitignored, Guillaume's own key — this tool never asks for
// or stores one on its own), else falls back to MyMemory's free, keyless
// translation API. Either way it's just a translation SUGGESTION: the admin UI only
// ever fills fields that are still empty/untouched, nothing is written to
// gallery-data.js until he submits the form.
// ---------------------------------------------------------------------
const DEEPL_LANG = { en: 'EN', fr: 'FR', es: 'ES' };
const LT_LANG = { en: 'en', fr: 'fr', es: 'es' };

async function translateOne(text, from, to) {
  if (config.deeplApiKey) {
    const host = /:fx$/.test(config.deeplApiKey) ? 'api-free.deepl.com' : 'api.deepl.com';
    const r = await fetch('https://' + host + '/v2/translate', {
      method: 'POST',
      headers: { 'Authorization': 'DeepL-Auth-Key ' + config.deeplApiKey, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ text, source_lang: DEEPL_LANG[from], target_lang: DEEPL_LANG[to] })
    });
    if (!r.ok) throw new Error('DeepL API error ' + r.status);
    const j = await r.json();
    return j.translations[0].text;
  }
  // MyMemory: free, keyless, no account needed (LibreTranslate's public
  // instance now requires an API key, confirmed when first wiring this up
  // — MyMemory is the one that actually works with zero setup).
  const langpair = encodeURIComponent(LT_LANG[from] + '|' + LT_LANG[to]);
  const r = await fetch('https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) + '&langpair=' + langpair);
  if (!r.ok) throw new Error('MyMemory error ' + r.status);
  const j = await r.json();
  if (!j.responseData || !j.responseData.translatedText) throw new Error('MyMemory: no translation returned');
  return j.responseData.translatedText;
}

async function translateTitle(text, from, targets) {
  const out = {};
  for (const to of targets) out[to] = await translateOne(text, from, to);
  return out;
}

// ---------------------------------------------------------------------
// Auto alt text (2026-11-15) — Guillaume: he writes the title on upload,
// alt text is generated automatically, from an actual look at the photo,
// for real (not generic/keyword-stuffed) SEO. Requires `anthropicApiKey`
// in .admin/config.json (his own key from console.anthropic.com, gitignored,
// never asked for or stored by this tool on its own) — unlike translation,
// there's no free keyless fallback for real vision captioning, so this
// throws a clear, actionable error when the key is missing rather than
// silently degrading to something worse.
// ---------------------------------------------------------------------
async function generateAltTextEn(imageBuffer, context) {
  if (!config.anthropicApiKey) {
    throw new Error('alt-text generation needs an Anthropic API key — add "anthropicApiKey" to .admin/config.json (get one at console.anthropic.com); there is no free fallback for real photo captioning');
  }
  const contextLines = [];
  if (context.title) contextLines.push('Title the photographer gave it: "' + context.title + '"');
  if (context.medium) contextLines.push('Medium: ' + context.medium);
  if (context.location) contextLines.push('Location: ' + context.location);
  if (context.year) contextLines.push('Year: ' + context.year);
  const prompt = 'Write alt text (English) for this photograph, for a fine-art/commercial photographer\'s website.\n\n' +
    'Describe concretely what is actually visible — subject, action, setting, light, color or black-and-white — in one ' +
    'natural sentence, the way a sighted person would describe it to someone who can\'t see it. This is for real ' +
    'accessibility and SEO, so be specific and accurate to the image, never generic ("a photo of...", "an image showing...") ' +
    'and never keyword-stuffed. Do not invent anything not visible in the image. Do not just repeat the title verbatim.' +
    (contextLines.length ? '\n\nContext (for your reference only — describe the image, don\'t just restate this):\n' + contextLines.join('\n') : '') +
    '\n\nReply with ONLY the alt text itself, nothing else — no quotes, no preamble, no "Alt text:" prefix.';

  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': config.anthropicApiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-haiku-5-5',
      max_tokens: 300,
      messages: [{
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBuffer.toString('base64') } },
          { type: 'text', text: prompt }
        ]
      }]
    })
  });
  if (!r.ok) {
    const body = await r.text().catch(() => '');
    throw new Error('Anthropic API error ' + r.status + (body ? ': ' + body.slice(0, 300) : ''));
  }
  const j = await r.json();
  const text = j.content && j.content[0] && j.content[0].text;
  if (!text) throw new Error('alt-text generation: empty response from the Anthropic API');
  return text.trim().replace(/^["']|["']$/g, '');
}

// ---------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------
function requireAltFields(alt) {
  if (!alt || !alt.en || !alt.fr || !alt.es) throw new Error('alt text (en/fr/es) is required');
}

// If `series`/`file` is some trunk anchor's "related" branch photo,
// returns that anchor's id; else null. Used by the move/place handler
// below so moving a photo OUT of a branch it's currently attached to
// doesn't leave a dangling {series,file} reference behind (resolve()
// would just silently fail to find it — not a crash, but a related
// photo that quietly vanishes from the anchor for the wrong reason).
function findAnchorIdForRelated(TRUNK_MANIFEST_CURRENT, TRUNK_MANIFEST_OTHER, series, file) {
  for (const arr of [TRUNK_MANIFEST_CURRENT, TRUNK_MANIFEST_OTHER]) {
    for (const e of arr) {
      if ((e.related || []).some((r) => r.series === series && r.file === file)) return e.id;
    }
  }
  return null;
}

// The anchor (if any) that already claims `branchSeries` as its attached
// branch — i.e. some other file with that series already sits in its
// related[]. Mirrors findAnchorIdForRelated's detach-on-move-out: this is
// the symmetric attach-on-move-in, so placing a photo into a branch that's
// already hooked up to an anchor keeps it visible on Trunk/branches
// without a separate manual "attach" step.
function findAnchorIdForBranch(TRUNK_MANIFEST_CURRENT, TRUNK_MANIFEST_OTHER, branchSeries) {
  for (const arr of [TRUNK_MANIFEST_CURRENT, TRUNK_MANIFEST_OTHER]) {
    for (const e of arr) {
      if ((e.related || []).some((r) => r.series === branchSeries)) return e.id;
    }
  }
  return null;
}

async function applyAction(action) {
  const { gsrc, tsrc, GALLERY_DATA, TRUNK_MANIFEST_CURRENT, TRUNK_MANIFEST_OTHER } = loadDataFiles();

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
    let newT = tsrc;
    if (from !== to) {
      const fromFolder = folderFor(GALLERY_DATA, from);
      const toFolder = folderFor(GALLERY_DATA, to);
      moveFiles(fromFolder, toFolder, file);
      const anchorId = findAnchorIdForRelated(TRUNK_MANIFEST_CURRENT, TRUNK_MANIFEST_OTHER, from, file);
      if (anchorId) newT = removeRelated(tsrc, anchorId, file);
      const destAnchor = [...TRUNK_MANIFEST_CURRENT, ...TRUNK_MANIFEST_OTHER].find((e) => (e.related || []).some((r) => r.series === to));
      const alreadyRelated = destAnchor && (destAnchor.related || []).some((r) => r.series === to && r.file === file);
      if (destAnchor && !alreadyRelated) newT = addRelated(newT, destAnchor.id, to, file, undefined);
    }
    fs.writeFileSync(GALLERY_DATA_PATH, newG);
    if (newT !== tsrc) fs.writeFileSync(TRUNK_DATA_PATH, newT);
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

  if (action.type === 'set-gallery-title') {
    // renames the gallery/branch's own display name (GALLERY_DATA[id].title)
    // — not a photo's museum-label title, that's set-meta.
    const { gallery, title } = action;
    if (!title || !title.en || !title.fr || !title.es) throw new Error('set-gallery-title: title (en/fr/es) is required');
    const newG = setGalleryTitle(gsrc, gallery, title);
    fs.writeFileSync(GALLERY_DATA_PATH, newG);
    return { ok: true };
  }

  if (action.type === 'upload') {
    const { gallery, filename, dataBase64, position, alt, title, medium, location, year, attachToTrunkId } = action;
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

    // Alt text: an explicit client-supplied value wins (back-compat escape
    // hatch — nothing in the current admin.html sends one any more); other-
    // wise generate it here, from the actual compressed photo that just got
    // written, plus whatever title/medium/location/year context exists, then
    // translate EN->FR/ES through the same pipeline as title. Guillaume
    // writes the title; this writes the alt text.
    let finalAlt = alt;
    if (!finalAlt || !finalAlt.en) {
      const altEn = await generateAltTextEn(fs.readFileSync(finalJpeg), {
        title: title && (title.en || title.fr),
        medium: medium && medium.en,
        location: location && location.en,
        year
      });
      const translated = await translateTitle(altEn, 'en', ['fr', 'es']);
      finalAlt = { en: altEn, fr: translated.fr, es: translated.es };
    }
    requireAltFields(finalAlt);

    let newG = insertNewImage(gsrc, gallery, position == null ? undefined : Number(position), {
      file: filename, alt: finalAlt, title: title || null, medium: medium || null, location: location || null, year: year || null
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
    return { ok: true, message: 'Uploaded ' + filename + ' into ' + gallery + trunkMsg, generatedAlt: finalAlt };
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
    // Idempotent at the ACTION level (unlike addRelated itself, which
    // intentionally allows duplicates for direct curation calls — see
    // its own tests): client code calls this defensively after a
    // place/unarchive that may or may not have already auto-attached the
    // file via place's own destAnchor logic (it can't, for a branch not
    // attached to any anchor yet — the first photo ever added to a brand
    // new branch has nothing to auto-attach to). Checking first here
    // means callers never have to know which case they're in.
    const anchor = findTrunkAnchor(tsrc, trunkId);
    const already = (() => {
      const body = tsrc.slice(anchor.objStart, anchor.objEnd);
      return body.includes("{series:'" + branchSeries + "',file:'" + file.replace(/'/g, "\\'") + "'}");
    })();
    if (!already) {
      const newT = addRelated(tsrc, trunkId, branchSeries, file, position == null ? undefined : Number(position));
      fs.writeFileSync(TRUNK_DATA_PATH, newT);
    }
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

  if (action.type === 'delete-branch') {
    // Archives every still-live photo (file move only — never fs.unlink,
    // same as every other archive in this tool), then either deletes any
    // anchor(s) still pointing at it (deleteAnchors: true — "the whole
    // thing", the anchor's own photo is kept, unpromoted, in the trunk
    // pool) or just detaches it (deleteAnchors: false/omitted — the
    // anchor stays, now showing "no branch yet"), then removes the
    // now-empty "branch-xxx": {images:[]} entry and its now-empty
    // folder. The UI confirmation for this lives in admin.html
    // (type-to-confirm) — this handler itself does not re-confirm, by
    // design: it's meant to be called only after that gate has passed.
    const { gallery, deleteAnchors } = action;
    if (!/^branch-/.test(gallery)) throw new Error('delete-branch: only branch-* galleries can be deleted this way');
    const g = GALLERY_DATA[gallery];
    if (!g) throw new Error('delete-branch: unknown gallery ' + gallery);

    const liveFolder = folderFor(GALLERY_DATA, gallery);
    const archFolder = path.join(ARCHIVE_ROOT, gallery);
    const toArchive = g.images.filter((im) => !im.archived);
    for (const im of toArchive) moveFiles(liveFolder, archFolder, im.file);

    let newT = tsrc;
    const attachedTo = [];
    for (const arr of [TRUNK_MANIFEST_CURRENT, TRUNK_MANIFEST_OTHER]) {
      for (const e of arr) {
        if ((e.related || []).some((r) => r.series === gallery)) attachedTo.push(e.id);
      }
    }
    if (deleteAnchors) {
      // "the whole thing" — the anchor's own photo is kept, unpromoted,
      // in the trunk pool; only the tile and its statement (if any) go
      // away, same as deleteTrunkAnchor's own contract.
      for (const id of attachedTo) newT = deleteTrunkAnchor(newT, id);
    } else {
      for (const id of attachedTo) newT = detachBranch(newT, id);
    }
    if (newT !== tsrc) fs.writeFileSync(TRUNK_DATA_PATH, newT);

    const newG = deleteGallery(gsrc, gallery);
    fs.writeFileSync(GALLERY_DATA_PATH, newG);

    try { fs.rmdirSync(liveFolder); } catch (e) { /* best-effort: non-empty for an unexpected reason, or already gone — leave it rather than force */ }

    return { ok: true, archivedCount: toArchive.length, deletedAnchors: deleteAnchors ? attachedTo : [], detachedFrom: deleteAnchors ? [] : attachedTo };
  }

  if (action.type === 'delete-trunk-anchor') {
    // Fully removes a branch-less anchor: archives its own photo (same
    // file-move as the generic 'archive' action, scoped to the 'trunk'
    // gallery) so it drops off both trunk pages (art-trunk.js's resolve()
    // skips archived images), then deletes the trunk-data.js anchor entry
    // itself so no ghost row is left in this tool. Refuses an anchor that
    // still has a branch — detach it first, same gate the UI enforces.
    const { trunkId } = action;
    for (const arr of [TRUNK_MANIFEST_CURRENT, TRUNK_MANIFEST_OTHER]) {
      const e = arr.find((x) => x.id === trunkId);
      if (e && (e.related || []).length) throw new Error('delete-trunk-anchor: ' + trunkId + ' still has a branch — detach it first');
    }
    const file = (() => {
      for (const arr of [TRUNK_MANIFEST_CURRENT, TRUNK_MANIFEST_OTHER]) {
        const e = arr.find((x) => x.id === trunkId);
        if (e) return e.file;
      }
      throw new Error('delete-trunk-anchor: ' + trunkId + ' not found in either manifest');
    })();

    const im = GALLERY_DATA.trunk.images.find((i) => i.file === file);
    if (im && !im.archived) {
      const newG = setArchived(gsrc, 'trunk', file, true);
      moveFiles(folderFor(GALLERY_DATA, 'trunk'), path.join(ARCHIVE_ROOT, 'trunk'), file);
      fs.writeFileSync(GALLERY_DATA_PATH, newG);
    }

    const newT = deleteTrunkAnchor(tsrc, trunkId);
    fs.writeFileSync(TRUNK_DATA_PATH, newT);
    return { ok: true };
  }

  if (action.type === 'replace-anchor-photo') {
    // Repoints an existing anchor at a different trunk photo — same id,
    // same position, same related[] branch, only `file:` changes. The
    // old photo is left as an ordinary unattached trunk photo; archiving
    // it (or not) is a separate decision, not part of this action.
    const { trunkId, file } = action;
    if (!GALLERY_DATA.trunk || !GALLERY_DATA.trunk.images.some((im) => im.file === file)) {
      throw new Error('replace-anchor-photo: "' + file + '" is not in gallery-data.js\'s trunk.images — upload/place it there first');
    }
    const newT = setTrunkAnchorFile(tsrc, trunkId, file);
    fs.writeFileSync(TRUNK_DATA_PATH, newT);
    return { ok: true };
  }

  if (action.type === 'set-trunk-statement') {
    // The artist-text paragraph shown on a trunk anchor's own page.
    // statement: {en,fr,es} object, or null to clear it.
    const { trunkId, statement } = action;
    let literal = null;
    if (statement != null) {
      if (!statement.fr) throw new Error('set-trunk-statement: statement.fr is required (the site falls back to it)');
      literal = trilingualLiteral({ en: statement.en || statement.fr, fr: statement.fr, es: statement.es || statement.fr });
    }
    const newT = setTrunkStatement(tsrc, trunkId, literal);
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
        const result = await applyAction(action);
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

    // same as /img/ but prefers the existing -800w responsive derivative
    // (webp, then avif) when one is already on disk — never generates one.
    // Used for the small thumbnails in the Trunk/branches tab so that tab
    // doesn't pull full-size originals just to show a filename picker.
    if (req.method === 'GET' && u.pathname.startsWith('/thumb/')) {
      const rel = decodeURIComponent(u.pathname.slice('/thumb/'.length));
      const abs = path.join(IMAGES_ROOT, rel);
      if (!abs.startsWith(IMAGES_ROOT) || !fs.existsSync(abs)) { send(res, 404, 'not found'); return; }
      const dir = path.dirname(abs);
      const ext = path.extname(abs);
      const base = path.basename(abs, ext);
      const candidates = [path.join(dir, base + '-800w.webp'), path.join(dir, base + '-800w.avif'), abs];
      const picked = candidates.find((p) => fs.existsSync(p));
      const pickedExt = path.extname(picked).toLowerCase();
      const type = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif' }[pickedExt] || 'application/octet-stream';
      send(res, 200, fs.readFileSync(picked), { 'Content-Type': type, 'Cache-Control': 'no-store' });
      return;
    }

    if (req.method === 'GET' && u.pathname === '/api/git/status') {
      try {
        sendJson(res, 200, { ok: true, files: gitStatusScoped() });
      } catch (e) {
        sendJson(res, 500, { ok: false, error: e.message });
      }
      return;
    }

    if (req.method === 'POST' && u.pathname === '/api/git/publish') {
      const body = (await readBody(req, 1e4)).toString('utf8');
      let payload = {};
      try { payload = body ? JSON.parse(body) : {}; } catch (e) { sendJson(res, 400, { ok: false, error: 'bad JSON' }); return; }
      try {
        const result = gitPublish(payload.message);
        sendJson(res, 200, Object.assign({ ok: true }, result));
      } catch (e) {
        sendJson(res, 400, { ok: false, error: e.message });
      }
      return;
    }

    if (req.method === 'POST' && u.pathname === '/api/translate') {
      const body = (await readBody(req, 1e5)).toString('utf8');
      let payload;
      try { payload = JSON.parse(body); } catch (e) { sendJson(res, 400, { ok: false, error: 'bad JSON' }); return; }
      const { text, from, targets } = payload;
      if (!text || !DEEPL_LANG[from] || !Array.isArray(targets) || !targets.length || targets.some((t) => !DEEPL_LANG[t])) {
        sendJson(res, 400, { ok: false, error: 'translate: need text, from (en/fr/es), targets ([en/fr/es, ...])' });
        return;
      }
      try {
        const translations = await translateTitle(text, from, targets);
        sendJson(res, 200, { ok: true, translations, usedDeepL: !!config.deeplApiKey });
      } catch (e) {
        sendJson(res, 502, { ok: false, error: e.message });
      }
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
