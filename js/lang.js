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
    hero_statement:    "Film photography made slowly, between Medellín and the road. The work keeps returning to the same questions: how a place holds memory, how a body meets the light, how an image earns the right to exist.",
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
    about_p1:       "Guillaume Delye, French photographer based in Medellín. The work is made on film.",
    about_p2:       "Available for exhibitions, acquisitions, and signed editions. Editorial commissions on the commercial site.",
    about_readmore: "Read more",

    /* Bridge to pro site */
    bridge_text:    "Editorial and commercial commissions handled separately.",
    bridge_link:    "Commercial portfolio ↗",

    /* Acquisition / inquiry */
    inquire_label:    "Inquire",
    inquire_lightbox: "Inquire about this print",
    inquire_subject:  "Print inquiry",
    edition_label:    "Collector editions of 15 + 2 AP, signed and numbered · open editions also available · archival pigment on cotton rag",

    /* Footer */
    footer_copy:    "© W2b — All rights reserved",

    /* Gallery page */
    back_home:      "← Back",
    photo_count:    "images",

    /* About page */
    about_lead:     "Medellín — film.",
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
    about_prints:             "Collector editions of 15 + 2 AP, signed and numbered · open editions available.",
    about_prints_link:        "See prints →",
    about_exhibitions_label:  "Available for",
    about_avail_1:            "Solo and group exhibitions",
    about_avail_2:            "Residencies and assignments",
    about_avail_3:            "Acquisitions — institutional and private",
    about_publications_label: "Press &amp; selected features",
    about_press_line:         "For press, features and review copies — <a href=\"mailto:w2bphoto+press@gmail.com\">w2bphoto@gmail.com</a>",

    /* Scroll hint */
    scroll_hint:    "Scroll to explore",
    tap_open:       "▼ Slide, scroll, or tap a frame",

    /* Collaborate page */
    nav_collab:        "Collaborate",
    collab_lead:       "Collaboration &amp; Commissions",
    collab_title:      "Work together",
    collab_intro:      "Two ways in — a collaboration between artists, or a private commission.",
    collab_c_label:    "01 — Collaborations",
    collab_c_title:    "For artists &amp; makers",
    collab_c_body:     "I work with models, stylists, dancers and other artists on shared projects — series, exhibitions, ideas that need more than one pair of hands. I bring the eye and the film; you bring what you make. If our work might belong in the same frame, tell me what you're building.",
    collab_c_name:     "Name",
    collab_c_discipline: "Discipline or medium",
    collab_c_idea:     "What you're working on",
    collab_c_link:     "Portfolio or Instagram",
    collab_c_email:    "Email",
    collab_c_submit:   "Send proposal",
    collab_b_label:    "02 — Commissions",
    collab_b_title:    "Boudoir &amp; Dark Desire",
    collab_b_body1:    "A few private commissions each year, in the language of the Nude and Dark Desire series — fine-art boudoir and fetish portraiture, made as art, in a lineage that runs from Bellocq and Newton to Nan Goldin.",
    collab_b_body2:    "How it works: we talk first, at length, before any camera. You see references, we agree the frame together, and nothing is made that you haven't approved. The images are reviewed with you — they are yours, at your pace, and you decide what exists and what doesn't. Closed set in Medellín, full discretion.",
    collab_b_terms:    "By application. Adults only (18+). Not every request is accepted — this work is made slowly and with care.",
    collab_b_name:     "Name",
    collab_b_email:    "Email",
    collab_b_note:     "A few words about what draws you to the work",
    collab_b_note_ph:  "No need for detail here — just a sense of why.",
    collab_b_consent:  "I am 18 or older, and I understand this is an inquiry, not a booking.",
    collab_b_submit:   "Send inquiry",
    collab_response:   "Replies within about a week.",
    collab_discretion: "Every inquiry is handled privately and in confidence.",
    collab_b_cta:      "Private commissions →",

    /* Prints / Shop */
    nav_shop:          "Prints",
    shop_lead:         "Prints &amp; Editions",
    shop_title:        "Collect a print",
    shop_intro:        "Selected images as archival pigment prints on cotton rag, in two tiers — open editions across the catalogue, and a signed, numbered collector edition (15 + 2 AP, with certificate) of the strongest work.",
    shop_terms:        "Each print is made to order and shipped worldwide. Allow two to three weeks. Prices in euros, US dollars and Colombian pesos.",
    shop_acquire:      "Acquire",
    shop_badge_collector: "Collector",
    shop_badge_open:      "Open edition",
    shop_collector_note:  "Signed and numbered · limited edition of 15 + 2 AP · with certificate of authenticity.",
    shop_open_note:       "Open edition · archival pigment print · unsigned.",
    shop_m_intro:      "Choose a size. I'll confirm availability, the final price and shipping to you.",
    shop_m_size:       "Size",
    shop_m_name:       "Name",
    shop_m_email:      "Email",
    shop_m_note:       "Anything I should know (optional)",
    shop_m_submit:     "Request this print",
    shop_m_success:    "Thank you. I'll confirm availability and send the invoice within a couple of days.",
    shop_dark_note:    "Prints from the Nude and Dark Desire series are available privately, on request.",

    /* Press form (About) */
    press_label:       "Press",
    press_intro:       "For press, features, interviews and review copies, send a note — I reply within 48 hours.",
    press_name:        "Name &amp; outlet",
    press_email:       "Email",
    press_msg:         "What you're working on",
    press_submit:      "Send",
    press_success:     "Thank you. I'll be in touch shortly.",
  },

  fr: {
    nav_home:       "Accueil",
    nav_galleries:  "Galeries",
    nav_about:      "À propos",
    nav_pro:        "Commercial ↗",

    hero_tagline:      "Photographies argentiques. Guillaume Delye.",
    hero_eyebrow:      "Photographies argentiques · 2014 — 2026",
    hero_statement:    "Une photographie argentique faite lentement, entre Medellín et la route. Le travail revient toujours aux mêmes questions : comment un lieu garde la mémoire, comment un corps rencontre la lumière, comment une image gagne le droit d'exister.",
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
    about_p1:       "Guillaume Delye, photographe français installé à Medellín. Travail argentique.",
    about_p2:       "Disponible pour expositions, acquisitions et tirages signés. Commandes éditoriales sur le site commercial.",
    about_readmore: "En savoir plus",

    bridge_text:    "Commandes éditoriales et commerciales traitées séparément.",
    bridge_link:    "Portfolio commercial ↗",

    inquire_label:    "Acquérir",
    inquire_lightbox: "Demander cette épreuve",
    inquire_subject:  "Demande de tirage",
    edition_label:    "Éditions collector de 15 + 2 EA, signées et numérotées · éditions ouvertes également · pigment archive sur papier coton",

    footer_copy:    "© W2b — Tous droits réservés",

    back_home:      "← Retour",
    photo_count:    "images",

    about_lead:     "Medellín — argentique.",
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
    about_prints:             "Éditions collector de 15 + 2 EA, signées et numérotées · éditions ouvertes disponibles.",
    about_prints_link:        "Voir les tirages →",
    about_exhibitions_label:  "Disponible pour",
    about_avail_1:            "Expositions personnelles et collectives",
    about_avail_2:            "Résidences et missions",
    about_avail_3:            "Acquisitions — institutionnelles et privées",
    about_publications_label: "Presse &amp; publications",
    about_press_line:         "Pour la presse, articles et exemplaires de critique — <a href=\"mailto:w2bphoto+press@gmail.com\">w2bphoto@gmail.com</a>",

    scroll_hint:    "Défiler pour explorer",
    tap_open:       "▼ Glissez, défilez ou cliquez sur une vignette",

    /* Collaborate page */
    nav_collab:        "Collaborer",
    collab_lead:       "Collaboration &amp; Commandes",
    collab_title:      "Travailler ensemble",
    collab_intro:      "Deux portes — une collaboration entre artistes, ou une commande privée.",
    collab_c_label:    "01 — Collaborations",
    collab_c_title:    "Pour les artistes &amp; créateurs",
    collab_c_body:     "Je travaille avec des modèles, stylistes, danseur·ses et autres artistes sur des projets communs — séries, expositions, idées qui demandent plus d'une paire de mains. J'apporte le regard et la pellicule ; vous apportez ce que vous faites. Si nos univers peuvent tenir dans le même cadre, dites-moi ce que vous construisez.",
    collab_c_name:     "Nom",
    collab_c_discipline: "Discipline ou médium",
    collab_c_idea:     "Ce sur quoi vous travaillez",
    collab_c_link:     "Portfolio ou Instagram",
    collab_c_email:    "E-mail",
    collab_c_submit:   "Envoyer la proposition",
    collab_b_label:    "02 — Commandes",
    collab_b_title:    "Boudoir &amp; Dark Desire",
    collab_b_body1:    "Quelques commandes privées par an, dans la langue des séries Nu et Dark Desire — boudoir et portrait fétichiste comme art, dans une lignée qui va de Bellocq et Newton à Nan Goldin.",
    collab_b_body2:    "Comment ça se passe : on parle d'abord, longuement, avant tout appareil. Vous voyez des références, on décide le cadre ensemble, et rien n'est fait que vous n'ayez approuvé. Les images sont regardées avec vous — elles sont à vous, à votre rythme, et vous décidez de ce qui existe ou non. Plateau fermé à Medellín, discrétion totale.",
    collab_b_terms:    "Sur candidature. Adultes uniquement (18+). Toutes les demandes ne sont pas acceptées — ce travail se fait lentement et avec soin.",
    collab_b_name:     "Nom",
    collab_b_email:    "E-mail",
    collab_b_note:     "Quelques mots sur ce qui vous attire dans ce travail",
    collab_b_note_ph:  "Pas besoin de détails ici — juste une intention.",
    collab_b_consent:  "J'ai 18 ans ou plus, et je comprends qu'il s'agit d'une demande, pas d'une réservation.",
    collab_b_submit:   "Envoyer la demande",
    collab_response:   "Réponse sous une semaine environ.",
    collab_discretion: "Chaque demande est traitée en privé et en confiance.",
    collab_b_cta:      "Commandes privées →",

    /* Tirages / Boutique */
    nav_shop:          "Tirages",
    shop_lead:         "Tirages &amp; Éditions",
    shop_title:        "Acquérir un tirage",
    shop_intro:        "Une sélection d'images en tirages pigmentaires archive sur papier coton, sur deux niveaux — éditions ouvertes dans tout le catalogue, et une édition collector signée et numérotée (15 + 2 EA, avec certificat) des œuvres les plus fortes.",
    shop_terms:        "Chaque tirage est réalisé à la commande et expédié dans le monde entier. Comptez deux à trois semaines. Prix en euros, dollars US et pesos colombiens.",
    shop_acquire:      "Acquérir",
    shop_badge_collector: "Collection",
    shop_badge_open:      "Édition ouverte",
    shop_collector_note:  "Signé et numéroté · édition limitée de 15 + 2 EA · avec certificat d'authenticité.",
    shop_open_note:       "Édition ouverte · tirage pigmentaire archive · non signé.",
    shop_m_intro:      "Choisissez un format. Je confirme la disponibilité, le prix final et l'envoi.",
    shop_m_size:       "Format",
    shop_m_name:       "Nom",
    shop_m_email:      "E-mail",
    shop_m_note:       "Ce que je devrais savoir (facultatif)",
    shop_m_submit:     "Demander ce tirage",
    shop_m_success:    "Merci. Je confirme la disponibilité et envoie la facture sous quelques jours.",
    shop_dark_note:    "Les tirages des séries Nu et Dark Desire sont disponibles en privé, sur demande.",

    /* Formulaire presse (À propos) */
    press_label:       "Presse",
    press_intro:       "Pour la presse, articles, entretiens et exemplaires de presse, écrivez-moi — je réponds sous 48 heures.",
    press_name:        "Nom &amp; média",
    press_email:       "E-mail",
    press_msg:         "Ce sur quoi vous travaillez",
    press_submit:      "Envoyer",
    press_success:     "Merci. Je vous réponds très vite.",
  },

  es: {
    nav_home:       "Inicio",
    nav_galleries:  "Galerías",
    nav_about:      "Acerca",
    nav_pro:        "Comercial ↗",

    hero_tagline:      "Fotografía analógica. Guillaume Delye.",
    hero_eyebrow:      "Fotografía analógica · 2014 — 2026",
    hero_statement:    "Fotografía analógica hecha con lentitud, entre Medellín y la carretera. La obra vuelve siempre a las mismas preguntas: cómo un lugar guarda la memoria, cómo un cuerpo encuentra la luz, cómo una imagen se gana el derecho a existir.",
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
    about_p1:       "Guillaume Delye, fotógrafo francés afincado en Medellín. La obra se hace en analógico.",
    about_p2:       "Disponible para exposiciones, adquisiciones y ediciones firmadas. Los encargos editoriales y comerciales en el sitio comercial.",
    about_readmore: "Leer más",

    bridge_text:    "Encargos editoriales y comerciales se gestionan por separado.",
    bridge_link:    "Portfolio comercial ↗",

    inquire_label:    "Adquirir",
    inquire_lightbox: "Solicitar esta copia",
    inquire_subject:  "Solicitud de copia",
    edition_label:    "Ediciones de coleccionista de 15 + 2 PA, firmadas y numeradas · ediciones abiertas también · pigmento archival sobre papel de algodón",

    footer_copy:    "© W2b — Todos los derechos reservados",

    back_home:      "← Volver",
    photo_count:    "imágenes",

    about_lead:     "Medellín — analógico.",
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
    about_prints:             "Ediciones de coleccionista de 15 + 2 PA, firmadas y numeradas · ediciones abiertas disponibles.",
    about_prints_link:        "Ver copias →",
    about_exhibitions_label:  "Disponible para",
    about_avail_1:            "Exposiciones individuales y colectivas",
    about_avail_2:            "Residencias y encargos",
    about_avail_3:            "Adquisiciones — institucionales y privadas",
    about_publications_label: "Prensa y publicaciones",
    about_press_line:         "Para prensa, artículos y ejemplares de crítica — <a href=\"mailto:w2bphoto+press@gmail.com\">w2bphoto@gmail.com</a>",

    scroll_hint:    "Desplácese para explorar",
    tap_open:       "▼ Desliza, navega o toca una viñeta",

    /* Collaborate page */
    nav_collab:        "Colaborar",
    collab_lead:       "Colaboración y Encargos",
    collab_title:      "Trabajar juntos",
    collab_intro:      "Dos puertas — una colaboración entre artistas, o un encargo privado.",
    collab_c_label:    "01 — Colaboraciones",
    collab_c_title:    "Para artistas y creadores",
    collab_c_body:     "Trabajo con modelos, estilistas, bailarinas y otros artistas en proyectos compartidos — series, exposiciones, ideas que piden más de un par de manos. Yo pongo la mirada y la película; tú pones lo que haces. Si nuestro trabajo puede caber en el mismo encuadre, cuéntame qué estás construyendo.",
    collab_c_name:     "Nombre",
    collab_c_discipline: "Disciplina o medio",
    collab_c_idea:     "En qué estás trabajando",
    collab_c_link:     "Portafolio o Instagram",
    collab_c_email:    "Correo",
    collab_c_submit:   "Enviar propuesta",
    collab_b_label:    "02 — Encargos",
    collab_b_title:    "Boudoir &amp; Dark Desire",
    collab_b_body1:    "Unos pocos encargos privados al año, en el lenguaje de las series Desnudo y Dark Desire — boudoir y retrato fetichista hechos como arte, en una tradición que va de Bellocq y Newton a Nan Goldin.",
    collab_b_body2:    "Cómo funciona: hablamos primero, con calma, antes de cualquier cámara. Ves referencias, decidimos el encuadre juntos, y no se hace nada que no hayas aprobado. Las imágenes se revisan contigo — son tuyas, a tu ritmo, y tú decides qué existe y qué no. Set cerrado en Medellín, discreción total.",
    collab_b_terms:    "Por solicitud. Solo adultos (18+). No se aceptan todas las solicitudes — este trabajo se hace despacio y con cuidado.",
    collab_b_name:     "Nombre",
    collab_b_email:    "Correo",
    collab_b_note:     "Unas palabras sobre qué te atrae de este trabajo",
    collab_b_note_ph:  "No hace falta detalle aquí — solo la intención.",
    collab_b_consent:  "Tengo 18 años o más, y entiendo que esto es una solicitud, no una reserva.",
    collab_b_submit:   "Enviar solicitud",
    collab_response:   "Respuesta en aproximadamente una semana.",
    collab_discretion: "Cada solicitud se trata en privado y con confidencialidad.",
    collab_b_cta:      "Encargos privados →",

    /* Copias / Tienda */
    nav_shop:          "Copias",
    shop_lead:         "Copias y Ediciones",
    shop_title:        "Adquirir una copia",
    shop_intro:        "Una selección de imágenes en copias pigmentadas archival sobre papel de algodón, en dos niveles — ediciones abiertas en todo el catálogo, y una edición de coleccionista firmada y numerada (15 + 2 P/A, con certificado) de las obras más fuertes.",
    shop_terms:        "Cada copia se hace por encargo y se envía a todo el mundo. Calcula dos o tres semanas. Precios en euros, dólares y pesos colombianos.",
    shop_acquire:      "Adquirir",
    shop_badge_collector: "Colección",
    shop_badge_open:      "Edición abierta",
    shop_collector_note:  "Firmada y numerada · edición limitada de 15 + 2 P/A · con certificado de autenticidad.",
    shop_open_note:       "Edición abierta · copia pigmentada archival · sin firmar.",
    shop_m_intro:      "Elige un tamaño. Confirmo disponibilidad, el precio final y el envío.",
    shop_m_size:       "Tamaño",
    shop_m_name:       "Nombre",
    shop_m_email:      "Correo",
    shop_m_note:       "Algo que deba saber (opcional)",
    shop_m_submit:     "Solicitar esta copia",
    shop_m_success:    "Gracias. Confirmo disponibilidad y envío la factura en un par de días.",
    shop_dark_note:    "Las copias de las series Desnudo y Dark Desire están disponibles en privado, a solicitud.",

    /* Formulario de prensa (Sobre mí) */
    press_label:       "Prensa",
    press_intro:       "Para prensa, artículos, entrevistas y ejemplares de reseña, escríbeme — respondo en 48 horas.",
    press_name:        "Nombre y medio",
    press_email:       "Correo",
    press_msg:         "En qué estás trabajando",
    press_submit:      "Enviar",
    press_success:     "Gracias. Te escribo muy pronto.",
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
