/**
 * Vente de Bois de Chauffage B2B - Main JavaScript
 * Handles navbar interactions, mobile menu drawer, and language switcher.
 */

document.addEventListener('DOMContentLoaded', () => {
    console.log('BOIS DE CHAUFFAGE PRO B2B - Initialisé');

    // Mobile Menu Drawer Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuDrawer = document.getElementById('mobile-menu-drawer');
    const mobileMenuClose = document.getElementById('mobile-menu-close');

    if (mobileMenuBtn && mobileMenuDrawer) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuDrawer.classList.remove('hidden');
        });
    }

    if (mobileMenuClose && mobileMenuDrawer) {
        mobileMenuClose.addEventListener('click', () => {
            mobileMenuDrawer.classList.add('hidden');
        });
    }

    // Language Switcher Dropdown
    const langBtn = document.getElementById('lang-switcher-btn');
    const langMenu = document.getElementById('lang-switcher-menu');

    if (langBtn && langMenu) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', () => {
            if (!langMenu.classList.contains('hidden')) {
                langMenu.classList.add('hidden');
            }
        });
    }
});
