/* ============================================================
   W2b ART — Language System
   To edit translations: find the key, change the text value.
   Keys map to elements with data-i18n="key" in HTML.
   ============================================================ */

const TRANSLATIONS = {
  en: {
    /* Navigation */
    nav_home:       "Home",
    nav_galleries:  "Galleries",
    nav_about:      "About",
    nav_pro:        "Commercial ↗",

    /* Hero — curatorial title block */
    hero_tagline:      "Photographs on film. Guillaume Delye.",
    hero_eyebrow:      "Photographs on film · 2014 — 2026",
    hero_statement:    "A working monograph. Five series, sixty-four photographs — made between Medellín and the road.",
    hero_location:     "Studio · Medellín, Colombia",
    hero_index_label:  "Index",
    canister_emulsion: "Hand-developed",

    /* Section labels */
    sec_galleries_num: "PLATE 01",
    sec_about_num:     "PLATE 02",

    /* Gallery section */
    sec_galleries:  "Selected Work",
    view_gallery:   "Enter",
    view_about:     "Read more",

    /* Gallery titles */
    gal_bestof_title: "Selected",
    gal_bestof_desc:  "A working monograph — images held over from a decade of film.",
    gal_wip_title:    "Medellín",
    gal_wip_desc:     "Long-form documentary, ongoing since 2024.",
    gal_s1_title:     "Still Life",
    gal_s1_desc:      "Found objects, botanical studies, and the things left behind.",
    gal_s2_title:     "Distance",
    gal_s2_desc:      "Aerials, horizons, and the figure at scale.",
    gal_s3_title:     "Surface",
    gal_s3_desc:      "Material studies — light, weather, and the grain of matter.",

    /* About snippet */
    sec_about:      "About",
    about_p1:       "Guillaume Delye, French photographer based in Medellín. The work is made on film and printed by hand.",
    about_p2:       "Available for exhibitions, acquisitions, and signed editions. Editorial commissions on the commercial site.",
    about_readmore: "Read more",

    /* Bridge to pro site */
    bridge_text:    "Editorial and commercial commissions handled separately.",
    bridge_link:    "Commercial portfolio ↗",

    /* Acquisition / inquiry */
    inquire_label:    "Inquire",
    inquire_lightbox: "Inquire about this print",
    inquire_subject:  "Print inquiry",
    edition_label:    "Editions of 7 + 2 AP · Signed and numbered · Archival pigment on cotton rag",

    /* Footer */
    footer_copy:    "© W2b — All rights reserved",

    /* Gallery page */
    back_home:      "← Back",
    photo_count:    "images",

    /* About page */
    about_lead:     "Medellín — film, hand-printed.",
    about_title:    "Guillaume Delye",
    about_full_p1:  "I'm Guillaume Delye, a French photographer based in Medellín, Colombia. I shoot 35mm and medium format. Black and white is processed by hand; colour is scanned and printed on cotton rag.",
    about_full_p2:  "The work asks the same three questions — how a place holds memory, how a body sits in light, how an image earns the right to exist. The series come slowly, and they stay.",
    about_full_p3:  "Open to exhibitions, residencies, and acquisitions. Editorial and commercial commissions are handled on the commercial site.",
    about_currently_label:    "In progress",
    about_currently:          "<em>Medellín</em> — long-form documentary, since 2024.",
    about_practice_label:     "Practice",
    about_practice:           "35mm and medium format film · Hand-developed black &amp; white · Archival pigment prints on cotton rag",
    about_locations_label:    "Based",
    about_locations:          "Medellín, Colombia · available internationally",
    about_prints_label:       "Editions",
    about_prints:             "Editions of 7 + 2 AP · signed and numbered · pricing on request.",
    about_exhibitions_label:  "Available for",
    about_avail_1:            "Solo and group exhibitions",
    about_avail_2:            "Residencies and assignments",
    about_avail_3:            "Acquisitions — institutional and private",
    about_publications_label: "Press &amp; selected features",
    about_press_line:         "For press, features and review copies — <a href=\"mailto:press@guillaumedelye.com\">press@guillaumedelye.com</a>",

    /* Scroll hint */
    scroll_hint:    "Scroll to explore",
    tap_open:       "▼ Slide, scroll, or tap a frame",
  },

  fr: {
    nav_home:       "Accueil",
    nav_galleries:  "Galeries",
    nav_about:      "À propos",
    nav_pro:        "Commercial ↗",

    hero_tagline:      "Photographies argentiques. Guillaume Delye.",
    hero_eyebrow:      "Photographies argentiques · 2014 — 2026",
    hero_statement:    "Monographie en cours. Cinq séries, soixante-quatre photographies — faites entre Medellín et la route.",
    hero_location:     "Atelier · Medellín, Colombie",
    hero_index_label:  "Index",
    canister_emulsion: "Développé à la main",

    sec_galleries_num: "PLANCHE 01",
    sec_about_num:     "PLANCHE 02",

    sec_galleries:  "Œuvres choisies",
    view_gallery:   "Entrer",
    view_about:     "En savoir plus",

    gal_bestof_title: "Sélection",
    gal_bestof_desc:  "Une monographie en cours — images retenues d'une décennie d'argentique.",
    gal_wip_title:    "Medellín",
    gal_wip_desc:     "Documentaire au long cours, depuis 2024.",
    gal_s1_title:     "Nature morte",
    gal_s1_desc:      "Objets trouvés, études botaniques, traces laissées.",
    gal_s2_title:     "Distance",
    gal_s2_desc:      "Vues aériennes, horizons, la figure à l'échelle.",
    gal_s3_title:     "Surface",
    gal_s3_desc:      "Études matérielles — lumière, climat, grain de la matière.",

    sec_about:      "À propos",
    about_p1:       "Guillaume Delye, photographe français installé à Medellín. Travail argentique, tirage à la main.",
    about_p2:       "Disponible pour expositions, acquisitions et tirages signés. Commandes éditoriales sur le site commercial.",
    about_readmore: "En savoir plus",

    bridge_text:    "Commandes éditoriales et commerciales traitées séparément.",
    bridge_link:    "Portfolio commercial ↗",

    inquire_label:    "Acquérir",
    inquire_lightbox: "Demander cette épreuve",
    inquire_subject:  "Demande de tirage",
    edition_label:    "Tirages de 7 + 2 EA · signés et numérotés · pigment archive sur papier coton",

    footer_copy:    "© W2b — Tous droits réservés",

    back_home:      "← Retour",
    photo_count:    "images",

    about_lead:     "Medellín — argentique, tirage à la main.",
    about_title:    "Guillaume Delye",
    about_full_p1:  "Je suis Guillaume Delye, photographe français installé à Medellín, en Colombie. Je travaille en 35mm et moyen format. Le noir et blanc est développé à la main ; la couleur est scannée et tirée sur papier coton.",
    about_full_p2:  "Le travail revient à trois questions — comment un lieu garde la mémoire, comment un corps habite la lumière, comment une image gagne le droit d'exister. Les séries viennent lentement, et restent.",
    about_full_p3:  "Ouvert aux expositions, résidences et acquisitions. Les commandes éditoriales et commerciales sont traitées sur le site commercial.",
    about_currently_label:    "En cours",
    about_currently:          "<em>Medellín</em> — documentaire au long cours, depuis 2024.",
    about_practice_label:     "Pratique",
    about_practice:           "35mm et moyen format argentique · Noir &amp; blanc développé à la main · Tirages pigmentaires archive sur papier coton",
    about_locations_label:    "Basé",
    about_locations:          "Medellín, Colombie · disponible à l'international",
    about_prints_label:       "Éditions",
    about_prints:             "Éditions de 7 + 2 EA · signées et numérotées · prix sur demande.",
    about_exhibitions_label:  "Disponible pour",
    about_avail_1:            "Expositions personnelles et collectives",
    about_avail_2:            "Résidences et missions",
    about_avail_3:            "Acquisitions — institutionnelles et privées",
    about_publications_label: "Presse &amp; publications",
    about_press_line:         "Pour la presse, articles et exemplaires de critique — <a href=\"mailto:press@guillaumedelye.com\">press@guillaumedelye.com</a>",

    scroll_hint:    "Défiler pour explorer",
    tap_open:       "▼ Glissez, défilez ou cliquez sur une vignette",
  },

  es: {
    nav_home:       "Inicio",
    nav_galleries:  "Galerías",
    nav_about:      "Acerca",
    nav_pro:        "Comercial ↗",

    hero_tagline:      "Fotografía analógica. Guillaume Delye.",
    hero_eyebrow:      "Fotografía analógica · 2014 — 2026",
    hero_statement:    "Monografía en curso. Cinco series, sesenta y cuatro fotografías — hechas entre Medellín y la carretera.",
    hero_location:     "Estudio · Medellín, Colombia",
    hero_index_label:  "Índice",
    canister_emulsion: "Revelado a mano",

    sec_galleries_num: "LÁMINA 01",
    sec_about_num:     "LÁMINA 02",

    sec_galleries:  "Obra seleccionada",
    view_gallery:   "Entrar",
    view_about:     "Leer más",

    gal_bestof_title: "Selección",
    gal_bestof_desc:  "Una monografía en curso — imágenes retenidas de una década en analógico.",
    gal_wip_title:    "Medellín",
    gal_wip_desc:     "Documental de largo aliento, desde 2024.",
    gal_s1_title:     "Naturaleza muerta",
    gal_s1_desc:      "Objetos encontrados, estudios botánicos, lo que queda.",
    gal_s2_title:     "Distancia",
    gal_s2_desc:      "Vistas aéreas, horizontes, la figura a escala.",
    gal_s3_title:     "Superficie",
    gal_s3_desc:      "Estudios materiales — luz, clima, el grano de la materia.",

    sec_about:      "Acerca",
    about_p1:       "Guillaume Delye, fotógrafo francés afincado en Medellín. La obra se hace en analógico y se imprime a mano.",
    about_p2:       "Disponible para exposiciones, adquisiciones y ediciones firmadas. Los encargos editoriales y comerciales en el sitio comercial.",
    about_readmore: "Leer más",

    bridge_text:    "Encargos editoriales y comerciales se gestionan por separado.",
    bridge_link:    "Portfolio comercial ↗",

    inquire_label:    "Adquirir",
    inquire_lightbox: "Solicitar esta copia",
    inquire_subject:  "Solicitud de copia",
    edition_label:    "Ediciones de 7 + 2 PA · firmadas y numeradas · pigmento archival sobre papel de algodón",

    footer_copy:    "© W2b — Todos los derechos reservados",

    back_home:      "← Volver",
    photo_count:    "imágenes",

    about_lead:     "Medellín — analógico, copia a mano.",
    about_title:    "Guillaume Delye",
    about_full_p1:  "Soy Guillaume Delye, fotógrafo francés afincado en Medellín, Colombia. Trabajo en 35mm y medio formato. El blanco y negro lo revelo a mano; el color lo escaneo y lo imprimo sobre papel de algodón.",
    about_full_p2:  "El trabajo vuelve a las mismas tres preguntas — cómo un lugar guarda la memoria, cómo un cuerpo habita la luz, cómo una imagen se gana el derecho a existir. Las series llegan lentas, y se quedan.",
    about_full_p3:  "Abierto a exposiciones, residencias y adquisiciones. Los encargos editoriales y comerciales se gestionan en el sitio comercial.",
    about_currently_label:    "En curso",
    about_currently:          "<em>Medellín</em> — documental de largo aliento, desde 2024.",
    about_practice_label:     "Práctica",
    about_practice:           "Analógico 35mm y medio formato · Blanco &amp; negro revelado a mano · Copias archivales pigmentadas sobre papel de algodón",
    about_locations_label:    "Ubicación",
    about_locations:          "Medellín, Colombia · disponible internacionalmente",
    about_prints_label:       "Ediciones",
    about_prints:             "Ediciones de 7 + 2 PA · firmadas y numeradas · precios bajo solicitud.",
    about_exhibitions_label:  "Disponible para",
    about_avail_1:            "Exposiciones individuales y colectivas",
    about_avail_2:            "Residencias y encargos",
    about_avail_3:            "Adquisiciones — institucionales y privadas",
    about_publications_label: "Prensa y publicaciones",
    about_press_line:         "Para prensa, artículos y ejemplares de crítica — <a href=\"mailto:press@guillaumedelye.com\">press@guillaumedelye.com</a>",

    scroll_hint:    "Desplácese para explorar",
    tap_open:       "▼ Desliza, navega o toca una viñeta",
  }
};

/* ── Language Engine ─────────────────────────────────────────── */
let currentLang = localStorage.getItem('w2b_lang') || 'en';

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('w2b_lang', lang);

  const t = TRANSLATIONS[lang];
  if (!t) return;

  // Update all translatable elements
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key] !== undefined) el.innerHTML = t[key];
  });

  // Update placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (t[key] !== undefined) el.placeholder = t[key];
  });

  // Update lang buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
  });

  // Update html lang attribute
  document.documentElement.lang = lang;
}

function initLang() {
  applyLang(currentLang);
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => applyLang(btn.getAttribute('data-lang')));
  });
}

document.addEventListener('DOMContentLoaded', initLang);
