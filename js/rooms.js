/* Rooms system — shared behaviour for the pages using css/rooms.css:
   scroll-reveal (clip-path, IntersectionObserver), a small transform-only
   hero parallax, and the corner "index" overlay that replaces the old
   persistent top nav. Vanilla JS, no framework — follows the same
   classList-toggle + dataset-guard pattern already used across the site
   (see js/art-i18n.js menu-btn wiring, js/consent.js banner). */
(function(){

  function wireReveal(){
    var els = document.querySelectorAll('.reveal, .reveal-img');
    if(!els.length) return;
    if(!('IntersectionObserver' in window)){
      els.forEach(function(e){ e.classList.add('in'); });
      return;
    }
    /* safety net: some embeds/old browsers under-report intersection
       (ad blockers, odd iframe hosts). Content must never stay hidden —
       force-reveal anything still unseen a couple seconds after it is
       first eligible, checked per-element from when it starts loading. */
    els.forEach(function(e){
      setTimeout(function(){ e.classList.add('in'); }, 6000);
    });
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, {threshold:.15, rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(e){ io.observe(e); });
  }

  /* transform-only parallax, capped, on the hero/room-hero image only */
  function wireParallax(){
    var hero = document.querySelector('[data-parallax]');
    if(!hero) return;
    var img = hero.querySelector('img.on, .frame.on img, img');
    if(!img) return;
    var cap = 30; /* px, small on purpose */
    var ticking = false;
    function apply(){
      ticking = false;
      var r = hero.getBoundingClientRect();
      var p = Math.min(Math.max(-r.top / (r.height || 1), 0), 1);
      img.style.transform = 'translateY(' + Math.round(p * cap) + 'px)';
    }
    function onScroll(){
      if(ticking) return;
      ticking = true;
      window.requestAnimationFrame(apply);
    }
    window.addEventListener('scroll', onScroll, {passive:true});
    apply();
  }

  function buildIndex(){
    var fab = document.getElementById('idxFab');
    var overlay = document.getElementById('idxOverlay');
    if(!fab || !overlay) return;
    var LANG = window.W2B_LANG || 'fr';

    /* The corner-index "Séries" section used to list every GALLERY_ORDER
       entry (the 8 standalone series pages + After Dark). Those 8 pages
       are no longer primary navigation — they're reachable through the
       home.html trunk/branch tree (js/art-trunk.js) and now just redirect
       to home.html (see gallery-*.html) — so they're dropped from this
       list. After Dark keeps its own entry; it stays a separate, gated,
       continuous room-sequence experience, untouched. */
    var list = document.getElementById('idxSeries');
    if(list){
      var a = document.createElement('a');
      a.className = 'idx-link';
      a.href = 'after-dark.html';
      a.textContent = (typeof w2bT === 'function' ? w2bT('afterdark_label') : 'After Dark') + ' · 18+';
      list.appendChild(a);
    }

    var cur = document.getElementById('idxCur');
    if(cur && window.GALLERY_ID && typeof GALLERY_DATA !== 'undefined'){
      var g = GALLERY_DATA[window.GALLERY_ID];
      if(g) cur.textContent = g.title[LANG] || g.title.fr;
    }

    function openIt(){
      overlay.classList.add('open');
      fab.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function closeIt(){
      overlay.classList.remove('open');
      fab.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
    fab.addEventListener('click', openIt);
    var closeBtn = document.getElementById('idxClose');
    if(closeBtn) closeBtn.addEventListener('click', closeIt);
    /* 2026-11-12 — the persistent right-side nav (oeuvre-actuelle.html /
       autres-travaux.html only, see .side-nav in css/rooms.css) has its
       own "Index" entry that opens this exact same overlay rather than
       duplicating the series-list markup a second time. */
    var sideNavIndex = document.getElementById('sideNavIndex');
    if(sideNavIndex) sideNavIndex.addEventListener('click', openIt);
    overlay.addEventListener('click', function(e){ if(e.target === overlay) closeIt(); });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && overlay.classList.contains('open')) closeIt();
    });

    var langBtns = overlay.querySelectorAll('[data-idx-lang] button');
    langBtns.forEach(function(b){
      if(b.dataset.l === LANG) b.classList.add('on');
      b.addEventListener('click', function(){
        try{ localStorage.setItem('w2b_lang', b.dataset.l); }catch(e){}
        location.reload();
      });
    });
  }

  function init(){
    wireReveal();
    wireParallax();
    buildIndex();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
