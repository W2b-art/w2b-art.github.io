/* W2b art — shared legal-links bar. Appends localized links to the page footer.
   Keeps content in one place instead of editing 17 hand-built footers. */
(function(){
  var L = {
    es:{ privacy:"Privacidad", terms:"Términos", cookies:"Cookies", refund:"Reembolsos", note:"Contenido de autor. Algunas series incluyen desnudo artístico (+18)." },
    en:{ privacy:"Privacy", terms:"Terms", cookies:"Cookies", refund:"Refunds", note:"Fine-art work. Some series include artistic nudity (18+)." },
    fr:{ privacy:"Confidentialité", terms:"Conditions", cookies:"Cookies", refund:"Remboursements", note:"Œuvre d'auteur. Certaines séries incluent du nu artistique (+18)." }
  };
  function lang(){
    var s; try{ s = localStorage.getItem('w2b_lang'); }catch(e){}
    return L[s] ? s : 'fr';
  }
  var wrap = document.createElement('div');
  wrap.className = 'legal-bar';
  wrap.setAttribute('role','contentinfo');
  wrap.innerHTML =
    '<style>'+
    '.legal-bar{border-top:1px solid rgba(237,230,218,.1);padding:16px clamp(20px,5vw,40px);'+
    'display:flex;flex-wrap:wrap;gap:8px 18px;align-items:center;justify-content:center;'+
    'font-family:Montserrat,system-ui,sans-serif;font-size:11px;letter-spacing:.1em;color:#9A9089;text-align:center}'+
    '.legal-bar a{color:#9A9089;text-decoration:none;border-bottom:1px solid transparent}'+
    '.legal-bar a:hover,.legal-bar a:focus-visible{color:#C6924E;border-bottom-color:#C6924E}'+
    '.legal-bar .legal-note{flex-basis:100%;opacity:.7;letter-spacing:.04em;font-size:10.5px}'+
    '.legal-bar :focus-visible{outline:2px solid #C6924E;outline-offset:3px}'+
    '</style>'+
    '<nav aria-label="Legal">'+
      '<a data-lk="privacy" href="documents/privacy.html"></a> · '+
      '<a data-lk="terms" href="documents/terms.html"></a> · '+
      '<a data-lk="cookies" href="documents/cookies.html"></a> · '+
      '<a data-lk="refund" href="documents/refund.html"></a>'+
    '</nav>'+
    '<span class="legal-note" data-lk="note"></span>';
  function render(){
    var t = L[lang()];
    wrap.querySelectorAll('[data-lk]').forEach(function(el){
      el.textContent = t[el.getAttribute('data-lk')];
    });
  }
  function mount(){
    var f = document.querySelector('footer');
    if (f && f.parentNode){ f.parentNode.insertBefore(wrap, f.nextSibling); }
    else { document.body.appendChild(wrap); }
    render();
    document.querySelectorAll('.lang button, .lang-btn').forEach(function(b){
      b.addEventListener('click', function(){ setTimeout(render, 0); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
