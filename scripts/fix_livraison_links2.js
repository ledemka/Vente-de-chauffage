const fs = require('fs');
const path = require('path');

const dirs = ['.', 'en', 'de', 'nl'];
const filename = 'livraison.html';

dirs.forEach(dir => {
    const filepath = path.join(__dirname, '..', dir, filename);
    if (!fs.existsSync(filepath)) return;
    
    let content = fs.readFileSync(filepath, 'utf8');
    
    const target = `<a class="text-label-md font-label-md text-inverse-primary hover:text-white transition-colors flex items-center gap-2 w-fit uppercase relative z-10" href="#">
                        Consulter les <span data-i18n="footer.cgv">CGV</span> Logistiques
                        <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
</a>`;
    const replacement = `<a class="text-label-md font-label-md text-inverse-primary hover:text-white transition-colors flex items-center gap-2 w-fit uppercase relative z-10" href="./cgv.html">
                        Consulter les <span data-i18n="footer.cgv">CGV</span> Logistiques
                        <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
</a>`;

    content = content.replace(target, replacement);
    
    // As a fallback if whitespaces are different:
    const regexFallback = /<a([^>]*)href="#"([^>]*)>\s*Consulter les <span data-i18n="footer\.cgv">CGV<\/span> Logistiques/g;
    content = content.replace(regexFallback, '<a$1href="./cgv.html"$2>\n                        Consulter les <span data-i18n="footer.cgv">CGV</span> Logistiques');
    
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Updated link in ${filepath}`);
});
