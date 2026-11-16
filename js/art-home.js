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
     auto-advancing carousel. Pool draws from the real branch photos
     rather than the old pre-curation series folders, so the hero is
     coherent with what the page actually shows. Swap-the-picture
     only, per Guillaume — the mechanism (one random pick/visit, no
     carousel) is unchanged.
     2026-11-11 — home.html split into oeuvre-actuelle.html /
     autres-travaux.html (see js/art-trunk.js for the matching
     TRUNK_MANIFEST split); each page sets window.TRUNK_SET before
     this script loads, so the hero pulls only from what that page
     actually shows.
     2026-11-15 — Guillaume: one branch (Dark Bay) kept turning up as
     if it were the only one. Root cause: this was a hand-maintained
     list that drifted from trunk-data.js the same way shop.html's own
     list once did — missing several real current branches (t3/t5/t13/
     t17) entirely, and still pointing at 3 branches since archived or
     renamed (branch-glass-roof, branch-bamboo-pond, branch-passage —
     all 404 now), so a meaningful share of picks silently failed and
     only the branches that happened to still be valid ever visibly
     showed. Built from TRUNK_MANIFEST_CURRENT/OTHER + GALLERY_DATA
     instead — the same source of truth as the trunk grid itself below
     — so it can't drift out of sync with reality again, and every live
     branch's photos are actually in the pool. */
  var HERO_TRUNK_MANIFEST = (window.TRUNK_SET === 'other')
    ? (typeof TRUNK_MANIFEST_OTHER !== 'undefined' ? TRUNK_MANIFEST_OTHER : [])
    : (typeof TRUNK_MANIFEST_CURRENT !== 'undefined' ? TRUNK_MANIFEST_CURRENT : []);
  var POOL = [];
  if (typeof GALLERY_DATA !== 'undefined') {
    HERO_TRUNK_MANIFEST.forEach(function(entry){
      (entry.related || []).forEach(function(r){
        var g = GALLERY_DATA[r.series];
        var im = g && g.images.filter(function(i){ return i.file === r.file; })[0];
        if (g && im && !im.archived) POOL.push([g.folder + im.file, r.series]);
      });
    });
  }
  var pick = POOL.length ? POOL[Math.floor(Math.random()*POOL.length)] : null;

  var wrap=document.getElementById('heroFrames'), now=document.getElementById('now'),
      dots=document.getElementById('dots');
  if (wrap && pick) {
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

/* "Portfolio" side-nav button → EN/FR/ES language picker (2026-11-15).
   position:fixed in the CSS so it floats free of the nav's own flex
   column; this just places it next to whichever instance of the button
   opened it (oeuvre-actuelle.html and autres-travaux.html each have
   their own #sideNavPortfolio/#portfolioPick pair, same ids, only one
   pair exists per page). */
(function(){
  var btn = document.getElementById('sideNavPortfolio');
  var pick = document.getElementById('portfolioPick');
  if (!btn || !pick) return;
  function place(){
    var r = btn.getBoundingClientRect();
    pick.style.top = Math.max(8, r.top - 4) + 'px';
    pick.style.right = (window.innerWidth - r.left + 10) + 'px';
  }
  function open(){ place(); pick.classList.add('open'); pick.setAttribute('aria-hidden', 'false'); btn.setAttribute('aria-expanded', 'true'); }
  function close(){ pick.classList.remove('open'); pick.setAttribute('aria-hidden', 'true'); btn.setAttribute('aria-expanded', 'false'); }
  btn.addEventListener('click', function(e){ e.stopPropagation(); pick.classList.contains('open') ? close() : open(); });
  document.addEventListener('click', function(e){ if (pick.classList.contains('open') && !pick.contains(e.target) && e.target !== btn) close(); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') close(); });
  window.addEventListener('resize', function(){ if (pick.classList.contains('open')) place(); });
})();
