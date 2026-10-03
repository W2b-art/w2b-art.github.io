/* Gallery renderer (new DA): asymmetric mosaic + adaptive lightbox + trilingual.
   The page sets window.GALLERY_ID; content comes from gallery-data.js + art-copy.js. */
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

  /* back link: explicit galleries return to After Dark, the rest to the home series */
  var backEl = document.querySelector('.hdr .back');
  if(backEl){
    if(id==='nude' || id==='boudoir'){ backEl.href='after-dark.html'; backEl.textContent=(typeof w2bT==='function'?w2bT('back_afterdark'):'← After Dark'); }
    else { backEl.href='home.html#series'; }
  }

  var order = (typeof GALLERY_ORDER!=='undefined') ? GALLERY_ORDER.indexOf(id) : -1;
  var no = order>=0 ? ('Série '+String(order+1).padStart(2,'0')) : '';
  var cover = g.images[g.coverIndex||0] || g.images[0];
  var desc = (COPY[id]&&COPY[id].desc&&COPY[id].desc[LANG]) || (g.description&&(g.description[LANG]||g.description.fr)) || '';

  /* fallback caption = subject only, no medium jargon (full alt stays for SEO) */
  function cleanCap(s){ return (s||'').replace(/,?\s*(photographie|photography|argentique|moyen format|medium format|noir et blanc|black and white|film|macro|documentaire|documentary|couleur|colour|color|analog).*$/i,'').replace(/\s[—–]\s/g,', ').trim(); }

  var top = document.createElement('section'); top.className='top';
  top.innerHTML = '<img src="'+g.folder+cover.file+'" alt="">'+
    '<div class="tt"><div class="no">'+no+'</div><h1>'+g.title[LANG]+'</h1><p>'+desc+'</p></div>';
  app.appendChild(top);

  var plates = document.createElement('section'); plates.className='plates';
  var ITEMS = g.images.map(function(im,i){
    var tri = COPY[id]&&COPY[id].caps&&COPY[id].caps[i]&&COPY[id].caps[i][LANG];
    return { src: g.folder+im.file, cap: tri || cleanCap(im.alt&&(im.alt[LANG]||im.alt.fr)) };
  });
  g.images.forEach(function(im,i){
    var isFeature = !im.wide && ((i%5===2) || (i===g.images.length-1));
    var fig = document.createElement('figure'); fig.className='plate'+(im.wide?' wide':(isFeature?' feature':''));
    var img = new Image(); img.loading='lazy'; img.src=g.folder+im.file; img.alt=(im.alt&&(im.alt[LANG]||im.alt.fr))||'';
    var cap = document.createElement('figcaption'); cap.className='n'; cap.textContent=String(i+1).padStart(2,'0')+' / '+g.images.length;
    fig.appendChild(img); fig.appendChild(cap); plates.appendChild(fig);
    fig.addEventListener('click', function(){ openLB(i); });
  });
  app.appendChild(plates);
  document.title = 'W2b — '+g.title[LANG];

  /* lightbox */
  var lb=document.getElementById('lb'), lbImg=document.getElementById('lbImg'),
      lbTxt=document.getElementById('lbTxt'), lbNum=document.getElementById('lbNum'), cur=0;
  function show(i){ cur=(i+ITEMS.length)%ITEMS.length;
    lbImg.onload=function(){ lb.classList.toggle('port', lbImg.naturalHeight>lbImg.naturalWidth); };
    lbImg.src=ITEMS[cur].src; lbTxt.textContent=ITEMS[cur].cap;
    lbNum.textContent=g.title[LANG]+' · '+String(cur+1).padStart(2,'0')+' / '+ITEMS.length; }
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
})();
