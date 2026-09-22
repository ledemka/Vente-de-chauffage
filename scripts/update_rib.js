const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();

const langs = ['fr', 'en', 'de', 'nl'];
const translations = {
    fr: { forKey: "Pour :", refKey: "Référence obligatoire à rappeler :" },
    en: { forKey: "For:", refKey: "Mandatory reference to quote:" },
    de: { forKey: "Für:", refKey: "Zwingend anzugebende Referenz:" },
    nl: { forKey: "Voor:", refKey: "Verplichte vermelding referentie:" }
};

// 1. Update i18n JSONs
for (const l of langs) {
    const jp = path.join(ROOT, 'data/i18n', `${l}.json`);
    let data = JSON.parse(fs.readFileSync(jp, 'utf8'));
    if (!data.confirm) data.confirm = {};
    data.confirm.for = translations[l].forKey;
    data.confirm.reference = translations[l].refKey;
    fs.writeFileSync(jp, JSON.stringify(data, null, 4));
}

// 2. Update confirmation-commande.html in all languages
const confirmHTMLBlockFR = `                    <div class="grid grid-cols-[120px_1fr] gap-y-1 mb-2">
                        <span class="text-on-surface-variant font-medium" data-i18n="confirm.beneficiary">Bénéficiaire :</span>
                        <span class="font-bold">CAMARA LANSANA</span>
                    </div>
                    <div class="grid grid-cols-[120px_1fr] gap-y-1 mb-2">
                        <span class="text-on-surface-variant font-medium" data-i18n="confirm.for">Pour :</span>
                        <span class="font-bold">SOTRAMSBOIS</span>
                    </div>`;
                    
const confirmHTMLBlockEN = `                    <div class="grid grid-cols-[120px_1fr] gap-y-1 mb-2">
                        <span class="text-on-surface-variant font-medium" data-i18n="confirm.beneficiary">Beneficiary:</span>
                        <span class="font-bold">CAMARA LANSANA</span>
                    </div>
                    <div class="grid grid-cols-[120px_1fr] gap-y-1 mb-2">
                        <span class="text-on-surface-variant font-medium" data-i18n="confirm.for">For:</span>
                        <span class="font-bold">SOTRAMSBOIS</span>
                    </div>`;

const confirmHTMLBlockDE = `                    <div class="grid grid-cols-[120px_1fr] gap-y-1 mb-2">
                        <span class="text-on-surface-variant font-medium" data-i18n="confirm.beneficiary">Begünstigter:</span>
                        <span class="font-bold">CAMARA LANSANA</span>
                    </div>
                    <div class="grid grid-cols-[120px_1fr] gap-y-1 mb-2">
                        <span class="text-on-surface-variant font-medium" data-i18n="confirm.for">Für:</span>
                        <span class="font-bold">SOTRAMSBOIS</span>
                    </div>`;

const confirmHTMLBlockNL = `                    <div class="grid grid-cols-[120px_1fr] gap-y-1 mb-2">
                        <span class="text-on-surface-variant font-medium" data-i18n="confirm.beneficiary">Begunstigde:</span>
                        <span class="font-bold">CAMARA LANSANA</span>
                    </div>
                    <div class="grid grid-cols-[120px_1fr] gap-y-1 mb-2">
                        <span class="text-on-surface-variant font-medium" data-i18n="confirm.for">Voor:</span>
                        <span class="font-bold">SOTRAMSBOIS</span>
                    </div>`;

const htmlBlocks = { fr: confirmHTMLBlockFR, en: confirmHTMLBlockEN, de: confirmHTMLBlockDE, nl: confirmHTMLBlockNL };

