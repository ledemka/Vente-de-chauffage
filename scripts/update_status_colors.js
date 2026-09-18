const fs = require('fs');

const files = [
    'tableau-de-bord.html',
    'en/tableau-de-bord.html',
    'de/tableau-de-bord.html',
    'nl/tableau-de-bord.html',
    'admin-commandes.html',
    'en/admin-commandes.html',
    'de/admin-commandes.html',
    'nl/admin-commandes.html'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Replace statusMap
    const mapRegex = /const statusMap = \{[\s\S]*?\};/;
    const newMap = `const statusMap = {
                    'pending_payment': { label: 'En attente', icon: 'schedule', class: 'text-orange-500 border-orange-300 bg-orange-50' },
                    'paid': { label: 'Paiement reçu', icon: 'check_circle', class: 'text-[#0ea5e9] border-[#0ea5e9] bg-[#f0f9ff]' },
                    'preparing': { label: 'En prépa', icon: 'inventory_2', class: 'text-blue-500 border-blue-300 bg-blue-50' },
                    'shipped': { label: 'Expédiée', icon: 'local_shipping', class: 'text-blue-500 border-blue-300 bg-blue-50' },
                    'delivered': { label: 'Livrée', icon: 'check_circle', class: 'text-emerald-600 border-emerald-300 bg-emerald-50' },
                    'cancelled': { label: 'Annulée', icon: 'cancel', class: 'text-red-500 border-red-300 bg-red-50' }
                };`;
    content = content.replace(mapRegex, newMap);

    // 2. Replace badge HTML in table row
    // For dashboard: <td class="py-4 px-2 text-body-sm"><span class="px-2 py-1 rounded text-xs font-bold ${statusInfo.class}">${statusInfo.label}</span></td>
    // For admin: <td class="py-4 px-2 text-body-sm"><span class="px-2 py-1 rounded text-xs font-bold ${stInfo.class}" id="badge-${order.order_reference}">${stInfo.label}</span></td>
    
    // In dashboard:
    content = content.replace(
        /<span class="px-2 py-1 rounded text-xs font-bold \$\{statusInfo\.class\}">\$\{statusInfo\.label\}<\/span>/g,
        `<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border \${statusInfo.class} uppercase tracking-wide"><span class="material-symbols-outlined text-[14px]">\${statusInfo.icon}</span>\${statusInfo.label}</div>`
    );

    // In admin (uses stInfo):
    content = content.replace(
        /<span class="px-2 py-1 rounded text-xs font-bold \$\{stInfo\.class\}" id="badge-\$\{order\.order_reference\}">\$\{stInfo\.label\}<\/span>/g,
        `<div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border \${stInfo.class} uppercase tracking-wide" id="badge-\${order.order_reference}"><span class="material-symbols-outlined text-[14px]">\${stInfo.icon}</span>\${stInfo.label}</div>`
    );

    // 3. Replace Stats HTML
    // The image shows very specific stats cards
    const statsRegex = /const statsContainer = document\.getElementById\('dashboard-stats'\);[\s\S]*?if \(statsContainer\) \{[\s\S]*?statsContainer\.innerHTML = `[\s\S]*?`;\s*\}/;
    
    const newStats = `const statsContainer = document.getElementById('dashboard-stats');
            if (statsContainer) {
                statsContainer.innerHTML = \`
                    <div class="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col items-start border-2 border-[#1a2b3c]">
                        <div class="w-8 h-8 rounded-md flex items-center justify-center mb-3 bg-gray-100 text-gray-500">
                            <span class="material-symbols-outlined text-[18px]">dashboard_customize</span>
                        </div>
                        <span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Total commandes</span>
                        <span class="text-headline-md font-headline-md text-on-surface leading-none">\${String(stats.total).padStart(2, '0')}</span>
                    </div>
                    <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline/10 shadow-sm flex flex-col items-start">
                        <div class="w-8 h-8 rounded-md flex items-center justify-center mb-3 bg-blue-50 text-blue-500">
                            <span class="material-symbols-outlined text-[18px]">local_shipping</span>
                        </div>
                        <span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">En cours livraison</span>
                        <span class="text-headline-md font-headline-md text-on-surface leading-none">\${String(stats.delivery).padStart(2, '0')}</span>
                    </div>
                    <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline/10 shadow-sm flex flex-col items-start">
                        <div class="w-8 h-8 rounded-md flex items-center justify-center mb-3 bg-emerald-50 text-emerald-500">
                            <span class="material-symbols-outlined text-[18px]">check_circle</span>
                        </div>
                        <span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Livrées</span>
                        <span class="text-headline-md font-headline-md text-on-surface leading-none">\${String(stats.delivered).padStart(2, '0')}</span>
                    </div>
                    <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline/10 shadow-sm flex flex-col items-start">
                        <div class="w-8 h-8 rounded-md flex items-center justify-center mb-3 bg-orange-50 text-orange-400">
                            <span class="material-symbols-outlined text-[18px]">schedule</span>
                        </div>
                        <span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">En attente paiement</span>
                        <span class="text-headline-md font-headline-md text-on-surface leading-none">\${String(stats.pending).padStart(2, '0')}</span>
                    </div>
                    <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline/10 shadow-sm flex flex-col items-start">
                        <div class="w-8 h-8 rounded-md flex items-center justify-center mb-3 bg-red-50 text-red-500">
                            <span class="material-symbols-outlined text-[18px]">cancel</span>
                        </div>
                        <span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Annulées</span>
                        <span class="text-headline-md font-headline-md text-on-surface leading-none">\${String(stats.cancelled).padStart(2, '0')}</span>
                    </div>
                \`;
            }`;
    
    if (content.match(statsRegex)) {
        content = content.replace(statsRegex, newStats);
    }
    
    // Some translations tweaks for dashboard labels
    content = content.replace(
        "label: 'En attente de paiement'", "label: 'En attente'"
    );

    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
});
