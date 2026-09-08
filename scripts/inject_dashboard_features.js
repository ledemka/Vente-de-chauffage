const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const tbPath = path.join(ROOT_DIR, 'tableau-de-bord.html');

let content = fs.readFileSync(tbPath, 'utf8');

// 1. Replace the Info section with a form
const infoRegex = /<div class="flex flex-col gap-4">\s*<div>\s*<span class="text-label-md font-label-md text-outline-variant block mb-1".*?<\/div>\s*<\/div>/s;
const newInfoForm = `<form id="profile-form" class="flex flex-col gap-4">
                        <div id="profile-msg" class="text-body-sm font-bold hidden px-4 py-2 rounded"></div>
                        <div>
                            <label class="text-label-md font-label-md text-outline-variant block mb-1">Société</label>
                            <input type="text" id="info-company" name="company" class="w-full bg-surface-container-highest/10 border border-outline/30 rounded-lg py-2 px-4 text-body-sm text-inverse-on-surface focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label class="text-label-md font-label-md text-outline-variant block mb-1">Contact</label>
                            <input type="text" id="info-contact" name="contact_name" class="w-full bg-surface-container-highest/10 border border-outline/30 rounded-lg py-2 px-4 text-body-sm text-inverse-on-surface focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label class="text-label-md font-label-md text-outline-variant block mb-1">Email</label>
                            <input type="email" id="info-email" name="email" class="w-full bg-surface-container-highest/10 border border-outline/30 rounded-lg py-2 px-4 text-body-sm text-inverse-on-surface focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label class="text-label-md font-label-md text-outline-variant block mb-1">Téléphone</label>
                            <input type="text" id="info-phone" name="phone" class="w-full bg-surface-container-highest/10 border border-outline/30 rounded-lg py-2 px-4 text-body-sm text-inverse-on-surface focus:outline-none focus:border-primary" />
                        </div>
                        <div>
                            <label class="text-label-md font-label-md text-outline-variant block mb-1">Adresse <span class="text-error">*</span></label>
                            <input type="text" id="info-address" name="address" required class="w-full bg-surface-container-highest/10 border border-outline/30 rounded-lg py-2 px-4 text-body-sm text-inverse-on-surface focus:outline-none focus:border-primary" />
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="text-label-md font-label-md text-outline-variant block mb-1">Code Postal <span class="text-error">*</span></label>
                                <input type="text" id="info-postal" name="postal_code" required class="w-full bg-surface-container-highest/10 border border-outline/30 rounded-lg py-2 px-4 text-body-sm text-inverse-on-surface focus:outline-none focus:border-primary" />
                            </div>
                            <div>
                                <label class="text-label-md font-label-md text-outline-variant block mb-1">Ville <span class="text-error">*</span></label>
                                <input type="text" id="info-city" name="city" required class="w-full bg-surface-container-highest/10 border border-outline/30 rounded-lg py-2 px-4 text-body-sm text-inverse-on-surface focus:outline-none focus:border-primary" />
                            </div>
                        </div>
                        <button type="submit" class="mt-2 w-full bg-primary hover:bg-primary/90 text-on-primary py-2 rounded-lg font-label-md transition-colors">
                            Enregistrer
                        </button>
                    </form>`;

content = content.replace(infoRegex, newInfoForm);

