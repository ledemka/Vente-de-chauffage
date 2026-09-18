const fs = require('fs');

const files = [
    'tableau-de-bord.html',
    'en/tableau-de-bord.html',
    'de/tableau-de-bord.html',
    'nl/tableau-de-bord.html'
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Add Filter Badges HTML right after the "Mes Commandes" title
    const titleRegex = /<h2 class="text-headline-md font-headline-md text-on-surface mb-6 flex items-center gap-2">[\s\S]*?<\/h2>/;
    const filterHtml = `<h2 class="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary">list_alt</span>
                        <span data-i18n="dashboard.my_orders">Mes Commandes</span>
                    </h2>
                    
                    <div class="flex flex-wrap gap-2 mb-6" id="dashboard-status-filters">
                        <button class="px-4 py-1.5 rounded-full bg-primary text-on-primary text-[13px] font-bold transition-colors shadow-sm" data-filter="all">Toutes</button>
                        <button class="px-4 py-1.5 rounded-full bg-surface text-on-surface hover:bg-surface-container-highest border border-outline/20 text-[13px] font-bold transition-colors" data-filter="pending_payment">En attente de payement</button>
                        <button class="px-4 py-1.5 rounded-full bg-surface text-on-surface hover:bg-surface-container-highest border border-outline/20 text-[13px] font-bold transition-colors" data-filter="paid">Payé</button>
                        <button class="px-4 py-1.5 rounded-full bg-surface text-on-surface hover:bg-surface-container-highest border border-outline/20 text-[13px] font-bold transition-colors" data-filter="shipped">En cour de Livraison</button>
                        <button class="px-4 py-1.5 rounded-full bg-surface text-on-surface hover:bg-surface-container-highest border border-outline/20 text-[13px] font-bold transition-colors" data-filter="delivered">Livrée</button>
                    </div>`;
    
    if (content.match(titleRegex) && !content.includes('id="dashboard-status-filters"')) {
        content = content.replace(titleRegex, filterHtml);
    }

    // 2. Add global variables
    if (!content.includes('let currentFilter = \'all\';')) {
        content = content.replace('let currentProfileData = {};', 'let currentProfileData = {};\nlet allOrders = [];\nlet currentFilter = \'all\';\n');
    }

    // 3. Replace the orders fetch and render block
    const ordersFetchRegex = /\/\/ 4\. Chargement des commandes[\s\S]*?\/\/ Modal Logic/m;
    const newOrdersLogic = `// 4. Chargement des commandes
    const ordersContainer = document.getElementById('orders-container');
    try {
        const formData = new URLSearchParams();
        formData.append('action', 'list');
        const res = await fetch('./api/orders.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString()
        });
        const data = await res.json();
        
        if (data.success && data.orders) {
            allOrders = data.orders;
            renderClientOrders();
            renderStatsCards();
        } else {
            ordersContainer.innerHTML = '<div class="text-center py-10 text-on-surface-variant"><span class="material-symbols-outlined text-[48px] opacity-50 mb-4 block">inventory_2</span><p data-i18n="dashboard.no_orders">Aucune commande pour le moment.</p></div>';
        }
    } catch (err) {
        ordersContainer.innerHTML = '<div class="text-center py-10 text-error">Erreur lors du chargement des commandes.</div>';
    }

    // Filtres Event Listeners
    const filterContainer = document.getElementById('dashboard-status-filters');
    if (filterContainer) {
        filterContainer.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target;
                
                // Si on clique sur le filtre déjà actif (sauf 'all'), on le désélectionne (revient à 'all')
                let filterVal = target.getAttribute('data-filter');
                if (currentFilter === filterVal && filterVal !== 'all') {
                    filterVal = 'all';
                }
                
                currentFilter = filterVal;
                
                // Update UI
                filterContainer.querySelectorAll('button').forEach(b => {
                    b.classList.remove('bg-primary', 'text-on-primary', 'shadow-sm');
                    b.classList.add('bg-surface', 'text-on-surface');
                });
                
                const activeBtn = filterContainer.querySelector(\`button[data-filter="\${currentFilter}"]\`);
                if (activeBtn) {
                    activeBtn.classList.remove('bg-surface', 'text-on-surface');
                    activeBtn.classList.add('bg-primary', 'text-on-primary', 'shadow-sm');
                }
                
                renderClientOrders();
            });
        });
    }
});

function renderStatsCards() {
    let stats = { total: allOrders.length, delivery: 0, delivered: 0, pending: 0, paid: 0 };
    allOrders.forEach(order => {
        if (order.status === 'shipped') stats.delivery++;
        else if (order.status === 'delivered') stats.delivered++;
        else if (order.status === 'pending_payment') stats.pending++;
        else if (order.status === 'paid') stats.paid++;
    });

    const statsContainer = document.getElementById('dashboard-stats');
    if (statsContainer) {
        statsContainer.innerHTML = \`
            <div class="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex flex-col items-start border border-outline/10 cursor-pointer hover:shadow-md transition-shadow" onclick="document.querySelector('#dashboard-status-filters button[data-filter=all]').click()">
                <div class="w-8 h-8 rounded-md flex items-center justify-center mb-3 bg-gray-100 text-gray-500">
                    <span class="material-symbols-outlined text-[18px]">dashboard_customize</span>
                </div>
                <span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Total commandes</span>
                <span class="text-headline-md font-headline-md text-on-surface leading-none">\${String(stats.total).padStart(2, '0')}</span>
            </div>
            <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline/10 shadow-sm flex flex-col items-start cursor-pointer hover:shadow-md transition-shadow" onclick="document.querySelector('#dashboard-status-filters button[data-filter=pending_payment]').click()">
                <div class="w-8 h-8 rounded-md flex items-center justify-center mb-3 bg-orange-50 text-orange-400">
                    <span class="material-symbols-outlined text-[18px]">schedule</span>
                </div>
                <span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">En attente payement</span>
                <span class="text-headline-md font-headline-md text-on-surface leading-none">\${String(stats.pending).padStart(2, '0')}</span>
            </div>
            <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline/10 shadow-sm flex flex-col items-start cursor-pointer hover:shadow-md transition-shadow" onclick="document.querySelector('#dashboard-status-filters button[data-filter=paid]').click()">
                <div class="w-8 h-8 rounded-md flex items-center justify-center mb-3 bg-blue-50 text-blue-500">
                    <span class="material-symbols-outlined text-[18px]">account_balance_wallet</span>
                </div>
                <span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Payé</span>
                <span class="text-headline-md font-headline-md text-on-surface leading-none">\${String(stats.paid || 0).padStart(2, '0')}</span>
            </div>
            <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline/10 shadow-sm flex flex-col items-start cursor-pointer hover:shadow-md transition-shadow" onclick="document.querySelector('#dashboard-status-filters button[data-filter=shipped]').click()">
                <div class="w-8 h-8 rounded-md flex items-center justify-center mb-3 bg-blue-50 text-blue-500">
                    <span class="material-symbols-outlined text-[18px]">local_shipping</span>
                </div>
                <span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">En cour Livraison</span>
                <span class="text-headline-md font-headline-md text-on-surface leading-none">\${String(stats.delivery).padStart(2, '0')}</span>
            </div>
            <div class="bg-surface-container-lowest p-4 rounded-xl border border-outline/10 shadow-sm flex flex-col items-start cursor-pointer hover:shadow-md transition-shadow" onclick="document.querySelector('#dashboard-status-filters button[data-filter=delivered]').click()">
                <div class="w-8 h-8 rounded-md flex items-center justify-center mb-3 bg-emerald-50 text-emerald-500">
                    <span class="material-symbols-outlined text-[18px]">check_circle</span>
                </div>
                <span class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Livrées</span>
                <span class="text-headline-md font-headline-md text-on-surface leading-none">\${String(stats.delivered).padStart(2, '0')}</span>
            </div>
        \`;
    }
}

function renderClientOrders() {
    const ordersContainer = document.getElementById('orders-container');
    
    let filtered = allOrders.filter(o => currentFilter === 'all' || o.status === currentFilter);
    
    if (filtered.length === 0) {
        ordersContainer.innerHTML = '<div class="text-center py-10 text-on-surface-variant"><span class="material-symbols-outlined text-[48px] opacity-50 mb-4 block">filter_alt_off</span><p data-i18n="dashboard.no_orders">Aucune commande trouvée pour ce statut.</p></div>';
        return;
    }

    let html = '<table class="w-full text-left border-collapse"><thead class="border-b border-outline/20"><tr><th class="py-3 pr-2 text-label-md font-label-md text-on-surface-variant">Référence</th><th class="py-3 px-2 text-label-md font-label-md text-on-surface-variant">Date</th><th class="py-3 px-2 text-label-md font-label-md text-on-surface-variant">Statut</th><th class="py-3 pl-2 text-label-md font-label-md text-on-surface-variant text-right">Total TTC</th></tr></thead><tbody>';
    
    filtered.forEach(order => {
        const dateObj = new Date(order.created_at);
        const dateStr = dateObj.toLocaleDateString();
        const statusMap = {
            'pending_payment': { label: 'En attente de payement', icon: 'schedule', class: 'text-orange-500 border-orange-300 bg-orange-50' },
            'paid': { label: 'Payé', icon: 'check_circle', class: 'text-[#0ea5e9] border-[#0ea5e9] bg-[#f0f9ff]' },
            'shipped': { label: 'En cour de Livraison', icon: 'local_shipping', class: 'text-blue-500 border-blue-300 bg-blue-50' },
            'delivered': { label: 'Livrée', icon: 'check_circle', class: 'text-emerald-600 border-emerald-300 bg-emerald-50' }
        };
        
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
        
        // Clic sur le badge de statut dans le tableau déclenche le filtre
        html += \`<tr class="order-row border-b border-outline/10 cursor-pointer hover:bg-surface-container-highest/20 transition-colors" data-order="\${orderDataStr}">
            <td class="py-4 pr-2 text-body-md font-bold text-on-surface">\${order.order_reference}</td>
            <td class="py-4 px-2 text-body-sm text-on-surface-variant">\${dateStr}</td>
            <td class="py-4 px-2 text-body-sm">
                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border \${statusInfo.class} uppercase tracking-wide cursor-pointer hover:shadow-md hover:scale-105 transition-transform" onclick="event.stopPropagation(); document.querySelector('#dashboard-status-filters button[data-filter=\${order.status}]').click()">
                    <span class="material-symbols-outlined text-[14px]">\${statusInfo.icon}</span>\${statusInfo.label}
                </div>
            </td>
            <td class="py-4 pl-2 text-right text-body-md font-data-mono font-bold text-primary">\${totalFmt}</td>
        </tr>\`;
    });
    html += '</tbody></table>';
    
    ordersContainer.innerHTML = html;
}

// Modal Logic`;

    if (content.match(ordersFetchRegex)) {
        content = content.replace(ordersFetchRegex, newOrdersLogic);
    }
    
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
});
