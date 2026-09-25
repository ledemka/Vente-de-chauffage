const fs = require('fs');

let html = fs.readFileSync('mentions-legales.html', 'utf8');
// Fix the bad replacements
html = html.replace(/<a href="mailto:.*?>"[^>]*>/g, (match) => {
   // The problem is something like <a href="mailto:..." data-i18n="...">"[Email de contact...]">
   return match;
});
// I'll just restore the original files from git and re-apply correctly.
