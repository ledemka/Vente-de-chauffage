const fs = require('fs');

const file = 'tableau-de-bord.html';
let content = fs.readFileSync(file, 'utf8');

// Revert container
content = content.replace(/<div id="orders-container" class="overflow-x-auto pb-4 px-1 -mx-1">/g, '<div id="orders-container" class="overflow-x-auto">');

// Revert Header
const headerRegex = /let html = `<table class="w-full text-left border-separate" style="border-spacing: 0 0\.75rem;"><thead class="text-on-surface-variant"><tr><th class="pb-2 px-4 text-label-md font-label-md font-semibold">\${t\('order\.table\.ref', 'Référence'\)}<\/th><th class="pb-2 px-4 text-label-md font-label-md font-semibold">\${t\('order\.table\.date', 'Date'\)}<\/th><th class="pb-2 px-4 text-label-md font-label-md font-semibold">\${t\('order\.table\.status', 'Statut'\)}<\/th><th class="pb-2 px-4 text-label-md font-label-md font-semibold text-right" data-i18n="modal\.total_ttc">\${t\('order\.table\.total', 'Total TTC'\)}<\/th><th class="pb-2 px-4 text-label-md font-label-md font-semibold text-right">\${t\('order\.table\.actions', 'Actions'\)}<\/th><\/tr><\/thead><tbody>`;/s;
const origHeader = `let html = \`<table class="w-full text-left border-collapse"><thead class="border-b border-outline/20"><tr><th class="py-3 pr-2 text-label-md font-label-md text-on-surface-variant">\${t('order.table.ref', 'Référence')}</th><th class="py-3 px-2 text-label-md font-label-md text-on-surface-variant">\${t('order.table.date', 'Date')}</th><th class="py-3 px-2 text-label-md font-label-md text-on-surface-variant">\${t('order.table.status', 'Statut')}</th><th class="py-3 px-2 text-label-md font-label-md text-on-surface-variant text-right" data-i18n="modal.total_ttc">\${t('order.table.total', 'Total TTC')}</th><th class="py-3 pl-2 text-label-md font-label-md text-on-surface-variant text-right">\${t('order.table.actions', 'Actions')}</th></tr></thead><tbody>\`;`;
content = content.replace(headerRegex, origHeader);

// Revert Row
const rowRegex = /html \+= `<tr class="order-row bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow cursor-pointer".*?<\/tr>`;/s;
const origRow = `html += \`<tr class="order-row border-b border-outline/10 cursor-pointer hover:bg-surface-container-highest/20 transition-colors" data-order="\${orderDataStr}">
            <td class="py-4 pr-2 text-body-md font-bold text-on-surface">\${order.order_reference}</td>
            <td class="py-4 px-2 text-body-sm text-on-surface-variant">\${dateStr}</td>
            <td class="py-4 px-2 text-body-sm">
                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border \${statusInfo.class} uppercase tracking-wide cursor-default select-none">
                    <span class="material-symbols-outlined text-[14px]">\${statusInfo.icon}</span>\${statusInfo.label}
                </div>
            </td>
            <td class="py-4 px-2 text-right text-body-md font-data-mono font-bold text-primary">\${totalFmt}</td>
            <td class="py-4 pl-2 text-right">
                <div class="flex items-center justify-end gap-1.5">
                    <button class="flex items-center gap-1 text-[12px] font-semibold bg-surface-container border border-outline/20 text-on-surface px-2 py-1 rounded-md hover:bg-surface-container-highest transition-colors shadow-sm" title="\${t('order.action.view', 'Voir')}">
                        <span class="material-symbols-outlined text-[16px]">visibility</span>
                        <span class="hidden md:inline">\${t('order.action.view', 'Voir')}</span>
                    </button>
                    <button onclick="downloadOrderPdf('\${order.order_reference}', event)" class="btn-download-pdf flex items-center gap-1 text-[12px] font-semibold bg-primary text-on-primary px-2 py-1 rounded-md hover:bg-primary/90 transition-colors shadow-sm" title="\${t('order.action.download', 'Bon de commande')}">
                        <span class="material-symbols-outlined text-[16px]">download</span>
                        <span class="hidden lg:inline" data-i18n="modal.download">\${t('modal.download', 'Bon de commande')}</span>
                    </button>
                </div>
            </td>
        </tr>\`;`;
content = content.replace(rowRegex, origRow);

fs.writeFileSync(file, content, 'utf8');
console.log('tableau-de-bord.html reverted to standard layout.');
