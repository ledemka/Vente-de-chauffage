/**
 * B2B Cart & Auth Frontend logic
 */

const CartAPI = {
    async request(action, data = {}) {
        const token = localStorage.getItem('cart_session_token');
        if (token) data.session_token = token;
        data.action = action;
        
        const formData = new URLSearchParams();
        for (const key in data) {
            formData.append(key, data[key]);
        }

        const res = await fetch('/api/cart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString()
        });
        const json = await res.json();
        
        if (json.session_token) {
            localStorage.setItem('cart_session_token', json.session_token);
        }
        return json;
    },

    async add(productId, quantity = 1) {
        return this.request('add', { product_id: productId, quantity });
    },

    async update(productId, quantity) {
        return this.request('update', { product_id: productId, quantity });
    },

    async remove(productId) {
        return this.request('remove', { product_id: productId });
    },

    async get() {
        return this.request('get');
    }
};

const AuthAPI = {
    async request(action, data = {}) {
        data.action = action;
        const formData = new URLSearchParams();
        for (const key in data) {
            formData.append(key, data[key]);
        }

        const res = await fetch('/api/auth.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString()
        });
        return await res.json();
    },

    async login(email, password) {
        const res = await this.request('login', { email, password });
        if (res.success) {
            localStorage.setItem('user', JSON.stringify(res.client));
            // Sync cart
            const token = localStorage.getItem('cart_session_token');
            if (token) {
                await fetch('/api/cart.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ action: 'sync', session_token: token })
                });
            }
        }
        return res;
    },

    async register(data) {
        const res = await this.request('register', data);
        if (res.success) {
            // Also sync cart
            const token = localStorage.getItem('cart_session_token');
            if (token) {
                await fetch('/api/cart.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ action: 'sync', session_token: token })
                });
            }
        }
        return res;
    },

    async logout() {
        localStorage.removeItem('user');
        return this.request('logout');
    },

    getUser() {
        try {
            return JSON.parse(localStorage.getItem('user'));
        } catch(e) {
            return null;
        }
    }
};

const OrderAPI = {
    async create(data) {
        const token = localStorage.getItem('cart_session_token');
        if (token) data.session_token = token;
        
        const formData = new URLSearchParams();
        for (const key in data) {
            formData.append(key, data[key]);
        }

        const res = await fetch('/api/order.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString()
        });
        return await res.json();
    }
};

window.CartAPI = CartAPI;
window.AuthAPI = AuthAPI;
window.OrderAPI = OrderAPI;


// --- UI Rendering Logic ---

