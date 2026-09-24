const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../assets/js/cart.js');
let content = fs.readFileSync(file, 'utf8');

// Replace item format string
content = content.replace(
    '<span data-i18n="cart.format_weight">Format :</span> ${item.format} / ${prod.palette_weight}',
    '<span data-i18n="cart.format_weight">Format :</span> ${window.i18n ? window.i18n.t("formats." + item.format, item.format) : item.format} / ${prod.palette_weight}'
);

// Replace prod.format in product cards (line 315 / 322)
content = content.replace(
    '<div class="text-body-sm text-on-surface-variant mb-2">${p.format}</div>',
    '<div class="text-body-sm text-on-surface-variant mb-2">${window.i18n ? window.i18n.t("formats." + p.format, p.format) : p.format}</div>'
);

// Note: The checkout summary also has ${item.format}
content = content.replace(
    '<span class="text-body-sm text-on-surface-variant block">${item.format}</span>',
    '<span class="text-body-sm text-on-surface-variant block">${window.i18n ? window.i18n.t("formats." + item.format, item.format) : item.format}</span>'
);


fs.writeFileSync(file, content);
console.log('Patched cart.js formats.');
