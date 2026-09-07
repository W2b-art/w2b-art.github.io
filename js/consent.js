/* W2b — opt-in analytics consent. DORMANT by default: does nothing until you
   configure an analytics endpoint. Prepared per Guillaume's choice (privacy-first,
   consent-based). No tracking runs, and no banner shows, unless you activate below.

   TO ACTIVATE later:
   1. Set a config before this script loads, e.g. in the page <head>:
        <script>window.W2B_ANALYTICS = {
          src: "https://plausible.io/js/script.js",   // privacy-friendly, cookieless
          domain: "w2bphotography.com"
        };</script>
   2. Include this file on every page: <script src="js/consent.js" defer></script>
   Analytics loads ONLY after the visitor clicks Accept. Choice is stored in
   localStorage ('w2b_analytics_consent'); no analytics runs on Decline. */
(function(){
  var cfg = window.W2B_ANALYTICS;
  if (!cfg || !cfg.src) return; // dormant: nothing configured

  var KEY = 'w2b_analytics_consent';
  function get(){ try{ return localStorage.getItem(KEY); }catch(e){ return null; } }
  function set(v){ try{ localStorage.setItem(KEY, v); }catch(e){} }

  function loadAnalytics(){
    var s = document.createElement('script');
    s.defer = true; s.src = cfg.src;
    if (cfg.domain) s.setAttribute('data-domain', cfg.domain);
    document.head.appendChild(s);
  }

  if (get() === 'granted'){ loadAnalytics(); return; }
  if (get() === 'denied'){ return; }

  var T = {
    es:{ msg:"Usamos una medición de audiencia respetuosa con la privacidad, solo con tu permiso.", ok:"Aceptar", no:"Rechazar" },
    en:{ msg:"We use privacy-friendly audience measurement, only with your permission.", ok:"Accept", no:"Decline" },
    fr:{ msg:"Nous utilisons une mesure d'audience respectueuse, uniquement avec votre accord.", ok:"Accepter", no:"Refuser" }
  };
  function lang(){ var s; try{ s = localStorage.getItem('w2b_lang'); }catch(e){} return T[s] ? s : 'fr'; }
  var t = T[lang()];

  function banner(){
    var b = document.createElement('div');
    b.setAttribute('role','dialog');
    b.setAttribute('aria-label', t.msg);
    b.innerHTML =
      '<style>'+
      '.w2b-consent{position:fixed;left:16px;right:16px;bottom:16px;max-width:520px;margin:0 auto;z-index:9998;'+
      'background:rgba(20,16,16,.96);color:#EDE6DA;border:1px solid rgba(237,230,218,.16);border-radius:6px;'+
      'padding:14px 16px;display:flex;flex-wrap:wrap;gap:10px 14px;align-items:center;justify-content:space-between;'+
      'font-family:Montserrat,system-ui,sans-serif;font-size:13px;line-height:1.5;box-shadow:0 8px 30px rgba(0,0,0,.4)}'+
      '.w2b-consent p{margin:0;flex:1 1 240px}'+
      '.w2b-consent .btns{display:flex;gap:8px}'+
      '.w2b-consent button{font:inherit;font-size:12px;letter-spacing:.06em;cursor:pointer;padding:8px 14px;border-radius:3px}'+
      '.w2b-consent .ok{background:#C6924E;border:1px solid #C6924E;color:#141010}'+
      '.w2b-consent .no{background:none;border:1px solid rgba(237,230,218,.28);color:#EDE6DA}'+
      '.w2b-consent button:focus-visible{outline:2px solid #C6924E;outline-offset:2px}'+
      '</style>'+
      '<div class="w2b-consent"><p>'+t.msg+'</p><div class="btns">'+
      '<button type="button" class="no">'+t.no+'</button>'+
      '<button type="button" class="ok">'+t.ok+'</button>'+
      '</div></div>';
    document.body.appendChild(b);
    b.querySelector('.ok').addEventListener('click', function(){ set('granted'); b.remove(); loadAnalytics(); });
    b.querySelector('.no').addEventListener('click', function(){ set('denied'); b.remove(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', banner);
  else banner();
})();
