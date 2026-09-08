/**
 * User Menu — Dynamic header person icon
 * Depends on auth.js (AuthAPI must be loaded first).
 * 
 * When logged in: shows firstname + dropdown (dashboard / logout)
 * When logged out: simple link to connexion.html
 */

(function() {
    function init() {
        const container = document.getElementById('user-menu-container');
        if (!container) return;

        const user = window.AuthAPI ? window.AuthAPI.getUser() : null;

        // Detect relative path for links
        const inSubdir = /^\/(en|de|nl)\//.test(window.location.pathname);
        const base = inSubdir ? '../' : './';

        if (!user) {
            // NOT LOGGED IN — static link to connexion
            container.innerHTML = `
                <a href="${base}connexion.html" class="flex items-center" id="user-menu-login-link">
                    <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:opacity-80 transition-opacity">
                        <span class="material-symbols-outlined text-on-primary text-[18px]">person</span>
                    </div>
                </a>`;
            return;
        }

        // LOGGED IN — show firstname + dropdown
        const firstName = (user.contact_name || '').split(' ')[0] || 'Mon compte';

        container.innerHTML = `
            <div class="relative flex items-center" id="user-menu-wrapper">
                <button id="user-menu-toggle" class="flex items-center gap-2 cursor-pointer group" aria-haspopup="true" aria-expanded="false">
                    <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center group-hover:opacity-80 transition-opacity">
                        <span class="material-symbols-outlined text-on-primary text-[18px]">person</span>
                    </div>
                    <span class="text-inverse-on-surface text-label-md font-label-md hidden sm:inline">${firstName}</span>
                    <span class="material-symbols-outlined text-inverse-on-surface text-[18px] hidden sm:inline">expand_more</span>
                </button>

                <!-- Dropdown menu -->
                <div id="user-dropdown" class="hidden absolute right-0 top-full mt-2 w-52 bg-surface-container-lowest shadow-md rounded-md overflow-hidden z-[100] border border-outline/10">
                    <a href="${base}tableau-de-bord.html" class="flex items-center gap-3 px-4 py-3 text-body-sm text-on-surface hover:bg-surface-container transition-colors" id="user-menu-dashboard">
                        <span class="material-symbols-outlined text-[18px] text-primary">dashboard</span>
                        <span>Mon tableau de bord</span>
                    </a>
                    <div class="border-t border-outline/10"></div>
                    <button onclick="handleUserLogout('${base}')" class="w-full flex items-center gap-3 px-4 py-3 text-body-sm text-on-surface hover:bg-surface-container transition-colors" id="user-menu-logout">
                        <span class="material-symbols-outlined text-[18px] text-error">logout</span>
                        <span>Déconnexion</span>
                    </button>
                </div>
            </div>`;

        const toggle = document.getElementById('user-menu-toggle');
        const dropdown = document.getElementById('user-dropdown');

        // Toggle on click (works on both desktop and mobile)
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = !dropdown.classList.contains('hidden');
            dropdown.classList.toggle('hidden', isOpen);
            toggle.setAttribute('aria-expanded', String(!isOpen));
        });

        // Close on outside click
        document.addEventListener('click', () => {
            dropdown.classList.add('hidden');
            toggle.setAttribute('aria-expanded', 'false');
        });
    }

    // Logout handler — global so inline onclick can call it
    window.handleUserLogout = async function(base) {
        if (window.AuthAPI) {
            await window.AuthAPI.logout();
        } else {
            localStorage.removeItem('user');
        }
        window.location.href = (base || './') + 'index.html';
    };

    // Run after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
