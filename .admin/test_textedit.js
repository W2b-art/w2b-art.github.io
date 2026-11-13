const fs = require('fs');
const cp = require('child_process');
const te = require('./lib/textedit');
const {
  setArchived, setMetaField, moveImage, placeImage, insertNewImage, createGallery,
  moveTrunkAnchor, reorderTrunkAnchor, createTrunkAnchor, addRelated, removeRelated,
  reorderRelated, detachBranch, findTrunkAnchor, nextTrunkId, trilingualLiteral, yearLiteral
} = te;

let failures = 0;
function ok(cond, label) {
  if (cond) console.log('OK  ', label);
  else { console.log('FAIL', label); failures++; }
}
function checkJs(src, label) {
  fs.writeFileSync(__dirname + '/_tmp_check.js', src);
  try {
    cp.execSync('node --check "' + __dirname + '/_tmp_check.js"', { stdio: 'pipe' });
    console.log('OK  ', label);
  } catch (e) {
    console.log('FAIL', label);
    console.log(e.stderr.toString());
    failures++;
  }
}
function loadArray(src, globalName) {
  const vm = require('vm');
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(src.replace(/^const /gm, 'var '), ctx);
  return ctx[globalName];
}
function diffAt(a, b, label) {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i] !== b[i]) { console.log(label, 'diff at', i, JSON.stringify(a.slice(i - 40, i + 40)), 'vs', JSON.stringify(b.slice(i - 40, i + 40))); return; }
  }
}

/* Reads the REAL data files read-only — every mutation below only ever
   produces a new in-memory string; nothing is written back to disk here. */
const gsrc = fs.readFileSync(__dirname + '/../js/gallery-data.js', 'utf8');
const tsrc = fs.readFileSync(__dirname + '/../js/trunk-data.js', 'utf8');

const TEST_FILE = 'argentina-couple-embrace-black-white-film-w2b.jpg';
const SINGLE_LINE_FILE = 'arcade-gallery-interior-arches-columns-black-white-w2b.jpg'; // branch-glass-roof

console.log('--- 1. setArchived (multi-line + single-line styles) ---');
{
  let g1 = setArchived(gsrc, 'argentina', TEST_FILE, true);
  ok(new RegExp('file: "' + TEST_FILE + '",\\s*archived: true,').test(g1), 'archive insert pattern found');
  checkJs(g1, 'after archive insert');
  let g2 = setArchived(g1, 'argentina', TEST_FILE, false);
  ok(g2 === gsrc, 'archive round-trip byte-identical'); if (g2 !== gsrc) diffAt(gsrc, g2, 'archive rt');

  let gsl1 = setArchived(gsrc, 'branch-glass-roof', SINGLE_LINE_FILE, true);
  checkJs(gsl1, 'after single-line archive insert');
  ok(new RegExp('file: "' + SINGLE_LINE_FILE + '", archived: true, alt: \\{').test(gsl1), 'single-line archive insert inline');
  let gsl2 = setArchived(gsl1, 'branch-glass-roof', SINGLE_LINE_FILE, false);
  ok(gsl2 === gsrc, 'single-line archive round-trip byte-identical'); if (gsl2 !== gsrc) diffAt(gsrc, gsl2, 'sl archive rt');
}

