/* Targeted text-surgery helpers for js/gallery-data.js and js/trunk-data.js.
   Deliberately NOT a full JS parser: these files are hand-authored, richly
   commented and trilingual, and a rewrite-from-AST would throw all of that
   away. Every mutation here finds an exact, unambiguous anchor in the real
   file text and edits only that span, the same way the 2026-11-11 content
   cull was done by hand. Every function throws instead of guessing when its
   anchor isn't found verbatim — a failed match means "stop and look", never
   "write something close enough". Covered by .admin/test_textedit.js,
   including byte-identical round-trip checks.

   2026-11-11b — trunk/branch addressing migrated from `idx` (array
   position) to `file` (filename): see the migration note at the top of
   js/trunk-data.js. That migration is what makes everything below safe —
   "trunk" and "branch-*" are no longer index-locked, because nothing
   references their images arrays by position anymore. Every array in
   gallery-data.js (plain gallery, trunk, or branch-*) can now be freely
   inserted into, removed from, and reordered. */

'use strict';

// ---------------------------------------------------------------------
// Low-level, string-aware scanning primitives
// ---------------------------------------------------------------------

/* String-aware forward brace/bracket scan from `openIdx` (which must be
   the opening char itself). Returns the index just past the matching
   close char, or -1. Treats `"` and `'` quoted strings as opaque. */
function scanMatch(src, openIdx, openCh, closeCh, hardEnd) {
  let depth = 0;
  const end = hardEnd == null ? src.length : hardEnd;
  for (let i = openIdx; i < end; i++) {
    const ch = src[i];
    if (ch === '"' || ch === "'") {
      const q = ch;
      let j = i + 1;
      while (j < end && !(src[j] === q && src[j - 1] !== '\\')) j++;
      i = j;
      continue;
    }
    if (ch === openCh) depth++;
    else if (ch === closeCh) {
      depth--;
      if (depth === 0) return i + 1;
    }
  }
  return -1;
}

/* String-aware backward brace scan: starting at `fromIdx`, find the
   nearest `{` at net depth 0 (counting `}` as +1, `{` as -1 while
   walking backward), i.e. the brace that opens the object containing
   fromIdx. Returns its index, or -1. */
function scanOpenBackward(src, fromIdx, hardStart) {
  let depth = 0;
  const start = hardStart == null ? 0 : hardStart;
  for (let i = fromIdx; i >= start; i--) {
    const ch = src[i];
    if (ch === '"' || ch === "'") {
      const q = ch;
      let j = i - 1;
      while (j >= start && !(src[j] === q && src[j - 1] !== '\\')) j--;
      i = j;
      continue;
    }
    if (ch === '}') depth++;
    else if (ch === '{') {
      if (depth === 0) return i;
      depth--;
    }
  }
  return -1;
}

/* Split the comma-separated top-level content of a `{...}` or `[...]`
   span into raw {start,end} chunks (string/brace/bracket-aware — nested
   containers and quoted strings never get split). `openIdx` is the index
   of the opening `{`/`[`; `closeIdx` is the index of the matching
   closing `}`/`]` itself (i.e. scanMatch's return value minus 1, or
   equivalently the position one before where scanMatch's return points).
   Each chunk's start/end may include surrounding whitespace — callers
   trim/line-snap as needed. Used for both object fields (key: value) and
   array elements. */
function splitTopLevelElements(src, openIdx, closeIdx) {
  const elems = [];
  let i = openIdx + 1;
  let depth = 0;
  let start = i;
  while (i < closeIdx) {
    const ch = src[i];
    if (ch === '"' || ch === "'") {
      const q = ch;
      let j = i + 1;
      while (j < closeIdx && !(src[j] === q && src[j - 1] !== '\\')) j++;
      i = j + 1;
      continue;
    }
    if (ch === '{' || ch === '[') { depth++; i++; continue; }
    if (ch === '}' || ch === ']') { depth--; i++; continue; }
    if (ch === ',' && depth === 0) {
      elems.push({ start, end: i });
      start = i + 1;
      i++;
      continue;
    }
    i++;
  }
  if (start < closeIdx && src.slice(start, closeIdx).trim().length) {
    elems.push({ start, end: closeIdx });
  }
  return elems;
}

/* Top-level `key: value` fields of an object span [objStart, objEnd)
   (objEnd is JUST PAST the closing `}`, i.e. scanMatch's return value). */
function splitTopLevelFields(src, objStart, objEnd) {
  return splitTopLevelElements(src, objStart, objEnd - 1)
    .map((f) => {
      const text = src.slice(f.start, f.end);
      const m = text.match(/^\s*([A-Za-z_$][\w$]*)\s*:/);
      return m ? { key: m[1], start: f.start, end: f.end } : null;
    })
    .filter(Boolean);
}