// 2. Add Modal before closing </main>
const modalMarkup = `
    <!-- Order Details Modal -->
    <dialog id="order-modal" class="bg-transparent p-0 w-full max-w-3xl backdrop:bg-inverse-surface/40 backdrop:backdrop-blur-sm m-auto">
        <div class="bg-surface-container-lowest shadow-md rounded-xl p-6 md:p-8 flex flex-col gap-6 w-full relative">
            <button id="close-modal-btn" class="absolute top-4 right-4 text-outline-variant hover:text-on-surface transition-colors">
                <span class="material-symbols-outlined text-[24px]">close</span>
            </button>
            
            <div class="border-b border-outline/20 pb-4">
                <h3 class="text-headline-md font-headline-md text-on-surface">Commande <span id="modal-ref" class="text-primary"></span></h3>
                <div class="flex gap-4 mt-2 text-body-sm text-on-surface-variant">
                    <span>Date : <span id="modal-date"></span></span>
                    <span>Statut : <span id="modal-status" class="px-2 py-0.5 bg-surface-container-highest rounded font-semibold"></span></span>
                </div>
            </div>
            
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse min-w-[500px]">
                    <thead class="border-b border-outline/20 text-label-md font-label-md text-on-surface-variant">
                        <tr>
                            <th class="py-2 pr-2 w-16">Article</th>
                            <th class="py-2 px-2">Détails</th>
                            <th class="py-2 px-2 text-center">Qté</th>
                            <th class="py-2 px-2 text-right">P.U.</th>
                            <th class="py-2 pl-2 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody id="modal-items-container">
                        <!-- Items injected here -->
                    </tbody>
                </table>
            </div>
            
            <div class="border-t border-outline/20 pt-4 flex justify-between items-center text-headline-md font-headline-md">
                <span>Total HT</span>
                <span id="modal-total" class="text-primary font-data-mono"></span>
            </div>
        </div>
    </dialog>
`;
content = content.replace(/<\/main>/, modalMarkup + '</main>');

// 3. Replace Script
const scriptStartIdx = content.indexOf('<script>', content.indexOf('</main>'));
const scriptEndIdx = content.indexOf('</script>', scriptStartIdx) + 9;
const oldScript = content.substring(scriptStartIdx, scriptEndIdx);

