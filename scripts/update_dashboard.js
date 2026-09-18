const fs = require('fs');

const files = [
    'tableau-de-bord.html',
    'en/tableau-de-bord.html',
    'de/tableau-de-bord.html',
    'nl/tableau-de-bord.html'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Insert stats container HTML
    const insertionPoint = '<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">';
    const statsHtml = `
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8" id="dashboard-stats">
            <!-- Injected by JS -->
        </div>
        `;
    
    if (!content.includes('id="dashboard-stats"')) {
        content = content.replace(insertionPoint, statsHtml + insertionPoint);
    }

    // Replace the JS rendering block
    const jsStart = 'if (data.success && data.orders && data.orders.length > 0) {';
    const jsEnd = "} else {\n            ordersContainer.innerHTML = '<div class=\"text-center py-10 text-on-surface-variant\"><span class=\"material-symbols-outlined text-[48px] opacity-50 mb-4 block\">inventory_2</span><p data-i18n=\"dashboard.no_orders\">Aucune commande pour le moment.</p></div>';\n        }";
    
    if (content.includes(jsStart)) {
        const replacementJs = `if (data.success && data.orders) {
            let stats = { total: data.orders.length, delivery: 0, delivered: 0, pending: 0, cancelled: 0 };
            
            let html = '<table class="w-full text-left border-collapse"><thead class="border-b border-outline/20"><tr><th class="py-3 pr-2 text-label-md font-label-md text-on-surface-variant">Référence</th><th class="py-3 px-2 text-label-md font-label-md text-on-surface-variant">Date</th><th class="py-3 px-2 text-label-md font-label-md text-on-surface-variant">Statut</th><th class="py-3 pl-2 text-label-md font-label-md text-on-surface-variant text-right">Total TTC</th></tr></thead><tbody>';
            
            data.orders.forEach(order => {
                const dateObj = new Date(order.created_at);
                const dateStr = dateObj.toLocaleDateString();
                const statusMap = {
                    'pending_payment': { label: 'En attente de paiement', class: 'bg-secondary-container text-on-secondary-container' },
                    'paid': { label: 'Paiement reçu', class: 'bg-surface-dim text-on-surface' },
                    'preparing': { label: 'En préparation', class: 'bg-primary-container text-on-primary-container' },
                    'shipped': { label: 'Expédiée', class: 'bg-primary-container text-on-primary-container' },
                    'delivered': { label: 'Livrée', class: 'bg-[#dcfce7] text-[#166534]' },
                    'cancelled': { label: 'Annulée', class: 'bg-error-container text-on-error-container' }
                };
                
                if (order.status === 'preparing' || order.status === 'shipped') stats.delivery++;
                else if (order.status === 'delivered') stats.delivered++;
                else if (order.status === 'pending_payment') stats.pending++;
                else if (order.status === 'cancelled') stats.cancelled++;

                const statusInfo = statusMap[order.status] || { label: order.status, class: 'bg-surface-container-highest text-on-surface-variant' };
                const totalFmt = parseFloat(order.total).toFixed(2) + ' €';
                
                const orderData = {
                    ref: order.order_reference,
                    date: dateStr,
                    status: statusInfo.label,
                    total: totalFmt,
                    delivery_address: order.delivery_address || 'Non spécifiée',
                    items: typeof order.items === 'string' ? JSON.parse(order.items || '[]') : (order.items || [])
                };
                const orderDataStr = JSON.stringify(orderData).replace(/"/g, '&quot;');
                
                html += \`<tr class="order-row border-b border-outline/10 cursor-pointer hover:bg-surface-container-highest/20 transition-colors" data-order="\${orderDataStr}">
                    <td class="py-4 pr-2 text-body-md font-bold text-on-surface">\${order.order_reference}</td>
                    <td class="py-4 px-2 text-body-sm text-on-surface-variant">\${dateStr}</td>
                    <td class="py-4 px-2 text-body-sm"><span class="px-2 py-1 rounded text-xs font-bold \${statusInfo.class}">\${statusInfo.label}</span></td>
                    <td class="py-4 pl-2 text-right text-body-md font-data-mono font-bold text-primary">\${totalFmt}</td>
                </tr>\`;
            });
            html += '</tbody></table>';
            
            if (data.orders.length > 0) {
                ordersContainer.innerHTML = html;
            } else {
                ordersContainer.innerHTML = '<div class="text-center py-10 text-on-surface-variant"><span class="material-symbols-outlined text-[48px] opacity-50 mb-4 block">inventory_2</span><p data-i18n="dashboard.no_orders">Aucune commande pour le moment.</p></div>';
            }

            const statsContainer = document.getElementById('dashboard-stats');
            if (statsContainer) {
                statsContainer.innerHTML = \`
                    <div class="bg-surface-container p-4 rounded-xl border border-outline/10 shadow-sm flex flex-col items-center justify-center">
                        <span class="text-headline-lg font-headline-lg text-primary">\${stats.total}</span>
                        <span class="text-label-md font-label-md text-on-surface-variant text-center mt-1">Total commandes</span>
                    </div>
                    <div class="bg-surface-container p-4 rounded-xl border border-outline/10 shadow-sm flex flex-col items-center justify-center">
                        <span class="text-headline-lg font-headline-lg text-primary">\${stats.delivery}</span>
                        <span class="text-label-md font-label-md text-on-surface-variant text-center mt-1">En cours livraison</span>
                    </div>
                    <div class="bg-surface-container p-4 rounded-xl border border-outline/10 shadow-sm flex flex-col items-center justify-center">
                        <span class="text-headline-lg font-headline-lg text-primary">\${stats.delivered}</span>
                        <span class="text-label-md font-label-md text-on-surface-variant text-center mt-1">Livrées</span>
                    </div>
                    <div class="bg-surface-container p-4 rounded-xl border border-outline/10 shadow-sm flex flex-col items-center justify-center">
                        <span class="text-headline-lg font-headline-lg text-primary">\${stats.pending}</span>
                        <span class="text-label-md font-label-md text-on-surface-variant text-center mt-1">En attente paiement</span>
                    </div>
                    <div class="bg-surface-container p-4 rounded-xl border border-outline/10 shadow-sm flex flex-col items-center justify-center">
                        <span class="text-headline-lg font-headline-lg text-primary">\${stats.cancelled}</span>
                        <span class="text-label-md font-label-md text-on-surface-variant text-center mt-1">Annulées</span>
                    </div>
                \`;
            }
        } else {
            ordersContainer.innerHTML = '<div class="text-center py-10 text-on-surface-variant"><span class="material-symbols-outlined text-[48px] opacity-50 mb-4 block">inventory_2</span><p data-i18n="dashboard.no_orders">Aucune commande pour le moment.</p></div>';
        }`;

        // I need to use regex because the exact spaces might not match
        // Or I can do substring replace since I know exactly where it starts.
        
        let startIdx = content.indexOf(jsStart);
        let endIdx = content.indexOf(jsEnd, startIdx) + jsEnd.length;
        
        content = content.substring(0, startIdx) + replacementJs + content.substring(endIdx);
    }
    
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
});
