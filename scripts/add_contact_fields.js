/**
 * add_contact_fields.js
 * 
 * Adds the contact_name, email, and phone fields to the checkout form
 * in all recapitulatif-commande.html files (root + en/ de/ nl/).
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const langDirs = ['', 'en', 'de', 'nl'];

// The exact regex pattern to find the company field block
// We capture everything from <div class="flex flex-col gap-2"> to </div>
const COMPANY_BLOCK_REGEX = /<div class="flex flex-col gap-2">\s*<label for="company" class="text-label-md font-label-md text-on-surface uppercase"[^>]*>.*?<\/label>\s*<input type="text" id="company" required class="[^"]*">\s*<\/div>/;

const NEW_FIELDS_BLOCK = `<div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div class="flex flex-col gap-2">
                                <label for="company" class="text-label-md font-label-md text-on-surface uppercase" data-i18n="auth.company">Société *</label>
                                <input type="text" id="company" required class="w-full bg-surface-container-highest border border-outline-variant rounded-md py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                            </div>
                            <div class="flex flex-col gap-2">
                                <label for="contact_name" class="text-label-md font-label-md text-on-surface uppercase" data-i18n="auth.contact_name">Nom du contact *</label>
                                <input type="text" id="contact_name" required class="w-full bg-surface-container-highest border border-outline-variant rounded-md py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                            </div>
                        </div>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div class="flex flex-col gap-2">
                                <label for="email" class="text-label-md font-label-md text-on-surface uppercase" data-i18n="auth.email">Email *</label>
                                <input type="email" id="email" required class="w-full bg-surface-container-highest border border-outline-variant rounded-md py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                            </div>
                            <div class="flex flex-col gap-2">
                                <label for="phone" class="text-label-md font-label-md text-on-surface uppercase" data-i18n="auth.phone">Téléphone *</label>
                                <input type="tel" id="phone" required class="w-full bg-surface-container-highest border border-outline-variant rounded-md py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                            </div>
                        </div>`;

let totalModified = 0;

for (const lang of langDirs) {
    const filePath = path.join(rootDir, lang, 'recapitulatif-commande.html');
    if (!fs.existsSync(filePath)) continue;

    let content = fs.readFileSync(filePath, 'utf8');

    if (COMPANY_BLOCK_REGEX.test(content)) {
        content = content.replace(COMPANY_BLOCK_REGEX, NEW_FIELDS_BLOCK);
        fs.writeFileSync(filePath, content, 'utf8');
        const displayPath = lang ? `${lang}/recapitulatif-commande.html` : 'recapitulatif-commande.html';
        console.log(`✓ Added fields to ${displayPath}`);
        totalModified++;
    }
}

console.log(`\nDone. Updated ${totalModified} file(s).`);
