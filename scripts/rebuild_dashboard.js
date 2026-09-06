const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dirs = ['.', 'en', 'de', 'nl'];

const newScriptContent = `<script>
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Affichage optimiste immǸdiat depuis le localStorage
    let user = null;
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            user = JSON.parse(storedUser);
            document.getElementById('info-company').textContent = user.company || '-';
            document.getElementById('info-contact').textContent = user.contact_name || '-';
            document.getElementById('info-email').textContent = user.email || '-';
        }
    } catch (e) {
        // Ignorer les erreurs de parsing
    }

    // 2. VǸrification rǸelle cǧtǸ serveur (Source de vǸritǸ finale)
    try {
        const formData = new URLSearchParams();
        formData.append('action', 'check');
        
        const checkRes = await fetch('API_PATH', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString()
        });
        
        if (!checkRes.ok) throw new Error('Not auth');
        
        const userData = await checkRes.json();
        if (!userData.authenticated) {
            throw new Error('Not auth');
        }
        
        // Mettre  jour avec les vraies donnǸes du serveur
        document.getElementById('info-company').textContent = userData.company || '-';
        document.getElementById('info-contact').textContent = userData.contact_name || '-';
        document.getElementById('info-email').textContent = userData.email || '-';
        
    } catch (e) {
        localStorage.removeItem('user');
        window.location.href = 'LOGIN_PATH';
        return;
    }

    // 3. Chargement des commandes
    const ordersContainer = document.getElementById('orders-container');
    try {
        const formData = new URLSearchParams();
        formData.append('action', 'list');
        const res = await fetch('ORDERS_PATH', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString()
        });
        const data = await res.json();
        
        if (data.success && data.orders && data.orders.length > 0) {
            let html = '<table class="w-full text-left border-collapse"><thead class="border-b border-outline/20"><tr><th class="py-3 pr-2 text-label-md font-label-md text-on-surface-variant">RǸfǸrence</th><th class="py-3 px-2 text-label-md font-label-md text-on-surface-variant">Date</th><th class="py-3 px-2 text-label-md font-label-md text-on-surface-variant">Statut</th><th class="py-3 pl-2 text-label-md font-label-md text-on-surface-variant text-right">Total HT</th></tr></thead><tbody>';
            
            data.orders.forEach(order => {
                const dateObj = new Date(order.created_at);
                const dateStr = dateObj.toLocaleDateString();
                const statusMap = {
                    'pending_payment': 'En attente de virement',
                    'paid': 'PayǸe',
                    'shipped': 'ExpǸdiǸe',
                    'delivered': 'LivrǸe',
                    'cancelled': 'AnnulǸe'
                };
                const statusTxt = statusMap[order.status] || order.status;
                const totalFmt = parseFloat(order.total).toFixed(2) + ' €';
                
                html += \`<tr class="border-b border-outline/10">
                    <td class="py-4 pr-2 text-body-md font-bold text-on-surface">\${order.order_reference}</td>
                    <td class="py-4 px-2 text-body-sm text-on-surface-variant">\${dateStr}</td>
                    <td class="py-4 px-2 text-body-sm"><span class="px-2 py-1 bg-surface-container-highest rounded text-on-surface-variant">\${statusTxt}</span></td>
                    <td class="py-4 pl-2 text-right text-body-md font-data-mono font-bold text-primary">\${totalFmt}</td>
                </tr>\`;
            });
            html += '</tbody></table>';
            ordersContainer.innerHTML = html;
        } else {
            ordersContainer.innerHTML = '<div class="text-center py-10 text-on-surface-variant"><span class="material-symbols-outlined text-[48px] opacity-50 mb-4 block">inventory_2</span><p data-i18n="dashboard.no_orders">Aucune commande pour le moment.</p></div>';
        }
    } catch (err) {
        ordersContainer.innerHTML = '<div class="text-center py-10 text-error">Erreur lors du chargement des commandes.</div>';
    }
});

async function handleLogout() {
    if (window.AuthAPI) {
        await AuthAPI.logout();
        window.location.href = 'LOGIN_PATH_SIMPLE';
    }
}
</script>`;

let modifiedCount = 0;

for (const dir of dirs) {
    const fullPath = path.join(rootDir, dir);
    if (!fs.existsSync(fullPath)) continue;
    
    const filePath = path.join(fullPath, 'tableau-de-bord.html');
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Find the specific script tag block
        const scriptRegex = /<script>\s*document\.addEventListener\('DOMContentLoaded'[\s\S]*?<\/script>/;
        
        const relPath = dir === '.' ? '.' : '..';
        const apiPath = `${relPath}/api/auth.php`;
        const ordersPath = `${relPath}/api/orders.php`;
        const loginPath = `${relPath}/connexion.html?redirect=tableau-de-bord.html`;
        const loginPathSimple = `${relPath}/connexion.html`;
        
        const customScript = newScriptContent
            .replace('API_PATH', apiPath)
            .replace('ORDERS_PATH', ordersPath)
            .replace('LOGIN_PATH', loginPath)
            .replace('LOGIN_PATH_SIMPLE', loginPathSimple);
            
        if (scriptRegex.test(content)) {
            content = content.replace(scriptRegex, customScript);
            fs.writeFileSync(filePath, content, 'utf8');
            modifiedCount++;
            console.log(`Updated ${path.join(dir, 'tableau-de-bord.html')}`);
        } else {
            console.log(`Could not find script block in ${path.join(dir, 'tableau-de-bord.html')}`);
        }
    }
}

console.log(`Updated ${modifiedCount} files.`);
