/* ============================================================
   TRUNK + RELATIONS MANIFEST
   ══════════════════════════════════════════════════════════════
   Guillaume's curated trunk photos from js/gallery-data.js's "trunk"
   pseudo-series, plus confirmed "branch" relations. Split 2026-11-11
   into two manifests to back the two pages that replaced home.html
   (oeuvre-actuelle.html / autres-travaux.html — see js/art-trunk.js,
   which reads window.TRUNK_SET to pick one):

   - TRUNK_MANIFEST_CURRENT: Bailar la Ciudad + Lo que dejamos — the
     two active projects, each a real branch anchor with its own
     artist-statement paragraph.
   - TRUNK_MANIFEST_OTHER: every other remaining trunk photo (after
     the 2026-11-11 removals — see images/_archive/ + archived:true
     flags in gallery-data.js for what came out and why).

   Each entry points at one photo in js/gallery-data.js (GALLERY_DATA)
   by `series` (the GALLERY_DATA key) + `file` (its filename in that
   series' `images` array). Branch photos live in their own
   "branch-*" pseudo-series — none of these are part of GALLERY_ORDER
   or any gallery-*.html page, they only exist for this tree
   navigation. Only the 2 anchors below carry a `related` array; the
   rest have none, which js/art-trunk.js already handles gracefully
   (no "More like this" section rendered — see RELATED_BY_ID).

   2026-11-11 — migrated from `idx` (numeric array position) to `file`
   (filename) addressing. `idx` was a silent-corruption trap: inserting,
   removing or reordering an element in a gallery-data.js images array
   shifted every later idx reference with no error anywhere (exactly
   the ".admin/" tool had to refuse to touch trunk/branch-* arrays for
   this reason). `file` is self-healing — a photo's filename travels
   with it regardless of its position, so the .admin/ tool (and any
   future hand-edit) can freely add/remove/reorder within trunk.images
   or any branch-*.images array without breaking a single reference.
   Filenames are already how shop.html's ANCHOR_TO_PROJECT/SHOP_EXCLUDE
   address trunk photos, so this also makes the whole codebase consistent
   on one addressing scheme instead of two. See js/art-trunk.js's
   resolve() for the lookup (now `g.images.find(im => im.file === ref.file)`
   instead of `g.images[ref.idx]`), and .admin/lib/textedit.js for how
   the admin tool now manages these arrays safely. */

