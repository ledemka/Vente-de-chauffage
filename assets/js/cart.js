/**
 * B2B Cart & Auth Frontend logic
 */

var CartAPI = {
    _ensureToken() {
        let token = localStorage.getItem('cart_session_token');
        if (!token) {
            token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
            localStorage.setItem('cart_session_token', token);
        }
        return token;
    },

    async request(action, data = {}) {
        data.action = action;
        data.session_token = this._ensureToken();
        
        const formData = new URLSearchParams();
        for (const key in data) {
            formData.append(key, data[key]);
        }

        // Use proper API path depending on current location
        const inSubdir = window.location.pathname.includes('/en/') || window.location.pathname.includes('/de/') || window.location.pathname.includes('/nl/');
        const apiPath = inSubdir ? '../api/cart.php' : './api/cart.php';

        const res = await fetch(apiPath, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString()
        });
        return await res.json();
    },

    async add(productId, quantity = 1, length = '') {
        const res = await this.request('add', { product_id: productId, quantity, length });
        if(window.updateCartBadge) window.updateCartBadge();
        return res;
    },
    async update(productId, quantity, length = '') {
        const res = await this.request('update', { product_id: productId, quantity, length });
        if(window.updateCartBadge) window.updateCartBadge();
        return res;
    },
    async remove(productId, length = '') {
        const res = await this.request('remove', { product_id: productId, length });
        if(window.updateCartBadge) window.updateCartBadge();
        return res;
    },
    async get() {
        return this.request('get');
    },
    async clear() {
        const res = await this.request('clear');
        if(window.updateCartBadge) window.updateCartBadge();
        return res;
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

        const inSubdir = window.location.pathname.includes('/en/') || window.location.pathname.includes('/de/') || window.location.pathname.includes('/nl/');
        const apiPath = inSubdir ? '../api/order.php' : './api/order.php';

        const res = await fetch(apiPath, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString()
        });
        return await res.json();
    }
};

window.CartAPI = CartAPI;
// AuthAPI is defined and exported by auth.js — do NOT redeclare here
window.OrderAPI = OrderAPI;


// --- UI Rendering Logic ---

