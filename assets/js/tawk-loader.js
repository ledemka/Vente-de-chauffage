// tawk-loader.js — charge le widget Tawk.to correspondant à la langue de la page.
(function () {
  var TAWK_MAP = {
    fr: '6ab2cbe14add4b343bded0ba/1k356oqko',
    en: '6ab2cbe14add4b343bded0ba/1k3l2nmh2',
    de: '6ab2cbe14add4b343bded0ba/1k3l2pr4h',
    nl: '6ab2cbe14add4b343bded0ba/1k3l2qoum'
  };

  var lang = (document.documentElement.lang || 'fr').toLowerCase().substring(0, 2);
  var widgetPath = TAWK_MAP[lang] || TAWK_MAP['fr'];

  var Tawk_API = window.Tawk_API || {};
  var Tawk_LoadStart = new Date();
  window.Tawk_API = Tawk_API;
  window.Tawk_LoadStart = Tawk_LoadStart;

  var s1 = document.createElement('script');
  var s0 = document.getElementsByTagName('script')[0];
  s1.async = true;
  s1.src = 'https://embed.tawk.to/' + widgetPath;
  s1.charset = 'UTF-8';
  s1.setAttribute('crossorigin', '*');
  s0.parentNode.insertBefore(s1, s0);
})();
