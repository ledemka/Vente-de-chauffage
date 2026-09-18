const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

function replaceAll(str, mapObj){
    const re = new RegExp(Object.keys(mapObj).join("|"),"g");
    return str.replace(re, function(matched){
        return mapObj[matched];
    });
}

function patchDashboard() {
    const file = path.join(rootDir, 'tableau-de-bord.html');
    let html = fs.readFileSync(file, 'utf8');

    // Add translation helper at the top of script
    if (!html.includes('let windowTranslations = null;')) {
        html = html.replace('<script>', `<script>
let windowTranslations = null;
document.addEventListener('i18nLoaded', (e) => {
    windowTranslations = e.detail.translations;
    // re-render dynamic parts
    if(typeof renderClientOrders === 'function' && allOrders.length > 0) renderClientOrders();
    if(typeof renderStatsCards === 'function') renderStatsCards();
    if(typeof renderOrders === 'function' && allOrders.length > 0) renderOrders();
});
function t(key, defaultText) {
    if (!windowTranslations) return defaultText;
    const keys = key.split('.');
    let val = windowTranslations;
    for (const k of keys) {
        if (val) val = val[k];
    }
    return val || defaultText;
}
`);
    }

    // Static HTML replacements
    const staticMap = {
        '>Société<': ' data-i18n="dashboard.profile.company">Société<',
        '>Contact<': ' data-i18n="dashboard.profile.contact">Contact<',
        '>Email<': ' data-i18n="dashboard.profile.email">Email<',
        '>Téléphone<': ' data-i18n="dashboard.profile.phone">Téléphone<',
        '>Adresse<': ' data-i18n="dashboard.profile.address">Adresse<',
        '>Adresse <span class="text-error"': ' data-i18n="dashboard.profile.address">Adresse <span class="text-error"',
        '>Code Postal<': ' data-i18n="dashboard.profile.postal_code">Code Postal<',
        '>Code Postal <span class="text-error"': ' data-i18n="dashboard.profile.postal_code">Code Postal <span class="text-error"',
        '>Ville<': ' data-i18n="dashboard.profile.city">Ville<',
        '>Ville <span class="text-error"': ' data-i18n="dashboard.profile.city">Ville <span class="text-error"',
        '>Modifier mes informations<': ' data-i18n="dashboard.profile.edit_btn">Modifier mes informations<',
        '>Annuler<': ' data-i18n="dashboard.profile.cancel_btn">Annuler<',
        '>Enregistrer<': ' data-i18n="dashboard.profile.save_btn">Enregistrer<',
        
        '>Toutes<': ' data-i18n="order.filter_all">Toutes<',
        '>En attente de payement<': ' data-i18n="order.status_pending">En attente de payement<',
        '>Payé<': ' data-i18n="order.status_paid">Payé<',
        '>En cour de Livraison<': ' data-i18n="order.status_shipped">En cour de Livraison<',
        '>Livrée<': ' data-i18n="order.status_delivered">Livrée<',
        
        'Commande <span id="modal-ref"': 'Commande <span id="modal-ref"',
        '<h3 class="text-headline-md font-headline-md text-on-surface pr-24">Commande ': '<h3 class="text-headline-md font-headline-md text-on-surface pr-24"><span data-i18n="modal.title">Commande </span>',
        '>Télécharger le bon de commande<': ' data-i18n="modal.download">Télécharger le bon de commande<',
        'Date : <span': 'Date : <span',
        '<span>Date : <span': '<span><span data-i18n="modal.date">Date :</span> <span',
        '<span>Statut : <span': '<span><span data-i18n="modal.status">Statut :</span> <span',
        'Livraison : <span': '<span data-i18n="modal.delivery">Livraison :</span> <span',
        
        '>Article<': ' data-i18n="modal.table.article">Article<',
        '>Détails<': ' data-i18n="modal.table.details">Détails<',
        '>Qté<': ' data-i18n="modal.table.qty">Qté<',
        '>P.U.<': ' data-i18n="modal.table.pu">P.U.<',
        '<th class="py-2 pl-2 text-right">Total</th>': '<th class="py-2 pl-2 text-right" data-i18n="modal.table.total">Total</th>',
        '>Total TTC<': ' data-i18n="modal.total_ttc">Total TTC<'
    };
    
    html = replaceAll(html, staticMap);

    // JS dynamic replacements
    html = html.replace(
        "const statusMap = {",
        "const statusMap = {\n            'pending_payment': { label: t('order.status_pending', 'En attente de payement'), icon: 'schedule', class: 'text-orange-500 border-orange-300 bg-orange-50' },\n            'paid': { label: t('order.status_paid', 'Payé'), icon: 'check_circle', class: 'text-[#0ea5e9] border-[#0ea5e9] bg-[#f0f9ff]' },\n            'shipped': { label: t('order.status_shipped', 'En cour de Livraison'), icon: 'local_shipping', class: 'text-blue-500 border-blue-300 bg-blue-50' },\n            'delivered': { label: t('order.status_delivered', 'Livrée'), icon: 'check_circle', class: 'text-emerald-600 border-emerald-300 bg-emerald-50' }\n        }; //"
    );

    html = html.replace(
        "'pending_payment': { label: 'En attente de payement', icon: 'schedule', class: 'text-orange-500 border-orange-300 bg-orange-50' },",
        "//"
    ).replace(
        "'paid': { label: 'Payé', icon: 'check_circle', class: 'text-[#0ea5e9] border-[#0ea5e9] bg-[#f0f9ff]' },",
        "//"
    ).replace(
        "'shipped': { label: 'En cour de Livraison', icon: 'local_shipping', class: 'text-blue-500 border-blue-300 bg-blue-50' },",
        "//"
    ).replace(
        "'delivered': { label: 'Livrée', icon: 'check_circle', class: 'text-emerald-600 border-emerald-300 bg-emerald-50' }",
        "//"
    );

    // Stats cards
    html = html.replace('>Total commandes<', `>\${t('dashboard.stat_total', 'Total commandes')}<`)
               .replace('>En attente payement<', `>\${t('dashboard.stat_pending', 'En attente payement')}<`)
               .replace('>Payé<', `>\${t('dashboard.stat_paid', 'Payé')}<`)
               .replace('>En cour Livraison<', `>\${t('dashboard.stat_shipped', 'En cour Livraison')}<`)
               .replace('>Livrées<', `>\${t('dashboard.stat_delivered', 'Livrées')}<`);

    // Table Headers in JS
    html = html.replace(
        `<tr><th class="py-3 pr-2 text-label-md font-label-md text-on-surface-variant">Référence</th><th class="py-3 px-2 text-label-md font-label-md text-on-surface-variant">Date</th><th class="py-3 px-2 text-label-md font-label-md text-on-surface-variant">Statut</th><th class="py-3 pl-2 text-label-md font-label-md text-on-surface-variant text-right">Total TTC</th></tr>`,
        `<tr><th class="py-3 pr-2 text-label-md font-label-md text-on-surface-variant">\${t('order.table.ref', 'Référence')}</th><th class="py-3 px-2 text-label-md font-label-md text-on-surface-variant">\${t('order.table.date', 'Date')}</th><th class="py-3 px-2 text-label-md font-label-md text-on-surface-variant">\${t('order.table.status', 'Statut')}</th><th class="py-3 pl-2 text-label-md font-label-md text-on-surface-variant text-right">\${t('order.table.total', 'Total TTC')}</th></tr>`
    );

    html = html.replace(`delivery_address: order.delivery_address || 'Non spécifiée'`, `delivery_address: order.delivery_address || t('modal.not_specified', 'Non spécifiée')`);
    
    fs.writeFileSync(file, html);
    console.log('tableau-de-bord.html patched.');
}

