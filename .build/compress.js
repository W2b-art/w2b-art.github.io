#!/usr/bin/env node
/* ============================================================
   W2b ART — image compressor
   ------------------------------------------------------------
   Resizes to <= 2400px on the longest side, re-encodes as
   mozjpeg quality 82, and strips EXIF (sharp drops metadata
   unless withMetadata() is called). Orientation is baked in
   first via .rotate() so stripping EXIF does not flip images.

   Usage (run from the repo root):
     node .build/compress.js <file-or-folder> [...more]

   Pass explicit files (or a folder) so only those are touched;
   existing images are left untouched. Edits in place.
   ============================================================ */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const MAX = 2400;
const QUALITY = 82;

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("Usage: node .build/compress.js <file-or-folder> [...]");
  process.exit(1);
}

function collect(target) {
  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    return fs
      .readdirSync(target)
      .filter((f) => /\.jpe?g$/i.test(f))
      .map((f) => path.join(target, f));
  }
  return [target];
}

async function compress(file) {
  const before = fs.statSync(file).size;
  const input = fs.readFileSync(file); // read first, then overwrite safely
  const tmp = file + ".tmp";
  await sharp(input)
    .rotate() // apply EXIF orientation before metadata is dropped
    .resize({ width: MAX, height: MAX, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(tmp);
  fs.renameSync(tmp, file);
  const after = fs.statSync(file).size;
  const kb = (n) => (n / 1024).toFixed(0) + " KB";
  console.log(
    `  ${path.basename(file)}  ${kb(before)} -> ${kb(after)}  (-${(
      100 - (after / before) * 100
    ).toFixed(0)}%)`
  );
}

(async () => {
  const files = args.flatMap(collect);
  console.log(`Compressing ${files.length} image(s), max ${MAX}px, q${QUALITY} mozjpeg, EXIF stripped:`);
  for (const f of files) {
    try {
      await compress(f);
    } catch (e) {
      console.error(`  FAILED ${f}: ${e.message}`);
      process.exitCode = 1;
    }
  }
  console.log("Done.");
})();
