/* After Dark: 18+ gate (sessionStorage) + 3 groups of 3 hero, one at random. */
(function(){
  if (typeof w2bApplyUI === 'function') w2bApplyUI();
  var KEY='w2b_ad_ok';
  var gate=document.getElementById('gate'), content=document.getElementById('content');

  function enterSite(){
    try{ sessionStorage.setItem(KEY,'1'); }catch(e){}
    gate.style.display='none'; content.style.display='block'; document.body.style.overflow=''; initHero();
  }
  document.getElementById('enter').addEventListener('click', enterSite);
  var ok=false; try{ ok = sessionStorage.getItem(KEY)==='1'; }catch(e){}
  if(ok){ enterSite(); } else { document.body.style.overflow='hidden'; }
  window.addEventListener('pageshow', function(e){ if(e.persisted) location.reload(); });

  function initHero(){
    var GROUPS = [
      [ ['images/nude/fine-art-nude-torso-sculptural-light-black-white-03-w2b.jpg','Nude','nude'],
        ['images/nude/fine-art-nude-back-curve-shadow-black-white-02-w2b.jpg','Nude','nude'],
        ['images/nude/fine-art-nude-side-light-contour-black-white-05-w2b.jpg','Nude','nude'] ],
      [ ['images/boudoir/fetish-latex-mask-red-light-01-w2b.jpg','Dark Desire','boudoir'],
        ['images/boudoir/shibari-bound-nude-gypsophila-black-white-w2b.jpg','Dark Desire','boudoir'],
        ['images/boudoir/fetish-latex-mask-dramatic-shadow-07-w2b.jpg','Dark Desire','boudoir'] ],
      [ ['images/nude/fine-art-nude-study-low-key-black-white-01-w2b.jpg','Nude','nude'],
        ['images/boudoir/shibari-rope-tying-red-roses-w2b.jpg','Dark Desire','boudoir'],
        ['images/nude/boudoir-red-drape-nude-intimate-colour-w2b.jpg','Nude','nude'] ]
    ];
    var pick = GROUPS[Math.floor(Math.random()*GROUPS.length)];
    var wrap=document.getElementById('heroFrames'), now=document.getElementById('now'), dots=document.getElementById('dots');
    pick.forEach(function(p,i){
      var f=document.createElement('a'); f.className='frame'+(i===0?' on':''); f.href='gallery-'+p[2]+'.html';
      var im=document.createElement('img'); im.src=p[0]; im.alt=''; f.appendChild(im); wrap.appendChild(f);
      var d=document.createElement('i'); if(i===0)d.className='on'; d.addEventListener('click',function(e){e.preventDefault();go(i);}); dots.appendChild(d);
    });
    var frames=wrap.querySelectorAll('.frame'), dd=dots.children, cur=0, timer=null;
    function setNow(i){ now.textContent=pick[i][1]; }
    setNow(0);
    function go(i){ frames[cur].classList.remove('on'); dd[cur].classList.remove('on'); cur=i; frames[cur].classList.add('on'); dd[cur].classList.add('on'); setNow(i); reset(); }
    function reset(){ clearInterval(timer); timer=setInterval(function(){ go((cur+1)%frames.length); },5200); }
    reset();
  }
})();
