/* ============================================================
   TRUNK + RELATIONS MANIFEST
   ══════════════════════════════════════════════════════════════
   Guillaume's real curated selection (2026-10-31): 20 trunk photos
   from his full photo library, plus 3 confirmed "branch" relations
   (bailar la ciudad / lo que dejamos / pretty OD). Replaces the
   earlier same-series-grouping placeholder wholesale.

   Each entry points at one photo in js/gallery-data.js (GALLERY_DATA)
   by `series` (the GALLERY_DATA key) + `idx` (its index in that
   series' `images` array). The trunk photos live in the "trunk"
   pseudo-series; branch photos live in their own "branch-*"
   pseudo-series — none of these are part of GALLERY_ORDER or any
   gallery-*.html page, they only exist for this tree navigation.

   Only 3 of the 20 trunk entries carry a `related` array (the
   confirmed anchors below); the other 17 have none, which
   js/art-trunk.js already handles gracefully (no "More like this"
   section rendered — see RELATED_BY_ID in that file).

   2026-10-31 — reordered so the 3 anchors come FIRST (were at
   positions 7/8/16 of 20). Guillaume: clicking a non-anchor photo
   (17 of the 20) correctly shows nothing beyond the photo itself,
   but nothing made that obvious, so most clicks read as "branches
   are broken" rather than "this one doesn't have a branch." Putting
   the 3 real anchors at the very top — the first thing anyone sees
   or clicks — means the branch feature is hit immediately instead
   of by chance. */