/* The start-of-line position for an arbitrary index — used so an
   inserted/replaced line always begins at column 0 of its own line
   rather than mid-line. */
function lineStartOf(src, idx, hardStart) {
  let start = idx;
  while (start > hardStart && src[start - 1] !== '\n') start--;
  return start;
}
function lineIndentOf(src, idx, hardStart) {
  const ls = lineStartOf(src, idx, hardStart);
  const m = src.slice(ls, idx + 40).match(/^[ \t]*/);
  return m ? m[0] : '';
}

// ---------------------------------------------------------------------
// Gallery / array location
// ---------------------------------------------------------------------

/* Locate `"<galleryId>": {` ... matching `}` for a top-level GALLERY_DATA
   entry, and within it the `images: [` ... matching `]` span. */
function findGallerySpan(src, galleryId) {
  const needle = '"' + galleryId + '": {';
  const keyIdx = src.indexOf(needle);
  if (keyIdx === -1) throw new Error('findGallerySpan: gallery not found: ' + galleryId);
  const braceStart = keyIdx + needle.length - 1;
  const galleryEnd = scanMatch(src, braceStart, '{', '}');
  if (galleryEnd === -1) throw new Error('findGallerySpan: unbalanced braces for ' + galleryId);

  const imagesNeedle = 'images: [';
  const imagesKeyIdx = src.indexOf(imagesNeedle, braceStart);
  if (imagesKeyIdx === -1 || imagesKeyIdx > galleryEnd) throw new Error('findGallerySpan: no images[] in ' + galleryId);
  const bracketStart = imagesKeyIdx + imagesNeedle.length - 1;
  const imagesEnd = scanMatch(src, bracketStart, '[', ']', galleryEnd);
  if (imagesEnd === -1) throw new Error('findGallerySpan: unbalanced [] for ' + galleryId);

  return { galleryStart: braceStart, galleryEnd, imagesStart: bracketStart, imagesEnd };
}

function findConstArraySpan(src, constName) {
  const needle = 'const ' + constName + ' = [';
  const kIdx = src.indexOf(needle);
  if (kIdx === -1) throw new Error('findConstArraySpan: ' + constName + ' not found');
  const bracketStart = kIdx + needle.length - 1;
  const end = scanMatch(src, bracketStart, '[', ']');
  if (end === -1) throw new Error('findConstArraySpan: unbalanced [] for ' + constName);
  return { start: bracketStart, end };
}

/* `const NAME = { ... };` outer object span (used for GALLERY_DATA itself,
   to insert a brand-new top-level gallery/branch key). */
function findConstObjectSpan(src, constName) {
  const needle = 'const ' + constName + ' = {';
  const kIdx = src.indexOf(needle);
  if (kIdx === -1) throw new Error('findConstObjectSpan: ' + constName + ' not found');
  const braceStart = kIdx + needle.length - 1;
  const end = scanMatch(src, braceStart, '{', '}');
  if (end === -1) throw new Error('findConstObjectSpan: unbalanced {} for ' + constName);
  return { start: braceStart, end };
}

/* The full object-literal span for the entry containing `file: "<filename>"`
   within images-array bounds [arrayStart, arrayEnd]. Includes the entry's
   own leading indentation and a trailing comma + newline, so cutting
   [start,end) leaves no dangling comma or blank line. */
function findImageObjectSpan(src, arrayStart, arrayEnd, filename) {
  const fileNeedle = 'file: "' + filename + '"';
  const fileIdx = src.indexOf(fileNeedle, arrayStart);
  if (fileIdx === -1 || fileIdx > arrayEnd) return null;

  const objStart = scanOpenBackward(src, fileIdx, arrayStart);
  if (objStart === -1) throw new Error('findImageObjectSpan: no enclosing { found for ' + filename);
  const objEnd = scanMatch(src, objStart, '{', '}', arrayEnd);
  if (objEnd === -1) throw new Error('findImageObjectSpan: no matching } found for ' + filename);

  let end = objEnd;
  while (src[end] === ' ' || src[end] === '\t') end++;
  if (src[end] === ',') end++;
  if (src[end] === '\r') end++;
  if (src[end] === '\n') end++;

  const start = lineStartOf(src, objStart, arrayStart);
  return { start, end, objStart, objEnd };
}

// ---------------------------------------------------------------------
// Generic array insert/remove at position (images arrays, related
// arrays, trunk-manifest arrays — anything that's a [ {...}, {...} ]).
// ---------------------------------------------------------------------

