/* Real pixel dimensions for room-system images, generated once with sharp.
   Used to set explicit width/height on <img> tags so the browser reserves
   layout space before a lazy-loaded image arrives (prevents 0-height
   collapse / images that never trigger native lazy-load). Read-only data,
   not part of the image pipeline.

   Scoped to what the PUBLIC pages that load this file actually display:
   home.html, gallery-contemplations.html, gallery-best-of.html. The two
   galleries show every image in their own folder (contemplations/,
   best-of/); every other folder here is trimmed to just the one cover
   image home.html uses from it — except images/trunk/ and the
   images/branch- folders, which are home.html's trunk/branch tree
   navigation (js/art-trunk.js, js/trunk-data.js) and so are listed in
   full. Nude/boudoir/after-dark filenames are NOT in this file —
   home.html only ever shows the pre-blurred safe teaser
   (images/boudoir/after-dark-teaser-safe.jpg), so that is the only
   boudoir/ entry here. The rest live in js/room-dims-afterdark.js, loaded
   only by after-dark.html, so those filenames are never shipped — even as
   inert text — to a public, indexed page. */
function sizeRoomImg(img, dims, availWidthPx){
  if(!dims || !availWidthPx) return;
  var ratio = dims[0]/dims[1];
  var capH = window.innerHeight*0.88;
  var h = Math.min(availWidthPx/ratio, capH);
  var w = h*ratio;
  img.style.width = Math.round(w)+"px";
  img.style.height = Math.round(h)+"px";
}

