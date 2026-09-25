const fs = require('fs');
const cheerio = require('cheerio');
let html = fs.readFileSync('tableau-de-bord.html', 'utf8');
html = html.replace('<script>if(!localStorage.getItem("user")){window.location.href="./connexion.html";}</script>', '');
const $ = cheerio.load(html, { decodeEntities: false });
const out = $.html();
console.log('cheerio </head> index:', out.indexOf('</head>'));