const CartUI = {
    products: null,
    
    // Grille de remise stricte
    // 1 pal = 0%, 2-4 = 4%, 5-9 = 6%, 10-19 = 8%, >=20 = 10%
    tiers: [
        { min: 1, pct: 0 },
        { min: 2, pct: 0.04 },
        { min: 5, pct: 0.06 },
        { min: 10, pct: 0.08 },
        { min: 20, pct: 0.10 }
    ],
    
    async loadProducts() {
        if (!this.products) {
            try {
                const res = await fetch('/data/products.json');
                if(!res.ok) {
                    const res2 = await fetch('../data/products.json');
                    this.products = await res2.json();
                } else {
                    this.products = await res.json();
                }
            } catch (e) {
                console.error('Could not load products', e);
                this.products = [];
            }
        }
        return this.products;
    },

    getProduct(id) {
        return this.products.find(p => p.id === id);
    },

    formatPrice(price) {
        return parseFloat(price).toFixed(2) + ' €';
    },
    
    getCurrentTier(totalQuantity) {
        let currentTier = this.tiers[0];
        let nextTier = null;
        for (let i = 0; i < this.tiers.length; i++) {
            if (totalQuantity >= this.tiers[i].min) {
                currentTier = this.tiers[i];
                nextTier = this.tiers[i+1] || null;
            }
        }
        return { currentTier, nextTier };
    },

    calculateDiscount(totalQuantity, subtotal) {
        const { currentTier } = this.getCurrentTier(totalQuantity);
        return subtotal * currentTier.pct;
    },

    async renderCartPage() {
        const container = document.getElementById('cart-items-container');
        if (!container) return;

        await this.loadProducts();
        const res = await CartAPI.get();
        const items = res.items || [];

        // Mettre à jour le nombre d'articles
        const titleEl = document.getElementById('cart-items-count');
        if(titleEl) {
            titleEl.textContent = `Articles sélectionnés (${items.length})`;
        }

        if (items.length === 0) {
            container.innerHTML = '<p data-i18n="cart.empty" class="text-body-md text-on-surface-variant p-8 text-center bg-surface-container rounded-xl">Votre panier est vide</p>';
            if(window.i18n) window.i18n.translateDOM(container);
            
            // Réinitialiser la sidebar
            const sidebar = document.getElementById('cart-sidebar');
            if (sidebar) sidebar.innerHTML = '';
            return;
        }

        // Rendu des cartes produits
        let html = '<div class="flex flex-col gap-4">';
        let subtotal = 0;
        let totalQuantity = 0;

        items.forEach(item => {
            const prod = this.getProduct(item.product_id);
            if (!prod) return;
            
            const lineTotal = prod.wholesale_price * item.quantity;
            subtotal += lineTotal;
            totalQuantity += item.quantity;

            html += `
            <div class="bg-surface-container rounded-xl p-5 border border-outline/10 shadow-sm flex flex-col md:flex-row items-center gap-6">
                <img src="${prod.image_product}" class="w-24 h-24 object-cover rounded-lg border border-outline/20 flex-shrink-0" alt="">
                
                <div class="flex-grow">
                    <div class="text-label-md uppercase text-outline-variant tracking-wider font-bold mb-1">RÉF: ${prod.id}</div>
                    <h3 class="text-body-lg font-bold text-on-surface mb-2">${prod.name}</h3>
                    <div class="text-body-sm text-on-surface-variant flex items-center gap-2">
                        <span class="material-symbols-outlined text-[16px]">inventory_2</span>
                        Format : ${prod.format} / ${prod.palette_weight}
                    </div>
                </div>
                
                <div class="flex flex-col items-center gap-3">
                    <div class="inline-flex items-center border border-outline-variant rounded-md overflow-hidden bg-surface-container-highest shadow-sm">
                        <button onclick="CartUI.updateItem('${item.product_id}', ${item.quantity - 1})" class="w-10 h-10 flex items-center justify-center hover:bg-surface-dim transition-colors border-r border-outline-variant">
                            <span class="material-symbols-outlined text-[20px]">remove</span>
                        </button>
                        <input type="number" min="1" value="${item.quantity}" readonly class="w-14 h-10 text-center bg-transparent focus:outline-none font-data-mono font-bold text-on-surface">
                        <button onclick="CartUI.updateItem('${item.product_id}', ${item.quantity + 1})" class="w-10 h-10 flex items-center justify-center hover:bg-surface-dim transition-colors border-l border-outline-variant">
                            <span class="material-symbols-outlined text-[20px]">add</span>
                        </button>
                    </div>
                    <div class="text-right">
                        <div class="text-headline-md font-data-mono font-bold text-on-surface">${this.formatPrice(prod.wholesale_price)} HT</div>
                    </div>
                </div>
                
                <div class="pl-4 border-l border-outline/10">
                    <button onclick="CartUI.removeItem('${item.product_id}')" class="text-error hover:text-on-error-container p-2 rounded-full hover:bg-error-container transition-colors" title="Supprimer">
                        <span class="material-symbols-outlined text-[24px]">delete</span>
                    </button>
                </div>
            </div>`;
        });
        html += '</div>';
        
        container.innerHTML = html;

        // Rendu de la Sidebar (Tarif Dégressif & Livraison)
        const discount = this.calculateDiscount(totalQuantity, subtotal);
        const totalHT = subtotal - discount;
        const totalTTC = totalHT * 1.20;
        
        const { currentTier, nextTier } = this.getCurrentTier(totalQuantity);
        
        // Jauge de progression
        let progressHtml = '';
        if (nextTier) {
            const palettesMissing = nextTier.min - totalQuantity;
            const progressPct = Math.min(100, Math.max(0, (totalQuantity / nextTier.min) * 100));
            progressHtml = `
                <div class="mt-4 mb-2">
                    <div class="flex justify-between text-body-sm text-on-surface font-bold mb-1">
                        <span>Palier actuel (- ${currentTier.pct * 100}%)</span>
                        <span>Prochain palier (- ${nextTier.pct * 100}%)</span>
                    </div>
                    <div class="w-full h-3 bg-surface-dim rounded-full overflow-hidden">
                        <div class="h-full bg-primary rounded-full transition-all duration-500" style="width: ${progressPct}%"></div>
                    </div>
                    <p class="text-body-sm text-on-surface-variant text-center mt-2 font-medium">
                        Plus que <span class="font-bold text-primary">${palettesMissing} palette(s)</span> pour - ${nextTier.pct * 100}% !
                    </p>
                </div>
            `;
        } else {
            progressHtml = `
                <div class="mt-4 mb-2 p-3 bg-primary/10 rounded-lg text-center text-primary font-bold">
                    🎉 Vous avez atteint la remise maximale (-10%) !
                </div>
            `;
        }

        const sidebar = document.getElementById('cart-sidebar');
        if (sidebar) {
            sidebar.innerHTML = `
                <div class="bg-surface-container rounded-xl p-4 mb-6 shadow-sm border border-outline/10 flex items-start gap-4">
                    <span class="material-symbols-outlined text-primary text-2xl mt-1">local_shipping</span>
                    <div>
                        <h4 class="font-bold text-on-surface">Livraison estimée :</h4>
                        <p class="text-body-sm text-on-surface-variant">3 à 5 jours ouvrés (France et limitrophe)</p>
                    </div>
                </div>
                
                <div class="bg-surface-container rounded-xl p-6 shadow-md border border-outline/20">
                    <h3 class="text-headline-md font-headline-md text-on-surface mb-6 flex items-center gap-2 border-b border-outline/20 pb-4">
                        <span class="material-symbols-outlined text-primary">trending_down</span>
                        <span>Votre Tarif Dégressif</span>
                    </h3>
                    
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-body-md text-on-surface-variant font-medium">Volume actuel :</span>
                        <span class="font-bold text-on-surface">${totalQuantity} Palette(s)</span>
                    </div>
                    
                    ${progressHtml}
                    
                    <div class="border-t border-outline/20 mt-6 pt-6 flex flex-col gap-3">
                        <div class="flex justify-between text-body-sm text-on-surface-variant">
                            <span>Sous-total HT</span>
                            <span class="font-data-mono">${this.formatPrice(subtotal)}</span>
                        </div>
                        <div class="flex justify-between text-body-sm font-bold text-primary">
                            <span>Remise volume (-${currentTier.pct * 100}%)</span>
                            <span class="font-data-mono">-${this.formatPrice(discount)}</span>
                        </div>
                        <div class="flex justify-between text-body-sm text-on-surface-variant">
                            <span>Frais de livraison</span>
                            <span class="font-bold">Calculés à la validation</span>
                        </div>
                        <div class="flex justify-between text-body-sm text-on-surface-variant">
                            <span>TVA (20%)</span>
                            <span class="font-data-mono">${this.formatPrice(totalHT * 0.20)}</span>
                        </div>
                    </div>
                    
                    <div class="flex justify-between items-end mb-6 text-on-surface border-t border-outline/30 mt-4 pt-4">
                        <span class="text-headline-md font-headline-md">Total TTC</span>
                        <span class="text-headline-lg font-data-mono font-bold text-primary">${this.formatPrice(totalTTC)}</span>
                    </div>

                    <a href="./recapitulatif-commande.html" class="w-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-4 rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <span>Valider ma commande</span>
                        <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </a>
                    <p class="text-center text-[11px] text-on-surface-variant mt-3 flex justify-center items-center gap-1">
                        <span class="material-symbols-outlined text-[14px]">lock</span> Paiement sécurisé B2B par Virement
                    </p>
                </div>
            `;
        }
        
        if(window.i18n) window.i18n.translateDOM(container);
    },

    async renderCheckoutPage() {
        const itemsContainer = document.getElementById('checkout-items');
        if (!itemsContainer) return;

        await this.loadProducts();
        const res = await CartAPI.get();
        const items = res.items || [];

        if (items.length === 0) {
            window.location.href = './panier.html';
            return;
        }

        let html = '<div class="overflow-x-auto"><table class="w-full text-left border-collapse">';
        html += '<thead><tr class="border-b border-outline/20">';
        html += '<th class="py-3 pr-2 text-label-md font-label-md uppercase text-on-surface-variant">Produit</th>';
        html += '<th class="py-3 px-2 text-label-md font-label-md uppercase text-on-surface-variant text-center">Qté</th>';
        html += '<th class="py-3 pl-2 text-label-md font-label-md uppercase text-on-surface-variant text-right">Total HT</th>';
        html += '</tr></thead><tbody>';

        let subtotal = 0;
        let totalQuantity = 0;

        items.forEach(item => {
            const prod = this.getProduct(item.product_id);
            if (!prod) return;
            const lineTotal = prod.wholesale_price * item.quantity;
            subtotal += lineTotal;
            totalQuantity += item.quantity;

            html += `<tr class="border-b border-outline/20">
                <td class="py-3 pr-2 text-body-sm">
                    <span class="font-bold text-on-surface block">${prod.name}</span>
                    <span class="text-label-md uppercase text-outline-variant mt-1 block">RÉF: ${prod.id}</span>
                </td>
                <td class="py-3 px-2 text-center text-body-sm font-data-mono">${item.quantity}</td>
                <td class="py-3 pl-2 text-right text-body-sm font-data-mono font-bold text-primary">${this.formatPrice(lineTotal)}</td>
            </tr>`;
        });

        html += '</tbody></table></div>';
        itemsContainer.innerHTML = html;

        const discount = this.calculateDiscount(totalQuantity, subtotal);
        const totalHT = subtotal - discount;

        document.getElementById('checkout-subtotal').textContent = this.formatPrice(subtotal);
        document.getElementById('checkout-discount').textContent = '-' + this.formatPrice(discount);
        document.getElementById('checkout-total').textContent = this.formatPrice(totalHT);

        // Pre-fill user data if logged in
        const user = AuthAPI.getUser();
        if (user) {
            if(document.getElementById('company')) document.getElementById('company').value = user.company || '';
        }

        // Handle form submission
        const form = document.getElementById('checkout-form');
        const btn = document.getElementById('submit-order-btn');
        const errorDiv = document.getElementById('checkout-error');
        
        if (form && btn) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                btn.innerHTML = '<span class="material-symbols-outlined animate-spin">autorenew</span>';
                btn.disabled = true;
                if(errorDiv) errorDiv.classList.add('hidden');

                const data = {
                    company: document.getElementById('company').value,
                    address: document.getElementById('address').value,
                    zip_code: document.getElementById('zip_code').value,
                    city: document.getElementById('city').value,
                    truck_access: document.getElementById('truck_access').checked ? 1 : 0
                };

                try {
                    const res = await OrderAPI.create(data);
                    if (res.success) {
                        const pathParts = window.location.pathname.split('/');
                        const fileIdx = pathParts.findIndex(p => p.includes('.html'));
                        pathParts[fileIdx] = 'confirmation-commande.html';
                        const newUrl = pathParts.join('/') + '?ref=' + res.order_reference;
                        window.location.href = newUrl;
                    } else {
                        if(errorDiv) {
                            errorDiv.textContent = res.message || 'Erreur lors de la création de la commande';
                            errorDiv.classList.remove('hidden');
                        }
                        btn.innerHTML = 'Confirmer la commande';
                        btn.disabled = false;
                    }
                } catch(err) {
                    if(errorDiv) {
                        errorDiv.textContent = 'Erreur réseau';
                        errorDiv.classList.remove('hidden');
                    }
                    btn.innerHTML = 'Confirmer la commande';
                    btn.disabled = false;
                }
            });
        }
    },

    async updateItem(productId, qty) {
        if (qty < 1) return;
        await CartAPI.update(productId, qty);
        this.renderCartPage();
    },

    async removeItem(productId) {
        await CartAPI.remove(productId);
        this.renderCartPage();
    },
    
    renderConfirmationPage() {
        const refSpan = document.getElementById('order-reference');
        if (refSpan) {
            const urlParams = new URLSearchParams(window.location.search);
            const ref = urlParams.get('ref');
            if (ref) {
                refSpan.textContent = ref;
            } else {
                refSpan.textContent = 'NON_TROUVEE';
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('panier.html')) {
        CartUI.renderCartPage();
    } else if (window.location.pathname.includes('recapitulatif-commande.html')) {
        CartUI.renderCheckoutPage();
    } else if (window.location.pathname.includes('confirmation-commande.html')) {
        CartUI.renderConfirmationPage();
    }
});
window.CartUI = CartUI;
