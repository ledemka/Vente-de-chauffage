const fs = require('fs');
const path = require('path');

const cartJsPath = path.join(__dirname, '..', 'assets', 'js', 'cart.js');

let content = fs.readFileSync(cartJsPath, 'utf8');

const uiLogic = `

// --- UI Rendering Logic ---

const CartUI = {
    products: null,
    
    async loadProducts() {
        if (!this.products) {
            try {
                // In production, might be at the root or relative
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
        return parseFloat(price).toFixed(2) + '€';
    },
    
    // Calculates total discount based on volume tiers from pricing-engine
    calculateDiscount(totalQuantity, subtotal) {
        let pct = 0;
        if (totalQuantity >= 20) pct = 0.10;
        else if (totalQuantity >= 10) pct = 0.08;
        else if (totalQuantity >= 5) pct = 0.05;
        else if (totalQuantity >= 2) pct = 0.02;
        
        return subtotal * pct;
    },

    async renderCartPage() {
        const container = document.getElementById('cart-items-container');
        if (!container) return;

        await this.loadProducts();
        const res = await CartAPI.get();
        const items = res.items || [];

        if (items.length === 0) {
            container.innerHTML = '<p data-i18n="cart.empty" class="text-body-md text-on-surface-variant">Votre panier est vide</p>';
            if(window.i18n) window.i18n.translateDOM(container);
            document.getElementById('cart-subtotal').textContent = '0.00€';
            document.getElementById('cart-discount').textContent = '-0.00€';
            document.getElementById('cart-total').textContent = '0.00€';
            return;
        }

        let html = '<div class="overflow-x-auto"><table class="w-full text-left border-collapse">';
        html += '<thead><tr class="border-b border-outline/20">';
        html += '<th class="py-3 pr-4 text-label-md font-label-md uppercase text-on-surface-variant w-1/2">Produit</th>';
        html += '<th class="py-3 px-4 text-label-md font-label-md uppercase text-on-surface-variant text-center">Quantité (Palettes)</th>';
        html += '<th class="py-3 px-4 text-label-md font-label-md uppercase text-on-surface-variant text-right">Prix Unitaire</th>';
        html += '<th class="py-3 pl-4 text-label-md font-label-md uppercase text-on-surface-variant text-right">Total HT</th>';
        html += '<th class="py-3 pl-4 w-10"></th>';
        html += '</tr></thead><tbody>';

        let subtotal = 0;
        let totalQuantity = 0;

        items.forEach(item => {
            const prod = this.getProduct(item.product_id);
            if (!prod) return;
            
            const lineTotal = prod.wholesale_price * item.quantity;
            subtotal += lineTotal;
            totalQuantity += item.quantity;

            html += \`<tr class="border-b border-outline/20">
                <td class="py-4 pr-4">
                    <div class="flex items-center gap-4">
                        <img src="\${prod.image_product}" class="w-16 h-16 object-cover rounded-md border border-outline/20 shadow-sm" alt="">
                        <div class="flex flex-col">
                            <span class="font-bold text-on-surface">\${prod.name}</span>
                            <span class="text-label-md uppercase text-outline-variant mt-1">\${prod.format} | \${prod.palette_weight}</span>
                        </div>
                    </div>
                </td>
                <td class="py-4 px-4 text-center">
                    <div class="inline-flex items-center border border-outline-variant rounded-md overflow-hidden bg-surface-container-highest shadow-sm">
                        <button onclick="CartUI.updateItem('\${item.product_id}', \${item.quantity - 1})" class="w-10 h-10 flex items-center justify-center hover:bg-surface-dim transition-colors border-r border-outline-variant">
                            <span class="material-symbols-outlined text-[20px]">remove</span>
                        </button>
                        <input type="number" min="1" value="\${item.quantity}" readonly class="w-14 h-10 text-center bg-transparent focus:outline-none font-data-mono font-bold text-on-surface">
                        <button onclick="CartUI.updateItem('\${item.product_id}', \${item.quantity + 1})" class="w-10 h-10 flex items-center justify-center hover:bg-surface-dim transition-colors border-l border-outline-variant">
                            <span class="material-symbols-outlined text-[20px]">add</span>
                        </button>
                    </div>
                </td>
                <td class="py-4 px-4 text-right font-data-mono text-on-surface-variant">
                    \${this.formatPrice(prod.wholesale_price)}
                </td>
                <td class="py-4 pl-4 text-right font-data-mono font-bold text-primary">
                    \${this.formatPrice(lineTotal)}
                </td>
                <td class="py-4 pl-4 text-right">
                    <button onclick="CartUI.removeItem('\${item.product_id}')" class="text-error hover:text-on-error-container p-2 rounded-full hover:bg-error-container transition-colors" title="Supprimer">
                        <span class="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                </td>
            </tr>\`;
        });

        html += '</tbody></table></div>';
        container.innerHTML = html;

        const discount = this.calculateDiscount(totalQuantity, subtotal);
        const total = subtotal - discount;

        document.getElementById('cart-subtotal').textContent = this.formatPrice(subtotal);
        document.getElementById('cart-discount').textContent = '-' + this.formatPrice(discount);
        document.getElementById('cart-total').textContent = this.formatPrice(total);
        
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

            html += \`<tr class="border-b border-outline/20">
                <td class="py-3 pr-2 text-body-sm">
                    <span class="font-bold text-on-surface block">\${prod.name}</span>
                    <span class="text-label-md uppercase text-outline-variant mt-1 block">\${prod.format}</span>
                </td>
                <td class="py-3 px-2 text-center text-body-sm font-data-mono">\${item.quantity}</td>
                <td class="py-3 pl-2 text-right text-body-sm font-data-mono font-bold text-primary">\${this.formatPrice(lineTotal)}</td>
            </tr>\`;
        });

        html += '</tbody></table></div>';
        itemsContainer.innerHTML = html;

        const discount = this.calculateDiscount(totalQuantity, subtotal);
        const total = subtotal - discount;

        document.getElementById('checkout-subtotal').textContent = this.formatPrice(subtotal);
        document.getElementById('checkout-discount').textContent = '-' + this.formatPrice(discount);
        document.getElementById('checkout-total').textContent = this.formatPrice(total);

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
`;

if (!content.includes('CartUI')) {
    fs.writeFileSync(cartJsPath, content + uiLogic, 'utf8');
    console.log('Appended CartUI logic to cart.js');
} else {
    console.log('CartUI logic already present in cart.js');
}