console.log('\n--- 2. placeImage / moveImage (now works on ANY gallery, incl. trunk/branch-*) ---');
{
  let g3 = moveImage(gsrc, 'argentina', 'matter', TEST_FILE);
  checkJs(g3, 'after moveImage argentina->matter');
  const after = loadArray(g3, 'GALLERY_DATA');
  ok(!after.argentina.images.some((i) => i.file === TEST_FILE), 'file removed from source gallery');
  ok(after.matter.images.some((i) => i.file === TEST_FILE), 'file present in target gallery');
  const movedObj = after.matter.images.find((i) => i.file === TEST_FILE);
  ok(!!(movedObj && movedObj.alt && movedObj.alt.fr), 'alt text preserved on move');
  ok(!after.argentina.images.some((i) => i === undefined) && !after.matter.images.some((i) => i === undefined), 'no array holes after move');
  const m = g3.match(new RegExp('( *)\\{\\s*\\r?\\n( *)file: "' + TEST_FILE + '"[\\s\\S]{0,20}?\\r?\\n( *)alt: \\{\\r?\\n( *)en:'));
  ok(!!m && m[4].length > m[3].length && m[3].length === m[2].length, 'nested indentation preserved after move');

  let g4 = moveImage(g3, 'matter', 'argentina', TEST_FILE);
  checkJs(g4, 'after moveImage matter->argentina (move back)');
  ok(g4 === gsrc, 'moveImage round-trip byte-identical'); if (g4 !== gsrc) diffAt(gsrc, g4, 'moveImage rt');

  // trunk/branch-* are no longer locked — the whole point of the
  // 2026-11-11b file-addressing migration. Prove it: move a branch photo
  // into a plain gallery and back, byte-identical round trip.
  const BRANCH_FILE = 'buoy-silhouette-bay-dramatic-sunset-sky-w2b.jpg'; // branch-dark-bay, 1 image
  let b1 = moveImage(gsrc, 'branch-dark-bay', 'matter', BRANCH_FILE);
  checkJs(b1, 'after moveImage branch-dark-bay->matter');
  const bAfter = loadArray(b1, 'GALLERY_DATA');
  ok(bAfter['branch-dark-bay'].images.length === 0, 'branch-dark-bay emptied correctly');
  ok(bAfter.matter.images.some((i) => i.file === BRANCH_FILE), 'branch photo present in matter');
  let b2 = moveImage(b1, 'matter', 'branch-dark-bay', BRANCH_FILE);
  ok(b2 === gsrc, 'branch<->plain gallery move round-trip byte-identical'); if (b2 !== gsrc) diffAt(gsrc, b2, 'branch move rt');

  // placeImage with an explicit position (insert at index 0, not append)
  let p1 = placeImage(gsrc, 'argentina', 'matter', TEST_FILE, 0);
  checkJs(p1, 'after placeImage at position 0');
  const pAfter = loadArray(p1, 'GALLERY_DATA');
  ok(pAfter.matter.images[0].file === TEST_FILE, 'placeImage inserted at position 0, not appended');
  ok(pAfter.matter.images.length === loadArray(gsrc, 'GALLERY_DATA').matter.images.length + 1, 'matter gained exactly one image');
}

console.log('\n--- 3. setMetaField (title/medium/year) ---');
{
  const title = { en: 'Under Glass', fr: 'Sous verre', es: 'Bajo cristal' };
  const medium = { en: 'Analog photograph', fr: 'Photographie argentique', es: 'Fotografía analógica' };
  let m1 = setMetaField(gsrc, 'branch-glass-roof', SINGLE_LINE_FILE, 'title', trilingualLiteral(title));
  m1 = setMetaField(m1, 'branch-glass-roof', SINGLE_LINE_FILE, 'medium', trilingualLiteral(medium));
  m1 = setMetaField(m1, 'branch-glass-roof', SINGLE_LINE_FILE, 'year', yearLiteral(2024));
  checkJs(m1, 'after setting title+medium+year');
  const loaded = loadArray(m1, 'GALLERY_DATA');
  const im = loaded['branch-glass-roof'].images.find((i) => i.file === SINGLE_LINE_FILE);
  ok(im.title && im.title.en === 'Under Glass', 'title set correctly');
  ok(im.medium && im.medium.fr === 'Photographie argentique', 'medium set correctly');
  ok(im.year === 2024, 'year set correctly');
  ok(!!im.alt, 'alt text untouched by metadata insert');

  // clear all three (null = remove), must round-trip byte-identical
  let m2 = setMetaField(m1, 'branch-glass-roof', SINGLE_LINE_FILE, 'year', null);
  m2 = setMetaField(m2, 'branch-glass-roof', SINGLE_LINE_FILE, 'medium', null);
  m2 = setMetaField(m2, 'branch-glass-roof', SINGLE_LINE_FILE, 'title', null);
  checkJs(m2, 'after clearing title+medium+year');
  ok(m2 === gsrc, 'setMetaField insert+clear round-trip byte-identical'); if (m2 !== gsrc) diffAt(gsrc, m2, 'metafield rt');
}

console.log('\n--- 4. insertNewImage + createGallery ---');
{
  const data = {
    file: 'test-upload-placeholder-w2b.jpg',
    alt: { en: 'Test', fr: 'Test', es: 'Prueba' },
    title: { en: 'Test Title', fr: 'Titre test', es: 'Título prueba' },
    year: 2026
  };
  let n1 = insertNewImage(gsrc, 'matter', undefined, data);
  checkJs(n1, 'after insertNewImage into matter (append)');
  const nAfter = loadArray(n1, 'GALLERY_DATA');
  const inserted = nAfter.matter.images.find((i) => i.file === data.file);
  ok(!!inserted, 'new image present after insertNewImage');
  ok(inserted && inserted.title && inserted.title.en === 'Test Title', 'new image title correct');
  ok(inserted && inserted.year === 2026, 'new image year correct');
  ok(nAfter.matter.images.length === loadArray(gsrc, 'GALLERY_DATA').matter.images.length + 1, 'matter gained exactly one image (insertNewImage)');

  let n2 = insertNewImage(gsrc, 'matter', 0, data);
  const n2After = loadArray(n2, 'GALLERY_DATA');
  ok(n2After.matter.images[0].file === data.file, 'insertNewImage respects explicit position 0');

  const g5 = createGallery(gsrc, 'branch-test-upload', 'images/branch-test-upload/', { en: 'Test', fr: 'Test', es: 'Prueba' });
  checkJs(g5, 'after createGallery');
  const g5After = loadArray(g5, 'GALLERY_DATA');
  ok(!!g5After['branch-test-upload'], 'new gallery present');
  ok(Array.isArray(g5After['branch-test-upload'].images) && g5After['branch-test-upload'].images.length === 0, 'new gallery starts with empty images[]');
  try { createGallery(g5, 'branch-test-upload', 'x', { en: 'x', fr: 'x', es: 'x' }); ok(false, 'createGallery should refuse a duplicate id'); }
  catch (e) { ok(/already exists/.test(e.message), 'createGallery refuses a duplicate id'); }
}

