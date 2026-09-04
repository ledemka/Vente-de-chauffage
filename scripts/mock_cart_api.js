const fs = require('fs');
const path = require('path');

const cartJsPath = path.join(__dirname, '..', 'assets', 'js', 'cart.js');

let content = fs.readFileSync(cartJsPath, 'utf8');

const newCartAPI = `const CartAPI = {
    _getCart() {
        try {
            return JSON.parse(localStorage.getItem('mock_cart')) || [];
        } catch(e) {
            return [];
        }
    },
    _saveCart(cart) {
        localStorage.setItem('mock_cart', JSON.stringify(cart));
    },
    async request(action, data = {}) {
        await new Promise(r => setTimeout(r, 200));
        let cart = this._getCart();

        if (action === 'get') {
            return { items: cart };
        }
        if (action === 'add') {
            const existing = cart.find(i => i.product_id === data.product_id);
            if (existing) {
                existing.quantity += parseInt(data.quantity);
            } else {
                cart.push({ product_id: data.product_id, quantity: parseInt(data.quantity) });
            }
            this._saveCart(cart);
            return { success: true, items: cart };
        }
        if (action === 'update') {
            const existing = cart.find(i => i.product_id === data.product_id);
            if (existing) {
                existing.quantity = parseInt(data.quantity);
            }
            this._saveCart(cart);
            return { success: true, items: cart };
        }
        if (action === 'remove') {
            cart = cart.filter(i => i.product_id !== data.product_id);
            this._saveCart(cart);
            return { success: true, items: cart };
        }
        
        return { success: false, error: 'Unknown action' };
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
};`;

content = content.replace(/const CartAPI = \{[\s\S]*?async get\(\) \{\s*return this\.request\('get'\);\s*\}\s*\};/m, newCartAPI);

fs.writeFileSync(cartJsPath, content, 'utf8');
console.log('CartAPI mocked with localStorage');
