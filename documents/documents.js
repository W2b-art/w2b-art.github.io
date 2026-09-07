/* W2b art legal docs — language toggle by whole blocks. Shares w2b_lang with the rest of the site. */
(function(){
  var LANGS = ['es','en','fr'];
  var btns = document.querySelectorAll('.lang button');
  function apply(lang){
    if(LANGS.indexOf(lang) === -1) lang = 'fr';
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-doclang]').forEach(function(el){
      el.classList.toggle('on', el.getAttribute('data-doclang') === lang);
    });
    btns.forEach(function(b){
      var on = b.getAttribute('data-lang') === lang;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try{ localStorage.setItem('w2b_lang', lang); }catch(e){}
  }
  btns.forEach(function(b){
    b.addEventListener('click', function(){ apply(b.getAttribute('data-lang')); });
  });
  var saved;
  try{ saved = localStorage.getItem('w2b_lang'); }catch(e){}
  apply(saved || 'fr');
})();
