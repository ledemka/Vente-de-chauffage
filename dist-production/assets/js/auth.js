/**
 * AuthAPI — B2B Authentication
 * Shared across all pages of the site.
 */

const AuthAPI = {
    _apiPath: null,

    /**
     * Resolve the correct API path relative to the current page depth.
     * Pages in subdirs (en/, de/, nl/) need '../api/auth.php'.
     */
    _getApiPath() {
        if (this._apiPath) return this._apiPath;
        // Detect if we are in a language subdir
        const path = window.location.pathname;
        const inSubdir = /^\/(en|de|nl)\//.test(path);
        this._apiPath = inSubdir ? '../api/auth.php' : '/api/auth.php';
        return this._apiPath;
    },

    async request(action, data = {}) {
        data.action = action;
        const formData = new URLSearchParams();
        for (const key in data) {
            formData.append(key, data[key]);
        }

        const res = await fetch(this._getApiPath(), {
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
            // Sync cart if session token exists
            const token = localStorage.getItem('cart_session_token');
            if (token) {
                const inSubdir = /^\/(en|de|nl)\//.test(window.location.pathname);
                const cartPath = inSubdir ? '../api/cart.php' : '/api/cart.php';
                await fetch(cartPath, {
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
            const token = localStorage.getItem('cart_session_token');
            if (token) {
                const inSubdir = /^\/(en|de|nl)\//.test(window.location.pathname);
                const cartPath = inSubdir ? '../api/cart.php' : '/api/cart.php';
                await fetch(cartPath, {
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

window.AuthAPI = AuthAPI;