for (const l of langs) {
    const hp = path.join(ROOT, l === 'fr' ? '' : l, 'confirmation-commande.html');
    if (!fs.existsSync(hp)) continue;
    let html = fs.readFileSync(hp, 'utf8');
    
    // Replace Beneficiary block
    const oldBenFR = `<div class="grid grid-cols-[120px_1fr] gap-y-1 mb-2">\n                        <span class="text-on-surface-variant font-medium" data-i18n="confirm.beneficiary">Bénéficiaire :</span>\n                        <span class="font-bold">CAMARA LANSANA - Responsable légale sotramsbois</span>\n                    </div>`;
    const oldBenEN = `<div class="grid grid-cols-[120px_1fr] gap-y-1 mb-2">\n                        <span class="text-on-surface-variant font-medium" data-i18n="confirm.beneficiary">Beneficiary:</span>\n                        <span class="font-bold">CAMARA LANSANA - Responsable légale sotramsbois</span>\n                    </div>`;
    const oldBenDE = `<div class="grid grid-cols-[120px_1fr] gap-y-1 mb-2">\n                        <span class="text-on-surface-variant font-medium" data-i18n="confirm.beneficiary">Begünstigter:</span>\n                        <span class="font-bold">CAMARA LANSANA - Responsable légale sotramsbois</span>\n                    </div>`;
    const oldBenNL = `<div class="grid grid-cols-[120px_1fr] gap-y-1 mb-2">\n                        <span class="text-on-surface-variant font-medium" data-i18n="confirm.beneficiary">Begunstigde:</span>\n                        <span class="font-bold">CAMARA LANSANA - Responsable légale sotramsbois</span>\n                    </div>`;
    
    html = html.replace(oldBenFR, htmlBlocks.fr);
    html = html.replace(oldBenEN, htmlBlocks.en);
    html = html.replace(oldBenDE, htmlBlocks.de);
    html = html.replace(oldBenNL, htmlBlocks.nl);

    fs.writeFileSync(hp, html);
}

// 3. Update api/order.php
let orderPhp = fs.readFileSync(path.join(ROOT, 'api/order.php'), 'utf8');
const oldOrderBen = `<tr><td style="padding:4px 0"><strong>Bénéficiaire :</strong></td><td style="padding:4px 0">CAMARA LANSANA - Responsable légale sotramsbois</td></tr>`;
const newOrderBen = `<tr><td style="padding:4px 0"><strong>Bénéficiaire :</strong></td><td style="padding:4px 0">CAMARA LANSANA</td></tr>\n    <tr><td style="padding:4px 0"><strong>Pour :</strong></td><td style="padding:4px 0">SOTRAMSBOIS</td></tr>`;
orderPhp = orderPhp.replace(oldOrderBen, newOrderBen);

const oldOrderRef = `<tr><td style="padding:4px 0"><strong>Référence :</strong></td><td style="padding:4px 0">' . htmlspecialchars($orderRef) . '</td></tr>`;
const newOrderRef = `<tr><td style="padding:4px 0"><strong>Référence obligatoire à rappeler :</strong></td><td style="padding:4px 0">' . htmlspecialchars($orderRef) . '</td></tr>`;
orderPhp = orderPhp.replace(oldOrderRef, newOrderRef);
fs.writeFileSync(path.join(ROOT, 'api/order.php'), orderPhp);


// 4. Update api/generate-order-pdf.php
let pdfPhp = fs.readFileSync(path.join(ROOT, 'api/generate-order-pdf.php'), 'utf8');
const oldPdfBen = `<tr>
                    <td style="padding: 4px 0;"><strong>Bénéficiaire :</strong></td>
                    <td style="padding: 4px 0;">CAMARA LANSANA - Responsable légale sotramsbois</td>
                </tr>`;
const newPdfBen = `<tr>
                    <td style="padding: 4px 0;"><strong>Bénéficiaire :</strong></td>
                    <td style="padding: 4px 0;">CAMARA LANSANA</td>
                </tr>
                <tr>
                    <td style="padding: 4px 0;"><strong>Pour :</strong></td>
                    <td style="padding: 4px 0;">SOTRAMSBOIS</td>
                </tr>`;
pdfPhp = pdfPhp.replace(oldPdfBen, newPdfBen);
fs.writeFileSync(path.join(ROOT, 'api/generate-order-pdf.php'), pdfPhp);

console.log("Done");
