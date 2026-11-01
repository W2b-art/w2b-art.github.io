/* Gallery renderer (new DA): asymmetric mosaic + adaptive lightbox + trilingual.
   The page sets window.GALLERY_ID; content comes from gallery-data.js + art-copy.js.

   Two galleries (contemplations, best-of) are the rooms-system proof slice and
   render through buildRoomGallery() instead of the shared .top/.plates mosaic —
   see ROOM_IDS below. The other galleries are untouched. */
(function(){
  if (typeof w2bApplyUI === 'function') w2bApplyUI();
  var LANG = window.W2B_LANG || 'fr';
  var COPY = (typeof GALLERY_COPY !== 'undefined') ? GALLERY_COPY : {};
  var id = window.GALLERY_ID || (new URLSearchParams(location.search).get('id')) || 'best-of';

  /* 18+ guard: explicit galleries only reachable after the gate */
  if (id==='nude' || id==='boudoir'){
    var _ok=false; try{ _ok = sessionStorage.getItem('w2b_ad_ok')==='1'; }catch(e){}
    if(!_ok){ location.replace('after-dark.html'); return; }
  }

  var g = (typeof GALLERY_DATA!=='undefined') && GALLERY_DATA[id];
  var app = document.getElementById('app');
  if(!g){ app.innerHTML = '<p style="padding:140px 40px">Gallery not found: '+id+'</p>'; return; }
  /* clear the crawlable static copy rendered into #app by the gallery pages */
  app.innerHTML = '';

  /* back link: explicit galleries return to After Dark, the rest to the home series.
     (contemplations/best-of use the corner index overlay instead and have no .hdr .back.) */
  var backEl = document.querySelector('.hdr .back');
  if(backEl){
    if(id==='nude' || id==='boudoir'){ backEl.href='after-dark.html'; backEl.textContent=(typeof w2bT==='function'?w2bT('back_afterdark'):'← After Dark'); }
    else { backEl.href='home.html#series'; }
  }

  var order = (typeof GALLERY_ORDER!=='undefined') ? GALLERY_ORDER.indexOf(id) : -1;
  var seriesWord = (typeof w2bT==='function') ? w2bT('series_no') : 'Série';
  var no = order>=0 ? (seriesWord+' '+String(order+1).padStart(2,'0')) : '';
  var cover = g.images[g.coverIndex||0] || g.images[0];
  var desc = (COPY[id]&&COPY[id].desc&&COPY[id].desc[LANG]) || (g.description&&(g.description[LANG]||g.description.fr)) || '';

  /* fallback caption = subject only, no medium jargon (full alt stays for SEO) */
  function cleanCap(s){ return (s||'').replace(/,?\s*(photographie|photography|argentique|moyen format|medium format|noir et blanc|black and white|film|macro|documentaire|documentary|couleur|colour|color|analog).*$/i,'').replace(/\s[—–]\s/g,', ').trim(); }

  /* shared lightbox: builds DOM refs + show/open/close once, used by either
     the room renderer or the classic mosaic renderer below. */
  function wireLightbox(ITEMS, title){
    var lb=document.getElementById('lb'), lbImg=document.getElementById('lbImg'),
        lbTxt=document.getElementById('lbTxt'), lbNum=document.getElementById('lbNum'), cur=0;
    function show(i){ cur=(i+ITEMS.length)%ITEMS.length;
      lbImg.onload=function(){ lb.classList.toggle('port', lbImg.naturalHeight>lbImg.naturalWidth); };
      lbImg.src=ITEMS[cur].src; lbTxt.textContent=ITEMS[cur].cap;
      lbNum.textContent=title+' · '+String(cur+1).padStart(2,'0')+' / '+ITEMS.length; }
    function openLB(i){ show(i); lb.classList.add('open'); document.body.style.overflow='hidden'; }
    function closeLB(){ lb.classList.remove('open'); document.body.style.overflow=''; }
    document.getElementById('lbX').addEventListener('click', closeLB);
    document.getElementById('lbPrev').addEventListener('click', function(){ show(cur-1); });
    document.getElementById('lbNext').addEventListener('click', function(){ show(cur+1); });
    /* a11y: name the icon controls and make them keyboard-operable */
    (function(){
      var LBL={es:{close:'Cerrar',prev:'Anterior',next:'Siguiente'},en:{close:'Close',prev:'Previous',next:'Next'},fr:{close:'Fermer',prev:'Précédent',next:'Suivant'}};
      var t=LBL[LANG]||LBL.fr, map={lbX:t.close,lbPrev:t.prev,lbNext:t.next};
      Object.keys(map).forEach(function(idk){
        var el=document.getElementById(idk); if(!el)return;
        el.setAttribute('role','button'); el.setAttribute('tabindex','0'); el.setAttribute('aria-label',map[idk]);
        el.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); el.click(); } });
      });
    })();
    lb.addEventListener('click', function(e){ if(e.target===lb||e.target.classList.contains('inner')) closeLB(); });
    document.addEventListener('keydown', function(e){ if(!lb.classList.contains('open'))return;
      if(e.key==='Escape')closeLB(); if(e.key==='ArrowLeft')show(cur-1); if(e.key==='ArrowRight')show(cur+1); });
    return { open: openLB };
  }

  /* ---------------------------------------------------------------
     Room system: contemplations and best-of are the proof slice —
     each gets its own layout grammar instead of the shared mosaic.
     The other galleries keep the .top + .plates template below.
     --------------------------------------------------------------- */
  var ROOM_IDS = { 'contemplations':1, 'best-of':1 };
  var ROOM_COPY = {
    'contemplations': { en:"What wears down comes to resemble what waits.", fr:"Ce qui s'use finit par ressembler à ce qui attend.", es:"Lo que se desgasta termina por parecerse a lo que espera." },
    'best-of': { en:"Not a series — a way of seeing that runs through all the others.", fr:"Pas une série, une manière de voir qui traverse toutes les autres.", es:"No es una serie, es una manera de mirar que atraviesa todas las demás." }
  };
  var ROOM_INTERRUPT = {
    'best-of': { en:"Between black and white and colour, the same question: what remains when everything else falls away?", fr:"Entre le noir et blanc et la couleur, la même question : qu'est-ce qui reste quand tout le reste s'efface ?", es:"Entre el blanco y negro y el color, la misma pregunta: ¿qué queda cuando todo lo demás se borra?" }
  };

  /* mobile-intentional crop: a per-gallery focal point, not the desktop
     frame scaled down (see css/rooms.css --hero-mob-pos). */
  var HERO_MOB_POS = { 'contemplations':'62% 46%', 'best-of':'38% 52%' };

  if (ROOM_IDS[id]) {
    var hero = document.createElement('section'); hero.className='room-hero'; hero.setAttribute('data-parallax','');
    if (HERO_MOB_POS[id]) hero.style.setProperty('--hero-mob-pos', HERO_MOB_POS[id]);
    hero.innerHTML = '<img src="'+g.folder+cover.file+'" alt="">'+
      '<div class="tt"><div class="no">'+no+'</div><h1>'+g.title[LANG]+'</h1><p>'+desc+'</p></div>';
    app.appendChild(hero);

    var opener = document.createElement('div'); opener.className='room room-first reveal';
    var openerTxt = (ROOM_COPY[id]&&ROOM_COPY[id][LANG]) || (ROOM_COPY[id]&&ROOM_COPY[id].fr) || '';
    opener.innerHTML = '<div class="room-opener"><p>'+openerTxt+'</p></div>';
    app.appendChild(opener);

    var coverIdx2 = g.coverIndex||0;
    var rest = g.images.map(function(im,i){ return {im:im, idx:i}; }).filter(function(o){ return o.idx!==coverIdx2; });
    var ITEMS = [];
    /* aspect ratio (width/height) from the real pixel dimensions, used to
       route images into slots so a wide column never ends up with a
       portrait image (artificially tall) next to a narrow column with a
       landscape image (artificially short) — that mismatch is what reads
       as a dead empty slab next to a tall one. Keeps groups in gallery
       order; only the slot WITHIN a group is chosen by shape. */
    function ratioOf(o){
      var dims = (typeof ROOM_DIMS!=='undefined') && ROOM_DIMS[g.folder+o.im.file];
      return dims ? (dims[0]/dims[1]) : 1;
    }
    function imgData(o){
      var tri = COPY[id]&&COPY[id].caps&&COPY[id].caps[o.idx]&&COPY[id].caps[o.idx][LANG];
      return { src: g.folder+o.im.file, alt:(o.im.alt&&(o.im.alt[LANG]||o.im.alt.fr))||'', cap: tri || cleanCap(o.im.alt&&(o.im.alt[LANG]||o.im.alt.fr)) };
    }
    var LB = wireLightbox(ITEMS, g.title[LANG]);
    function figureFor(o, delay){
      var data = imgData(o);
      ITEMS.push({src:data.src, cap:data.cap});
      var clickIdx = ITEMS.length-1;
      var fig = document.createElement('figure'); fig.className='reveal-img';
      if (delay) fig.style.transitionDelay = delay+'ms';
      /* explicit intrinsic size so the browser reserves layout space before
         a lazy image arrives — without it, width:auto;height:auto images
         can sit at 0x0 and never cross the native lazy-load threshold. */
      var dims = (typeof ROOM_DIMS!=='undefined') && ROOM_DIMS[data.src];
      /* <picture> with AVIF/WebP when js/responsive-manifest.js lists this
         src (see js/responsive-img.js) — a plain <img>, identical to
         before, for every image not yet processed by .build/responsive.js. */
      var img = (typeof buildResponsiveImg==='function')
        ? buildResponsiveImg(data.src, data.alt, dims&&dims[0], dims&&dims[1])
        : (function(){ var i=new Image(); i.loading='lazy'; i.src=data.src; i.alt=data.alt; if(dims){i.width=dims[0];i.height=dims[1];} return i; })();
      var n = document.createElement('div'); n.className='n'; n.textContent=String(clickIdx+1).padStart(2,'0')+' / '+rest.length;
      fig.appendChild(img); fig.appendChild(n);
      fig.addEventListener('click', function(){ LB.open(clickIdx); });
      return fig;
    }

    /* Count-agnostic room composition — works for 1 image or 30. Chunks the
       gallery greedily into rooms of 1/2/3 images and never strands a lone
       image inside a 2- or 3-up primitive (a gallery of 4, 5 or 7 degrades
       to full+full / rhythm3+asym2 / rhythm3+rhythm3+full — see the
       remaining===4 special case below, which splits 2+2 instead of 3+1
       precisely to avoid a stranded single next to a trio). `preferAsym2`
       keeps contemplations reading mostly as asymmetric pairs and best-of
       mostly as rhythm3 trios, matching the locked creative direction,
       without assuming a specific image count either way. */
    function buildRoomSequence(n, preferAsym2){
      var out=[], i=0, toggle=0, sincePause=0;
      while(i<n){
        var remaining=n-i, take, type;
        /* museum pacing: every 3rd room, if there's still enough material
           to form a real room afterward, peel off a single image as a
           small "detail" pause — a genuine change of pace, not another
           full-weight group. Skips itself naturally on short galleries
           (sincePause never reaches 3 before n runs out), so a 3-4 image
           gallery gets no artificial pause. */
        if (sincePause>=3 && remaining>=3){ take=1; type='detail'; sincePause=0; }
        else if(remaining===1){ take=1; type='full'; }
        else if(remaining===2){ take=2; type= toggle%2?'asym2-rev':'asym2'; }
        else if(remaining===3){ take=3; type= toggle%2?'rhythm3-alt':'rhythm3'; }
        else if(remaining===4){ take=2; type= toggle%2?'asym2-rev':'asym2'; }
        else if(preferAsym2){ take=2; type= toggle%2?'asym2-rev':'asym2'; }
        else { take=3; type= toggle%2?'rhythm3-alt':'rhythm3'; }
        if (type!=='detail') sincePause++;
        out.push({type:type, start:i, count:take});
        i+=take; toggle++;
      }
      return out;
    }

    var seq = buildRoomSequence(rest.length, id === 'contemplations');
    /* curatorial interrupt sits roughly at the midpoint, and only when
       there's enough gallery either side of it to actually interrupt —
       skipped outright for a short gallery (1-2 rooms). */
    var interruptAfter = (ROOM_INTERRUPT[id] && seq.length >= 3) ? (Math.ceil(seq.length/2)-1) : -1;

    seq.forEach(function(room, ri){
      var group = rest.slice(room.start, room.start+room.count);
      /* within the group, route the most-landscape image to the widest
         slot and the most-portrait to the narrowest — minimizes the
         height mismatch between columns regardless of group size. */
      var ordered = group.slice().sort(function(m,n2){ return ratioOf(n2)-ratioOf(m); });
      var el = document.createElement('div');
      if (room.type === 'full') {
        el.className = 'room reveal room--full';
        el.appendChild(figureFor(ordered[0]));
      } else if (room.type === 'detail') {
        el.className = 'room reveal room--detail';
        el.appendChild(figureFor(ordered[0]));
      } else if (room.type === 'asym2' || room.type === 'asym2-rev') {
        el.className = 'room reveal room--asym2'+(room.type==='asym2-rev'?' rev':'');
        var a = figureFor(ordered[0]); a.classList.add('a');
        var b = figureFor(ordered[1], 120); b.classList.add('b');
        el.appendChild(a); el.appendChild(b);
      } else {
        var isAlt = room.type === 'rhythm3-alt';
        el.className = 'room reveal room--rhythm3'+(isAlt?' alt':'');
        var big = ordered[0], mid = ordered[1], small = ordered[2];
        var x1 = figureFor(isAlt?small:big); x1.classList.add('x1');
        var x2 = figureFor(isAlt?big:small, 120); x2.classList.add('x2');
        var x3 = figureFor(mid, 240); x3.classList.add('x3');
        el.appendChild(x1); el.appendChild(x2); el.appendChild(x3);
      }
      app.appendChild(el);
      if (ri === interruptAfter) {
        var interrupt = document.createElement('div'); interrupt.className='room--interrupt reveal';
        var itxt = ROOM_INTERRUPT[id][LANG] || ROOM_INTERRUPT[id].fr;
        interrupt.innerHTML = '<p>'+itxt+'</p>';
        app.appendChild(interrupt);
      }
    });
    document.title = 'W2b — '+g.title[LANG];
    /* finalize image sizing now that every figure is laid out in the DOM
       (see js/room-dims.js — width:auto alone isn't reliable pre-load).
       .room--full/.room--detail's figure is inline-block/shrink-to-fit —
       its own clientWidth is circular (0 until the img inside has a
       size), so use the room's definite width as the available-width
       bound instead. */
    if (typeof ROOM_DIMS !== 'undefined' && typeof sizeRoomImg === 'function') {
      app.querySelectorAll('.room figure img').forEach(function(im){
        var d = ROOM_DIMS[im.getAttribute('src')];
        var fig = im.closest('figure');
        if (!d || !fig) return;
        var constrainedRoom = fig.closest('.room--full, .room--detail');
        var availW = constrainedRoom ? constrainedRoom.clientWidth : fig.clientWidth;
        sizeRoomImg(im, d, availW);
      });
    }
    return;
  }

  /* ---------------------------------------------------------------
     Classic mosaic — unchanged, used by every gallery not in ROOM_IDS.
     --------------------------------------------------------------- */
  var top = document.createElement('section'); top.className='top';
  top.innerHTML = '<img src="'+g.folder+cover.file+'" alt="">'+
    '<div class="tt"><div class="no">'+no+'</div><h1>'+g.title[LANG]+'</h1><p>'+desc+'</p></div>';
  app.appendChild(top);

  var plates = document.createElement('section'); plates.className='plates';
  var coverIdx = g.coverIndex||0;
  var gridImages = g.images.filter(function(im,i){ return i!==coverIdx; });
  var ITEMS = gridImages.map(function(im){
    var origIdx = g.images.indexOf(im);
    var tri = COPY[id]&&COPY[id].caps&&COPY[id].caps[origIdx]&&COPY[id].caps[origIdx][LANG];
    return { src: g.folder+im.file, cap: tri || cleanCap(im.alt&&(im.alt[LANG]||im.alt.fr)) };
  });
  var LB = wireLightbox(ITEMS, g.title[LANG]);
  gridImages.forEach(function(im,i){
    var isFeature = !im.wide && ((i%5===2) || (i===gridImages.length-1));
    var fig = document.createElement('figure'); fig.className='plate'+(im.wide?' wide':(isFeature?' feature':''));
    /* <picture> with AVIF/WebP when js/responsive-manifest.js lists this
       src (see js/responsive-img.js) — a plain <img>, identical to
       before, for every image not processed by .build/responsive.js
       (every gallery not yet run through the pipeline keeps rendering
       exactly as today). */
    var plateAlt = (im.alt&&(im.alt[LANG]||im.alt.fr))||'';
    var img = (typeof buildResponsiveImg==='function')
      ? buildResponsiveImg(g.folder+im.file, plateAlt)
      : (function(){ var i=new Image(); i.loading='lazy'; i.src=g.folder+im.file; i.alt=plateAlt; return i; })();
    var cap = document.createElement('figcaption'); cap.className='n'; cap.textContent=String(i+1).padStart(2,'0')+' / '+gridImages.length;
    fig.appendChild(img); fig.appendChild(cap); plates.appendChild(fig);
    fig.addEventListener('click', function(){ LB.open(i); });
  });
  app.appendChild(plates);
  document.title = 'W2b — '+g.title[LANG];
})();