/* Insert `piece` (a single already-formatted element, no surrounding
   whitespace/comma) at 0-based `position` among the array's existing
   top-level elements (or at the end if position is null/undefined or
   >= the current element count). `indent` is the leading whitespace to
   give the new line. */
/* Strips trailing `/* ... *\/` block comments (and the whitespace around
   them) off the end of a string, repeatedly. Used only to decide whether
   an append needs a separating comma — see insertIntoArrayAt below — so
   it only ever looks at the tail of top-level array content between
   elements, never inside a string, where this codebase's own convention
   never leaves a bare trailing comment anyway. */
function stripTrailingComments(s) {
  let prev;
  do {
    prev = s;
    s = s.replace(/\s*\/\*[\s\S]*?\*\/\s*$/, '');
  } while (s !== prev);
  return s;
}

function insertIntoArrayAt(src, openIdx, closeIdx, piece, indent, position) {
  const elems = splitTopLevelElements(src, openIdx, closeIdx);
  if (position == null || position >= elems.length) {
    const inner = src.slice(openIdx + 1, closeIdx);
    const trimmed = inner.replace(/\s+$/, '');
    const trailingWs = inner.slice(trimmed.length);
    /* A moved/removed anchor can leave its own preceding comment orphaned
       at the tail of the array (documented limitation — see README) —
       strip that before checking for a trailing comma, or appending after
       it silently inserts an extra comma that corrupts the array (real
       bug, caught 2026-11-13: reordering an anchor to "append" within its
       own already-last position round-trips through exactly this path). */
    const tailSansComments = stripTrailingComments(trimmed);
    const isEmpty = tailSansComments.trim().length === 0;
    const alreadyHasComma = tailSansComments.endsWith(',');
    const sep = (isEmpty || alreadyHasComma) ? '' : ',';
    const insertion = sep + '\r\n' + indent + piece;
    return src.slice(0, openIdx + 1) + trimmed + insertion + trailingWs + src.slice(openIdx + 1 + inner.length);
  }
  let p = elems[position].start;
  while (src[p] === ' ' || src[p] === '\t' || src[p] === '\r' || src[p] === '\n') p++;
  const lineStart = lineStartOf(src, p, openIdx);
  const insertion = indent + piece + ',\r\n';
  return src.slice(0, lineStart) + insertion + src.slice(lineStart);
}

/* After cutting an element out of an array/object (removal leaves a seam
   at `cutIdx`), the element immediately before the cut may now be the
   last one — and this codebase never puts a trailing comma before a
   closing `]`/`}`. If removing left exactly that shape (`, <ws>]`),
   strip the now-dangling comma so the result matches the file's own
   convention (and so remove-after-insert round-trips byte-identically). */
function stripDanglingTrailingComma(src, cutIdx) {
  let i = cutIdx - 1;
  while (i >= 0 && /\s/.test(src[i])) i--;
  if (src[i] !== ',') return src;
  let j = cutIdx;
  while (j < src.length && /\s/.test(src[j])) j++;
  if (src[j] !== ']' && src[j] !== '}') return src;
  return src.slice(0, i) + src.slice(i + 1);
}

/* 0-based position of the element whose top-level span contains
   `locatorIdx` (e.g. the index of a `file: "x"` match) — used to report
   "where is this today" to callers that want to reorder relative to it. */
function positionOf(src, openIdx, closeIdx, locatorIdx) {
  const elems = splitTopLevelElements(src, openIdx, closeIdx);
  for (let i = 0; i < elems.length; i++) {
    if (locatorIdx >= elems[i].start && locatorIdx < elems[i].end) return i;
  }
  return -1;
}

// ---------------------------------------------------------------------
// Image entry: archived flag + museum-label metadata (title/medium/year)
// ---------------------------------------------------------------------

/* Set or clear `archived: true,` right after `file: "<filename>",` inside
   a given gallery's images array. Idempotent.

   Image entries in this codebase come in two hand-written styles:
     multi-line: `{\n  file: "x",\n  alt: {\n...`
     single-line: `{ file: "x", alt: {\n...` (every branch-* gallery)
   and archive flips must handle both losslessly. Rather than guessing at
   line boundaries, this locates the `alt:` key that always immediately
   follows and treats whatever sits between the comma and `alt:` — call
   it `gap` — as the separator to reuse. Setting = `gap + "archived: true," + gap`
   (the gap appears identically on both sides of the new key, in both
   styles); clearing is the exact inverse: collapse back to a single `gap`. */