var CartUI = {
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
                const res = await fetch('/data/products.json?v=' + Date.now());
                if(!res.ok) {
                    const res2 = await fetch('../data/products.json?v=' + Date.now());
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
        // Obsolete function, discount is now calculated server-side per item
        return 0;
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
        if(window.updateCartBadge) window.updateCartBadge();
            
            // Réinitialiser la sidebar
            const sidebar = document.getElementById('cart-sidebar');
            if (sidebar) sidebar.innerHTML = '';
            return;
        }

        // Rendu des cartes produits
        let html = '<div class="flex flex-col gap-4">';
        
        let subtotal = 0;
        let rawSubtotal = 0;
        let totalQuantity = 0;
        
        let subgroupCounts = {};
        let firstSubgroup = null;

        items.forEach(item => {
            const prod = this.getProduct(item.product_id);
            if (!prod) return;
            
            const lineTotalHT = item.total;
            const lineTotalTTC = lineTotalHT * 1.20;
            subtotal += lineTotalHT;
            rawSubtotal += (item.wholesale_price * item.quantity);
            totalQuantity += item.quantity;
            
            if (!firstSubgroup) firstSubgroup = prod.subgroup_id;
            subgroupCounts[prod.subgroup_id] = (subgroupCounts[prod.subgroup_id] || 0) + item.quantity;

            const inSubdir = window.location.pathname.includes('/en/') || window.location.pathname.includes('/de/') || window.location.pathname.includes('/nl/');
            const relPath = inSubdir ? '..' : '.';
            const imgPrefix = relPath === '.' ? '' : relPath;

            html += `
            <div class="bg-surface-container rounded-xl p-5 border border-outline/10 shadow-sm flex flex-col md:flex-row items-center gap-6">
                <img src="${imgPrefix}${prod.image_product}" class="w-24 h-24 object-cover rounded-lg border border-outline/20 flex-shrink-0" alt="">
                
                <div class="flex-grow">
                    <div class="text-label-md uppercase text-outline-variant tracking-wider font-bold mb-1">RÉF: ${prod.id}</div>
                    <h3 class="text-body-lg font-bold text-on-surface mb-2">${prod.name}</h3>
                    <div class="text-body-sm text-on-surface-variant flex items-center gap-2">
                        <span class="material-symbols-outlined text-[16px]">inventory_2</span>
                        Format : ${item.format} / ${prod.palette_weight}
                    </div>
                </div>
                
                <div class="flex flex-col items-center gap-3">
                    <div class="inline-flex items-center border border-outline-variant rounded-md overflow-hidden bg-surface-container-highest shadow-sm">
                        <button onclick="CartUI.updateItem('${item.product_id}', ${item.quantity - 1}, '${item.length || ''}')" class="w-10 h-10 flex items-center justify-center hover:bg-surface-dim transition-colors border-r border-outline-variant">
                            <span class="material-symbols-outlined text-[20px]">remove</span>
                        </button>
                        <input type="number" min="1" value="${item.quantity}" readonly class="w-14 h-10 text-center bg-transparent focus:outline-none font-data-mono font-bold text-on-surface">
                        <button onclick="CartUI.updateItem('${item.product_id}', ${item.quantity + 1}, '${item.length || ''}')" class="w-10 h-10 flex items-center justify-center hover:bg-surface-dim transition-colors border-l border-outline-variant">
                            <span class="material-symbols-outlined text-[20px]">add</span>
                        </button>
                    </div>
                    <div class="text-right flex flex-col items-end">
                        ${item.discount_percent > 0 ? `
                            <div class="text-body-sm text-outline-variant line-through">${this.formatPrice(item.wholesale_price)} HT</div>
                            <div class="text-body-sm font-bold text-primary">-${item.discount_percent}%</div>
                            <div class="text-label-lg font-bold">${this.formatPrice(item.unit_price)} HT / pal</div>
                        ` : `
                            <div class="text-label-lg font-bold">${this.formatPrice(item.unit_price)} HT / pal</div>
                        `}
                        <div class="text-headline-md font-data-mono font-bold text-on-surface mt-1">${this.formatPrice(lineTotalTTC)} TTC</div>
                    </div>
                </div>
                
                <div class="pl-4 border-l border-outline/10">
                    <button onclick="CartUI.removeItem('${item.product_id}', '${item.length || ''}')" class="text-error hover:text-on-error-container p-2 rounded-full hover:bg-error-container transition-colors" title="Supprimer">
                        <span class="material-symbols-outlined text-[24px]">delete</span>
                    </button>
                </div>
            </div>`;
        });
        
        // --- Cross-selling Recommendation Logic ---
        let maxCount = -1;
        let majoritySubgroup = null;
        for (let sg in subgroupCounts) {
            if (subgroupCounts[sg] > maxCount) {
                maxCount = subgroupCounts[sg];
                majoritySubgroup = parseInt(sg);
            } else if (subgroupCounts[sg] === maxCount) {
                if (parseInt(sg) === firstSubgroup) {
                    majoritySubgroup = parseInt(sg);
                }
            }
        }
        
        if (majoritySubgroup !== null) {
            // Option B: Randomize (shuffle) and pick 3 max
            const shuffleArray = array => {
                let curId = array.length;
                while (0 !== curId) {
                    let randId = Math.floor(Math.random() * curId);
                    curId -= 1;
                    let tmp = array[curId];
                    array[curId] = array[randId];
                    array[randId] = tmp;
                }
                return array;
            };

            // 1. Similar Products
            let similarProducts = this.products.filter(p => p.subgroup_id === majoritySubgroup && !items.find(i => i.product_id === p.id));
            similarProducts = shuffleArray(similarProducts).slice(0, 3);
            
            // 2. Complementary Products
            let recSubgroup = 5;
            if (majoritySubgroup === 5) recSubgroup = 1;
            
            let recProducts = this.products.filter(p => p.subgroup_id === recSubgroup && !items.find(i => i.product_id === p.id));
            recProducts = shuffleArray(recProducts).slice(0, 3);
            
            const renderProductCards = (prodList) => {
                const inSubdir = window.location.pathname.includes('/en/') || window.location.pathname.includes('/de/') || window.location.pathname.includes('/nl/');
                const relPath = inSubdir ? '..' : '.';
                const imgPrefix = relPath === '.' ? '' : relPath;
                const basePath = relPath + '/';
                let phtml = '<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">';
                prodList.forEach(p => {
                    const isBuche = p.subgroup_id === 1 && p.prices_by_length;
                    // For Bûches: show price at 50cm by default (display only)
                    const displayPrice = isBuche
                        ? (p.prices_by_length['50'] || Math.min(...Object.values(p.prices_by_length).map(Number)))
                        : (p.wholesale_price || 0);

                    // For Bûches: redirect to catalogue format selector instead of adding directly
                    const actionBtn = isBuche
                        ? `<a href="${relPath}/catalogue.html?subgroup=1" class="w-full bg-amber-600 hover:bg-amber-700 text-white font-label-md py-2 rounded-md transition-colors flex items-center justify-center gap-2">
                                <span class="material-symbols-outlined text-[18px]">straighten</span>
                                <span>Choisir le format</span>
                           </a>`
                        : `<button onclick="CartUI.addRecommended('${p.id}')" class="w-full bg-surface-container-highest hover:bg-surface-dim text-on-surface font-label-md py-2 rounded-md transition-colors border border-outline-variant flex items-center justify-center gap-2">
                                <span class="material-symbols-outlined text-[18px]">add</span>
                                <span data-i18n="product.add_to_cart">Ajouter</span>
                           </button>`;

                    const formatLabel = isBuche
                        ? `<div class="text-body-sm text-amber-700 mb-2 flex items-center gap-1"><span class="material-symbols-outlined text-[14px]">straighten</span> Sélectionnez un format</div>`
                        : `<div class="text-body-sm text-on-surface-variant mb-2">${p.format}</div>`;

                    phtml += `
                        <div class="bg-surface-container rounded-xl p-4 border border-outline/10 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                            <div>
                                <img src="${imgPrefix}${p.image_product}" class="w-full h-32 object-cover rounded-lg mb-4" alt="">
                                <h4 class="text-label-lg font-bold text-on-surface mb-1 line-clamp-2">${p.name}</h4>
                                ${formatLabel}
                            </div>
                            <div>
                                <div class="text-label-lg font-data-mono font-bold text-primary mb-2">${this.formatPrice(displayPrice * 1.20)} TTC${isBuche ? '<span class="text-[10px] text-amber-700 font-normal ml-1">prix 50cm</span>' : ''}</div>
                                ${actionBtn}
                            </div>
                        </div>
                    `;
                });
                phtml += '</div>';
                return phtml;
            };

            if (similarProducts.length > 0 || recProducts.length > 0) {
                html += '<div class="mt-12 mb-4 border-t border-outline/20 pt-8 flex flex-col gap-8">';
                
                if (similarProducts.length > 0) {
                    html += '<div>';
                    html += '<h3 class="text-headline-sm font-bold text-on-surface mb-4 flex items-center gap-2"><span class="material-symbols-outlined text-primary">sell</span><span data-i18n="cart.similar">Produits similaires</span></h3>';
                    html += renderProductCards(similarProducts);
                    html += '</div>';
                }

                if (recProducts.length > 0) {
                    html += '<div>';
                    html += '<h3 class="text-headline-sm font-bold text-on-surface mb-4 flex items-center gap-2"><span class="material-symbols-outlined text-primary">add_shopping_cart</span><span data-i18n="cart.recommended">Produits complémentaires</span></h3>';
                    html += renderProductCards(recProducts);
                    html += '</div>';
                }
                
                html += '</div>';
            }
        }

        html += '</div>';
        
        container.innerHTML = html;

        // Rendu de la Sidebar (Tarif Dégressif & Livraison)
        const discount = Math.max(0, rawSubtotal - subtotal);
        const totalHT = subtotal;
        const totalTTC = totalHT * 1.20;
        const rawSubtotalTTC = rawSubtotal * 1.20;
        const discountTTC = discount * 1.20;
        
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
                            <span>Sous-total TTC</span>
                              <div class="text-right">
                                  <span class="font-data-mono">${this.formatPrice(rawSubtotalTTC)}</span>
                              </div>
                        </div>
                        <div class="flex justify-between text-body-sm font-bold text-primary">
                            <span>Remise volume (-${currentTier.pct * 100}%)</span>
                              <span class="font-data-mono">-${this.formatPrice(discountTTC)}</span>
                        </div>
                        <div class="flex justify-between text-body-sm text-on-surface-variant">
                            <span>Frais de livraison</span>
                            <span class="font-bold">Calculés à la validation</span>
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
        if(window.updateCartBadge) window.updateCartBadge();
    },

    async renderCheckoutPage() {
        // Enforce login for checkout
        const checkoutUser = typeof window.AuthAPI !== 'undefined' ? window.AuthAPI.getUser() : null;
        if (!checkoutUser) {
            const authModal = document.getElementById('auth-modal');
            if (authModal) {
                authModal.classList.remove('hidden');
                document.body.style.overflow = 'hidden'; // Prevent scrolling
            }
            return;
        }

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
        html += '<th class="py-3 pl-2 text-label-md font-label-md uppercase text-on-surface-variant text-right">Total TTC</th>';
        html += '</tr></thead><tbody>';

        let checkoutShippingCost = null;
        let validatedAddress = '';
        let isShippingCalculable = false;
        let checkoutTotalQty = 0;
        let checkoutSubtotal = 0;
        let checkoutDiscountAmt = 0;
        let isCalculating = false;
        
        function updateCheckoutTotal() {
        if (!checkoutSubtotal) return;
        
        const htAfterDiscount = checkoutSubtotal - checkoutDiscountAmt;
        const totalTTC_products = htAfterDiscount * 1.20;
        
        // Shipping is already TTC
        const total = totalTTC_products + (checkoutShippingCost || 0);

        const totalEl = document.getElementById('checkout-total');
        if (totalEl) totalEl.textContent = this.formatPrice(total);
        
        const btn = document.getElementById('submit-order-btn');
            if (btn && btn.id === 'submit-order-btn') {
                if (!validatedAddress || checkoutShippingCost === null || isCalculating) {
                    btn.disabled = true;
                    btn.innerHTML = 'Veuillez sélectionner une adresse valide';
                } else if (!isShippingCalculable) {
                    btn.disabled = true;
                    btn.innerHTML = 'Demande de devis requise';
                } else {
                    btn.disabled = false;
                    btn.innerHTML = 'Confirmer la commande';
                }
            }
        }
        updateCheckoutTotal = updateCheckoutTotal.bind(this);

        let subtotal = 0;
        let rawSubtotal = 0;
        let totalQuantity = 0;

        items.forEach(item => {
            const prod = this.getProduct(item.product_id);
            if (!prod) return;
            const lineTotal = item.total;
            const lineTotalTTC = lineTotal * 1.20;
            subtotal += lineTotal;
            rawSubtotal += (item.wholesale_price * item.quantity);
            totalQuantity += item.quantity;

            html += `<tr class="border-b border-outline/20">
                <td class="py-3 pr-2 text-body-sm">
                    <span class="font-bold text-on-surface block">${prod.name}</span>
                    <span class="text-body-sm text-on-surface-variant block">${item.format}</span>
                    <span class="text-label-md uppercase text-outline-variant mt-1 block">RÉF: ${prod.id}</span>
                </td>
                <td class="py-3 px-2 text-center text-body-sm font-data-mono">
                    ${item.quantity}<br>
                    <span class="text-xs text-outline-variant">${this.formatPrice(item.unit_price)} HT</span>
                </td>
                <td class="py-3 pl-2 text-right text-body-sm font-data-mono font-bold text-primary">
                    ${this.formatPrice(lineTotalTTC)} TTC
                    ${item.discount_percent > 0 ? `<span class="text-xs text-primary font-bold block">-${item.discount_percent}% remisé</span>` : ''}
                </td>
            </tr>`;
        });

        html += '</tbody></table></div>';
        itemsContainer.innerHTML = html;

        const discount = Math.max(0, rawSubtotal - subtotal);
        
        checkoutSubtotal = rawSubtotal;
        checkoutTotalQty = totalQuantity;
        checkoutDiscountAmt = discount;
        const subtotalTTC = rawSubtotal * 1.20;
        const discountTTC = discount * 1.20;
        
        document.getElementById('checkout-subtotal').innerHTML = `${this.formatPrice(subtotalTTC)}`;
        document.getElementById('checkout-discount').textContent = '-' + this.formatPrice(discountTTC);
        document.getElementById('checkout-shipping').textContent = 'À calculer';
        
        updateCheckoutTotal();

        // Pre-fill user data if logged in
        if (checkoutUser) {
            if(document.getElementById('company')) document.getElementById('company').value = checkoutUser.company || '';
            if(document.getElementById('contact_name')) document.getElementById('contact_name').value = checkoutUser.contact_name || '';
            if(document.getElementById('email')) document.getElementById('email').value = checkoutUser.email || '';
            if(document.getElementById('phone')) document.getElementById('phone').value = checkoutUser.phone || '';
        }

        
        // Initialize shipping autocomplete
        const shippingAddress = document.getElementById('address');
        const autocompleteResults = document.getElementById('autocomplete-results');
        const shippingResult = document.getElementById('shipping-result');
        const shippingError = document.getElementById('shipping-error');
        const shippingCostEl = document.getElementById('checkout-shipping');
        const shippingDistanceEl = document.getElementById('shipping-distance');
        const shippingLoading = document.getElementById('shipping-loading');
                let debounceTimer;
        
        if (shippingAddress) {
            shippingAddress.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                validatedAddress = '';
                checkoutShippingCost = null;
                isShippingCalculable = false;
                shippingResult.classList.add('hidden');
                shippingError.classList.add('hidden');
                shippingCostEl.textContent = 'À calculer';
                updateCheckoutTotal();
                
                const q = e.target.value;
                if (q.length < 3) {
                    autocompleteResults.classList.add('hidden');
                    return;
                }
                
                debounceTimer = setTimeout(async () => {
                    try {
                        const res = await fetch(`./api/shipping.php?action=autocomplete&q=${encodeURIComponent(q)}`);
                        const data = await res.json();
                        if (data.items && data.items.length > 0) {
                            autocompleteResults.innerHTML = '';
                            data.items.forEach(item => {
                                const div = document.createElement('div');
                                div.className = 'p-3 hover:bg-surface-container-low cursor-pointer text-body-sm border-b border-outline/10 last:border-b-0';
                                div.textContent = item.address.label;
                                div.addEventListener('click', () => {
                                    autocompleteResults.classList.add('hidden');
                                    
                                    const street = [item.address.street || '', item.address.houseNumber || ''].join(' ').trim() || item.title || item.address.label;
                                    const zip = item.address.postalCode || '';
                                    const city = item.address.city || '';

                                    const modalHtml = `
                                        <div id="address-confirm-modal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
                                            <div class="bg-surface-container rounded-2xl shadow-xl w-full max-w-md border border-outline/20 overflow-hidden">
                                                <div class="p-6">
                                                    <h3 class="text-headline-sm font-bold text-on-surface flex items-center gap-2 mb-4">
                                                        <span class="material-symbols-outlined text-primary">location_on</span>
                                                        Confirmer l'adresse
                                                    </h3>
                                                    <div class="bg-surface p-4 rounded-xl border border-primary/20 mb-6">
                                                        <div class="mb-3">
                                                            <span class="text-label-sm uppercase text-outline-variant tracking-wider">Adresse</span>
                                                            <div class="text-body-lg font-bold text-on-surface mt-1">${street}</div>
                                                        </div>
                                                        <div class="flex gap-6">
                                                            <div>
                                                                <span class="text-label-sm uppercase text-outline-variant tracking-wider">Code Postal</span>
                                                                <div class="text-body-lg font-bold text-on-surface mt-1">${zip}</div>
                                                            </div>
                                                            <div>
                                                                <span class="text-label-sm uppercase text-outline-variant tracking-wider">Ville</span>
                                                                <div class="text-body-lg font-bold text-on-surface mt-1">${city}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="flex gap-3">
                                                        <button id="btn-modal-cancel" class="flex-1 py-3 border-2 border-outline hover:border-primary text-on-surface rounded-md font-label-md transition-colors shadow-sm">Modifier</button>
                                                        <button id="btn-modal-confirm" class="flex-1 py-3 bg-primary hover:bg-primary-container text-on-primary rounded-md font-label-md transition-colors shadow-sm">Confirmer</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    `;
                                    document.body.insertAdjacentHTML('beforeend', modalHtml);

                                    document.getElementById('btn-modal-cancel').onclick = () => {
                                        document.getElementById('address-confirm-modal').remove();
                                        shippingAddress.focus();
                                    };

                                    document.getElementById('btn-modal-confirm').onclick = async () => {
                                        document.getElementById('address-confirm-modal').remove();
                                        shippingAddress.value = item.address.label;
                                        
                                        // Read-only widget
                                        let widget = document.getElementById('address-readonly-widget');
                                        if (!widget) {
                                            widget = document.createElement('div');
                                            widget.id = 'address-readonly-widget';
                                            widget.className = 'mt-3 bg-[#802813]/10 p-4 rounded-xl border border-[#802813]/30 flex items-start gap-3';
                                            shippingAddress.parentNode.parentNode.appendChild(widget);
                                        }
                                        widget.innerHTML = `
                                            <span class="material-symbols-outlined text-[#802813]">check_circle</span>
                                            <div>
                                                <div class="text-label-md font-bold text-[#802813] mb-1">Adresse validée</div>
                                                <div class="text-body-sm text-on-surface">${street}</div>
                                                <div class="text-body-sm text-on-surface font-medium">${zip} ${city}</div>
                                            </div>
                                        `;
                                        
                                        await calculateCheckoutShipping(item.address.label);
                                    };
                                });
                                autocompleteResults.appendChild(div);
                            });
                            autocompleteResults.classList.remove('hidden');
                        }
                    } catch (err) {
                        console.error('Autocomplete error', err);
                    }
                }, 300);
            });

            document.addEventListener('click', (e) => {
                if (!shippingAddress.contains(e.target) && !autocompleteResults.contains(e.target)) {
                    autocompleteResults.classList.add('hidden');
                }
            });
        }
        
        async function calculateCheckoutShipping(address) {
            isCalculating = true;
            updateCheckoutTotal();
            shippingAddress.disabled = true;
            
            shippingResult.classList.add('hidden');
            shippingError.classList.add('hidden');
            if (shippingLoading) shippingLoading.classList.remove('hidden');
            
            try {
                const res = await fetch(`./api/shipping.php?action=calculate&address=${encodeURIComponent(address)}&quantity=${checkoutTotalQty}`);
                const data = await res.json();
                
                if (shippingLoading) shippingLoading.classList.add('hidden');
                
                if (data.calculable) {
                    shippingError.classList.add('hidden');
                    shippingResult.classList.remove('hidden');
                    
                    checkoutShippingCost = parseFloat(data.shipping_price);
                    validatedAddress = address;
                    isShippingCalculable = true;
                    
                    shippingCostEl.textContent = this.formatPrice(checkoutShippingCost);
                    shippingDistanceEl.textContent = data.distance_km + ' km';
                                    } else {
                    shippingResult.classList.add('hidden');
                    shippingError.classList.remove('hidden');
                    
                    checkoutShippingCost = 0;
                    validatedAddress = address;
                    isShippingCalculable = false;
                    
                    shippingCostEl.textContent = '-';
                    if (data.reason === 'out_of_bounds_qty') {
                        document.getElementById('shipping-error-msg').textContent = "Quantité supérieure à 24 palettes. Veuillez demander un devis.";
                    } else {
                        document.getElementById('shipping-error-msg').textContent = "Distance supérieure à 1000km. Veuillez demander un devis.";
                    }
                }
            } catch (err) {
                console.error('Shipping calc error', err);
                checkoutShippingCost = 0;
                if (shippingLoading) shippingLoading.classList.add('hidden');
            }
            
            shippingAddress.disabled = false;
            isCalculating = false;
            updateCheckoutTotal();
        }
        calculateCheckoutShipping = calculateCheckoutShipping.bind(this);
    

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
                    contact_name: document.getElementById('contact_name').value,
                    email: document.getElementById('email').value,
                    phone: document.getElementById('phone').value,
                    delivery_address: validatedAddress || document.getElementById('address').value,
                    truck_access: document.getElementById('truck_access').checked ? 1 : 0
                };

                try {
                    const res = await OrderAPI.create(data);
                    if (res.success) {
                        const pathParts = window.location.pathname.split('/');
                        const fileIdx = pathParts.findIndex(p => p.includes('.html'));
                        pathParts[fileIdx] = 'confirmation-commande.html';
                        const newUrl = pathParts.join('/') + '?ref=' + res.order_reference + '&email=' + encodeURIComponent(data.email);
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

    async addRecommended(productId) {
        const container = document.getElementById('cart-items-container');
        if (container) container.style.opacity = '0.5';
        await CartAPI.add(productId, 1);
        await this.renderCartPage();
        if (container) container.style.opacity = '1';
    },

    async updateItem(productId, qty, length = '') {
        if (qty < 1) return;
        const container = document.getElementById('cart-items-container');
        if (container) container.style.opacity = '0.5';
        await CartAPI.update(productId, qty, length);
        await this.renderCartPage();
        if (container) container.style.opacity = '1';
    },

    async removeItem(productId, length = '') {
        const container = document.getElementById('cart-items-container');
        if (container) container.style.opacity = '0.5';
        await CartAPI.remove(productId, length);
        await this.renderCartPage();
        if (container) container.style.opacity = '1';
    },

    async clearCart() {
        if (!confirm('Vider le panier ?')) return;
        const container = document.getElementById('cart-items-container');
        if (container) container.style.opacity = '0.5';
        await CartAPI.clear();
        await this.renderCartPage();
        if (container) container.style.opacity = '1';
    },
    
    renderConfirmationPage() {
        const refSpan = document.getElementById('order-reference');
        if (refSpan) {
            const urlParams = new URLSearchParams(window.location.search);
            const ref = urlParams.get('ref');
            if (ref) {
                refSpan.textContent = ref;
                
                // Auto-download PDF
                setTimeout(() => {
                    const iframe = document.createElement('iframe');
                    iframe.style.display = 'none';
                    const inSubdir = window.location.pathname.includes('/en/') || window.location.pathname.includes('/de/') || window.location.pathname.includes('/nl/');
                    const apiPath = inSubdir ? '../api/generate-order-pdf.php' : './api/generate-order-pdf.php';
                    iframe.src = `${apiPath}?ref=${encodeURIComponent(ref)}`;
                    document.body.appendChild(iframe);
                }, 1000);
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