const TRUNK_MANIFEST_CURRENT = [

  /* anchor: bailar la ciudad.jpg — opens the bailar-la-ciudad branch (7
     related: 4 portraits + 3 exhibition-install shots added 2026-10-31).
     Statement = real paragraph from the dossier (D:\Documents\
     W2b-Portfolio-Dossier-v3\index.html, p10 "desc"). */
  { id:'t08', series:'trunk', file:'street-dancer-colombia-jersey-motion-night-w2b.jpg', statement:{
    fr:"Cinq mois à suivre les danseurs de hip-hop de Medellín, cyphers et battles de quartier en quartier : je veux montrer l'espace public comme un lieu que l'on choisit d'occuper et non pas uniquement à traverser. Un premier tirage a été présenté lors de cette même exposition, sous la direction du professeur Enrique Aguirre. Le travail continue vers une exposition complète, et vers un fanzine imprimé : Cypher Miraflores. En parallèle, je construis avec eux un projet plus ample : réunir une trentaine de danseurs pour un cypher photographique unique, pensé comme une œuvre collective, vers une exposition et un livre.",
    es:"Cinco meses siguiendo a los bailarines de hip hop de Medellín, cyphers y batallas de barrio en barrio: quiero mostrar el espacio público como un lugar que se elige ocupar, no solo atravesar. Un primer tiraje se presentó en esa misma exposición, bajo la dirección del profesor Enrique Aguirre. El trabajo sigue avanzando hacia una exposición completa y un fanzine impreso: Cypher Miraflores. En paralelo, construyo con ellos un proyecto más amplio: reunir a una treintena de bailarines para un cypher fotográfico único, pensado como una obra colectiva, hacia una exposición y un libro.",
    en:"Five months following Medellín's hip-hop dancers, cyphers and battles from one neighborhood to the next: I want to show public space as something you choose to occupy, not just pass through. A first print was shown at that same exhibition, under the direction of professor Enrique Aguirre. The work is moving toward a full exhibition and a printed fanzine: Cypher Miraflores. Alongside it, I'm building something larger with them: bringing together some thirty dancers for a single photographic cypher, conceived as a collective work, toward an exhibition and a book."
  } },

  /* anchor: proyecto bella artes-24.jpg — opens the lo-que-dejamos branch (7
     related: 4 location photos + 3 exhibition-install shots added
     2026-10-31). Statement = real paragraph from the dossier (p5 "desc"); the
     ES quote is the official exhibition intention text, printed on the
     actual panel at Palacio de Bellas Artes — use verbatim, see
     project_memoria_urbana_medellin.md. */
  { id:'t16', series:'trunk', file:'abandoned-train-wagons-junkyard-color-w2b.jpg', related:[
    {series:'branch-lo-que-dejamos',file:'scrap-metal-yard-entrance-barbed-wire-workers-w2b.jpg'},
    {series:'branch-lo-que-dejamos',file:'abandoned-factory-water-tower-overgrown-w2b.jpg'},
    {series:'branch-lo-que-dejamos',file:'ruined-building-interior-debris-furniture-w2b.jpg'},
    {series:'branch-lo-que-dejamos',file:'calle-54-street-sign-rubble-w2b.jpg'},
    {series:'branch-lo-que-dejamos',file:'lo-que-dejamos-exhibition-wide-parque-luces-w2b.jpg'},
    {series:'branch-lo-que-dejamos',file:'lo-que-dejamos-exhibition-panel-angle-w2b.jpg'},
    {series:'branch-lo-que-dejamos',file:'lo-que-dejamos-exhibition-panel-closeup-w2b.jpg'}
  ], statement:{
    fr:"Ces lieux abandonnés de Medellín portent une mémoire que la ville a cessé de regarder : je les photographie pour que chacun ait, à son tour, la possibilité de les voir sous un nouveau jour, une nouvelle lumière, une autre approche. La série a été présentée une première fois en 2026, dans le cadre du semillero de fotografía documental de l'Instituto de Bellas Artes de Medellín ; elle continue de s'étendre à mesure que de nouveaux lieux apparaissent.",
    es:"Estos lugares abandonados de Medellín guardan una memoria que la ciudad ha dejado de mirar: los fotografío para que cada quien tenga, a su vez, la posibilidad de verlos bajo una nueva luz, otra mirada. La serie se presentó por primera vez en 2026, en el marco del semillero de fotografía documental del Instituto de Bellas Artes de Medellín; sigue creciendo a medida que aparecen nuevos lugares.",
    en:"These abandoned places in Medellín carry a memory the city has stopped looking at: I photograph them so that others, in turn, might see them in a new light, a different way. The series was first shown in 2026, as part of the documentary photography seminar at the Instituto de Bellas Artes de Medellín; it keeps growing as new places appear."
  } }
];

/* 2026-11-01 — 11 more branches wired in, per the hand-curated
   proposal reviewed and approved in an earlier session
   (trunk-branch-candidates-v2/manifest.json): STRONG/MODERATE
   matches only. t13/t17 have no related entry — the candidate review
   found nothing better than a WEAK or NO MATCH for them, so they stay
   singular rather than force a weak link (same standard already
   applied to t06/pinball originally). t02 got a branch on 2026-11-01
   after a second pass over newly added source photos turned up a
   genuine match (same shoot, same driftwood, wide shot vs. the
   trunk's macro detail). */