const ROOM_DIMS = {
 "images/contemplations/contemplations-blossom-branches-backlit-black-white-w2b.jpg": [
  2048,
  1358
 ],
 "images/contemplations/contemplations-boat-prow-stranded-rocks-colour-w2b.jpg": [
  1867,
  2400
 ],
 "images/contemplations/contemplations-cliff-coastline-black-white-w2b.jpg": [
  2048,
  1604
 ],
 "images/contemplations/contemplations-cliff-cove-inlet-black-white-w2b.jpg": [
  1358,
  2048
 ],
 "images/contemplations/contemplations-figure-bench-by-the-sea-black-white-w2b.jpg": [
  2048,
  1358
 ],
 "images/contemplations/contemplations-golden-dusk-rock-spires-coast-w2b.jpg": [
  2048,
  1601
 ],
 "images/contemplations/contemplations-overgrown-ruin-interior-colour-w2b.jpg": [
  1885,
  2400
 ],
 "images/contemplations/contemplations-ruined-doorway-light-colour-w2b.jpg": [
  2016,
  2400
 ],
 "images/contemplations/contemplations-sea-stacks-pillars-black-white-w2b.jpg": [
  2048,
  1635
 ],
 "images/contemplations/contemplations-stone-cairn-rocky-shore-black-white-w2b.jpg": [
  2048,
  1358
 ],
 "images/contemplations/contemplations-stone-tower-well-black-white-w2b.jpg": [
  1591,
  2400
 ],
 "images/contemplations/contemplations-two-boats-misty-still-water-w2b.jpg": [
  2048,
  999
 ],
 "images/contemplations/contemplations-weathered-boat-hull-colour-w2b.jpg": [
  2048,
  1631
 ],
 "images/contemplations/contemplations-windswept-tree-cliff-edge-black-white-w2b.jpg": [
  1358,
  2048
 ],
 "images/contemplations/contemplations-woman-white-dress-reclining-rocks-w2b.jpg": [
  2048,
  1618
 ],
 "images/contemplations/contemplations-wrecked-boat-rocky-shore-black-white-w2b.jpg": [
  2048,
  1358
 ],
 "images/best-of/abandoned-fishing-boat-low-tide-harbor-black-white-w2b.jpg": [
  2400,
  1754
 ],
 "images/best-of/abandoned-shoes-street-debris-urban-black-white-w2b.jpg": [
  2400,
  1591
 ],
 "images/best-of/antique-shop-gilded-mirror-roman-bust-w2b.jpg": [
  1591,
  2400
 ],
 "images/best-of/bamboo-forest-pond-reflection-stone-wall-w2b.jpg": [
  1024,
  1020
 ],
 "images/best-of/bonfire-flames-night-black-white-w2b.jpg": [
  1358,
  2048
 ],
 "images/best-of/clown-statue-closeup-red-hair-colorful-w2b.jpg": [
  1591,
  2400
 ],
 "images/best-of/congress-building-buenos-aires-argentina-black-white-w2b.jpg": [
  1591,
  2400
 ],
 "images/best-of/crowded-medieval-street-france-motion-blur-black-white-w2b.jpg": [
  1591,
  2400
 ],
 "images/best-of/industrial-gears-bolts-vintage-machine-macro-black-white-w2b.jpg": [
  2400,
  1591
 ],
 "images/best-of/kite-grey-sky-airplane-contrail-minimalist-black-white-w2b.jpg": [
  2400,
  1389
 ],
 "images/best-of/lake-view-wooden-window-mountains-reeds-w2b.jpg": [
  2400,
  1798
 ],
 "images/best-of/lone-figure-salt-flat-salar-argentina-film-w2b.jpg": [
  2000,
  1735
 ],
 "images/best-of/moving-crane-apartment-building-facade-urban-w2b.jpg": [
  679,
  1024
 ],
 "images/best-of/paris-street-sticker-j-existe-haussmann-graffiti-w2b.jpg": [
  2400,
  1696
 ],
 "images/best-of/ransacked-room-interior-debris-chaos-documentary-w2b.jpg": [
  2400,
  1591
 ],
 "images/best-of/sea-anemone-underwater-teal-ocean-w2b.jpg": [
  1024,
  939
 ],
 "images/best-of/ski-lift-silhouette-alpine-sunset-mountains-w2b.jpg": [
  2048,
  2040
 ],
 "images/best-of/solitary-figure-bench-tropical-tree-seaside-black-white-w2b.jpg": [
  2075,
  2121
 ],
 "images/best-of/stone-corridor-ruins-arches-vanishing-point-black-white-w2b.jpg": [
  679,
  1024
 ],
 "images/best-of/sunset-lake-mountain-silhouette-bird-film-w2b.jpg": [
  2400,
  1591
 ],
 "images/best-of/willow-catkin-spring-dusk-blue-sky-w2b.jpg": [
  2400,
  1591
 ],
 "images/work-in-progress/medellin-mercado-interior-siluetas-black-white-w2b.jpg": [
  2400,
  2400
 ],
 "images/matter/artichoke-bud-close-up-spiral-geometry-medium-format-film-w2b.jpg": [
  2400,
  1916
 ],
 "images/perspective/aerial-plaza-fountain-palm-shadows-overhead-colour-film-w2b.jpg": [
  1326,
  2000
 ],
 "images/argentina/argentina-lone-tree-cover-w2b.jpg": [
  2400,
  2340
 ],
 "images/bailar-la-ciudad/bailar-ciudad-parada-manos-nocturna-black-white-w2b.jpg": [
  1600,
  2400
 ],
 "images/pretty-od/pretty-od-chapter-three-cover-w2b.jpg": [
  2400,
  1509
 ],
 "images/boudoir/after-dark-teaser-safe.jpg": [
  345,
  400
 ],

 "images/trunk/weathered-rock-formation-coastal-texture-w2b.jpg": [2400, 2390],
 "images/trunk/driftwood-pebble-beach-mountains-black-white-w2b.jpg": [2389, 2400],
 "images/trunk/sunset-pine-trees-mountain-silhouette-w2b.jpg": [2400, 2390],
 "images/trunk/contemplations-wrecked-boat-rocky-shore-black-white-w2b.jpg": [2048, 1358],
 "images/trunk/glass-roof-grid-baroque-sculpture-ornament-w2b.jpg": [2400, 2397],
 "images/trunk/pinball-arcade-machine-jackpot-cards-neon-w2b.jpg": [2400, 2355],
 "images/trunk/red-lamp-crossed-legs-magazine-intimate-room-w2b.jpg": [2019, 2400],
 "images/trunk/street-dancer-colombia-jersey-motion-night-w2b.jpg": [1267, 1900],
 "images/trunk/rowboats-misty-lake-mountains-w2b.jpg": [2400, 1593],
 "images/trunk/bamboo-tunnel-pond-stone-wall-w2b.jpg": [1024, 1020],
 "images/trunk/coastal-path-bench-ocean-view-faded-film-w2b.jpg": [1358, 2048],
 "images/trunk/rushing-water-rocks-black-white-w2b.jpg": [2400, 1591],
 "images/trunk/hands-playing-double-bass-black-white-w2b.jpg": [2400, 1591],
 "images/trunk/street-lamp-silhouette-bird-sky-black-white-w2b.jpg": [679, 1024],
 "images/trunk/wet-tree-bark-dripping-water-close-up-w2b.jpg": [679, 1024],
 "images/trunk/abandoned-train-wagons-junkyard-color-w2b.jpg": [2400, 2400],
 "images/trunk/woman-car-window-candid-street-black-white-w2b.jpg": [2048, 1629],
 "images/trunk/dark-bay-coastline-silhouette-dramatic-sky-black-white-w2b.jpg": [2400, 1591],
 "images/trunk/bolts-nuts-industrial-gear-close-up-black-white-w2b.jpg": [2400, 1591],
 "images/trunk/crowded-historic-passage-street-photography-black-white-w2b.jpg": [1591, 2400],

 "images/branch-bailar-la-ciudad/man-trucker-cap-sunglasses-night-portrait-black-white-w2b.jpg": [1600, 2400],
 "images/branch-bailar-la-ciudad/men-streetwear-cap-flip-night-black-white-w2b.jpg": [2223, 2400],
 "images/branch-bailar-la-ciudad/man-glasses-hand-gesture-tattoos-portrait-black-white-w2b.jpg": [1876, 2400],
 "images/branch-bailar-la-ciudad/breakdancer-mid-motion-red-light-w2b.jpg": [1600, 2400],

 "images/branch-lo-que-dejamos/scrap-metal-yard-entrance-barbed-wire-workers-w2b.jpg": [2396, 2400],
 "images/branch-lo-que-dejamos/abandoned-factory-water-tower-overgrown-w2b.jpg": [2358, 2400],
 "images/branch-lo-que-dejamos/ruined-building-interior-debris-furniture-w2b.jpg": [2400, 881],
 "images/branch-lo-que-dejamos/calle-54-street-sign-rubble-w2b.jpg": [2400, 882],

 "images/branch-pretty-od/pink-plastic-wrap-figure-abstract-w2b.jpg": [1143, 2400],
 "images/branch-pretty-od/red-light-glowing-eyes-intense-portrait-w2b.jpg": [1600, 2400],
 "images/branch-pretty-od/woman-reclining-neon-light-bedroom-w2b.jpg": [2400, 1600],
 "images/branch-pretty-od/woman-graphic-tee-pink-lit-room-posters-w2b.jpg": [1805, 2400],
 "images/branch-pretty-od/pink-love-perfume-bottle-still-life-w2b.jpg": [2321, 2400]
};
