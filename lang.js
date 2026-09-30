/* Language picker: remembers a language chosen by hand, closes the menu on
   an outside click, and sends a first-time visitor on the English home page
   to their browser's language when the site has it. Legal pages never
   redirect: the stores link to the English ones. */
(function () {
  var supported = ['en', 'es', 'de', 'fr', 'ru', 'pt'];
  var key = 'site.lang';

  var links = document.querySelectorAll('.lang-pick a[lang]');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function () {
      try { localStorage.setItem(key, this.getAttribute('lang')); } catch (e) {}
    });
  }
  document.addEventListener('click', function (e) {
    var open = document.querySelectorAll('.lang-pick[open]');
    for (var j = 0; j < open.length; j++) {
      if (!open[j].contains(e.target)) open[j].removeAttribute('open');
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var open = document.querySelector('.lang-pick[open]');
    if (open) { open.removeAttribute('open'); open.querySelector('summary').focus(); }
  });

  var root = document.documentElement;
  if (root.lang !== 'en' || !root.hasAttribute('data-home')) return;

  var wanted = null;
  try { wanted = localStorage.getItem(key); } catch (e) {}
  if (!wanted) {
    var prefs = navigator.languages || [navigator.language || 'en'];
    for (var k = 0; k < prefs.length; k++) {
      var code = String(prefs[k]).slice(0, 2).toLowerCase();
      if (supported.indexOf(code) !== -1) { wanted = code; break; }
    }
  }
  if (wanted && wanted !== 'en' && supported.indexOf(wanted) !== -1) {
    location.replace(wanted + '/' + location.hash);
  }
})();