const TRUNK_MANIFEST_OTHER = [
  { id:'t01', series:'trunk', file:'weathered-rock-formation-coastal-texture-w2b.jpg', related:[
    {series:'branch-coastal-texture',file:'mussels-barnacles-encrusted-rock-coastal-macro-w2b.jpg'},
    {series:'branch-coastal-texture',file:'sea-anemone-underwater-macro-teal-w2b.jpg'}
  ] },
  { id:'t02', series:'trunk', file:'driftwood-pebble-beach-mountains-black-white-w2b.jpg', related:[
    {series:'branch-driftwood-shore',file:'dead-trees-rocky-shore-mountains-black-white-w2b.jpg'}
  ] },
  { id:'t04', series:'trunk', file:'contemplations-wrecked-boat-rocky-shore-black-white-w2b.jpg', related:[
    {series:'branch-wrecked-boat',file:'wrecked-boat-hull-close-up-black-white-w2b.jpg'},
    {series:'branch-wrecked-boat',file:'wrecked-boat-pl5-marking-black-white-w2b.jpg'},
    {series:'branch-wrecked-boat',file:'wrecked-boat-full-view-colour-w2b.jpg'}
  ] },
  { id:'t05', series:'trunk', file:'glass-roof-grid-baroque-sculpture-ornament-w2b.jpg', related:[
    {series:'branch-glass-roof',file:'arcade-gallery-interior-arches-columns-black-white-w2b.jpg'}
  ] },
  { id:'t06', series:'trunk', file:'pinball-arcade-machine-jackpot-cards-neon-w2b.jpg', related:[
    {series:'branch-pinball',file:'vintage-costume-shop-neon-tubes-fur-coats-w2b.jpg'},
    {series:'branch-pinball',file:'circus-tent-entrance-blue-neon-arches-w2b.jpg'},
    {series:'branch-pinball',file:'teal-neon-light-trails-abandoned-interior-w2b.jpg'},
    {series:'branch-pinball',file:'dj-booth-neon-light-trails-nightclub-w2b.jpg'}
  ] },
  { id:'t10', series:'trunk', file:'bamboo-tunnel-pond-stone-wall-w2b.jpg', related:[
    {series:'branch-bamboo-pond',file:'pond-stone-wall-tree-reflections-w2b.jpg'}
  ] },
  { id:'t11', series:'trunk', file:'coastal-path-bench-ocean-view-faded-film-w2b.jpg', related:[
    {series:'branch-coastal-bench',file:'figure-seated-bench-bay-view-black-white-w2b.jpg'},
    {series:'branch-coastal-bench',file:'man-silhouette-bench-dramatic-sunset-sky-w2b.jpg'},
    {series:'branch-coastal-bench',file:'couple-bench-overlooking-water-w2b.jpg'}
  ] },
  { id:'t12', series:'trunk', file:'rushing-water-rocks-black-white-w2b.jpg', related:[
    {series:'branch-rushing-water',file:'iguazu-falls-wide-view-colour-w2b.jpg'},
    {series:'branch-rushing-water',file:'iguazu-falls-close-crop-colour-w2b.jpg'}
  ] },
  { id:'t13', series:'trunk', file:'hands-playing-double-bass-black-white-w2b.jpg' },
  { id:'t17', series:'trunk', file:'woman-car-window-candid-street-black-white-w2b.jpg' },
  { id:'t18', series:'trunk', file:'dark-bay-coastline-silhouette-dramatic-sky-black-white-w2b.jpg', related:[
    {series:'branch-dark-bay',file:'buoy-silhouette-bay-dramatic-sunset-sky-w2b.jpg'}
  ] },
  { id:'t19', series:'trunk', file:'bolts-nuts-industrial-gear-close-up-black-white-w2b.jpg', related:[
    {series:'branch-industrial',file:'truck-taillight-reflectors-grid-black-white-w2b.jpg'},
    {series:'branch-industrial',file:'motorcycle-frame-mechanical-detail-black-white-w2b.jpg'},
    {series:'branch-industrial',file:'man-junkyard-stripped-car-parts-black-white-w2b.jpg'}
  ] },
  { id:'t20', series:'trunk', file:'crowded-historic-passage-street-photography-black-white-w2b.jpg', related:[
    {series:'branch-passage',file:'tattoo-artist-desk-work-flash-art-wall-w2b.jpg'}
  ] }
];
