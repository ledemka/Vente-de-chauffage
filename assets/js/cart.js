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
