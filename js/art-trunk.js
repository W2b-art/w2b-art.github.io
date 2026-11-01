/* Trunk / branch navigation (home.html only).
   Trunk = Guillaume's 20 curated photos (TRUNK_MANIFEST, js/trunk-data.js),
   rendered into #seriesgrid through the same count-agnostic room sequencer
   the gallery pages use (js/room-sequence.js). Click a trunk photo → a
   "branch" overlay opens with that photo + its related photos pulled from
   js/gallery-data.js (only 3 of the 20 trunk photos have a branch; see
   trunk-data.js). A sticky "← Trunk" control is always visible while a
   branch is open (#branchBack, markup in home.html). */
(function(){
  if (typeof w2bApplyUI === 'function') w2bApplyUI();
  var LANG = window.W2B_LANG || 'fr';

  var grid = document.getElementById('seriesgrid');
  var overlay = document.getElementById('branchOverlay');
  var wrap = document.getElementById('branchWrap');
  var backBtn = document.getElementById('branchBack');
  if (!grid || typeof GALLERY_DATA === 'undefined' || typeof TRUNK_MANIFEST === 'undefined' || typeof buildRoomSequence !== 'function') return;

  /* fallback caption = subject only, no medium jargon (same rule as
     js/art-gallery.js's cleanCap — small enough to duplicate rather
     than reach into that file's closure). */
  function cleanCap(s){ return (s||'').replace(/,?\s*(photographie|photography|argentique|moyen format|medium format|noir et blanc|black and white|film|macro|documentaire|documentary|couleur|colour|color|analog).*$/i,'').replace(/\s[—–]\s/g,', ').trim(); }

  /* The one place that knows the {series, idx} manifest shape — change
     this if a future real-curation pass stores photos differently. */
  function resolve(ref){
    var g = ref.series && GALLERY_DATA[ref.series];
    var im = g && g.images[ref.idx];
    if (!g || !im) return null;
    var alt = (im.alt && (im.alt[LANG] || im.alt.fr)) || '';
    return {
      series: ref.series, idx: ref.idx,
      src: g.folder + im.file,
      alt: alt,
      cap: cleanCap(alt),
      seriesTitle: g.title[LANG] || g.title.fr
    };
  }

  var TRUNK = [], TRUNK_BY_ID = {}, RELATED_BY_ID = {};
  TRUNK_MANIFEST.forEach(function(entry){
    var item = resolve(entry);
    if (!item) return; /* missing series/idx — skip rather than break the page */
    item.id = entry.id;
    item.statement = entry.statement || null;
    TRUNK.push(item);
    TRUNK_BY_ID[entry.id] = item;
    RELATED_BY_ID[entry.id] = (entry.related || []).map(resolve).filter(Boolean);
  });

  /* <picture> with AVIF/WebP when js/responsive-manifest.js lists this
     src (see js/responsive-img.js) — a plain <img>, identical to
     before, for anything not processed by .build/responsive.js. Real
     pixel dims come from js/room-dims.js so the browser reserves
     layout space before the (lazy) image arrives, same pattern as the
     room-system galleries in js/art-gallery.js. */
  function makeImg(item){
    var dims = (typeof ROOM_DIMS !== 'undefined') && ROOM_DIMS[item.src];
    var img = (typeof buildResponsiveImg === 'function')
      ? buildResponsiveImg(item.src, item.alt, dims && dims[0], dims && dims[1])
      : (function(){ var i = new Image(); i.decoding = 'async'; i.loading = 'lazy'; i.src = item.src; i.alt = item.alt; if (dims){ i.width = dims[0]; i.height = dims[1]; } return i; })();
    return img;
  }

  /* 2026-10-31 — measured native loading="lazy" firing nearly all 20
     trunk images' requests within the first couple seconds on this
     fast (localhost) connection, which then queued behind the dev
     server's ~6-connections-per-origin HTTP/1.1 cap: last image
     finished at 7.6s, well after it's scrollable into view. Tried
     replacing it with a hand-rolled IntersectionObserver-based
     deferred loader (strip src into data-src, restore on intersect) —
     reverted: in testing, the observer never fired a single callback,
     even for elements scrolled fully into view with a 600px margin,
     for reasons I could not pin down in this environment (a bare
     `new IntersectionObserver(...).observe()` smoke test on this same
     page also produced zero callbacks). Shipping that would have
     meant images never loading at all — strictly worse than "slow."
     Left on native loading="lazy" (proven to eventually complete,
     just not fast) rather than ship an unverified replacement. See
     project_full_redesign_directions_2026-10-28.md for the measured
     numbers and the open question of whether this is a dev-server/
     test-harness-specific slowdown (HTTP/1.1 cap) that won't reproduce
     on the real GitHub Pages (HTTP/2) deployment. */

  /* finalize image sizing once figures are laid out in the DOM (see
     js/room-dims.js — width:auto alone isn't reliable pre-load). Mirrors
     js/art-gallery.js's room-system finalize pass. */
  function sizeFigures(container){
    if (typeof ROOM_DIMS === 'undefined' || typeof sizeRoomImg !== 'function') return;
    container.querySelectorAll('figure img').forEach(function(im){
      var d = ROOM_DIMS[im.getAttribute('src')];
      var fig = im.closest('figure');
      if (!d || !fig) return;
      var constrainedRoom = fig.closest('.room--full, .room--detail');
      var availW = constrainedRoom ? constrainedRoom.clientWidth : fig.clientWidth;
      sizeRoomImg(im, d, availW);
    });
  }

  function buildRooms(container, items, seq, onFigure){
    seq.forEach(function(room, ri){
      var group = items.slice(room.start, room.start + room.count);
      var el = document.createElement('div');
      var delayBase = ri * 60;
      if (room.type === 'full' || room.type === 'detail') {
        el.className = 'room reveal room--' + room.type;
        el.appendChild(onFigure(group[0], delayBase));
      } else if (room.type === 'asym2' || room.type === 'asym2-rev') {
        el.className = 'room reveal room--asym2' + (room.type === 'asym2-rev' ? ' rev' : '');
        var a = onFigure(group[0], delayBase); a.classList.add('a');
        var b = onFigure(group[1], delayBase + 120); b.classList.add('b');
        el.appendChild(a); el.appendChild(b);
      } else {
        var isAlt = room.type === 'rhythm3-alt';
        el.className = 'room reveal room--rhythm3' + (isAlt ? ' alt' : '');
        var x1 = onFigure(isAlt ? group[2] : group[0], delayBase); x1.classList.add('x1');
        var x2 = onFigure(isAlt ? group[0] : group[2], delayBase + 120); x2.classList.add('x2');
        var x3 = onFigure(group[1], delayBase + 240); x3.classList.add('x3');
        el.appendChild(x1); el.appendChild(x2); el.appendChild(x3);
      }
      container.appendChild(el);
    });
  }

  /* ---------------------------------------------------------------
     Trunk: clickable figures, each opens its branch. Reveal-on-scroll
     (.reveal/.reveal-img) works here because this runs before
     js/rooms.js's DOMContentLoaded-triggered IntersectionObserver
     wires up — these nodes already exist in the DOM when it looks.
     --------------------------------------------------------------- */
  /* museum-label cartel (dossier format): title now, a .med line (medium,
     date) once that per-photo data exists — see wiki note on this gap. */
  function cartel(item){
    var n = document.createElement('div'); n.className = 'cartel';
    n.textContent = item.cap || item.seriesTitle;
    return n;
  }

  function trunkFigure(item, delay){
    var fig = document.createElement('figure'); fig.className = 'reveal-img';
    if (delay) fig.style.transitionDelay = delay + 'ms';
    fig.appendChild(makeImg(item));
    fig.appendChild(cartel(item));
    fig.setAttribute('role', 'button');
    fig.setAttribute('tabindex', '0');
    fig.setAttribute('aria-haspopup', 'dialog');
    /* Only 3 of the 20 trunk photos open onto more — without a visible
       signal, clicking is a coin-flip and most clicks (correctly) show
       nothing, which reads as "branches are broken" rather than "most
       photos are singular." Mark the 3 that go deeper. */
    if ((RELATED_BY_ID[item.id] || []).length) {
      fig.classList.add('has-branch');
      var mark = document.createElement('span'); mark.className = 'branch-mark'; mark.setAttribute('aria-hidden', 'true');
      fig.appendChild(mark);
    }
    function go(){ openBranch(item.id, fig); }
    fig.addEventListener('click', go);
    fig.addEventListener('keydown', function(e){ if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); go(); } });
    return fig;
  }

  var seq = buildRoomSequence(TRUNK.length, true);
  buildRooms(grid, TRUNK, seq, trunkFigure);

  /* After Dark entry point — was a visible "After Dark · 18+" card in the
     old flat series grid; dropped when that grid became this trunk tree,
     leaving only the small corner Index overlay to find it (Guillaume:
     "we don't have access... or at least I don't see it on the landing
     page"). Restored as its own .room--detail "pause" (small, centered,
     divider lines — never the biggest thing on the page, per the
     .room-veiled CSS comment in css/rooms.css) using the pre-blurred safe
     teaser already built for exactly this (images/boudoir/after-dark-
     teaser-safe.jpg, dims in js/room-dims.js) — the only boudoir/nude
     asset this public page ever references. A real link, not a branch:
     clicking it leaves the trunk entirely for after-dark.html. */
  (function(){
    var teaserSrc = 'images/boudoir/after-dark-teaser-safe.jpg';
    var dims = (typeof ROOM_DIMS !== 'undefined') && ROOM_DIMS[teaserSrc];
    var wrap = document.createElement('div'); wrap.className = 'room reveal room--detail';
    var a = document.createElement('a'); a.className = 'room-link room-tile room-veiled'; a.href = 'after-dark.html';
    var fig = document.createElement('figure');
    var img = new Image(); img.decoding = 'async'; img.loading = 'lazy'; img.src = teaserSrc; img.alt = '';
    if (dims) { img.width = dims[0]; img.height = dims[1]; }
    fig.appendChild(img);
    var lab = document.createElement('div'); lab.className = 'lab';
    var no = document.createElement('div'); no.className = 'no';
    var adult = document.createElement('span'); adult.className = 'adult'; adult.textContent = '18+';
    no.appendChild(adult);
    var h3 = document.createElement('h3'); h3.textContent = (typeof w2bT === 'function') ? w2bT('afterdark_label') : 'After Dark';
    lab.appendChild(no); lab.appendChild(h3);
    a.appendChild(fig); a.appendChild(lab);
    wrap.appendChild(a);
    grid.appendChild(wrap);
  })();

  sizeFigures(grid);

  /* ---------------------------------------------------------------
     Branch: one clicked trunk photo + its 3-4 related photos. Built
     fresh into #branchWrap on open — no scroll-reveal classes here
     (see js/rooms.js: its reveal observer only ever looks at nodes
     present at DOMContentLoaded, so anything injected later would
     stay permanently clipped to zero height if given .reveal). The
     overlay's own opacity fade is the only motion branch content
     needs. One level of branching only, by design (trunk → branch;
     related photos are not themselves clickable into a further
     branch — v1 scope). */
  if (!overlay || !wrap || !backBtn) return;
  var lastFocus = null;

  function relatedFigure(item){
    var fig = document.createElement('figure');
    fig.style.cursor = 'default';
    fig.appendChild(makeImg(item));
    fig.appendChild(cartel(item));
    return fig;
  }

  function heroFigure(item){
    var fig = document.createElement('figure');
    fig.style.cursor = 'default';
    fig.appendChild(makeImg(item));
    fig.appendChild(cartel(item));
    return fig;
  }

  function openBranch(id, triggerEl){
    var item = TRUNK_BY_ID[id];
    if (!item) return;
    lastFocus = triggerEl || document.activeElement;

    wrap.innerHTML = '';
    /* Museum-label convention only — no big sentence duplicating the
       caption. The hero's own .cartel (small, italic, right-aligned,
       OUTSIDE the photo — see css/rooms.css) is the only caption. */
    var hero = document.createElement('div'); hero.className = 'room room--full room-first';
    hero.appendChild(heroFigure(item));
    wrap.appendChild(hero);

    /* Real description/context/statement — only the 3 anchor projects
       have one (js/trunk-data.js), sourced from Guillaume's own artist
       dossier text, not invented. A proper paragraph, distinct in kind
       from the .cartel caption: this is prose about the work, not a
       title sitting with the photo. */
    if (item.statement) {
      var st = document.createElement('div'); st.className = 'room room-first branch-statement';
      var p = document.createElement('p');
      p.textContent = item.statement[LANG] || item.statement.fr;
      st.appendChild(p);
      wrap.appendChild(st);
    }

    var related = RELATED_BY_ID[id] || [];
    if (related.length) {
      var h = document.createElement('div'); h.className = 'branch-related-h';
      h.textContent = (typeof w2bT === 'function') ? w2bT('branch_related') : 'More like this';
      wrap.appendChild(h);
      var rseq = buildRoomSequence(related.length, true);
      buildRooms(wrap, related, rseq, function(it){ return relatedFigure(it); });
    }
    sizeFigures(wrap);

    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    backBtn.focus();
  }

  function closeBranch(){
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  backBtn.addEventListener('click', closeBranch);
  overlay.addEventListener('click', function(e){ if (e.target === overlay) closeBranch(); });
  document.addEventListener('keydown', function(e){ if (overlay.classList.contains('open') && e.key === 'Escape') closeBranch(); });

  /* Deep-link from the 8 retired standalone gallery pages (gallery-*.html,
     now redirecting to home.html?branch=<old-id>). Only 3 of those ids still
     have matching trunk content — pretty-od/bailar-la-ciudad (real branches)
     and contemplations (one trunk photo, no "more like this"). The other 5
     old ids (argentina, best-of, matter, series-2, work-in-progress) have no
     photo in the curated 20-photo trunk at all, so there is nothing true to
     open for them — land on the series grid instead of guessing a stand-in. */
  var BRANCH_SLUG_TO_ID = { 'pretty-od':'t07', 'bailar-la-ciudad':'t08', 'contemplations':'t04' };
  var slug;
  try { slug = new URLSearchParams(location.search).get('branch'); } catch(e){ slug = null; }
  if (slug) {
    var deepId = BRANCH_SLUG_TO_ID[slug];
    if (deepId && TRUNK_BY_ID[deepId]) {
      openBranch(deepId);
    } else {
      var seriesSection = document.getElementById('series');
      if (seriesSection) seriesSection.scrollIntoView();
    }
  }
})();