const newScript = `<script>
let productsData = {};

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Fetch Products for images
    try {
        const prodRes = await fetch('./data/products.json');
        const prods = await prodRes.json();
        prods.forEach(p => productsData[p.id] = p);
    } catch(e) { console.error('Error loading products'); }

    // 2. Affichage optimiste immédiat depuis le localStorage
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            fillProfileForm(user);
        }
    } catch (e) {
        // Ignorer les erreurs de parsing
    }

    // 3. Vérification réelle côté serveur
    try {
        const formData = new URLSearchParams();
        formData.append('action', 'check');
        
        const checkRes = await fetch('./api/auth.php', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString()
        });
        
        if (!checkRes.ok) throw new Error('Not auth');
        
        const userData = await checkRes.json();
        if (!userData.authenticated) {
            throw new Error('Not auth');
        }
        
        fillProfileForm(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
    } catch (e) {
        localStorage.removeItem('user');
        window.location.href = './connexion.html?redirect=tableau-de-bord.html';
        return;
    }

    // 4. Chargement des commandes
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
        
        if (data.success && data.orders && data.orders.length > 0) {
            let html = '<table class="w-full text-left border-collapse"><thead class="border-b border-outline/20"><tr><th class="py-3 pr-2 text-label-md font-label-md text-on-surface-variant">Référence</th><th class="py-3 px-2 text-label-md font-label-md text-on-surface-variant">Date</th><th class="py-3 px-2 text-label-md font-label-md text-on-surface-variant">Statut</th><th class="py-3 pl-2 text-label-md font-label-md text-on-surface-variant text-right">Total HT</th></tr></thead><tbody>';
            
            data.orders.forEach(order => {
                const dateObj = new Date(order.created_at);
                const dateStr = dateObj.toLocaleDateString();
                const statusMap = {
                    'pending_payment': 'En attente',
                    'paid': 'Payée',
                    'shipped': 'Expédiée',
                    'delivered': 'Livrée',
                    'cancelled': 'Annulée'
                };
                const statusTxt = statusMap[order.status] || order.status;
                const totalFmt = parseFloat(order.total).toFixed(2) + ' €';
                
                const itemsJson = (order.items || '[]');
                
                html += \`<tr class="border-b border-outline/10 cursor-pointer hover:bg-surface-container-highest/20 transition-colors" onclick="openOrderModal('\${order.order_reference}', '\${dateStr}', '\${statusTxt}', '\${totalFmt}', \`\${itemsJson.replace(/"/g, '&quot;')}\`)">
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

function fillProfileForm(data) {
    if(data.company) document.getElementById('info-company').value = data.company;
    if(data.contact_name) document.getElementById('info-contact').value = data.contact_name;
    if(data.email) document.getElementById('info-email').value = data.email;
    if(data.phone) document.getElementById('info-phone').value = data.phone;
    if(data.address) document.getElementById('info-address').value = data.address;
    if(data.city) document.getElementById('info-city').value = data.city;
    if(data.postal_code) document.getElementById('info-postal').value = data.postal_code;
}

// Form Submission
document.getElementById('profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = document.getElementById('profile-msg');
    msg.classList.add('hidden');
    
    const formData = new URLSearchParams(new FormData(e.target));
    formData.append('action', 'update_profile');

    try {
        const res = await fetch('./api/auth.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString()
        });
        const data = await res.json();
        
        if (data.success) {
            msg.textContent = data.message;
            msg.className = 'text-body-sm font-bold block px-4 py-2 rounded bg-[#dcfce7] text-[#166534] mb-4';
            // Update local storage
            let user = JSON.parse(localStorage.getItem('user') || '{}');
            user = { ...user, ...data.client };
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            msg.textContent = data.message || 'Erreur lors de la mise à jour.';
            msg.className = 'text-body-sm font-bold block px-4 py-2 rounded bg-error-container text-on-error-container mb-4';
        }
    } catch(err) {
        msg.textContent = 'Erreur réseau.';
        msg.className = 'text-body-sm font-bold block px-4 py-2 rounded bg-error-container text-on-error-container mb-4';
    }
});

// Modal Logic
const modal = document.getElementById('order-modal');
const closeBtn = document.getElementById('close-modal-btn');

window.openOrderModal = (ref, date, status, total, itemsJson) => {
    document.getElementById('modal-ref').textContent = ref;
    document.getElementById('modal-date').textContent = date;
    document.getElementById('modal-status').textContent = status;
    document.getElementById('modal-total').textContent = total;
    
    const container = document.getElementById('modal-items-container');
    container.innerHTML = '';
    
    try {
        const items = JSON.parse(itemsJson);
        items.forEach(item => {
            const product = productsData[item.product_id] || {};
            const img = product.image_product ? \`<img src="./assets/images/\${product.image_product}" class="w-12 h-12 object-cover rounded" />\` : '<div class="w-12 h-12 bg-surface-container rounded flex items-center justify-center"><span class="material-symbols-outlined text-outline-variant">image</span></div>';
            
            const lineTotal = (item.quantity * item.unit_price).toFixed(2);
            
            container.innerHTML += \`
                <tr class="border-b border-outline/10">
                    <td class="py-3 pr-2">\${img}</td>
                    <td class="py-3 px-2">
                        <div class="font-bold text-body-md text-on-surface">\${item.name}</div>
                        <div class="text-body-sm text-outline-variant">\${item.format}</div>
                    </td>
                    <td class="py-3 px-2 text-center text-body-md">\${item.quantity}</td>
                    <td class="py-3 px-2 text-right text-body-sm">\${parseFloat(item.unit_price).toFixed(2)} €</td>
                    <td class="py-3 pl-2 text-right font-data-mono font-bold text-primary">\${lineTotal} €</td>
                </tr>
            \`;
        });
    } catch(e) { console.error('Error parsing items'); }
    
    modal.showModal();
};

closeBtn.addEventListener('click', () => modal.close());
modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
});

async function handleLogout() {
    if (window.AuthAPI) {
        await AuthAPI.logout();
        window.location.href = './connexion.html';
    }
}
</script>`;

content = content.replace(oldScript, newScript);

fs.writeFileSync(tbPath, content, 'utf8');
console.log('Modified tableau-de-bord.html');
