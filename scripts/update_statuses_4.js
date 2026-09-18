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
                    'pending_payment': { label: 'En attente de payement', icon: 'schedule', class: 'text-orange-500 border-orange-300 bg-orange-50' },
                    'paid': { label: 'Payé', icon: 'check_circle', class: 'text-[#0ea5e9] border-[#0ea5e9] bg-[#f0f9ff]' },
                    'shipped': { label: 'En cour de Livraison', icon: 'local_shipping', class: 'text-blue-500 border-blue-300 bg-blue-50' },
                    'delivered': { label: 'Livrée', icon: 'check_circle', class: 'text-emerald-600 border-emerald-300 bg-emerald-50' }
                };`;
    if (content.match(mapRegex)) content = content.replace(mapRegex, newMap);

    // 2. Replace stats calculation logic
    const statsLogicRegex = /if \(order\.status === 'preparing' \|\| order\.status === 'shipped'\) stats\.delivery\+\+;[\s\S]*?else if \(order\.status === 'cancelled'\) stats\.cancelled\+\+;/;
    const newStatsLogic = `if (order.status === 'shipped') stats.delivery++;
                else if (order.status === 'delivered') stats.delivered++;
                else if (order.status === 'pending_payment') stats.pending++;
                else if (order.status === 'paid') stats.paid++;`;
    
    // We also need to add 'paid: 0' to the stats object init
    content = content.replace(/stats = \{ total: data\.orders\.length, delivery: 0, delivered: 0, pending: 0, cancelled: 0 \};/, "stats = { total: data.orders.length, delivery: 0, delivered: 0, pending: 0, paid: 0 };");
    
    if (content.match(statsLogicRegex)) content = content.replace(statsLogicRegex, newStatsLogic);

    // 3. Replace Stats HTML
    const statsHtmlRegex = /const statsContainer = document\.getElementById\('dashboard-stats'\);[\s\S]*?if \(statsContainer\) \{[\s\S]*?statsContainer\.innerHTML = `[\s\S]*?`;\s*\}/;
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
                        <div class="w-8 h-8 rounded-md flex items-center justify-center mb-3 bg-orange-50 text-orange-400">
                            <span class="material-symbols-outlined text-[18px]">schedule</span>
                        </div>
                        <span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">En attente payement</span>
                        <span class="text-headline-md font-headline-md text-on-surface leading-none">\${String(stats.pending).padStart(2, '0')}</span>
                    </div>
                    <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline/10 shadow-sm flex flex-col items-start">
                        <div class="w-8 h-8 rounded-md flex items-center justify-center mb-3 bg-blue-50 text-blue-500">
                            <span class="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                        </div>
                        <span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Payé</span>
                        <span class="text-headline-md font-headline-md text-on-surface leading-none">\${String(stats.paid || 0).padStart(2, '0')}</span>
                    </div>
                    <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline/10 shadow-sm flex flex-col items-start">
                        <div class="w-8 h-8 rounded-md flex items-center justify-center mb-3 bg-blue-50 text-blue-500">
                            <span class="material-symbols-outlined text-[18px]">local_shipping</span>
                        </div>
                        <span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">En cour Livraison</span>
                        <span class="text-headline-md font-headline-md text-on-surface leading-none">\${String(stats.delivery).padStart(2, '0')}</span>
                    </div>
                    <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline/10 shadow-sm flex flex-col items-start">
                        <div class="w-8 h-8 rounded-md flex items-center justify-center mb-3 bg-emerald-50 text-emerald-500">
                            <span class="material-symbols-outlined text-[18px]">check_circle</span>
                        </div>
                        <span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Livrées</span>
                        <span class="text-headline-md font-headline-md text-on-surface leading-none">\${String(stats.delivered).padStart(2, '0')}</span>
                    </div>
                \`;
            }`;
    if (content.match(statsHtmlRegex)) content = content.replace(statsHtmlRegex, newStats);

    // 4. Update Admin filter tabs & Select dropdown
    if (file.includes('admin-commandes.html')) {
        // Filter tabs
        const tabsRegex = /<div class="flex flex-wrap gap-2" id="status-filters">[\s\S]*?<\/div>/;
        const newTabs = `<div class="flex flex-wrap gap-2" id="status-filters">
                <button class="px-4 py-2 rounded-full bg-primary text-on-primary text-body-sm font-bold transition-colors" data-filter="all">Toutes</button>
                <button class="px-4 py-2 rounded-full bg-surface text-on-surface hover:bg-surface-container-highest border border-outline/20 text-body-sm font-bold transition-colors" data-filter="pending_payment">En attente de payement</button>
                <button class="px-4 py-2 rounded-full bg-surface text-on-surface hover:bg-surface-container-highest border border-outline/20 text-body-sm font-bold transition-colors" data-filter="paid">Payé</button>
                <button class="px-4 py-2 rounded-full bg-surface text-on-surface hover:bg-surface-container-highest border border-outline/20 text-body-sm font-bold transition-colors" data-filter="shipped">En cour de Livraison</button>
                <button class="px-4 py-2 rounded-full bg-surface text-on-surface hover:bg-surface-container-highest border border-outline/20 text-body-sm font-bold transition-colors" data-filter="delivered">Livrée</button>
            </div>`;
        if (content.match(tabsRegex)) content = content.replace(tabsRegex, newTabs);

        // Select dropdown
        const selectRegex = /<select class="bg-surface border border-outline\/30 rounded py-1 px-2 text-body-sm focus:outline-none focus:border-primary" onchange="updateOrderStatus\('\$\{order\.order_reference\}', this\.value\)">[\s\S]*?<\/select>/g;
        const newSelect = `<select class="bg-surface border border-outline/30 rounded py-1 px-2 text-body-sm focus:outline-none focus:border-primary" onchange="updateOrderStatus('\${order.order_reference}', this.value)">
                    <option value="" disabled selected>Changer statut...</option>
                    <option value="pending_payment">En attente de payement</option>
                    <option value="paid">Payé</option>
                    <option value="shipped">En cour de Livraison</option>
                    <option value="delivered">Livrée</option>
                </select>`;
        content = content.replace(selectRegex, newSelect);
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
});
