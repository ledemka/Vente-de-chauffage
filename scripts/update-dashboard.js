const fs = require('fs');

const file = 'tableau-de-bord.html';
let content = fs.readFileSync(file, 'utf8');

// 1. Add "Actions" column to table header
const thTotal = `<th class="py-3 px-2 text-label-md font-label-md text-on-surface-variant text-right" data-i18n="modal.total_ttc">\${t('order.table.total', 'Total TTC')}</th><th class="py-3 pl-2 text-label-md font-label-md text-on-surface-variant text-right">\${t('order.table.actions', 'Actions')}</th>`;
content = content.replace(/<th class="py-3 pl-2 text-label-md font-label-md text-on-surface-variant text-right" data-i18n="modal.total_ttc">\$\{t\('order\.table\.total', 'Total TTC'\)\}<\/th>/, thTotal);

// 2. Modify row generation
const rowTarget = /html \+= `(.*?)<\/tr>`;/s;
const rowMatch = content.match(rowTarget);
if (rowMatch) {
    let newRow = rowMatch[0];
    newRow = newRow.replace('<td class="py-4 pl-2 text-right text-body-md font-data-mono font-bold text-primary">${totalFmt}</td>', '<td class="py-4 px-2 text-right text-body-md font-data-mono font-bold text-primary">${totalFmt}</td>\n            <td class="py-4 pl-2 text-right">\n                <div class="flex items-center justify-end gap-2">\n                    <button class="flex items-center gap-1 text-body-sm bg-surface-container border border-outline/20 text-on-surface px-3 py-1.5 rounded-lg hover:bg-surface-container-highest transition-colors shadow-sm" title="${t(\'order.action.view\', \'Voir\')}">\n                        <span class="material-symbols-outlined text-[18px]">visibility</span>\n                        <span class="hidden md:inline font-semibold">${t(\'order.action.view\', \'Voir\')}</span>\n                    </button>\n                    <button onclick="downloadOrderPdf(\'${order.order_reference}\', event)" class="btn-download-pdf flex items-center gap-1 text-body-sm bg-primary text-on-primary px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors shadow-sm" title="${t(\'order.action.download\', \'Bon de commande\')}">\n                        <span class="material-symbols-outlined text-[18px]">download</span>\n                        <span class="hidden lg:inline font-semibold" data-i18n="modal.download">${t(\'modal.download\', \'Bon de commande\')}</span>\n                    </button>\n                </div>\n            </td>');
    content = content.replace(rowMatch[0], newRow);
}

// 3. Remove modal button
const modalBtnRegex = /<a id="modal-download-btn".*?<\/a>/s;
content = content.replace(modalBtnRegex, '');
content = content.replace('pr-24', ''); // remove padding right for the absolute button

// 4. Update click listener
const listenerRegex = /document\.getElementById\('orders-container'\)\.addEventListener\('click', \(e\) => {/s;
content = content.replace(listenerRegex, `// Global download function\nwindow.downloadOrderPdf = (ref, event) => {\n    if (event) event.stopPropagation();\n    const iframe = document.createElement('iframe');\n    iframe.style.display = 'none';\n    const inSubdir = window.location.pathname.includes('/en/') || window.location.pathname.includes('/de/') || window.location.pathname.includes('/nl/');\n    const apiPath = inSubdir ? '../api/generate-order-pdf.php' : './api/generate-order-pdf.php';\n    iframe.src = \`\${apiPath}?ref=\${ref}\`;\n    document.body.appendChild(iframe);\n    setTimeout(() => { if (iframe.parentNode) document.body.removeChild(iframe); }, 5000);\n};\n\ndocument.getElementById('orders-container').addEventListener('click', (e) => {\n    if (e.target.closest('.btn-download-pdf')) return;\n`);

// 5. Remove modal download logic
const modalLogicRegex = /if \(document\.getElementById\('modal-download-btn'\)\) \{.*?\}\n/s;
content = content.replace(modalLogicRegex, '');

fs.writeFileSync(file, content, 'utf8');
console.log('tableau-de-bord.html updated.');
