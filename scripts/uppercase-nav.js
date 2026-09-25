const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

for (let file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Replace <a class="... text-on-surface-variant ... data-i18n="nav.*"
  // Actually, we can just replace all instances of `data-i18n="nav.` with `class="uppercase" data-i18n="nav.`? No, the `a` tag already has a `class` attribute.
  // Let's use regex to find `<a ... data-i18n="nav.` and inject `uppercase` into its class list.
  
  content = content.replace(/(<a[^>]*class=")([^"]*)("[^>]*data-i18n="nav\.[^"]*")/g, (match, p1, p2, p3) => {
    if (!p2.includes('uppercase')) {
      changed = true;
      return p1 + p2 + ' uppercase' + p3;
    }
    return match;
  });

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file} nav links with uppercase`);
  }
}
console.log('Done modifying nav uppercase.');
