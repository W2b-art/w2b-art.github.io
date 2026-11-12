# W2b art — local admin tool

A small local-only tool to upload new photos, place photos (new or
existing) anywhere — any gallery, any position, including trunk and
branch-* — manage branches and trunk anchors, edit museum-label
metadata, and archive/restore — without hand-editing
`js/gallery-data.js` / `js/trunk-data.js`.

**Local only. Never deployed, never public, never runs git.** It binds to
`127.0.0.1` only. Every action edits `js/gallery-data.js` and/or
`js/trunk-data.js` and moves/writes real files under `images/`, but it
never stages, commits, or pushes anything — review the diff
(`git status` / `git diff`) and commit it yourself, same as any other
change.

## Run it

```bash
node .admin/server.js
```

First run creates `.admin/config.json` with a random password and prints
it once to the terminal — it's gitignored, so it never leaves your
machine. Change the password any time by editing that file. Open the
printed URL (default `http://127.0.0.1:4848`), enter the password.

**First-time setup for Upload**: the upload pipeline needs `sharp`
installed in `.build/` (it's `.gitignore`d, like any `node_modules/`).
If `node .admin/server.js` works but Upload fails with a
"Cannot find module" error, run:
```bash
cd .build && npm install
```
once. Nothing else needs installing — the admin server itself has zero
dependencies.

## 2026-11-11b — architecture change: filename addressing

Everything below was made possible by fixing the actual root cause the
first version of this tool only worked around. **Read this section
before the capability list** — it explains why trunk/branch-* used to be
restricted and why they no longer are.

**Before**: `js/trunk-data.js` addressed photos in `js/gallery-data.js`'s
`trunk` and `branch-*` pseudo-series by **numeric array position**
(`idx`) — `{series:'branch-industrial', idx:0}` meant "whatever is at
position 0 right now". Physically inserting, removing, or reordering an
element in that array would silently shift every later `idx` and point
the site at the wrong photo, with no error anywhere. The first version
of this tool refused to touch those arrays at all for exactly that
reason (archive-in-place and whole-anchor-move were the only safe
operations it allowed).

**Now**: `js/trunk-data.js` addresses photos by **filename**
(`{series:'branch-industrial', file:'man-junkyard-stripped-car-parts-black-white-w2b.jpg'}`).
A filename travels with its photo regardless of position, so inserting,
removing, and reordering within `trunk.images` or any `branch-*.images`
array is now exactly as safe as doing it in a plain gallery — **nothing
is index-locked any more**. This also makes `trunk-data.js` consistent
with how `shop.html`'s `ANCHOR_TO_PROJECT`/`SHOP_EXCLUDE` already
addressed trunk photos (by filename), instead of the codebase running
two different addressing schemes.

Why filename over "a reindex step that rewrites every idx reference
whenever an array changes" (the other option on the table): a reindex
step only protects actions that go *through this tool*. A hand-edit (an
earlier session of mine did several, directly, while curating what's on
the two trunk pages) would still silently corrupt `idx` the moment
someone adds or removes an array element without remembering to run a
reindex pass afterward — and nothing would ever tell them it happened.
Filename addressing is self-healing against *any* kind of edit, tool or
manual, which is exactly the standard the rest of this codebase's
"grep the real value, never compute it by assumed pattern" rule asks
for.

`js/art-trunk.js`'s `resolve()` was updated to match (`g.images.find(im
=> im.file === ref.file)` instead of `g.images[ref.idx]`). The real
site was re-rendered and re-verified after the migration (same photo
counts, same branches, same click-to-open behavior, 0 console errors) —
this was a pure addressing change, not a content change.

**One known, accepted limitation, unchanged from before**: a trunk
anchor's own preceding `/* anchor: ... */` comment block does not travel
with it when moved between pages or reordered — only the data object
itself moves. Tidy a stray comment by hand if it bothers you.

## What it can do

### Archive / Restore
Any photo in any gallery, including trunk and branch-* photos. Flips
`archived: true` and moves the real file (plus any `-800w`/`-1600w`
responsive variants) into/out of `images/_archive/<gallery>/`. Nothing
is ever deleted.

### Place (move + reorder, including trunk/branch-*)
Move a photo to a different gallery, reorder it within its current one,
or both in one step — pick the target gallery and, optionally, an exact
0-based position (blank = append at the end). Works on **any** gallery
now, including `trunk` and `branch-*` — the addressing fix above is what
makes that safe.

### Museum-label metadata (Title, Medium, Year)
Three new, **optional** per-photo fields: `title` (trilingual, like
`alt`), `medium` (trilingual — wording differs per language, e.g.
"Photographie argentique" vs. "Analog photograph"), `year` (a single
number, not translated). Edit them for any photo from the Galleries tab
("Edit label…"). `js/art-trunk.js`'s `cartel()` renders "Title" with a
"Medium, Year" sub-line (`.med`, a pre-existing CSS class that was
waiting for exactly this) when a photo has them, and falls back to
today's plain caption when it doesn't — **nothing was backfilled**, the
20+ photos curated before this existed keep working exactly as they do
today until Guillaume adds labels himself.

### Upload
Pick a target gallery (plain, trunk, or any branch-*), a `.jpg`/`.jpeg`
source file, required trilingual alt text, and optional title/medium/
year/position/trunk-attachment. On submit the tool:
1. Runs the file through the **real pipeline already in this repo**:
   `.build/compress.js` (resize ≤2400px, mozjpeg q82, EXIF-safe rotate)
   then `.build/responsive.js` (`-800w`/`-1600w` AVIF+WebP variants,
   which also updates `js/responsive-manifest.js` itself — the same
   thing that script always does).
2. Writes the result into `images/<gallery>/` and inserts the data
   object into `js/gallery-data.js` at the position you chose.
3. If you picked a branch-* gallery and named a trunk anchor to attach
   to, also adds the new photo to that anchor's `related[]` in
   `js/trunk-data.js` — "upload into a branch" can mean "...and make it
   show up" in one step.

This is a **deliberate, explicit exception** to "never run the image
pipeline" (CLAUDE.md) — that rule is about not touching *existing*
content; running compress/responsive on a brand-new upload, as this
tool's own designed job, is exactly what was asked for. The pipeline
never runs against anything already in `images/` — uploads are
processed in a private scratch dir (`.admin/_upload_tmp/`, gitignored)
and only moved into the real gallery folder once both scripts succeed;
a failed run never leaves a half-processed file behind.

Collisions are refused outright (never silently overwrites an existing
file with the same name).

### Create a branch
A one-field form (id + trilingual title) that adds a new, empty
`"branch-xxx": { images: [] }` entry to `js/gallery-data.js` and creates
its `images/branch-xxx/` folder. Upload photos into it afterward, then
attach it to a trunk anchor if you want it to actually show as "more
like this" on the site.

### Manage trunk anchors
- **Reorder / move** any anchor to an exact position on either page
  (Oeuvre actuelle / Autres travaux).
- **Create a new anchor** for a photo already in `GALLERY_DATA.trunk.images`
  (upload straight into the "trunk" gallery first, or place an existing
  photo there, then create its anchor) — auto-assigns the next free
  `tNN` id (ids aren't required to be contiguous; the five archived from
  the 2026-11-11 content cull — t03/t07/t09/t14/t15 — are real gaps this
  correctly reuses rather than skipping).

### Manage branches on an anchor
- **Attach** a branch to an anchor that doesn't have one yet (creates
  its first `related[]` entry).
- **Add / remove / reorder** individual related-branch entries at an
  exact position.
- **Detach** the whole branch from an anchor in one step (only removes
  the link — the branch gallery's own photos are untouched, so
  reattaching it later is just "attach" again).

## What it still deliberately doesn't do

- **No hard delete, anywhere.** Archive moves a file to
  `images/_archive/<gallery>/` and flips a flag; nothing in this tool
  ever calls `fs.unlink` on a real content file. If a gallery/branch
  genuinely needs to disappear, archive every photo in it by hand (or
  ask for a "delete gallery" primitive to be added — it wasn't built
  because nothing in this round of work needed it, not because it's
  unsafe).
- **No `.png`/`.webp`/etc. uploads** — only `.jpg`/`.jpeg`, matching
  `.build/compress.js`'s own `/\.jpe?g$/i` filter and this site's single
  consistent master format.
- **No dedup check on `addRelated`/related-branch attach** — attaching
  the same `{series, file}` to an anchor twice is allowed (useful for
  testing position changes; a real accidental duplicate is a curation
  mistake to catch by eye, not a data-integrity one, same standard the
  rest of this tool draws between "could corrupt the file" and
  "could be the wrong editorial choice").

## Architecture notes (for the next person who touches this)

- **No npm dependencies in the server itself.** Plain Node
  `http`/`fs`/`path`/`vm`/`crypto`/`child_process`. `node .admin/server.js`
  just works. The upload pipeline shells out to `.build/compress.js` /
  `.build/responsive.js`, which **do** need `sharp` — see "Run it" above.
- **Reads** `gallery-data.js` / `trunk-data.js` by running them in a `vm`
  sandbox (safe, read-only, gets you real JS objects without needing a
  JSON schema). Top-level `const` is rewritten to `var` first — a `vm`
  sandbox's `const`/`let` don't become own properties of the context
  object, only `var` does; this only matters for the read side, writes
  never touch this rewritten copy.
- **Writes** are never "serialize the object back out" — that would
  throw away every hand-written comment and the surrounding file
  structure. Every write is a targeted, string-aware brace/bracket scan
  that finds the exact span to cut or the exact point to insert
  (`.admin/lib/textedit.js`), the same kind of surgical edit a human
  would make. The core primitives:
  - `splitTopLevelElements`/`splitTopLevelFields` — string/brace-aware
    comma-splitting, shared by every array-position and object-field
    operation below.
  - `insertIntoArrayAt(src, open, close, piece, indent, position)` — the
    one function every array insert (images, related[], trunk manifests,
    even a brand-new GALLERY_DATA key) goes through.
  - `setArchived` / `setMetaField` — field-level insert/replace/remove,
    handling both this codebase's hand-written styles (multi-line
    `{\n  file: "x",\n  alt: {...` and single-line `{ file: "x", alt:
    {...`, used inconsistently across galleries) losslessly.
  - `placeImage` / `insertNewImage` — whole-entry cut/insert for
    `images[]` arrays, with a uniform-shift reindent so a multi-line
    entry's nesting survives a move.
  - `findTrunkAnchor` / `reorderTrunkAnchor` / `createTrunkAnchor` /
    `addRelated` / `removeRelated` / `reorderRelated` / `detachBranch` —
    the trunk-manifest-specific layer built on the same primitives.
- `.admin/test_textedit.js` exercises every primitive against the real,
  current data files (**read-only** — it never writes to them),
  including byte-identical round-trip checks (archive+unarchive,
  move-out+move-back, insert-metadata+clear-metadata, attach-branch+
  detach-branch) — run it after touching `textedit.js`:
  ```bash
  node .admin/test_textedit.js
  ```
  **This caught three real, shipped-then-fixed bugs during this very
  round of work** (a double-indent regression in the refactored
  `placeImage`, a single-line-entry insertion bug in the new
  `setMetaField`, and a blank-line-on-removal bug in `removeRelated`) —
  trust the round-trip assertions over a visual read of the diff; two of
  the three only showed up once tested against a real single-line or
  multi-entry array, not the first (simpler) case tried.
- If this tool's scope ever needs to grow further, prefer adding a new
  narrow primitive in `textedit.js` with its own round-trip test over
  generalizing the existing ones — the whole point is that each
  primitive's blast radius is small and verifiable.