const TRUNK_MANIFEST = [
  /* anchor: Pretty OD final-7.jpg — opens the pretty-OD branch (5 related).
     Statement = the real paragraph from his artist dossier (D:\Documents\
     W2b-Portfolio-Dossier\index.html, p12 "desc"), FR as-written, ES/EN
     translated from it — not invented. */
  { id:'t07', series:'trunk', idx:6, related:[
    {series:'branch-pretty-od',idx:0},
    {series:'branch-pretty-od',idx:1},
    {series:'branch-pretty-od',idx:2},
    {series:'branch-pretty-od',idx:3},
    {series:'branch-pretty-od',idx:4}
  ], statement:{
    fr:"Six chapitres mis en scène, construits un à un comme une progression : l'amour comme une substance, les sentiments achetés dans une dystopie, de ce qui manque à ce qui devient une cage. Une série conceptuelle complète, à l'opposé du geste documentaire du reste de ma pratique : ici, chaque image est construite avant d'être prise.",
    es:"Seis capítulos puestos en escena, construidos uno a uno como una progresión: el amor como una sustancia, los sentimientos comprados en una distopía, de lo que falta a lo que se vuelve una jaula. Una serie conceptual completa, en las antípodas del gesto documental del resto de mi práctica: aquí, cada imagen se construye antes de ser tomada.",
    en:"Six staged chapters, built one by one as a progression: love as a substance, feelings bought in a dystopia, from what's missing to what becomes a cage. A fully conceptual series, the opposite of the documentary gesture running through the rest of my practice: here, every image is constructed before it's taken."
  } },

  /* anchor: bailar la ciudad.jpg — opens the bailar-la-ciudad branch (7
     related: 4 portraits + 3 exhibition-install shots added 2026-10-31).
     Statement = real paragraph from the dossier (D:\Documents\
     W2b-Portfolio-Dossier-v3\index.html, p10 "desc"). */
  { id:'t08', series:'trunk', idx:7, related:[
    {series:'branch-bailar-la-ciudad',idx:0},
    {series:'branch-bailar-la-ciudad',idx:1},
    {series:'branch-bailar-la-ciudad',idx:2},
    {series:'branch-bailar-la-ciudad',idx:3},
    {series:'branch-bailar-la-ciudad',idx:4},
    {series:'branch-bailar-la-ciudad',idx:5},
    {series:'branch-bailar-la-ciudad',idx:6}
  ], statement:{
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
  { id:'t16', series:'trunk', idx:15, related:[
    {series:'branch-lo-que-dejamos',idx:0},
    {series:'branch-lo-que-dejamos',idx:1},
    {series:'branch-lo-que-dejamos',idx:2},
    {series:'branch-lo-que-dejamos',idx:3},
    {series:'branch-lo-que-dejamos',idx:4},
    {series:'branch-lo-que-dejamos',idx:5},
    {series:'branch-lo-que-dejamos',idx:6}
  ], statement:{
    fr:"Ces lieux abandonnés de Medellín portent une mémoire que la ville a cessé de regarder : je les photographie pour que chacun ait, à son tour, la possibilité de les voir sous un nouveau jour, une nouvelle lumière, une autre approche. La série a été présentée une première fois en 2026, dans le cadre du semillero de fotografía documental de l'Instituto de Bellas Artes de Medellín ; elle continue de s'étendre à mesure que de nouveaux lieux apparaissent.",
    es:"Estos lugares abandonados de Medellín guardan una memoria que la ciudad ha dejado de mirar: los fotografío para que cada quien tenga, a su vez, la posibilidad de verlos bajo una nueva luz, otra mirada. La serie se presentó por primera vez en 2026, en el marco del semillero de fotografía documental del Instituto de Bellas Artes de Medellín; sigue creciendo a medida que aparecen nuevos lugares.",
    en:"These abandoned places in Medellín carry a memory the city has stopped looking at: I photograph them so that others, in turn, might see them in a new light, a different way. The series was first shown in 2026, as part of the documentary photography seminar at the Instituto de Bellas Artes de Medellín; it keeps growing as new places appear."
  } },

  /* 2026-11-01 — 11 more branches wired in, per the hand-curated
     proposal reviewed and approved in an earlier session
     (trunk-branch-candidates-v2/manifest.json): STRONG/MODERATE
     matches only. t02/t09/t13/t17 have no related entry — the
     candidate review found nothing better than a WEAK or NO MATCH
     for them, so they stay singular rather than force a weak link
     (same standard already applied to t06/pinball originally). */
  { id:'t01', series:'trunk', idx:0, related:[
    {series:'branch-coastal-texture',idx:0},
    {series:'branch-coastal-texture',idx:1}
  ] },
  { id:'t02', series:'trunk', idx:1 },
  { id:'t03', series:'trunk', idx:2, related:[
    {series:'branch-sunset-pines',idx:0},
    {series:'branch-sunset-pines',idx:1}
  ] },
  { id:'t04', series:'trunk', idx:3, related:[
    {series:'branch-wrecked-boat',idx:0},
    {series:'branch-wrecked-boat',idx:1},
    {series:'branch-wrecked-boat',idx:2}
  ] },
  { id:'t05', series:'trunk', idx:4, related:[
    {series:'branch-glass-roof',idx:0}
  ] },
  { id:'t06', series:'trunk', idx:5, related:[
    {series:'branch-pinball',idx:0},
    {series:'branch-pinball',idx:1},
    {series:'branch-pinball',idx:2},
    {series:'branch-pinball',idx:3}
  ] },
  { id:'t09', series:'trunk', idx:8 },
  { id:'t10', series:'trunk', idx:9, related:[
    {series:'branch-bamboo-pond',idx:0}
  ] },
  { id:'t11', series:'trunk', idx:10, related:[
    {series:'branch-coastal-bench',idx:0},
    {series:'branch-coastal-bench',idx:1},
    {series:'branch-coastal-bench',idx:2}
  ] },
  { id:'t12', series:'trunk', idx:11, related:[
    {series:'branch-rushing-water',idx:0},
    {series:'branch-rushing-water',idx:1}
  ] },
  { id:'t13', series:'trunk', idx:12 },
  { id:'t14', series:'trunk', idx:13, related:[
    {series:'branch-street-lamp',idx:0},
    {series:'branch-street-lamp',idx:1}
  ] },
  { id:'t15', series:'trunk', idx:14, related:[
    {series:'branch-tree-bark',idx:0}
  ] },
  { id:'t17', series:'trunk', idx:16 },
  { id:'t18', series:'trunk', idx:17, related:[
    {series:'branch-dark-bay',idx:0}
  ] },
  { id:'t19', series:'trunk', idx:18, related:[
    {series:'branch-industrial',idx:0},
    {series:'branch-industrial',idx:1},
    {series:'branch-industrial',idx:2}
  ] },
  { id:'t20', series:'trunk', idx:19, related:[
    {series:'branch-passage',idx:0}
  ] }
];