function setArchived(src, galleryId, filename, archived) {
  const g = findGallerySpan(src, galleryId);
  const fileNeedle = 'file: "' + filename + '"';
  const fileIdx = src.indexOf(fileNeedle, g.imagesStart);
  if (fileIdx === -1 || fileIdx > g.imagesEnd) {
    throw new Error('setArchived: ' + filename + ' not found in ' + galleryId);
  }
  const commaIdx = src.indexOf(',', fileIdx + fileNeedle.length);
  if (commaIdx === -1) throw new Error('setArchived: no comma after file: for ' + filename);
  const afterComma = commaIdx + 1;

  const altIdx = src.indexOf('alt:', afterComma);
  if (altIdx === -1 || altIdx > g.imagesEnd) throw new Error('setArchived: no alt: found after file: for ' + filename);

  const archivedIdx = src.indexOf('archived:', afterComma);
  const hasArchived = archivedIdx !== -1 && archivedIdx < altIdx &&
    /^\s*$/.test(src.slice(afterComma, archivedIdx));

  if (archived && !hasArchived) {
    const gap = src.slice(afterComma, altIdx);
    if (!/^\s*$/.test(gap)) throw new Error('setArchived: unexpected content between file: and alt: for ' + filename);
    const insertion = gap + 'archived: true,' + gap;
    return src.slice(0, afterComma) + insertion + src.slice(altIdx);
  }
  if (!archived && hasArchived) {
    const preGap = src.slice(afterComma, archivedIdx);
    return src.slice(0, afterComma) + preGap + src.slice(altIdx);
  }
  return src; // already in the requested state
}

/* Canonical field order for an image entry — used only to decide where
   a NEW field goes relative to other fields that already exist (never
   reorders fields that are already present). */
const META_FIELD_ORDER = ['file', 'archived', 'title', 'medium', 'year', 'alt', 'wide'];

/* Set (insert or replace), or remove (valueLiteral === null), one
   metadata field on the image entry for `filename` in `galleryId`.
   `valueLiteral` is the exact already-escaped JS literal text to write
   (see titleLiteral/mediumLiteral/yearLiteral below) — this function
   only places it, it doesn't serialize it, so it has no opinion on
   trilingual-object vs. number vs. anything else a future field might
   need. Generalizes setArchived's approach (locate the object, work
   with its top-level fields) to an arbitrary field name. */
function setMetaField(src, galleryId, filename, key, valueLiteral) {
  if (key === 'archived') throw new Error('setMetaField: use setArchived for archived');
  const g = findGallerySpan(src, galleryId);
  const span = findImageObjectSpan(src, g.imagesStart, g.imagesEnd, filename);
  if (!span) throw new Error('setMetaField: ' + filename + ' not found in ' + galleryId);
  const fields = splitTopLevelFields(src, span.objStart, span.objEnd);
  const existing = fields.find((f) => f.key === key);

  if (valueLiteral === null) {
    if (!existing) return src; // already absent
    let valEnd = existing.end;
    if (src[valEnd] === ',') valEnd++;
    let trimStart = existing.start;
    while (/\s/.test(src[trimStart])) trimStart++;
    const singleLine = !/\r?\n/.test(src.slice(span.objStart, existing.end));
    if (singleLine) {
      // "key: value, " sits inline with its neighbors — drop the field and
      // exactly the one space that follows its comma, so removal is the
      // precise inverse of the single-line insert path above.
      let after = valEnd;
      while (src[after] === ' ') after++;
      return src.slice(0, trimStart) + src.slice(after);
    }
    // multi-line — the field owns its own line; drop from the start of
    // that line through the start of whatever follows (next field's line,
    // or the closing brace's line), so no blank line is left behind.
    const lineStart = lineStartOf(src, trimStart, span.objStart);
    let after = valEnd;
    while (src[after] === ' ' || src[after] === '\t') after++;
    if (src[after] === '\r') after++;
    if (src[after] === '\n') after++;
    return src.slice(0, lineStart) + src.slice(after);
  }

  const newFieldText = key + ': ' + valueLiteral;
  if (existing) {
    let start = existing.start;
    while (/\s/.test(src[start])) start++;
    return src.slice(0, start) + newFieldText + src.slice(existing.end);
  }

  // Not present yet — insert before the first existing field that comes
  // AFTER `key` in canonical order; if none, insert right before the
  // object's closing brace (i.e. after the last field).
  const myRank = META_FIELD_ORDER.indexOf(key);
  let insertBefore = null;
  for (const f of fields) {
    const rank = META_FIELD_ORDER.indexOf(f.key);
    if (rank !== -1 && rank > myRank) { insertBefore = f; break; }
  }
  const indent = lineIndentOf(src, span.objStart, g.imagesStart) + '  ';
  if (insertBefore) {
    let p = insertBefore.start;
    while (/\s/.test(src[p])) p++;
    const lineStart = lineStartOf(src, p, span.objStart);
    if (lineStart === span.objStart) {
      // single-line style (`{ file: "x", alt: {...`) — the target field
      // sits on the SAME line as the object's own opening brace, so
      // lineStartOf has nowhere real to back up to. Insert inline, right
      // before the field, instead of on a manufactured new line (which
      // would land the new text BEFORE the object's own `{` — the bug
      // this comment replaced).
      return src.slice(0, p) + newFieldText + ', ' + src.slice(p);
    }
    return src.slice(0, lineStart) + indent + newFieldText + ',\r\n' + src.slice(lineStart);
  }
  // append as new last field, right before the closing `}`
  const lastField = fields[fields.length - 1];
  let insAt = lastField ? lastField.end : span.objStart + 1;
  if (src[insAt] === ',') insAt++;
  const objIsSingleLine = !/\r?\n/.test(src.slice(span.objStart, insAt));
  if (objIsSingleLine) {
    while (src[insAt] === ' ') insAt++;
    return src.slice(0, insAt) + newFieldText + ', ' + src.slice(insAt);
  }
  return src.slice(0, insAt) + ',\r\n' + indent + newFieldText + src.slice(insAt);
}

