/* Home hero (new DA): 4 groups of 4, one picked at random per visit.
   Each photo links to its gallery. Content from real gallery images. */
(function(){
  if (typeof w2bApplyUI === 'function') w2bApplyUI();
  var LANG = window.W2B_LANG || 'fr';

  /* ---- series grid (scale contrast); titles localized from gallery-data ---- */
  var GRID = [
    ['best-of','c-feat','images/best-of/lone-figure-salt-flat-salar-argentina-film-w2b.jpg'],
    ['bailar-la-ciudad','c-tall','images/bailar-la-ciudad/bailar-ciudad-parada-manos-nocturna-black-white-w2b.jpg'],
    ['work-in-progress','c-half','images/work-in-progress/medellin-mercado-interior-siluetas-black-white-w2b.jpg'],
    ['contemplations','c-half','images/contemplations/contemplations-golden-dusk-rock-spires-coast-w2b.jpg'],
    ['matter','c-third','images/matter/artichoke-bud-close-up-spiral-geometry-medium-format-film-w2b.jpg'],
    ['series-2','c-third','images/perspective/aerial-plaza-fountain-palm-shadows-overhead-colour-film-w2b.jpg'],
    ['argentina','c-third','images/argentina/argentina-lone-tree-cover-w2b.jpg'],
    ['pretty-od','c-half','images/pretty-od/pretty-od-chapter-three-cover-w2b.jpg'],
    ['__afterdark__','c-half','images/boudoir/fetish-latex-mask-red-light-01-w2b.jpg']
  ];
  var gridEl=document.getElementById('seriesgrid');
  if(gridEl && typeof GALLERY_DATA!=='undefined'){
    var ord=(typeof GALLERY_ORDER!=='undefined')?GALLERY_ORDER:[];
    GRID.forEach(function(row){
      var id=row[0], span=row[1], cover=row[2], href, title, sub='';
      if(id==='__afterdark__'){ href='after-dark.html'; title=(typeof w2bT==='function'?w2bT('afterdark_label'):'After Dark'); sub='<span class="adult">18 +</span>'; }
      else { href='gallery-'+id+'.html'; var gd=GALLERY_DATA[id]; title=gd?(gd.title[LANG]||gd.title.fr):id; var n=ord.indexOf(id); if(n>=0) sub=String(n+1).padStart(2,'0'); }
      var a=document.createElement('a'); a.className='card '+span; a.href=href;
      a.innerHTML='<img src="'+cover+'" alt="">'+
        '<div class="lab">'+(sub?'<div class="no">'+sub+'</div>':'')+'<h3>'+title+'</h3></div>';
      gridEl.appendChild(a);
    });
  }

  /* [src, series title, "Série NN", gallery id] */
  var GROUPS = [
    [ ['images/best-of/antique-shop-gilded-mirror-roman-bust-w2b.jpg','Obras seleccionadas','Série 01','best-of'],
      ['images/work-in-progress/medellin-calle-peatones-movimiento-luz-dorada-color-w2b.jpg','Medellín','Série 03','work-in-progress'],
      ['images/pretty-od/pretty-od-chapter-three-cover-w2b.jpg','Pretty OD','Série 08','pretty-od'],
      ['images/argentina/argentina-lone-tree-cover-w2b.jpg','Argentina','Série 07','argentina'] ],
    [ ['images/bailar-la-ciudad/bailar-ciudad-parada-manos-nocturna-black-white-w2b.jpg','Bailar la Ciudad','Série 02','bailar-la-ciudad'],
      ['images/work-in-progress/medellin-mercado-interior-siluetas-black-white-w2b.jpg','Medellín','Série 03','work-in-progress'],
      ['images/best-of/kite-grey-sky-airplane-contrail-minimalist-black-white-w2b.jpg','Obras seleccionadas','Série 01','best-of'],
      ['images/contemplations/contemplations-cliff-coastline-black-white-w2b.jpg','Contemplations','Série 04','contemplations'] ],
    [ ['images/contemplations/contemplations-golden-dusk-rock-spires-coast-w2b.jpg','Contemplations','Série 04','contemplations'],
      ['images/argentina/argentina-andean-canyon-golden-light-film-w2b.jpg','Argentina','Série 07','argentina'],
      ['images/perspective/aerial-plaza-fountain-palm-shadows-overhead-colour-film-w2b.jpg','Perspectives','Série 06','series-2'],
      ['images/contemplations/contemplations-two-boats-misty-still-water-w2b.jpg','Contemplations','Série 04','contemplations'] ],
    [ ['images/matter/artichoke-bud-close-up-spiral-geometry-medium-format-film-w2b.jpg','Matière','Série 05','matter'],
      ['images/pretty-od/08-pretty-od-euphoria-glitter-smile-w2b.jpg','Pretty OD','Série 08','pretty-od'],
      ['images/perspective/lighthouse-signal-tower-silhouette-golden-sunset-film-w2b.jpg','Perspectives','Série 06','series-2'],
      ['images/bailar-la-ciudad/bailar-ciudad-movimiento-inclinado-tatuaje-black-white-w2b.jpg','Bailar la Ciudad','Série 02','bailar-la-ciudad'] ]
  ];
  var pick = GROUPS[Math.floor(Math.random()*GROUPS.length)];

  var wrap=document.getElementById('heroFrames'), now=document.getElementById('now'),
      dots=document.getElementById('dots'), hdr=document.getElementById('hdr');
  pick.forEach(function(p,i){
    var f=document.createElement('a'); f.className='frame'+(i===0?' on':''); f.href='gallery-'+p[3]+'.html';
    var im=document.createElement('img'); im.src=p[0]; im.alt=''; f.appendChild(im); wrap.appendChild(f);
    var d=document.createElement('i'); if(i===0)d.className='on'; d.addEventListener('click',function(e){e.preventDefault();go(i);}); dots.appendChild(d);
  });
  var frames=wrap.querySelectorAll('.frame'), dd=dots.children, cur=0, timer=null;
  function setNow(i){ now.querySelector('.t').textContent=pick[i][1]; now.querySelector('.s').textContent=pick[i][2]; }
  setNow(0);
  function go(i){ frames[cur].classList.remove('on'); dd[cur].classList.remove('on'); cur=i; frames[cur].classList.add('on'); dd[cur].classList.add('on'); setNow(i); reset(); }
  function reset(){ clearInterval(timer); timer=setInterval(function(){ go((cur+1)%frames.length); },5200); }
  reset();
  window.addEventListener('scroll', function(){ hdr.classList.toggle('solid', window.scrollY>60); });
  window.addEventListener('pageshow', function(e){ if(e.persisted) location.reload(); });
})();
