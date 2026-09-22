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

const helperCode = `
                        if (typeof window.getProductField === 'undefined') {
                            window.getProductField = (p, field, forceLang) => {
                                if (!p || !p[field]) return '';
                                const l = forceLang || document.documentElement.lang || 'fr';
                                if (typeof p[field] === 'string') return p[field];
                                return p[field][l] || p[field]['fr'] || '';
                            };
                        }
`;

function processHTML(fp) {
  if (!fs.existsSync(fp)) return;
  let html = fs.readFileSync(fp, 'utf8');
  
  if (!html.includes('window.getProductField')) {
      // Find the first `<script>` inside `produit.html` that contains `i18nLoaded`
      // Or just inject right after `<script>` for the DOMContentLoaded.
      const target = `<script>\n                document.addEventListener('DOMContentLoaded', () => {`;
      if (html.includes(target)) {
          html = html.replace(target, `<script>${helperCode}\n                document.addEventListener('DOMContentLoaded', () => {`);
      } else {
          // Alternative target
          const altTarget = `<script>\n            document.addEventListener('DOMContentLoaded', () => {`;
          if (html.includes(altTarget)) {
              html = html.replace(altTarget, `<script>${helperCode}\n            document.addEventListener('DOMContentLoaded', () => {`);
          } else {
             // Fallback
             html = html.replace('<script>', `<script>${helperCode}\n`);
          }
      }
      fs.writeFileSync(fp, html, 'utf8');
      console.log(`[HTML] Injected getProductField into ${fp}`);
  } else {
      console.log(`[HTML] ${fp} already has getProductField`);
  }
}

for (const l of LANGS) {
  const prodPath = path.join(ROOT, l.dir, 'produit.html');
  processHTML(prodPath);
}