function esc(s) { return String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"'); }
function trilingualLiteral(obj, indent) {
  return '{ en: "' + esc(obj.en) + '", fr: "' + esc(obj.fr) + '", es: "' + esc(obj.es) + '" }';
}
function yearLiteral(y) {
  const n = Number(y);
  if (!Number.isInteger(n) || n < 1900 || n > 2100) throw new Error('yearLiteral: not a plausible year: ' + y);
  return String(n);
}

// ---------------------------------------------------------------------
// Image placement: move/insert/reorder across ANY gallery (including
// trunk/branch-*, now that addressing is by filename — see top note)
// ---------------------------------------------------------------------

function reindentPiece(rawPiece, targetIndent) {
  const rawLines = rawPiece.replace(/,\s*$/, '').replace(/\s+$/, '').split(/\r?\n/);
  const indentOf = (l) => (l.match(/^[ \t]*/) || [''])[0].length;
  const delta = targetIndent - indentOf(rawLines[0]);
  return rawLines.map((l, i) => {
    const cur = indentOf(l);
    const newIndent = i === 0 ? targetIndent : Math.max(0, cur + delta);
    return ' '.repeat(newIndent) + l.slice(cur);
  }).join('\r\n');
}

/* Move (or reorder in place) the image object for `filename` from
   `fromGalleryId` into `toGalleryId` at 0-based `position` (end of
   array if omitted). `fromGalleryId === toGalleryId` reorders within
   the same array. Works on any gallery, including "trunk" and any
   "branch-*" — those are no longer index-locked (see top-of-file note):
   nothing references their images arrays by position any more, only by
   filename, so cutting/reinserting an element never breaks a reference. */
function placeImage(src, fromGalleryId, toGalleryId, filename, position) {
  const from = findGallerySpan(src, fromGalleryId);
  const span = findImageObjectSpan(src, from.imagesStart, from.imagesEnd, filename);
  if (!span) throw new Error('placeImage: ' + filename + ' not found in ' + fromGalleryId);

  const piece = reindentPiece(src.slice(span.start, span.end), 6);
  const removed = stripDanglingTrailingComma(src.slice(0, span.start) + src.slice(span.end), span.start);

  const to = findGallerySpan(removed, toGalleryId);
  // indent '' — `piece` already carries its own full indentation (every
  // line, including the first) from reindentPiece() above; passing a
  // non-empty indent here would double it (this exact bug shipped once
  // before, see .admin/README.md history).
  return insertIntoArrayAt(removed, to.imagesStart, to.imagesEnd - 1, piece, '', position);
}

/* Back-compat alias used by earlier admin-tool code/tests: append-only
   move between two plain galleries. placeImage(..., undefined) already
   appends, this just keeps the old name working. */
function moveImage(src, fromGalleryId, toGalleryId, filename) {
  if (fromGalleryId === toGalleryId) throw new Error('moveImage: source and target are the same gallery');
  return placeImage(src, fromGalleryId, toGalleryId, filename, undefined);
}

/* Build a brand-new image object literal (multi-line style, the more
   common/readable convention) and insert it into `galleryId`'s images
   array at `position` (end if omitted). Returns the new source. Throws
   if `galleryId` doesn't exist yet — use createGallery() first for a
   brand-new branch. */
function insertNewImage(src, galleryId, position, data) {
  const g = findGallerySpan(src, galleryId);
  const indent = '      ';
  const inner = indent + '  ';
  const lines = ['{', indent + '  file: "' + esc(data.file) + '",'];
  if (data.archived) lines.push(indent + '  archived: true,');
  if (data.title) lines.push(indent + '  title: ' + trilingualLiteral(data.title) + ',');
  if (data.medium) lines.push(indent + '  medium: ' + trilingualLiteral(data.medium) + ',');
  if (data.year) lines.push(indent + '  year: ' + yearLiteral(data.year) + ',');
  lines.push(indent + '  alt: {');
  lines.push(indent + '    en: "' + esc(data.alt.en) + '",');
  lines.push(indent + '    fr: "' + esc(data.alt.fr) + '",');
  lines.push(indent + '    es: "' + esc(data.alt.es) + '"');
  lines.push(indent + '  }');
  lines.push(indent + '}');
  const piece = lines.join('\r\n');
  return insertIntoArrayAt(src, g.imagesStart, g.imagesEnd - 1, piece, indent, position);
}

// ---------------------------------------------------------------------
// GALLERY_DATA: create a brand-new gallery / branch-* entry
// ---------------------------------------------------------------------

function createGallery(src, galleryId, folder, title) {
  let already = true;
  try { findGallerySpan(src, galleryId); } catch (e) { already = false; }
  if (already) throw new Error('createGallery: "' + galleryId + '" already exists');

  const gd = findConstObjectSpan(src, 'GALLERY_DATA');
  const piece = [
    '"' + galleryId + '": {',
    '    id: "' + esc(galleryId) + '",',
    '    folder: "' + esc(folder) + '",',
    '    title: ' + trilingualLiteral(title) + ',',
    '    images: []',
    '  }'
  ].join('\r\n  ');
  // insertIntoArrayAt's bracket-aware scan works identically for a `{...}`
  // object as for a `[...]` array (splitTopLevelElements doesn't care which
  // it is) — gd.start is the '{', gd.end-1 is the matching '}'.
  return insertIntoArrayAt(src, gd.start, gd.end - 1, piece, '  ', null);
}

/* Rename a gallery's own trilingual `title` — the gallery/branch's
   display name itself (e.g. "Scrap and Steel" for branch-industrial),
   not a photo's museum-label title (that's setMetaField). Every gallery
   gets one from createGallery, so the "missing" branch below is
   defensive, not a real path in current data. */
function setGalleryTitle(src, galleryId, title) {
  const g = findGallerySpan(src, galleryId);
  const fields = splitTopLevelFields(src, g.galleryStart, g.galleryEnd);
  const existing = fields.find((f) => f.key === 'title');
  const newFieldText = 'title: ' + trilingualLiteral(title);

  if (existing) {
    let start = existing.start;
    while (/\s/.test(src[start])) start++;
    return src.slice(0, start) + newFieldText + src.slice(existing.end);
  }

  const imagesField = fields.find((f) => f.key === 'images');
  if (!imagesField) throw new Error('setGalleryTitle: no images field found in ' + galleryId);
  let p = imagesField.start;
  while (/\s/.test(src[p])) p++;
  const lineStart = lineStartOf(src, p, g.galleryStart);
  if (lineStart === g.galleryStart) {
    return src.slice(0, p) + newFieldText + ', ' + src.slice(p);
  }
  return src.slice(0, lineStart) + '    ' + newFieldText + ',\r\n' + src.slice(lineStart);
}

// ---------------------------------------------------------------------
// Trunk manifest (js/trunk-data.js): anchors + their `related` branch list
// ---------------------------------------------------------------------

const TRUNK_SETS = { current: 'TRUNK_MANIFEST_CURRENT', other: 'TRUNK_MANIFEST_OTHER' };

/* Find a trunk anchor `{id:'tNN', ...}` by id in whichever of the two
   manifests it's actually in. Returns {setName, objStart, objEnd,
   setSpan} or throws. */
function findTrunkAnchor(src, trunkId) {
  for (const setName of ['current', 'other']) {
    const span = findConstArraySpan(src, TRUNK_SETS[setName]);
    const needle = "id:'" + trunkId + "'";
    const idIdx = src.indexOf(needle, span.start);
    if (idIdx !== -1 && idIdx < span.end) {
      const objStart = scanOpenBackward(src, idIdx, span.start);
      const objEnd = scanMatch(src, objStart, '{', '}', span.end);
      if (objStart === -1 || objEnd === -1) throw new Error('findTrunkAnchor: malformed entry for ' + trunkId);
      return { setName, setSpan: span, objStart, objEnd };
    }
  }
  throw new Error('findTrunkAnchor: ' + trunkId + ' not found in either manifest');
}

/* Next unused 'tNN' id (scans both manifests; ids are not required to be
   contiguous, this just avoids colliding with an existing one). */
function nextTrunkId(src) {
  const used = new Set();
  const re = /id:'t(\d+)'/g;
  let m;
  while ((m = re.exec(src))) used.add(Number(m[1]));
  let n = 1;
  while (used.has(n)) n++;
  return 't' + n;
}

/* Move a whole trunk-manifest ENTRY ({id, series:'trunk', file, related?,
   statement?}) to 0-based `position` within `toSet` ('current'|'other') —
   works whether toSet is the anchor's current set (pure reorder) or the
   other one (move + position). Index-safe by construction: gallery-data.js
   arrays are never touched, only trunk-data.js's own two manifest arrays. */
function reorderTrunkAnchor(src, trunkId, toSet, position) {
  const found = findTrunkAnchor(src, trunkId);
  const toConst = TRUNK_SETS[toSet];
  if (!toConst) throw new Error('reorderTrunkAnchor: toSet must be "current" or "other"');

  let end = found.objEnd;
  while (src[end] === ' ') end++;
  if (src[end] === ',') end++;
  if (src[end] === '\r') end++;
  if (src[end] === '\n') end++;
  const start = lineStartOf(src, found.objStart, found.setSpan.start);

  const piece = reindentPiece(src.slice(start, found.objEnd), 2);
  const removed = stripDanglingTrailingComma(src.slice(0, start) + src.slice(end), start);

  const toSpan = findConstArraySpan(removed, toConst);
  // indent '' — same reason as placeImage above: piece is pre-indented.
  return insertIntoArrayAt(removed, toSpan.start, toSpan.end - 1, piece, '', position);
}
/* Back-compat: append-only move between the two pages. */
function moveTrunkAnchor(src, trunkId, toSet) {
  return reorderTrunkAnchor(src, trunkId, toSet, undefined);
}

/* Create a brand-new trunk anchor for a photo that's (already, or about
   to be) in gallery-data.js's "trunk".images — auto-assigns the next free
   'tNN' id. `file` must already exist in GALLERY_DATA.trunk.images (insert
   it there first via insertNewImage/placeImage if it's a fresh upload). */
function createTrunkAnchor(src, toSet, file, position) {
  const toConst = TRUNK_SETS[toSet];
  if (!toConst) throw new Error('createTrunkAnchor: toSet must be "current" or "other"');
  const id = nextTrunkId(src);
  const piece = "{ id:'" + id + "', series:'trunk', file:'" + file.replace(/'/g, "\\'") + "' }";
  const span = findConstArraySpan(src, toConst);
  const newSrc = insertIntoArrayAt(src, span.start, span.end - 1, piece, '  ', position);
  return { src: newSrc, id };
}

/* Insert a `{series,file}` related-branch entry into trunk anchor
   `trunkId`'s `related` array at `position` (end if omitted). Creates
   the `related:[...]` array (attaching a first branch to a previously
   branch-less anchor) if the anchor doesn't have one yet. */
function addRelated(src, trunkId, branchSeries, file, position) {
  const found = findTrunkAnchor(src, trunkId);
  const piece = "{series:'" + branchSeries + "',file:'" + file.replace(/'/g, "\\'") + "'}";

  const body = src.slice(found.objStart, found.objEnd);
  const relIdx = body.indexOf('related:[');
  if (relIdx === -1) {
    // no related array yet — add one, right after the file:'...' field
    const fileFieldRe = /file:'[^']*'/;
    const fm = fileFieldRe.exec(body);
    if (!fm) throw new Error('addRelated: no file: field found on ' + trunkId);
    const insAt = found.objStart + fm.index + fm[0].length;
    const insertion = ", related:[\r\n    " + piece + "\r\n  ]";
    return src.slice(0, insAt) + insertion + src.slice(insAt);
  }
  const bracketStart = found.objStart + relIdx + 'related:'.length;
  const bracketEnd = scanMatch(src, bracketStart, '[', ']', found.objEnd);
  if (bracketEnd === -1) throw new Error('addRelated: unbalanced related[] for ' + trunkId);
  return insertIntoArrayAt(src, bracketStart, bracketEnd - 1, piece, '    ', position);
}

/* Remove one `{series,file}` entry from trunk anchor `trunkId`'s `related`
   array. If it was the last entry, removes the whole `related:[...]` key
   too (an anchor with an emptied branch reverts to looking exactly like
   an anchor that never had one — t13/t17's style). */
function removeRelated(src, trunkId, file) {
  const found = findTrunkAnchor(src, trunkId);
  const body = src.slice(found.objStart, found.objEnd);
  const relIdx = body.indexOf('related:[');
  if (relIdx === -1) throw new Error('removeRelated: ' + trunkId + ' has no related array');
  const bracketStart = found.objStart + relIdx + 'related:'.length;
  const bracketEnd = scanMatch(src, bracketStart, '[', ']', found.objEnd);
  if (bracketEnd === -1) throw new Error('removeRelated: unbalanced related[] for ' + trunkId);

  const elems = splitTopLevelElements(src, bracketStart, bracketEnd - 1);
  const fileNeedle = "file:'" + file.replace(/'/g, "\\'") + "'";
  let target = null;
  for (const e of elems) {
    if (src.slice(e.start, e.end).indexOf(fileNeedle) !== -1) { target = e; break; }
  }
  if (!target) throw new Error('removeRelated: ' + file + ' not found in ' + trunkId + "'s related");

  if (elems.length === 1) {
    // last/only entry — drop the whole `, related:[...]` (or leading
    // `related:[...], ` if it was the first field) so the anchor reverts
    // to no-related style, not an empty related:[] array.
    let cutStart = found.objStart + relIdx;
    let cutEnd = bracketEnd;
    // absorb a preceding ", " or a following ", "
    if (src[cutStart - 1] === ' ' && src[cutStart - 2] === ',') cutStart -= 2;
    else if (src.slice(cutEnd, cutEnd + 2) === ', ') cutEnd += 2;
    return src.slice(0, cutStart) + src.slice(cutEnd);
  }

  let elemEnd = target.end;
  if (src[elemEnd] === ',') elemEnd++;
  // consume the newline (+ leading indent) right after the comma too, not
  // just the comma — otherwise the NEXT element's own leading newline
  // combines with this cut to leave a blank line behind.
  while (src[elemEnd] === ' ' || src[elemEnd] === '\t') elemEnd++;
  if (src[elemEnd] === '\r') elemEnd++;
  if (src[elemEnd] === '\n') elemEnd++;
  const elemStart = lineStartOf(src, (() => { let p = target.start; while (/\s/.test(src[p])) p++; return p; })(), bracketStart);
  const removed = src.slice(0, elemStart) + src.slice(elemEnd);
  return stripDanglingTrailingComma(removed, elemStart);
}

/* Reorder one related-branch entry within its own anchor's related array
   (remove + reinsert at the new position). */
function reorderRelated(src, trunkId, branchSeries, file, newPosition) {
  const removed = removeRelated(src, trunkId, file);
  return addRelated(removed, trunkId, branchSeries, file, newPosition);
}

/* Detach the whole branch from a trunk anchor in one step (removes the
   entire `related:[...]` key regardless of how many entries it has). The
   branch gallery itself (its images array in gallery-data.js) is
   untouched — only the anchor stops pointing at it. */
function detachBranch(src, trunkId) {
  const found = findTrunkAnchor(src, trunkId);
  const body = src.slice(found.objStart, found.objEnd);
  const relIdx = body.indexOf('related:[');
  if (relIdx === -1) return src; // already detached
  const bracketStart = found.objStart + relIdx + 'related:'.length;
  const bracketEnd = scanMatch(src, bracketStart, '[', ']', found.objEnd);
  if (bracketEnd === -1) throw new Error('detachBranch: unbalanced related[] for ' + trunkId);
  let cutStart = found.objStart + relIdx;
  let cutEnd = bracketEnd;
  if (src[cutStart - 1] === ' ' && src[cutStart - 2] === ',') cutStart -= 2;
  else if (src.slice(cutEnd, cutEnd + 2) === ', ') cutEnd += 2;
  return src.slice(0, cutStart) + src.slice(cutEnd);
}

module.exports = {
  // scanning
  scanMatch, scanOpenBackward, splitTopLevelElements, splitTopLevelFields,
  lineStartOf, lineIndentOf,
  // location
  findGallerySpan, findConstArraySpan, findConstObjectSpan, findImageObjectSpan, positionOf,
  // array surgery
  insertIntoArrayAt, stripDanglingTrailingComma,
  // image entry
  setArchived, setMetaField, trilingualLiteral, yearLiteral, esc,
  // placement
  placeImage, moveImage, insertNewImage,
  // galleries
  createGallery, setGalleryTitle,
  // trunk/branch management
  findTrunkAnchor, nextTrunkId, reorderTrunkAnchor, moveTrunkAnchor, createTrunkAnchor,
  addRelated, removeRelated, reorderRelated, detachBranch
};
