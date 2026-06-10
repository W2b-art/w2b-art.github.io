/* ============================================================
   W2b ART — Gallery Data
   ══════════════════════════════════════════════════════════════

   HOW TO ADD A PHOTO:
   1. Name your file descriptively for SEO, e.g.:
        street-rain-paris-night-w2b.jpg
        portrait-woman-red-light-w2b.jpg
   2. Place the file in the correct images/ subfolder
   3. Add an entry to the images array below

   HOW TO RENAME THE SERIES:
   Change the title and description for any gallery below.
   ============================================================ */

const GALLERY_DATA = {

  "best-of": {
    id: "best-of",
    folder: "images/best-of/",
    coverIndex: 11,
    title: {
      en: "Selected Works",
      fr: "Œuvres choisies",
      es: "Obras seleccionadas"
    },
    description: {
      en: "Defining images drawn from across the practice — black and white film, colour negative, and medium format.",
      fr: "Images choisies à travers la pratique — argentique noir et blanc, négatif couleur et moyen format.",
      es: "Imágenes seleccionadas de toda la práctica — analógico blanco y negro, negativo color y formato medio."
    },
    images: [
      {
        file: "bonfire-flames-night-black-white-w2b.jpg",
        alt: {
          en: "Bonfire burning intensely at night, high contrast black and white film photography",
          fr: "Feu de joie en flammes la nuit, photographie argentique noir et blanc grand contraste",
          es: "Hoguera ardiendo intensamente de noche, fotografía analógica en blanco y negro de alto contraste"
        }
      },
      {
        file: "willow-catkin-spring-dusk-blue-sky-w2b.jpg",
        alt: {
          en: "Willow catkin in bloom against a blue dusk sky, close-up nature film photography",
          fr: "Chaton de saule en fleur sur fond de ciel bleu au crépuscule, macro argentique",
          es: "Amento de sauce en flor contra un cielo azul al anochecer, fotografía macro analógica"
        }
      },
      {
        file: "abandoned-shoes-street-debris-urban-black-white-w2b.jpg",
        alt: {
          en: "Abandoned shoes and urban debris on wet pavement, black and white street documentary photography",
          fr: "Chaussures abandonnées et débris urbains sur pavé mouillé, photographie documentaire noir et blanc",
          es: "Zapatos abandonados y residuos urbanos en pavimento mojado, fotografía documental en blanco y negro"
        }
      },
      {
        file: "solitary-figure-bench-tropical-tree-seaside-black-white-w2b.jpg",
        alt: {
          en: "Solitary figure seated under a tropical tree overlooking the sea, black and white film photography",
          fr: "Silhouette solitaire assise sous un arbre tropical face à la mer, argentique noir et blanc",
          es: "Figura solitaria sentada bajo un árbol tropical frente al mar, fotografía analógica en blanco y negro"
        }
      },
      {
        file: "sea-anemone-underwater-teal-ocean-w2b.jpg",
        alt: {
          en: "Sea anemone with golden tentacles and pink tips on a dark teal ocean floor, underwater photography",
          fr: "Anémone de mer aux tentacules dorés et pointes roses sur fond océan sarcelle, photographie sous-marine",
          es: "Anémona de mar con tentáculos dorados y puntas rosas en fondo oceánico verde azulado"
        }
      },
      {
        file: "bamboo-forest-pond-reflection-stone-wall-w2b.jpg",
        alt: {
          en: "Bamboo forest framing a tranquil pond with stone wall reflection, medium format film photography",
          fr: "Forêt de bambous encadrant un étang tranquille avec reflet de mur en pierre, moyen format argentique",
          es: "Bosque de bambú enmarcando un estanque tranquilo con reflejo de muro de piedra, formato medio analógico"
        }
      },
      {
        file: "antique-shop-gilded-mirror-roman-bust-w2b.jpg",
        alt: {
          en: "Antique shop interior with gilded mirror reflecting the photographer, Roman bust and chandeliers, colour film",
          fr: "Intérieur de brocante avec miroir doré reflétant le photographe, buste romain et lustres, argentique couleur",
          es: "Interior de anticuario con espejo dorado que refleja al fotógrafo, busto romano y lámparas, analógico color"
        }
      },
      {
        file: "ski-lift-silhouette-alpine-sunset-mountains-w2b.jpg",
        alt: {
          en: "Ski lift silhouette against a golden alpine sunset with snow-capped mountain range, film photography",
          fr: "Silhouette de télésiège contre un coucher de soleil alpin doré et chaîne de montagnes enneigées, argentique",
          es: "Silueta de telesilla contra un atardecer alpino dorado con cordillera nevada, fotografía analógica"
        }
      },
      {
        file: "kite-grey-sky-airplane-contrail-minimalist-black-white-w2b.jpg",
        alt: {
          en: "Lone kite flying in a grey sky crossed by an airplane contrail, minimalist black and white film photography",
          fr: "Cerf-volant solitaire dans un ciel gris traversé par une traînée d'avion, minimaliste noir et blanc argentique",
          es: "Cometa solitaria volando en cielo gris cruzado por estela de avión, minimalista blanco y negro analógico"
        }
      },
      {
        file: "lake-view-wooden-window-mountains-reeds-w2b.jpg",
        alt: {
          en: "Mountain lake with reeds and pine forest viewed through a dark wooden window frame, film photography",
          fr: "Lac de montagne avec roseaux et forêt de pins vu à travers un cadre de fenêtre en bois sombre, argentique",
          es: "Lago de montaña con cañas y pinar visto a través de un marco de ventana de madera oscura, analógico"
        }
      },
      {
        file: "sunset-lake-mountain-silhouette-bird-film-w2b.jpg",
        alt: {
          en: "Solitary bird on a calm lake at sunset, mountain silhouette and golden light reflections on water, film photography",
          fr: "Oiseau solitaire sur un lac calme au coucher du soleil, silhouette de montagne et reflets dorés sur l'eau, argentique",
          es: "Pájaro solitario en lago tranquilo al atardecer, silueta de montaña y reflejos dorados en el agua, analógico"
        }
      },
      {
        file: "lone-figure-salt-flat-salar-argentina-film-w2b.jpg",
        alt: {
          en: "Lone figure walking across a vast salt flat in Argentina under a dramatic cloudy sky, colour film photography",
          fr: "Silhouette solitaire marchant sur un immense salar en Argentine sous un ciel nuageux dramatique, argentique couleur",
          es: "Figura solitaria caminando por un vasto salar en Argentina bajo un cielo nublado dramático, analógico color"
        }
      },
      {
        file: "moving-crane-apartment-building-facade-urban-w2b.jpg",
        alt: {
          en: "Moving crane extending diagonally across a Parisian apartment building facade, urban colour film photography",
          fr: "Monte-meuble s'étendant en diagonale sur la façade d'un immeuble parisien, photographie urbaine argentique couleur",
          es: "Grúa de mudanza extendiéndose diagonalmente sobre la fachada de un edificio parisino, analógico color urbano"
        }
      },
      {
        file: "congress-building-buenos-aires-argentina-black-white-w2b.jpg",
        alt: {
          en: "Argentine National Congress building in Buenos Aires with statues and pedestrians, black and white film photography",
          fr: "Congrès national argentin à Buenos Aires avec statues et passants, photographie argentique noir et blanc",
          es: "Congreso Nacional Argentino en Buenos Aires con estatuas y peatones, fotografía analógica en blanco y negro"
        }
      },
      {
        file: "stone-corridor-ruins-arches-vanishing-point-black-white-w2b.jpg",
        alt: {
          en: "Ancient stone corridor in ruins with repeated arches creating a vanishing point, black and white film photography",
          fr: "Couloir en pierre ancienne en ruines avec arches répétées créant un point de fuite, argentique noir et blanc",
          es: "Corredor de piedra antigua en ruinas con arcos repetidos creando punto de fuga, analógico blanco y negro"
        }
      },
      {
        file: "industrial-gears-bolts-vintage-machine-macro-black-white-w2b.jpg",
        alt: {
          en: "Close-up of vintage industrial machine parts with gears and scattered bolts, black and white macro film photography",
          fr: "Gros plan de pièces mécaniques industrielles vintage avec engrenages et boulons épars, macro argentique noir et blanc",
          es: "Primer plano de piezas industriales vintage con engranajes y tornillos dispersos, macro analógico blanco y negro"
        }
      },
      {
        file: "abandoned-fishing-boat-low-tide-harbor-black-white-w2b.jpg",
        alt: {
          en: "Weathered fishing boat PL5 stranded on mud at low tide in a misty harbour, black and white film photography",
          fr: "Vieux bateau de pêche PL5 échoué sur la vase à marée basse dans un port brumeux, argentique noir et blanc",
          es: "Barca de pesca PL5 varada en el barro con marea baja en un puerto brumoso, analógico blanco y negro"
        }
      },
      {
        file: "ransacked-room-interior-debris-chaos-documentary-w2b.jpg",
        alt: {
          en: "Interior of a completely ransacked room covered in scattered papers and debris, colour documentary film photography",
          fr: "Intérieur d'une pièce entièrement saccagée couverte de papiers épars et débris, photographie documentaire argentique couleur",
          es: "Interior de habitación completamente saqueada cubierta de papeles y escombros, fotografía documental analógica color"
        }
      },
      {
        file: "crowded-medieval-street-france-motion-blur-black-white-w2b.jpg",
        alt: {
          en: "Crowded medieval street in France with motion-blurred figures and historic shop signs, black and white film photography",
          fr: "Rue médiévale bondée en France avec silhouettes floues en mouvement et enseignes historiques, argentique noir et blanc",
          es: "Calle medieval concurrida en Francia con figuras en movimiento y carteles históricos, analógico blanco y negro"
        }
      },
      {
        file: "paris-street-sticker-j-existe-haussmann-graffiti-w2b.jpg",
        alt: {
          en: "Paris street traffic box with J'EXISTE sticker and graffiti tags, Haussmann buildings softly blurred in background, colour film",
          fr: "Boîtier de signalisation parisien avec sticker J'EXISTE et tags graffiti, immeubles haussmanniens flous en arrière-plan, argentique couleur",
          es: "Caja de señalización parisina con pegatina J'EXISTE y grafitis, edificios haussmanianos desenfocados al fondo, analógico color"
        }
      },
      {
        file: "clown-statue-closeup-red-hair-colorful-w2b.jpg",
        alt: {
          en: "Close-up portrait of a painted clown statue with red hair and yellow bow tie, vivid colour film photography",
          fr: "Portrait en gros plan d'une statue de clown peinte aux cheveux rouges et nœud papillon jaune, argentique couleur vif",
          es: "Retrato en primer plano de estatua de payaso pintada con cabello rojo y pajarita amarilla, analógico color vivo"
        }
      }
    ]
  },

  "work-in-progress": {
    id: "work-in-progress",
    folder: "images/work-in-progress/",
    coverIndex: 2,
    title: {
      en: "Medellín — In Progress",
      fr: "Medellín — En cours",
      es: "Medellín — En curso"
    },
    description: {
      en: "An ongoing documentary project through the streets, markets, and institutions of Medellín, Colombia.",
      fr: "Un projet documentaire en cours dans les rues, marchés et institutions de Medellín, Colombie.",
      es: "Un proyecto documental en curso por las calles, mercados e instituciones de Medellín, Colombia."
    },
    images: [
      {
        file: "medellin-elder-straw-hat-curbside-street-portrait-colombia-w2b.jpg",
        alt: {
          en: "Elderly man in straw hat and red shirt sitting on a curbside in Medellín, street portrait, colour documentary photography",
          fr: "Homme âgé en chapeau de paille et chemise rouge assis sur un trottoir à Medellín, portrait de rue, documentaire couleur",
          es: "Hombre mayor con sombrero de paja y camisa roja sentado en la acera de Medellín, retrato callejero, fotografía documental color"
        }
      },
      {
        file: "medellin-kitten-shoulder-street-youth-colombia-colour-w2b.jpg",
        alt: {
          en: "Young person carrying a kitten in a leopard-print harness on their shoulder in a colourful Medellín street, colour documentary",
          fr: "Jeune personne portant un chaton en harnais léopard sur l'épaule dans une rue colorée de Medellín, documentaire couleur",
          es: "Joven llevando un gatito con arnés de leopardo sobre el hombro en una colorida calle de Medellín, documental color"
        }
      },
      {
        file: "medellin-dried-flower-market-vintage-scale-colour-w2b.jpg",
        alt: {
          en: "Medellín flower market stall packed with hanging dried and fresh flowers surrounding a vintage weighing scale, colour photography",
          fr: "Étal de marché aux fleurs de Medellín débordant de fleurs séchées et fraîches suspendues autour d'une balance vintage, couleur",
          es: "Puesto del mercado de flores de Medellín repleto de flores secas y frescas colgantes alrededor de una balanza vintage, color"
        }
      },
      {
        file: "medellin-elder-straw-hat-graffiti-street-scene-colombia-w2b.jpg",
        alt: {
          en: "Elderly man in straw hat seated near a locksmith shop against a vivid blue graffiti wall in Medellín, street documentary",
          fr: "Homme âgé au chapeau de paille assis près d'une serrurerie devant un mur de graffiti bleu vif à Medellín, documentaire de rue",
          es: "Hombre mayor con sombrero de paja sentado cerca de una cerrajería ante una pared de grafiti azul vivo en Medellín, documental"
        }
      },
      {
        file: "medellin-candy-vendor-elder-colourful-market-stall-w2b.jpg",
        alt: {
          en: "Elderly candy vendor resting at a colourful market stall overflowing with sweets and lollipops in Medellín, documentary portrait",
          fr: "Vendeur de bonbons âgé se reposant à un étal de marché coloré débordant de sucreries et sucettes à Medellín, portrait documentaire",
          es: "Vendedor anciano de dulces descansando en un puesto de mercado colorido repleto de golosinas en Medellín, retrato documental"
        }
      },
      {
        file: "medellin-bioreactor-laboratory-green-tanks-science-w2b.jpg",
        alt: {
          en: "Row of glowing green bioreactor tanks in a Medellín research laboratory, colour documentary photography",
          fr: "Rangée de cuves bioreacteurs vertes lumineuses dans un laboratoire de recherche de Medellín, photographie documentaire couleur",
          es: "Fila de tanques biorreactores verdes luminosos en un laboratorio de investigación de Medellín, fotografía documental color"
        }
      },
      {
        file: "medellin-worker-rappel-building-facade-urban-labour-w2b.jpg",
        alt: {
          en: "Construction worker rappelling down a striking black and red building facade in Medellín, urban labour documentary, colour",
          fr: "Ouvrier en rappel sur une façade d'immeuble noir et rouge frappante à Medellín, documentaire du travail urbain, couleur",
          es: "Obrero en rappel por una llamativa fachada de edificio negro y rojo en Medellín, documental del trabajo urbano, color"
        }
      },
      {
        file: "medellin-auditorium-social-realist-mural-empty-chairs-black-white-w2b.jpg",
        alt: {
          en: "Empty auditorium chairs beneath a large social realist mural in a Medellín institution, black and white documentary photography",
          fr: "Chaises d'auditorium vides sous une grande fresque réaliste sociale dans une institution de Medellín, noir et blanc documentaire",
          es: "Sillas de auditorio vacías bajo un gran mural realista social en una institución de Medellín, fotografía documental blanco y negro"
        }
      },
      {
        file: "medellin-palacio-cultura-neo-gothic-arches-interior-black-white-w2b.jpg",
        alt: {
          en: "Dramatic upward view of neo-gothic arched galleries inside the Palacio de la Cultura in Medellín, black and white film photography",
          fr: "Vue dramatique vers le haut des galeries arquées néo-gothiques à l'intérieur du Palacio de la Cultura de Medellín, noir et blanc argentique",
          es: "Vista dramática hacia arriba de las galerías arqueadas neogóticas del Palacio de la Cultura de Medellín, fotografía analógica blanco y negro"
        }
      },
      {
        file: "medellin-church-cross-tattoo-wings-devotion-documentary-w2b.jpg",
        alt: {
          en: "Woman from behind in a Medellín church pew, large angel wings and cross tattoo across her back, documentary colour photography",
          fr: "Femme de dos dans les bancs d'une église de Medellín, grand tatouage d'ailes d'ange et croix dans le dos, documentaire couleur",
          es: "Mujer de espaldas en un banco de iglesia en Medellín, gran tatuaje de alas de ángel y cruz en la espalda, documental color"
        }
      }
    ]
  },

  "series-1": {
    id: "series-1",
    folder: "images/details/",
    coverIndex: 7,
    title: {
      en: "Details",
      fr: "Détails",
      es: "Detalles"
    },
    description: {
      en: "Quiet close-ups, found objects, and botanical fragments — fine details noticed and held still.",
      fr: "Gros plans silencieux, objets trouvés et fragments botaniques — détails fins remarqués et figés.",
      es: "Primeros planos silenciosos, objetos encontrados y fragmentos botánicos — detalles notados y detenidos."
    },
    images: [
      {
        file: "child-shoes-stone-ledge-brick-wall-found-object-film-w2b.jpg",
        alt: {
          en: "Pair of small child's leather shoes left on a stone ledge against a red brick wall, colour film found-object photography",
          fr: "Petites chaussures d'enfant en cuir posées sur un rebord en pierre devant un mur de briques rouges, photographie argentique d'objet trouvé",
          es: "Pequeños zapatos de cuero infantiles dejados en una repisa de piedra contra un muro de ladrillo rojo, fotografía analógica de objeto encontrado"
        }
      },
      {
        file: "animal-skeleton-rocky-ground-sepia-film-w2b.jpg",
        alt: {
          en: "Animal skeleton resting among warm rocky ground, sepia toned colour film detail photography",
          fr: "Squelette d'animal reposant sur un sol rocheux aux tons chauds, détail photographique argentique sépia",
          es: "Esqueleto de animal sobre suelo rocoso de tonos cálidos, fotografía analógica de detalle en sepia"
        }
      },
      {
        file: "ghost-swing-blue-urban-alley-multiple-exposure-colour-film-w2b.jpg",
        alt: {
          en: "Yellow swing rendered as a ghost from a multiple exposure in a dim blue urban alley, colour film photography",
          fr: "Balançoire jaune en surimpression spectrale dans une ruelle urbaine bleue, photographie argentique couleur",
          es: "Columpio amarillo en exposición múltiple fantasmal en un callejón urbano azul, fotografía analógica color"
        }
      },
      {
        file: "frida-kahlo-painted-portrait-dark-wooden-planks-film-w2b.jpg",
        alt: {
          en: "Painted portrait of Frida Kahlo on a small metal plate mounted on dark wooden planks, colour film street art detail",
          fr: "Portrait peint de Frida Kahlo sur une petite plaque métallique fixée sur des planches en bois sombre, détail street art argentique couleur",
          es: "Retrato pintado de Frida Kahlo en una placa metálica pequeña montada sobre tablones de madera oscura, detalle de arte urbano analógico"
        }
      },
      {
        file: "geranium-silhouette-teal-glass-wall-minimalist-film-w2b.jpg",
        alt: {
          en: "Slender geranium plant silhouetted against a soft teal glass wall, minimalist colour film botanical study",
          fr: "Géranium élancé en silhouette devant un mur en verre vert d'eau, étude botanique minimaliste argentique couleur",
          es: "Geranio esbelto en silueta contra una pared de vidrio verde agua, estudio botánico minimalista analógico color"
        }
      },
      {
        file: "geranium-plant-light-leak-orange-curtain-interior-film-w2b.jpg",
        alt: {
          en: "Indoor geranium plant against a window with curtains, dramatic orange and green light leak, colour film photography",
          fr: "Géranium d'intérieur devant une fenêtre avec rideaux, fuites de lumière orange et verte, photographie argentique couleur",
          es: "Geranio de interior frente a ventana con cortinas, dramáticas filtraciones de luz naranja y verde, fotografía analógica color"
        }
      },
      {
        file: "blue-spiky-wildflower-macro-medium-format-colour-film-w2b.jpg",
        alt: {
          en: "Macro close-up of a blue spiky wildflower (love-in-a-mist) on warm bokeh ground, medium format colour film botanical detail",
          fr: "Macro d'une fleur sauvage bleue épineuse (nigelle) sur fond chaud en bokeh, détail botanique moyen format argentique couleur",
          es: "Macro de flor silvestre azul espinosa (neguilla) sobre fondo cálido en bokeh, detalle botánico medio formato analógico color"
        }
      },
      {
        file: "artichoke-bud-close-up-spiral-geometry-medium-format-film-w2b.jpg",
        alt: {
          en: "Close-up of an unopened artichoke bud revealing the perfect spiral geometry of its leaves, medium format colour film",
          fr: "Gros plan d'un bouton d'artichaut fermé révélant la géométrie spirale parfaite de ses feuilles, moyen format argentique couleur",
          es: "Primer plano de una alcachofa cerrada revelando la geometría espiral perfecta de sus hojas, medio formato analógico color"
        }
      }
    ]
  },

  "series-2": {
    id: "series-2",
    folder: "images/perspective/",
    coverIndex: 0,
    title: {
      en: "Perspectives",
      fr: "Perspectives",
      es: "Perspectivas"
    },
    description: {
      en: "Aerial views, vanishing points, and angles that pull the eye through the frame.",
      fr: "Vues aériennes, points de fuite et angles qui entraînent le regard à travers le cadre.",
      es: "Vistas aéreas, puntos de fuga y ángulos que llevan la mirada a través del cuadro."
    },
    images: [
      {
        file: "aerial-plaza-fountain-palm-shadows-overhead-colour-film-w2b.jpg",
        alt: {
          en: "Overhead aerial view of an empty plaza with a small fountain and dramatic palm tree shadows, warm colour film photography",
          fr: "Vue aérienne plongeante d'une place vide avec petite fontaine et ombres dramatiques de palmiers, photographie argentique couleur",
          es: "Vista aérea cenital de una plaza vacía con pequeña fuente y dramáticas sombras de palmeras, fotografía analógica color"
        }
      },
      {
        file: "airplane-window-wing-river-below-aerial-black-white-film-w2b.jpg",
        alt: {
          en: "Aerial view through an airplane porthole of the wing and a meandering river below, black and white film photography",
          fr: "Vue aérienne à travers un hublot d'avion sur l'aile et une rivière sinueuse en contrebas, photographie argentique noir et blanc",
          es: "Vista aérea a través de la ventanilla de un avión del ala y un río serpenteante abajo, fotografía analógica blanco y negro"
        }
      },
      {
        file: "lighthouse-signal-tower-silhouette-golden-sunset-film-w2b.jpg",
        alt: {
          en: "Silhouette of a tall coastal signal tower with figures at its base against a golden orange sunset sky, colour film photography",
          fr: "Silhouette d'une haute tour de signalisation côtière avec personnages à sa base devant un ciel orange doré au coucher du soleil, argentique couleur",
          es: "Silueta de una alta torre de señales costera con figuras en su base contra un cielo de atardecer dorado anaranjado, analógico color"
        }
      },
      {
        file: "stone-arch-corridor-bicycles-night-black-white-film-w2b.jpg",
        alt: {
          en: "Receding stone vaulted corridor with parked bicycles and an antique urn at night, black and white film architectural photography",
          fr: "Couloir voûté en pierre en perspective fuyante avec vélos garés et urne ancienne la nuit, photographie architecturale argentique noir et blanc",
          es: "Corredor abovedado de piedra en fuga con bicicletas estacionadas y urna antigua de noche, fotografía arquitectónica analógica blanco y negro"
        }
      },
      {
        file: "metro-crowd-glimpsed-dark-gap-black-white-film-w2b.jpg",
        alt: {
          en: "Crowd of metro passengers glimpsed through a dark vertical gap with sharp light, black and white film urban photography",
          fr: "Foule de passagers du métro entrevue à travers une fente sombre verticale avec lumière vive, photographie urbaine argentique noir et blanc",
          es: "Multitud de pasajeros del metro vista a través de una rendija oscura vertical con luz intensa, fotografía urbana analógica blanco y negro"
        }
      },
      {
        file: "circus-tent-blue-neon-arcs-dusk-structural-film-w2b.jpg",
        alt: {
          en: "Circus tent framed by curving blue neon arcs at dusk, structural and symmetrical film photography",
          fr: "Chapiteau de cirque encadré par des arcs courbes de néon bleu au crépuscule, photographie argentique structurelle et symétrique",
          es: "Carpa de circo enmarcada por arcos curvos de neón azul al atardecer, fotografía analógica estructural y simétrica"
        }
      },
      {
        file: "aerial-bariloche-lake-islands-mountain-panorama-colour-film-w2b.jpg",
        alt: {
          en: "Aerial panorama of Bariloche lakes, islands and snowy mountains seen from a high vantage point, colour film landscape photography",
          fr: "Panorama aérien des lacs, îles et montagnes enneigées de Bariloche vu d'un point haut, paysage argentique couleur",
          es: "Panorama aéreo de los lagos, islas y montañas nevadas de Bariloche desde un punto alto, paisaje analógico color"
        }
      },
      {
        file: "stone-statues-silhouette-purple-lake-sunset-patagonia-film-w2b.jpg",
        alt: {
          en: "Three carved stone figures silhouetted against a violet Patagonian lake at sunset, colour film perspective photography",
          fr: "Trois figures de pierre sculptées en silhouette devant un lac patagonien violet au coucher du soleil, photographie argentique couleur",
          es: "Tres figuras de piedra talladas en silueta contra un lago patagónico violeta al atardecer, fotografía analógica color"
        }
      }
    ]
  },

  "series-3": {
    id: "series-3",
    folder: "images/textures/",
    coverIndex: 0,
    title: {
      en: "Textures",
      fr: "Textures",
      es: "Texturas"
    },
    description: {
      en: "Surfaces, materials, and abstract studies — the tactile language of light on matter.",
      fr: "Surfaces, matières et études abstraites — le langage tactile de la lumière sur la matière.",
      es: "Superficies, materiales y estudios abstractos — el lenguaje táctil de la luz sobre la materia."
    },
    images: [
      {
        file: "cactus-spines-extreme-macro-abstract-black-white-film-w2b.jpg",
        alt: {
          en: "Extreme macro of cactus spines forming an abstract crystalline pattern, black and white film photography",
          fr: "Macro extrême d'épines de cactus formant un motif cristallin abstrait, photographie argentique noir et blanc",
          es: "Macro extrema de espinas de cactus formando un patrón cristalino abstracto, fotografía analógica blanco y negro"
        }
      },
      {
        file: "water-cascade-splash-dark-rocks-black-white-film-w2b.jpg",
        alt: {
          en: "Whitewater splashing over dark wet rocks, frozen by film, black and white texture photography",
          fr: "Eau blanche éclaboussant sur des rochers sombres mouillés, figée à l'argentique, photographie de texture noir et blanc",
          es: "Agua blanca salpicando sobre rocas oscuras y húmedas, congelada por el analógico, fotografía de textura blanco y negro"
        }
      },
      {
        file: "guitar-strings-light-trails-long-exposure-black-white-film-w2b.jpg",
        alt: {
          en: "Long exposure of guitar strings rendered as flowing light trails by a moving hand, black and white film abstract texture",
          fr: "Longue exposition de cordes de guitare devenues traînées lumineuses par une main en mouvement, texture abstraite argentique noir et blanc",
          es: "Larga exposición de cuerdas de guitarra convertidas en estelas de luz por una mano en movimiento, textura abstracta analógica"
        }
      },
      {
        file: "geodesic-dome-mesh-looking-up-sepia-film-w2b.jpg",
        alt: {
          en: "Looking up through the geometric mesh of a geodesic dome sculpture, sepia toned film texture and pattern photography",
          fr: "Vue vers le haut à travers le maillage géométrique d'une sculpture en dôme géodésique, photographie argentique sépia de texture et motif",
          es: "Vista hacia arriba a través de la malla geométrica de una escultura de cúpula geodésica, fotografía analógica sepia de textura y patrón"
        }
      },
      {
        file: "fresh-pita-bread-bakery-shallow-depth-colour-film-w2b.jpg",
        alt: {
          en: "Row of fresh pita breads on a bakery counter, shallow depth of field, warm colour film food texture photography",
          fr: "Rangée de pains pita frais sur un comptoir de boulangerie, faible profondeur de champ, photographie argentique couleur de texture culinaire",
          es: "Fila de panes pita frescos en mostrador de panadería, poca profundidad de campo, fotografía analógica color de textura culinaria"
        }
      },
      {
        file: "stage-spotlights-purple-smoke-darkness-abstract-w2b.jpg",
        alt: {
          en: "Purple stage spotlights cutting through smoke in total darkness, abstract concert texture photography",
          fr: "Projecteurs de scène violets traversant la fumée dans l'obscurité totale, photographie abstraite de texture de concert",
          es: "Focos morados de escenario atravesando humo en total oscuridad, fotografía abstracta de textura de concierto"
        }
      },
      {
        file: "pink-geranium-silver-foliage-close-up-medium-format-film-w2b.jpg",
        alt: {
          en: "Tiny pink geranium flower nestled within silver-green foliage, medium format colour film botanical texture photography",
          fr: "Petite fleur de géranium rose nichée dans un feuillage vert argenté, photographie botanique de texture moyen format argentique couleur",
          es: "Pequeña flor de geranio rosa anidada en follaje verde plateado, fotografía botánica de textura medio formato analógico color"
        }
      }
    ]
  },

  "nude": {
    id: "nude",
    folder: "images/nude/",
    coverIndex: 0,
    title: {
      en: "Nude",
      fr: "Nu",
      es: "Desnudo"
    },
    description: {
      en: "Fine-art nude and boudoir — the body as landscape, studied in low-key black and white.",
      fr: "Nu d'art et boudoir — le corps comme paysage, étudié en noir et blanc clair-obscur.",
      es: "Desnudo artístico y boudoir — el cuerpo como paisaje, estudiado en blanco y negro de bajo perfil."
    },
    images: [
      {
        file: "fine-art-nude-torso-sculptural-light-black-white-03-w2b.jpg",
        alt: {
          en: "Sculptural fine-art nude torso shaped by directional light, low-key black and white photography",
          fr: "Torse nu sculptural modelé par une lumière directionnelle, photographie noir et blanc clair-obscur",
          es: "Torso desnudo escultural modelado por luz direccional, fotografía en blanco y negro de bajo perfil"
        }
      },
      {
        file: "fine-art-nude-back-curve-shadow-black-white-02-w2b.jpg",
        alt: {
          en: "Fine-art nude study of a curved back and shoulder in deep shadow, black and white",
          fr: "Étude de nu d'art, courbe du dos et de l'épaule dans une ombre profonde, noir et blanc",
          es: "Estudio de desnudo artístico, curva de la espalda y el hombro en sombra profunda, blanco y negro"
        }
      },
      {
        file: "fine-art-nude-side-light-contour-black-white-05-w2b.jpg",
        alt: {
          en: "Side-lit nude contour tracing hip and waist, minimalist black and white form study",
          fr: "Contour de nu en lumière latérale soulignant la hanche et la taille, étude de forme minimaliste noir et blanc",
          es: "Contorno de desnudo con luz lateral que traza cadera y cintura, estudio de forma minimalista en blanco y negro"
        }
      },
      {
        file: "fine-art-nude-reclining-soft-light-black-white-04-w2b.jpg",
        alt: {
          en: "Reclining nude bathed in soft low light, intimate black and white photography",
          fr: "Nu allongé baigné d'une lumière douce et tamisée, photographie intime noir et blanc",
          es: "Desnudo reclinado bañado en luz suave y tenue, fotografía íntima en blanco y negro"
        }
      },
      {
        file: "fine-art-nude-study-low-key-black-white-01-w2b.jpg",
        alt: {
          en: "Low-key nude study, the body emerging from darkness in black and white",
          fr: "Étude de nu en clair-obscur, le corps émergeant de l'obscurité en noir et blanc",
          es: "Estudio de desnudo en bajo perfil, el cuerpo emergiendo de la oscuridad en blanco y negro"
        }
      },
      {
        file: "fine-art-nude-silhouette-minimal-black-white-07-w2b.jpg",
        alt: {
          en: "Minimal nude silhouette against deep shadow, black and white fine-art photography",
          fr: "Silhouette de nu minimaliste sur ombre profonde, photographie d'art noir et blanc",
          es: "Silueta de desnudo minimalista contra sombra profunda, fotografía artística en blanco y negro"
        }
      },
      {
        file: "fine-art-nude-form-study-shadow-black-white-06-w2b.jpg",
        alt: {
          en: "Intimate portrait of a model with eyes closed in soft light, black and white fine-art nude study",
          fr: "Portrait intime d'une modèle aux yeux fermés en lumière douce, étude de nu d'art noir et blanc",
          es: "Retrato íntimo de una modelo con los ojos cerrados en luz suave, estudio de desnudo artístico en blanco y negro"
        }
      },
      {
        file: "boudoir-lingerie-low-key-black-white-08-w2b.jpg",
        alt: {
          en: "Boudoir portrait in delicate lace lingerie reclining on a bed, low-key black and white",
          fr: "Portrait boudoir en lingerie de dentelle délicate, allongée sur un lit, noir et blanc clair-obscur",
          es: "Retrato boudoir en lencería de encaje delicada recostada en una cama, blanco y negro de bajo perfil"
        }
      },
      {
        file: "boudoir-intimate-pose-black-white-10-w2b.jpg",
        alt: {
          en: "Intimate boudoir pose seen from behind with lace detail, black and white photography",
          fr: "Pose boudoir intime vue de dos avec détail de dentelle, photographie noir et blanc",
          es: "Pose boudoir íntima vista de espaldas con detalle de encaje, fotografía en blanco y negro"
        }
      },
      {
        file: "boudoir-fishnet-stockings-black-white-09-w2b.jpg",
        alt: {
          en: "Boudoir study in fishnet stockings, kneeling figure in low-key black and white",
          fr: "Étude boudoir en bas résille, silhouette agenouillée en noir et blanc clair-obscur",
          es: "Estudio boudoir con medias de red, figura arrodillada en blanco y negro de bajo perfil"
        }
      },
      {
        file: "boudoir-figure-shadow-black-white-11-w2b.jpg",
        alt: {
          en: "Nude figure softly lit on a bed, shadow and skin in black and white",
          fr: "Silhouette nue doucement éclairée sur un lit, ombre et peau en noir et blanc",
          es: "Figura desnuda suavemente iluminada en una cama, sombra y piel en blanco y negro"
        }
      },
      {
        file: "boudoir-soft-light-black-white-13-w2b.jpg",
        alt: {
          en: "Intimate scene in soft low light, tender black and white boudoir photography",
          fr: "Scène intime en lumière douce et tamisée, photographie boudoir tendre noir et blanc",
          es: "Escena íntima en luz suave y tenue, fotografía boudoir tierna en blanco y negro"
        }
      },
      {
        file: "boudoir-warm-light-figure-colour-12-w2b.jpg",
        alt: {
          en: "Reclining figure in warm ambient light, intimate boudoir photography",
          fr: "Silhouette allongée dans une lumière chaude ambiante, photographie boudoir intime",
          es: "Figura reclinada en cálida luz ambiente, fotografía boudoir íntima"
        }
      }
    ]
  },

  "boudoir": {
    id: "boudoir",
    folder: "images/boudoir/",
    coverIndex: 0,
    title: {
      en: "Dark Desire",
      fr: "Désir Obscur",
      es: "Deseo Oscuro"
    },
    description: {
      en: "A darker register — latex, masks, and red light. Fetish portraiture and bold colour boudoir.",
      fr: "Un registre plus sombre — latex, masques et lumière rouge. Portrait fétichiste et boudoir couleur affirmé.",
      es: "Un registro más oscuro — látex, máscaras y luz roja. Retrato fetichista y boudoir a color audaz."
    },
    images: [
      {
        file: "fetish-latex-mask-red-light-01-w2b.jpg",
        alt: {
          en: "Figure in a black latex hood under deep red light, fetish portrait photography",
          fr: "Silhouette en cagoule de latex noir sous une lumière rouge profonde, photographie de portrait fétichiste",
          es: "Figura con capucha de látex negro bajo luz roja profunda, fotografía de retrato fetichista"
        }
      },
      {
        file: "fetish-latex-mask-red-light-02-w2b.jpg",
        alt: {
          en: "Masked figure in latex under dramatic red light, fetish art photography",
          fr: "Silhouette masquée en latex sous une lumière rouge dramatique, photographie d'art fétichiste",
          es: "Figura enmascarada en látex bajo luz roja dramática, fotografía artística fetichista"
        }
      },
      {
        file: "fetish-latex-mask-red-light-04-w2b.jpg",
        alt: {
          en: "Latex-hooded figure with hands together under red light, fetish portrait",
          fr: "Silhouette en cagoule de latex, mains jointes sous lumière rouge, portrait fétichiste",
          es: "Figura con capucha de látex y manos juntas bajo luz roja, retrato fetichista"
        }
      },
      {
        file: "fetish-latex-mask-red-light-06-w2b.jpg",
        alt: {
          en: "Masked latex figure emerging from red-lit darkness, fetish art photography",
          fr: "Silhouette masquée en latex émergeant d'une obscurité rouge, photographie d'art fétichiste",
          es: "Figura enmascarada en látex emergiendo de la oscuridad roja, fotografía artística fetichista"
        }
      },
      {
        file: "fetish-latex-mask-red-light-08-w2b.jpg",
        alt: {
          en: "Latex mask lit in dual red tones, bold fetish portrait photography",
          fr: "Masque de latex éclairé en doubles tons rouges, portrait fétichiste affirmé",
          es: "Máscara de látex iluminada en dobles tonos rojos, retrato fetichista audaz"
        }
      },
      {
        file: "fetish-latex-mask-red-light-10-w2b.jpg",
        alt: {
          en: "Standing figure in a latex catsuit and hood under red light, fetish photography",
          fr: "Silhouette debout en combinaison et cagoule de latex sous lumière rouge, photographie fétichiste",
          es: "Figura de pie en mono y capucha de látex bajo luz roja, fotografía fetichista"
        }
      },
      {
        file: "fetish-latex-mask-dramatic-shadow-07-w2b.jpg",
        alt: {
          en: "Masked latex figure in dramatic chiaroscuro shadow, fetish art photography",
          fr: "Silhouette masquée en latex dans un clair-obscur dramatique, photographie d'art fétichiste",
          es: "Figura enmascarada en látex en claroscuro dramático, fotografía artística fetichista"
        }
      },
      {
        file: "fetish-latex-mask-low-key-03-w2b.jpg",
        alt: {
          en: "Latex-hooded figure raising a blade into red light, low-key fetish portrait",
          fr: "Silhouette en cagoule de latex levant une lame dans la lumière rouge, portrait fétichiste clair-obscur",
          es: "Figura con capucha de látex levantando una hoja hacia la luz roja, retrato fetichista de bajo perfil"
        }
      },
      {
        file: "fetish-latex-mask-low-key-05-w2b.jpg",
        alt: {
          en: "Tattooed arm and latex mask with a blade, low-key red fetish photography",
          fr: "Bras tatoué et masque de latex avec une lame, photographie fétichiste rouge clair-obscur",
          es: "Brazo tatuado y máscara de látex con una hoja, fotografía fetichista roja de bajo perfil"
        }
      },
      {
        file: "fetish-latex-mask-low-key-09-w2b.jpg",
        alt: {
          en: "Latex mask barely emerging from near-total darkness, atmospheric fetish photography",
          fr: "Masque de latex émergeant à peine d'une obscurité quasi totale, photographie fétichiste atmosphérique",
          es: "Máscara de látex apenas emergiendo de una oscuridad casi total, fotografía fetichista atmosférica"
        }
      },
      {
        file: "fetish-latex-mask-portrait-11-w2b.jpg",
        alt: {
          en: "Close fetish portrait, latex hood and gloved hands framing the face in red light",
          fr: "Portrait fétichiste rapproché, cagoule de latex et mains gantées encadrant le visage en lumière rouge",
          es: "Retrato fetichista cercano, capucha de látex y manos enguantadas enmarcando el rostro en luz roja"
        }
      },
      {
        file: "boudoir-nude-warm-light-colour-12-w2b.jpg",
        alt: {
          en: "Colour boudoir nude seen from behind in warm ambient light, fine-art photography",
          fr: "Nu boudoir couleur vu de dos dans une lumière chaude ambiante, photographie d'art",
          es: "Desnudo boudoir a color visto de espaldas en cálida luz ambiente, fotografía artística"
        }
      },
      {
        file: "boudoir-nude-warm-light-colour-13-w2b.jpg",
        alt: {
          en: "Warm-toned colour boudoir nude study, fine-art photography",
          fr: "Étude de nu boudoir couleur aux tons chauds, photographie d'art",
          es: "Estudio de desnudo boudoir a color de tonos cálidos, fotografía artística"
        }
      }
    ]
  }

};

/* Order galleries appear in the camera-back homepage selector */
const GALLERY_ORDER = [
  "best-of",
  "work-in-progress",
  "series-1",
  "series-2",
  "series-3",
  "nude",
  "boudoir"
];

/* Extra non-gallery frames appended to the film strip on the homepage.
   Each entry mirrors a GALLERY_DATA shape but carries a `url` override
   so the click handler routes to a standalone page instead of the
   gallery-${id}.html template. */
const STRIP_EXTRAS = {
  "about": {
    id: "about",
    folder: "images/ui/",
    coverIndex: 0,
    url: "about.html",
    title: {
      en: "About",
      fr: "À propos",
      es: "Sobre mí"
    },
    images: [
      {
        file: "about.jpg",
        alt: {
          en: "Portrait of W2b — about the photographer",
          fr: "Portrait de W2b — à propos du photographe",
          es: "Retrato de W2b — sobre el fotógrafo"
        }
      }
    ]
  }
};

/* Full ordering rendered into the film strip — galleries first, then
   any standalone-page frames (about, etc.). */
const STRIP_ORDER = [...GALLERY_ORDER, "about"];
