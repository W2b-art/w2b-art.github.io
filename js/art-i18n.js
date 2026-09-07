/* Shared UI strings + language helper for the art site (new DA).
   Language key is localStorage 'w2b_lang' (shared with the rest of the site). */
(function(){
  window.W2B_LANG = (function(){ try { return localStorage.getItem('w2b_lang') || 'fr'; } catch(e){ return 'fr'; } })();

  window.W2B_UI = {
    nav_series:{en:"Series",fr:"Séries",es:"Series"},
    nav_prints:{en:"Prints",fr:"Tirages",es:"Copias"},
    nav_collab:{en:"Collaborate",fr:"Collaborer",es:"Colaborar"},
    nav_about:{en:"About",fr:"À propos",es:"Sobre mí"},
    nav_commercial:{en:"Commercial ↗",fr:"Commercial ↗",es:"Comercial ↗"},
    nav_pro:{en:"Pro Portfolio",fr:"Portfolio Pro",es:"Portafolio Pro"},
    descriptor:{en:"Fine-art photography · Medellín",fr:"Photographie d'art · Medellín",es:"Fotografía de autor · Medellín"},
    back_series:{en:"← All series",fr:"← Toutes les séries",es:"← Todas las series"},
    back_afterdark:{en:"← After Dark",fr:"← After Dark",es:"← After Dark"},
    hero_kicker:{en:"Fine-art photography",fr:"Photographie d'art",es:"Fotografía de autor"},
    hero_title:{en:"The world, as it gives itself to those who take the time to look.",fr:"Le monde, tel qu'il se donne à qui prend le temps de regarder.",es:"El mundo, tal como se entrega a quien se toma el tiempo de mirar."},
    afterdark_label:{en:"After Dark",fr:"After Dark",es:"After Dark"},
    hero_scroll:{en:"Series",fr:"Séries",es:"Series"},
    work_h:{en:"The work",fr:"Le travail",es:"El trabajo"},
    work_sub:{en:"Nine series. Each with its own light, place and intent.",fr:"Neuf séries. Chacune sa lumière, son lieu, son propos.",es:"Nueve series. Cada una con su luz, su lugar y su propósito."},
    foot_prints:{en:"Fine-art prints",fr:"Tirages d'art",es:"Copias de autor"},
    foot_collab:{en:"Collaborate",fr:"Collaborer",es:"Colaborar"},
    foot_about:{en:"About",fr:"À propos",es:"Sobre mí"},
    foot_commercial:{en:"Commercial → pro site ↗",fr:"Commercial → site pro ↗",es:"Comercial → sitio pro ↗"},
    foot_place:{en:"Medellín · Colombia",fr:"Medellín · Colombie",es:"Medellín · Colombia"},
    foot_contact:{en:"Contact",fr:"Contact",es:"Contacto"},
    /* after dark */
    gate_k:{en:"After Dark",fr:"After Dark",es:"After Dark"},
    gate_h:{en:"This section contains adult imagery.",fr:"Cette section contient des images pour adultes.",es:"Esta sección contiene imágenes para adultos."},
    gate_p:{en:"Fine-art nude, boudoir and a darker register. By entering you confirm you are eighteen or older and wish to see this work. Everyone photographed gave written consent.",fr:"Nu d'art, boudoir et un registre plus sombre. En entrant, tu confirmes avoir dix-huit ans ou plus et vouloir voir ce travail. Toutes les personnes photographiées ont donné leur consentement écrit.",es:"Desnudo artístico, boudoir y un registro más oscuro. Al entrar confirmas tener dieciocho años o más y querer ver este trabajo. Todas las personas fotografiadas dieron su consentimiento por escrito."},
    gate_enter:{en:"I am 18 or older, enter",fr:"J'ai 18 ans ou plus, entrer",es:"Tengo 18 años o más, entrar"},
    gate_leave:{en:"Leave",fr:"Quitter",es:"Salir"},
    gate_fine:{en:"W2b / @w2b.film. None of the images in this section are indexed or sold through the same channels as the rest of the site.",fr:"W2b / @w2b.film. Aucune image de cette section n'est indexée ni vendue via les mêmes canaux que le reste du site.",es:"W2b / @w2b.film. Ninguna imagen de esta sección se indexa ni se vende por los mismos canales que el resto del sitio."},
    ad_h:{en:"After Dark",fr:"After Dark",es:"After Dark"},
    ad_p:{en:"The body as landscape, and a darker register. What the night allows.",fr:"Le corps comme paysage, et un registre plus sombre. Ce que la nuit autorise.",es:"El cuerpo como paisaje, y un registro más oscuro. Lo que la noche permite."},
    entry_go:{en:"View the series →",fr:"Voir la série →",es:"Ver la serie →"},
    entry_nude_p:{en:"The body as landscape. What light reveals once everything else falls away.",fr:"Le corps comme paysage. Ce que la lumière révèle quand tout le reste s'efface.",es:"El cuerpo como paisaje. Lo que la luz revela cuando todo lo demás se borra."},
    entry_dd_p:{en:"Desire staged, between latex, rope and red light.",fr:"Le désir mis en scène, entre latex, corde et lumière rouge.",es:"El deseo puesto en escena, entre látex, cuerda y luz roja."},
    entry_bd_p:{en:"The person as the whole picture — presence, not pose.",fr:"La personne comme toute l'image — la présence, pas la pose.",es:"La persona como toda la imagen — presencia, no pose."}
  };

  window.w2bT = function(key){ var e=W2B_UI[key]; return e ? (e[W2B_LANG]||e.fr) : key; };

  /* fill [data-ui] elements, set <html lang>, wire the [data-langsw] switcher */
  window.w2bApplyUI = function(){
    try { document.documentElement.lang = W2B_LANG; } catch(e){}
    var els = document.querySelectorAll('[data-ui]');
    for (var i=0;i<els.length;i++){ els[i].textContent = w2bT(els[i].getAttribute('data-ui')); }
    var sw = document.querySelector('[data-langsw]');
    if (sw){
      [].forEach.call(sw.querySelectorAll('button'), function(b){
        if (b.dataset.l === W2B_LANG) b.classList.add('on');
        b.addEventListener('click', function(){ try{ localStorage.setItem('w2b_lang', b.dataset.l); }catch(e){} location.reload(); });
      });
    }
    /* cross-portfolio button → commercial (pro) site.
       Only on navigational pages (home/about/prints/collaborate), not inside
       a gallery view (those set window.GALLERY_ID). */
    try {
      var hdr = document.querySelector('.hdr');
      if (hdr && !window.GALLERY_ID && !hdr.querySelector('.xport')){
        var a = document.createElement('a');
        a.className = 'xport'; a.href = 'https://w2bphotography.com/w2b-pro/';
        a.setAttribute('aria-label', w2bT('nav_pro'));
        a.innerHTML = '<img src="images/ui/gd-mark-light.svg" alt=""><span>'+w2bT('nav_pro')+'</span>';
        var nav = hdr.querySelector('nav');
        if (nav) nav.appendChild(a);
        else hdr.insertBefore(a, hdr.querySelector('.lang'));
      }
    } catch(e){}
  };
})();