function patchAdmin() {
    const file = path.join(rootDir, 'admin-commandes.html');
    let html = fs.readFileSync(file, 'utf8');

    // Add translation helper at the top of script
    if (!html.includes('let windowTranslations = null;')) {
        html = html.replace('<script>', `<script>
let windowTranslations = null;
document.addEventListener('i18nLoaded', (e) => {
    windowTranslations = e.detail.translations;
    // re-render dynamic parts
    if(typeof renderOrders === 'function' && allOrders.length > 0) renderOrders();
});
function t(key, defaultText) {
    if (!windowTranslations) return defaultText;
    const keys = key.split('.');
    let val = windowTranslations;
    for (const k of keys) {
        if (val) val = val[k];
    }
    return val || defaultText;
}
`);
    }

    // Static HTML replacements
    const staticMap = {
        '>Toutes<': ' data-i18n="admin.filter_all">Toutes<',
        '>En attente de payement<': ' data-i18n="order.status_pending">En attente de payement<',
        '>Payé<': ' data-i18n="order.status_paid">Payé<',
        '>En cour de Livraison<': ' data-i18n="order.status_shipped">En cour de Livraison<',
        '>Livrée<': ' data-i18n="order.status_delivered">Livrée<',
        'placeholder="Réf, Nom, Email..."': 'data-i18n="admin.search_placeholder" placeholder="Réf, Nom, Email..."',
        
        '<h3 class="text-headline-md font-headline-md text-on-surface pr-24">Commande ': '<h3 class="text-headline-md font-headline-md text-on-surface pr-24"><span data-i18n="modal.title">Commande </span>',
        '>Télécharger le bon de commande<': ' data-i18n="modal.download">Télécharger le bon de commande<',
        '<span>Date : <span': '<span><span data-i18n="modal.date">Date :</span> <span',
        '<span>Client : <span': '<span><span data-i18n="modal.client">Client :</span> <span',
        'Livraison : <span': '<span data-i18n="modal.delivery">Livraison :</span> <span',
        
        '>Article<': ' data-i18n="modal.table.article">Article<',
        '>Détails<': ' data-i18n="modal.table.details">Détails<',
        '>Qté<': ' data-i18n="modal.table.qty">Qté<',
        '>P.U.<': ' data-i18n="modal.table.pu">P.U.<',
        '<th class="py-2 pl-2 text-right">Total</th>': '<th class="py-2 pl-2 text-right" data-i18n="modal.table.total">Total</th>',
        '>Total TTC<': ' data-i18n="modal.total_ttc">Total TTC<'
    };
    
    html = replaceAll(html, staticMap);

    // JS dynamic replacements
    html = html.replace(
        "const statusMap = {",
        "const statusMap = {\n            'pending_payment': { label: t('order.status_pending', 'En attente de payement'), icon: 'schedule', class: 'text-orange-500 border-orange-300 bg-orange-50' },\n            'paid': { label: t('order.status_paid', 'Payé'), icon: 'check_circle', class: 'text-[#0ea5e9] border-[#0ea5e9] bg-[#f0f9ff]' },\n            'shipped': { label: t('order.status_shipped', 'En cour de Livraison'), icon: 'local_shipping', class: 'text-blue-500 border-blue-300 bg-blue-50' },\n            'delivered': { label: t('order.status_delivered', 'Livrée'), icon: 'check_circle', class: 'text-emerald-600 border-emerald-300 bg-emerald-50' }\n        }; //"
    );

    html = html.replace(
        "'pending_payment': { label: 'En attente de payement', icon: 'schedule', class: 'text-orange-500 border-orange-300 bg-orange-50' },",
        "//"
    ).replace(
        "'paid': { label: 'Payé', icon: 'check_circle', class: 'text-[#0ea5e9] border-[#0ea5e9] bg-[#f0f9ff]' },",
        "//"
    ).replace(
        "'shipped': { label: 'En cour de Livraison', icon: 'local_shipping', class: 'text-blue-500 border-blue-300 bg-blue-50' },",
        "//"
    ).replace(
        "'delivered': { label: 'Livrée', icon: 'check_circle', class: 'text-emerald-600 border-emerald-300 bg-emerald-50' }",
        "//"
    );

    // Table Headers in JS
    html = html.replace(
        `<tr><th class="py-3 pr-2 text-label-md font-label-md text-on-surface-variant">Réf</th><th class="py-3 px-2 text-label-md font-label-md text-on-surface-variant">Date</th><th class="py-3 px-2 text-label-md font-label-md text-on-surface-variant">Client</th><th class="py-3 px-2 text-label-md font-label-md text-on-surface-variant text-right">Total TTC</th><th class="py-3 px-2 text-label-md font-label-md text-on-surface-variant">Statut (actuel)</th><th class="py-3 pl-2 text-label-md font-label-md text-on-surface-variant text-right">Action</th></tr>`,
        `<tr><th class="py-3 pr-2 text-label-md font-label-md text-on-surface-variant">\${t('admin.table.ref', 'Réf')}</th><th class="py-3 px-2 text-label-md font-label-md text-on-surface-variant">\${t('admin.table.date', 'Date')}</th><th class="py-3 px-2 text-label-md font-label-md text-on-surface-variant">\${t('admin.table.client', 'Client')}</th><th class="py-3 px-2 text-label-md font-label-md text-on-surface-variant text-right">\${t('admin.table.total', 'Total TTC')}</th><th class="py-3 px-2 text-label-md font-label-md text-on-surface-variant">\${t('admin.table.status', 'Statut (actuel)')}</th><th class="py-3 pl-2 text-label-md font-label-md text-on-surface-variant text-right">\${t('admin.table.action', 'Action')}</th></tr>`
    );

    html = html.replace(`delivery_address: order.delivery_address || 'Non spécifiée'`, `delivery_address: order.delivery_address || t('modal.not_specified', 'Non spécifiée')`);
    html = html.replace(`'<div class="text-center py-10 text-on-surface-variant">Aucune commande trouvée.</div>'`, `\`<div class="text-center py-10 text-on-surface-variant">\${t('admin.no_orders', 'Aucune commande trouvée.')}</div>\``);
    
    html = html.replace(`>Changer statut...<`, `>\${t('admin.select_status', 'Changer statut...')}<`);
    // updateOrderStatus alerts
    html = html.replace(`'Changer le statut en : ' + newStatus + ' ?'`, `t('admin.confirm_status', 'Changer le statut en : ') + newStatus + ' ?'`);
    html = html.replace(`alert(data.message || 'Erreur lors de la mise à jour');`, `alert(data.message || t('admin.update_error', 'Erreur lors de la mise à jour'));`);
    html = html.replace(`alert('Erreur réseau');`, `alert(t('admin.network_error', 'Erreur réseau'));`);
    
    fs.writeFileSync(file, html);
    console.log('admin-commandes.html patched.');
}

patchDashboard();
patchAdmin();
