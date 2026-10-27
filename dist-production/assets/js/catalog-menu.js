/**
 * catalog-menu.js
 * Handles interactive dropdown on hover & touch for "CATALOGUE" navigation item,
 * seamless category filtering without page reloads when on catalogue.html,
 * and mobile drawer category accordion.
 */
(function () {
    function initCatalogMenu() {
        const wrappers = document.querySelectorAll('#nav-catalog-wrapper');
        
        wrappers.forEach(wrapper => {
            const link = wrapper.querySelector('#nav-catalog-link') || wrapper.querySelector('a');
            const dropdown = wrapper.querySelector('#nav-catalog-dropdown');
            const chevron = wrapper.querySelector('#nav-catalog-chevron');

            // Force parent navigation container to never clip dropdown on desktop
            const navParent = wrapper.closest('nav');
            if (navParent) {
                navParent.style.overflow = 'visible';
                const innerNav = wrapper.parentElement;
                if (innerNav) {
                    innerNav.style.overflow = 'visible';
                }
            }

            if (!dropdown) return;

            let closeTimer = null;

            function showMenu() {
                if (closeTimer) {
                    clearTimeout(closeTimer);
                    closeTimer = null;
                }
                dropdown.style.display = 'block';
                // Trigger reflow for smooth CSS transition
                void dropdown.offsetHeight;
                dropdown.style.opacity = '1';
                dropdown.style.visibility = 'visible';
                dropdown.style.pointerEvents = 'auto';
                dropdown.style.transform = 'translateY(0)';
                dropdown.classList.remove('hidden', 'opacity-0', 'invisible', 'pointer-events-none', '-translate-y-1');
                dropdown.classList.add('opacity-100', 'visible', 'pointer-events-auto', 'translate-y-0', 'is-open');
                wrapper.classList.add('is-open');
                if (chevron) {
                    chevron.style.transform = 'rotate(180deg)';
                    chevron.style.transition = 'transform 0.25s ease';
                }
            }

            function hideMenu(immediate) {
                if (closeTimer) {
                    clearTimeout(closeTimer);
                    closeTimer = null;
                }
                const executeClose = () => {
                    dropdown.style.opacity = '0';
                    dropdown.style.visibility = 'hidden';
                    dropdown.style.pointerEvents = 'none';
                    dropdown.style.transform = 'translateY(-4px)';
                    dropdown.classList.remove('opacity-100', 'visible', 'pointer-events-auto', 'translate-y-0', 'is-open');
                    dropdown.classList.add('opacity-0', 'invisible', 'pointer-events-none', '-translate-y-1');
                    wrapper.classList.remove('is-open');
                    if (chevron) chevron.style.transform = '';
                    setTimeout(() => {
                        if (!wrapper.classList.contains('is-open')) {
                            dropdown.style.display = '';
                        }
                    }, 200);
                };

                if (immediate) {
                    executeClose();
                } else {
                    closeTimer = setTimeout(executeClose, 180);
                }
            }

            // Desktop hover events (mouseenter, mouseleave, pointerenter, pointerleave)
            wrapper.addEventListener('mouseenter', showMenu);
            wrapper.addEventListener('mouseleave', () => hideMenu(false));

            wrapper.addEventListener('pointerenter', (e) => {
                if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
                    showMenu();
                }
            });

            wrapper.addEventListener('pointerleave', (e) => {
                if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
                    hideMenu(false);
                }
            });

            // Touch screen support: first tap on touch device opens menu if closed
            if (link) {
                link.addEventListener('click', function (e) {
                    const isTouch = window.matchMedia('(hover: none)').matches;
                    const isClosed = !wrapper.classList.contains('is-open') && 
                                     (dropdown.classList.contains('invisible') || dropdown.style.visibility === 'hidden' || dropdown.classList.contains('hidden'));
                    if (isTouch && isClosed) {
                        e.preventDefault();
                        e.stopPropagation();
                        showMenu();
                    }
                });
            }

            // Close on click outside
            document.addEventListener('click', function (e) {
                if (!wrapper.contains(e.target)) {
                    hideMenu(true);
                }
            });

            // Category link clicks
            dropdown.querySelectorAll('[data-catalog-subgroup]').forEach(item => {
                item.addEventListener('click', function (e) {
                    const subgroupId = this.getAttribute('data-catalog-subgroup');
                    hideMenu(true);

                    // Check if already on catalogue page
                    const path = window.location.pathname;
                    const isCatalog = path.endsWith('catalogue.html') || path.endsWith('catalogue') || (path.includes('catalogue') && !path.includes('produit'));
                    if (isCatalog && typeof window.applyCategoryFilter === 'function') {
                        e.preventDefault();
                        window.applyCategoryFilter(subgroupId);
                    }
                });
            });
        });

        // Mobile drawer accordion
        const mobileToggle = document.getElementById('mobile-catalog-expand-btn');
        const mobileSubmenu = document.getElementById('mobile-catalog-subcategories');
        const mobileChevron = document.getElementById('mobile-catalog-chevron');

        if (mobileToggle && mobileSubmenu) {
            mobileToggle.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const isHidden = mobileSubmenu.classList.contains('hidden');
                mobileSubmenu.classList.toggle('hidden', !isHidden);
                mobileToggle.setAttribute('aria-expanded', String(isHidden));
                if (mobileChevron) {
                    mobileChevron.style.transform = isHidden ? 'rotate(180deg)' : '';
                    mobileChevron.style.transition = 'transform 0.25s ease';
                }
            });

            mobileSubmenu.querySelectorAll('[data-catalog-subgroup]').forEach(item => {
                item.addEventListener('click', function (e) {
                    const drawer = document.getElementById('mobile-menu-drawer');
                    if (drawer) drawer.classList.add('hidden');

                    const subgroupId = this.getAttribute('data-catalog-subgroup');
                    const path = window.location.pathname;
                    const isCatalog = path.endsWith('catalogue.html') || path.endsWith('catalogue') || (path.includes('catalogue') && !path.includes('produit'));
                    if (isCatalog && typeof window.applyCategoryFilter === 'function') {
                        e.preventDefault();
                        window.applyCategoryFilter(subgroupId);
                    }
                });
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCatalogMenu);
    } else {
        initCatalogMenu();
    }
})();
