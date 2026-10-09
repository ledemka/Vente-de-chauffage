const fs = require("fs");

const file = "tableau-de-bord.html";
let content = fs.readFileSync(file, "utf8");

// 1. Update the table header (replace border-collapse with border-separate border-spacing-y-3)
const oldHeader =
  /let html = `<table class="w-full text-left border-collapse"><thead class="border-b border-outline\/20"><tr><th class="py-3 pr-2.*?<\/tbody>`;/;

const newHeader = `let html = \`<table class="w-full text-left border-separate" style="border-spacing: 0 0.75rem;"><thead class="text-on-surface-variant"><tr><th class="pb-2 px-4 text-label-md font-label-md font-semibold">\${t('order.table.ref', 'Référence')}</th><th class="pb-2 px-4 text-label-md font-label-md font-semibold">\${t('order.table.date', 'Date')}</th><th class="pb-2 px-4 text-label-md font-label-md font-semibold">\${t('order.table.status', 'Statut')}</th><th class="pb-2 px-4 text-label-md font-label-md font-semibold text-right" data-i18n="modal.total_ttc">\${t('order.table.total', 'Total TTC')}</th><th class="pb-2 px-4 text-label-md font-label-md font-semibold text-right">\${t('order.table.actions', 'Actions')}</th></tr></thead><tbody>\`;`;

content = content.replace(oldHeader, newHeader);

// 2. Update the row design to be card-like
const rowTarget =
  /html \+= `<tr class="order-row border-b border-outline\/10 cursor-pointer hover:bg-surface-container-highest\/20 transition-colors".*?<\/tr>`;/s;
const rowMatch = content.match(rowTarget);

if (rowMatch) {
  let newRow = `html += \`<tr class="order-row bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow cursor-pointer" data-order="\${orderDataStr}">
            <td class="py-4 px-4 rounded-l-xl text-body-md font-bold text-on-surface">\${order.order_reference}</td>
            <td class="py-4 px-4 text-body-sm text-on-surface-variant">\${dateStr}</td>
            <td class="py-4 px-4 text-body-sm">
                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border \${statusInfo.class} uppercase tracking-wide cursor-default select-none">
                    <span class="material-symbols-outlined text-[14px]">\${statusInfo.icon}</span>\${statusInfo.label}
                </div>
            </td>
            <td class="py-4 px-4 text-right text-body-md font-data-mono font-bold text-primary">\${totalFmt}</td>
            <td class="py-4 px-4 rounded-r-xl text-right">
                <div class="flex items-center justify-end gap-2">
                    <button class="flex items-center gap-1 text-[12px] font-semibold bg-surface-container border border-outline/20 text-on-surface px-2 py-1.5 rounded-lg hover:bg-surface-container-highest transition-colors shadow-sm" title="\${t('order.action.view', 'Voir')}">
                        <span class="material-symbols-outlined text-[16px]">visibility</span>
                        <span class="hidden xl:inline">\${t('order.action.view', 'Voir')}</span>
                    </button>
                    <button onclick="downloadOrderPdf('\${order.order_reference}', event)" class="btn-download-pdf flex items-center gap-1 text-[12px] font-semibold bg-primary text-on-primary px-2 py-1.5 rounded-lg hover:bg-primary/90 transition-colors shadow-sm" title="\${t('order.action.download', 'Bon de commande')}">
                        <span class="material-symbols-outlined text-[16px]">download</span>
                        <span class="hidden xl:inline" data-i18n="modal.download">\${t('modal.download', 'Bon de commande')}</span>
                    </button>
                </div>
            </td>
        </tr>\`;`;
  content = content.replace(rowMatch[0], newRow);
} else {
  console.log("Could not find the row target!");
}

// Ensure wrapper allows horizontal scrolling without clipping shadows
const containerRegex = /<div id="orders-container" class="overflow-x-auto">/g;
content = content.replace(
  containerRegex,
  '<div id="orders-container" class="overflow-x-auto pb-4 px-1 -mx-1">',
);

fs.writeFileSync(file, content, "utf8");
console.log("tableau-de-bord.html upgraded to card layout.");