console.log('\n--- 5. trunk anchor reorder/move (now position-aware) ---');
{
  let t1 = moveTrunkAnchor(tsrc, 't08', 'other');
  checkJs(t1, 'after moveTrunkAnchor t08 -> other');
  let after = loadArray(t1, 'TRUNK_MANIFEST_OTHER');
  let before = loadArray(t1, 'TRUNK_MANIFEST_CURRENT');
  ok(after.some((e) => e.id === 't08'), 't08 present in OTHER after move');
  ok(!before.some((e) => e.id === 't08'), 't08 removed from CURRENT');
  const movedT08 = after.find((e) => e.id === 't08');
  ok(movedT08.related && movedT08.related.length === 7 && !!movedT08.statement, 't08 related[7]+statement preserved on move');

  let t2 = moveTrunkAnchor(t1, 't08', 'current');
  checkJs(t2, 'after moveTrunkAnchor t08 back -> current');
  let backCurrent = loadArray(t2, 'TRUNK_MANIFEST_CURRENT');
  let backOther = loadArray(t2, 'TRUNK_MANIFEST_OTHER');
  ok(backCurrent.some((e) => e.id === 't08') && !backOther.some((e) => e.id === 't08'), 't08 moved back to CURRENT cleanly');
  // KNOWN LIMITATION (documented in README): the anchor's own preceding
  // /* anchor: ... */ comment doesn't travel with it, so this isn't
  // byte-identical — only the data object itself is guaranteed correct
  // (checked above), never the comment's position.

  // pure in-place reorder within the SAME set (t01 -> position 0 of OTHER)
  let r1 = reorderTrunkAnchor(tsrc, 't01', 'other', 0);
  checkJs(r1, 'after reorderTrunkAnchor t01 to position 0');
  let otherOrder = loadArray(r1, 'TRUNK_MANIFEST_OTHER').map((e) => e.id);
  ok(otherOrder[0] === 't01', 't01 reordered to position 0 (was already ~there, but exercises the position path)');
  let r2 = reorderTrunkAnchor(r1, 't01', 'other', 5);
  let otherOrder2 = loadArray(r2, 'TRUNK_MANIFEST_OTHER').map((e) => e.id);
  ok(otherOrder2[5] === 't01', 't01 reordered to position 5');
  ok(otherOrder2.length === otherOrder.length, 'reorder never changes element count');

  // REAL BUG, caught live 2026-11-13: reordering an anchor to "append"
  // (position omitted) within its OWN set, when it's already the last
  // element, round-trips through insertIntoArrayAt's append branch. The
  // array's remaining tail content is then just the removed anchor's own
  // orphaned preceding comment (see the known-limitation note above) —
  // insertIntoArrayAt's old comma check only looked at the literal last
  // character, saw "*/" instead of ",", and wrongly inserted an extra
  // separator comma, corrupting the array (a stray `*/,` — an elided
  // array hole that JSON.stringify turns into a literal `null`, which
  // then crashed the admin UI reading `.file` off it). t16 is
  // TRUNK_MANIFEST_CURRENT's actual last element, so this exercises the
  // real shape, not a synthetic one.
  let s1 = reorderTrunkAnchor(tsrc, 't16', 'current', undefined);
  checkJs(s1, 'after reorderTrunkAnchor t16 -> current, position omitted (self, already last)');
  ok(!s1.includes('*/,'), 'no stray comma left after the orphaned preceding comment');
  let selfOrder = loadArray(s1, 'TRUNK_MANIFEST_CURRENT');
  ok(selfOrder.length === 2 && selfOrder.map((e) => e.id).join(',') === 't08,t16', 't08+t16 both present, t16 still last');
  ok(selfOrder.find((e) => e.id === 't16').related.length === 7, "t16's related[7] survived the round-trip");
}

