/* Home hero (new DA): 4 groups of 4, one picked at random per visit.
   The old flat text-link series list that used to render into
   #seriesgrid here is gone — #seriesgrid is now the trunk/branch tree
   (js/art-trunk.js), which reads js/trunk-data.js instead of
   GALLERY_ORDER. GALLERY_DATA/GALLERY_ORDER stay exactly as they were
   (gallery pages, the corner index, this hero's labelling all still
   use them) — only this inline list was replaced. */
(function(){
  if (typeof w2bApplyUI === 'function') w2bApplyUI();
  var LANG = window.W2B_LANG || 'fr';

  /* ---- hero: ONE photo surfaces per visit — a single pick, no
     auto-advancing carousel. Pool draws from the real branch photos (the
     deeper-dive images behind 3 of the 20 trunk picks) rather than the
     old pre-curation series folders, so the hero is coherent with what
     the site actually shows now. Swap-the-picture only, per Guillaume —
     the mechanism (one random pick/visit, no carousel) is unchanged. */
  var POOL = [
    ['images/branch-bailar-la-ciudad/breakdancer-mid-motion-red-light-w2b.jpg','branch-bailar-la-ciudad'],
    ['images/branch-bailar-la-ciudad/man-glasses-hand-gesture-tattoos-portrait-black-white-w2b.jpg','branch-bailar-la-ciudad'],
    ['images/branch-bailar-la-ciudad/man-trucker-cap-sunglasses-night-portrait-black-white-w2b.jpg','branch-bailar-la-ciudad'],
    ['images/branch-bailar-la-ciudad/men-streetwear-cap-flip-night-black-white-w2b.jpg','branch-bailar-la-ciudad'],
    ['images/branch-lo-que-dejamos/abandoned-factory-water-tower-overgrown-w2b.jpg','branch-lo-que-dejamos'],
    ['images/branch-lo-que-dejamos/calle-54-street-sign-rubble-w2b.jpg','branch-lo-que-dejamos'],
    ['images/branch-lo-que-dejamos/ruined-building-interior-debris-furniture-w2b.jpg','branch-lo-que-dejamos'],
    ['images/branch-lo-que-dejamos/scrap-metal-yard-entrance-barbed-wire-workers-w2b.jpg','branch-lo-que-dejamos'],
    ['images/branch-pretty-od/pink-love-perfume-bottle-still-life-w2b.jpg','branch-pretty-od'],
    ['images/branch-pretty-od/pink-plastic-wrap-figure-abstract-w2b.jpg','branch-pretty-od'],
    ['images/branch-pretty-od/red-light-glowing-eyes-intense-portrait-w2b.jpg','branch-pretty-od'],
    ['images/branch-pretty-od/woman-graphic-tee-pink-lit-room-posters-w2b.jpg','branch-pretty-od'],
    ['images/branch-pretty-od/woman-reclining-neon-light-bedroom-w2b.jpg','branch-pretty-od']
  ];
  var pick = POOL[Math.floor(Math.random()*POOL.length)];

  var wrap=document.getElementById('heroFrames'), now=document.getElementById('now'),
      dots=document.getElementById('dots');
  if (wrap) {
    /* links into the trunk section, not the old standalone gallery page
       (those now redirect to home.html — see gallery-*.html). */
    var f=document.createElement('a'); f.className='frame on'; f.href='#series';
    /* AVIF/WebP via the same responsive pipeline as everything else — the
       plain full-res .jpg fallback some of these branch photos have is
       400KB-1.2MB, eagerly loading the single biggest thing on the page
       as literally the first thing a visitor sees. Flagged as part of
       "main page loading is particularly slow". Still eager (not lazy)
       since this is the hero, above the fold — buildResponsiveImg()
       defaults to lazy for the grid/branch use case, override it here. */
    var heroEl = (typeof buildResponsiveImg === 'function') ? buildResponsiveImg(pick[0], '') : (function(){ var i=new Image(); i.src=pick[0]; i.alt=''; return i; })();
    var heroImg = heroEl.tagName === 'PICTURE' ? heroEl.querySelector('img') : heroEl;
    heroImg.loading = 'eager';
    f.appendChild(heroEl); wrap.appendChild(f);
    if (dots) dots.style.display='none'; /* nothing to switch between — single pick, no carousel */
    if (now && typeof GALLERY_DATA!=='undefined') {
      /* branch pseudo-series aren't in GALLERY_ORDER (they're not primary
         nav) — no fabricated "Série NN" number for something that isn't
         numbered; just the real project title. */
      var gd = GALLERY_DATA[pick[1]];
      var title = gd ? (gd.title[LANG]||gd.title.fr) : pick[1];
      now.querySelector('.t').textContent = title;
      now.querySelector('.s').textContent = '';
    }
  }
})();
