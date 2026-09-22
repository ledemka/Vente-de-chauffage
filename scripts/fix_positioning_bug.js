"use strict";
const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();

const LANGS = [
  { dir: "",            lang: "fr" },
  { dir: "en",         lang: "en" },
  { dir: "de",         lang: "de" },
  { dir: "nl",         lang: "nl" },
];

function processHTML(fp) {
  if (!fs.existsSync(fp)) return;
  let html = fs.readFileSync(fp, 'utf8');
  
  // Replace p.positioning.toUpperCase() with getProductField(p, 'positioning').toUpperCase()
  html = html.replace(/\$\{p\.positioning\.toUpperCase\(\)\}/g, `\${getProductField(p, 'positioning').toUpperCase()}`);
  
  fs.writeFileSync(fp, html, 'utf8');
  console.log(`[HTML] Updated ${fp}`);
}

for (const l of LANGS) {
  const catPath = path.join(ROOT, l.dir, 'catalogue.html');
  processHTML(catPath);
}