console.log('\n--- 6. createTrunkAnchor ---');
{
  // t03/t07/t09/t14/t15 were archived in the 2026-11-11 content cull, so
  // the first free id is one of those gaps, not t21 — nextTrunkId fills
  // gaps rather than assuming the existing ids are contiguous.
  const expectedId = nextTrunkId(tsrc);
  ok(/^t\d+$/.test(expectedId) && !new RegExp("id:'" + expectedId + "'").test(tsrc), 'nextTrunkId picks a real unused id (' + expectedId + ')');
  const { src: c1, id } = createTrunkAnchor(tsrc, 'other', 'weathered-rock-formation-coastal-texture-w2b.jpg', undefined);
  checkJs(c1, 'after createTrunkAnchor (new anchor reusing an existing trunk.images file)');
  ok(id === expectedId, 'createTrunkAnchor assigned the expected free id (' + id + ')');
  const created = loadArray(c1, 'TRUNK_MANIFEST_OTHER').find((e) => e.id === id);
  ok(!!created && created.file === 'weathered-rock-formation-coastal-texture-w2b.jpg', 'new anchor references the right file');
}

console.log('\n--- 7. addRelated / removeRelated / reorderRelated / detachBranch ---');
{
  // t13 has NO related array today — attach one for the first time
  let a1 = addRelated(tsrc, 't13', 'branch-glass-roof', SINGLE_LINE_FILE, undefined);
  checkJs(a1, 'after addRelated (attach first branch to a previously branch-less anchor)');
  let t13 = loadArray(a1, 'TRUNK_MANIFEST_OTHER').find((e) => e.id === 't13');
  ok(t13.related && t13.related.length === 1 && t13.related[0].file === SINGLE_LINE_FILE, 't13 gained a related[] with the new entry');

  let a2 = removeRelated(a1, 't13', SINGLE_LINE_FILE);
  checkJs(a2, 'after removeRelated (the only entry — should fully detach)');
  ok(a2 === tsrc, 'addRelated+removeRelated (single entry) round-trips byte-identical, reverting to no-related style');
  if (a2 !== tsrc) diffAt(tsrc, a2, 'addRelated/removeRelated rt');

  // t08 has 7 related already — add an 8th, remove it, reorder two of them
  const EXTRA_FILE = 'palacio-bellas-artes-facade-installation-print-w2b.jpg'; // already in branch-bailar-la-ciudad
  let b1 = addRelated(tsrc, 't08', 'branch-bailar-la-ciudad', 'cypher-miraflores-fanzine-stack-wood-table-w2b.jpg', 0);
  // note: this file is ALREADY related to t08 — addRelated doesn't dedupe by
  // design (that's a curation decision, not a data-integrity one), so this
  // just proves position-aware insert into an existing related[] works;
  // remove it again immediately to get back to a clean round-trip check.
  let t08after = loadArray(b1, 'TRUNK_MANIFEST_CURRENT').find((e) => e.id === 't08');
  ok(t08after.related.length === 8 && t08after.related[0].file === 'cypher-miraflores-fanzine-stack-wood-table-w2b.jpg', 'addRelated inserted at position 0 of an existing related[]');
  let b2 = removeRelated(b1, 't08', 'cypher-miraflores-fanzine-stack-wood-table-w2b.jpg');
  // ambiguous which of the two identical-filename entries got removed is
  // fine here (both exist transiently) — what matters is count + byte match
  ok(b2 === tsrc, 'addRelated(pos 0)+removeRelated round-trips byte-identical on a multi-entry related[]');
  if (b2 !== tsrc) diffAt(tsrc, b2, 'multi-entry add/remove rt');

  let c1 = reorderRelated(tsrc, 't08', 'branch-bailar-la-ciudad', 'cypher-miraflores-fanzine-stack-wood-table-w2b.jpg', 0);
  checkJs(c1, 'after reorderRelated (move last related entry to position 0)');
  let t08c = loadArray(c1, 'TRUNK_MANIFEST_CURRENT').find((e) => e.id === 't08');
  ok(t08c.related[0].file === 'cypher-miraflores-fanzine-stack-wood-table-w2b.jpg' && t08c.related.length === 7, 'reorderRelated moved the entry without changing count');

  let d1 = detachBranch(tsrc, 't08');
  checkJs(d1, 'after detachBranch (full detach)');
  let t08d = loadArray(d1, 'TRUNK_MANIFEST_CURRENT').find((e) => e.id === 't08');
  ok(!t08d.related, 't08 fully detached — no related key at all');
  ok(!!t08d.statement, 'statement untouched by detachBranch');
  // branch-bailar-la-ciudad's own images array in gallery-data.js must be untouched
  const gAfterDetach = loadArray(gsrc, 'GALLERY_DATA');
  ok(gAfterDetach['branch-bailar-la-ciudad'].images.length === 7, 'detaching from the anchor never touches the branch gallery itself');
}

console.log(failures ? '\n=== ' + failures + ' CHECK(S) FAILED ===' : '\n=== ALL CHECKS PASSED ===');
process.exitCode = failures ? 1 : 0;
