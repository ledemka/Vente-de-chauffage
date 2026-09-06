/**
 * lang-selector.js
 * Handles the language selector dropdown toggle behavior.
 */
(function () {
    function init() {
        const btn = document.getElementById('lang-selector-btn');
        const dropdown = document.getElementById('lang-dropdown');
        if (!btn || !dropdown) return;

        btn.addEventListener('click', function (e) {
            e.stopPropagation();
            const isOpen = !dropdown.classList.contains('hidden');
            dropdown.classList.toggle('hidden', isOpen);
            btn.setAttribute('aria-expanded', String(!isOpen));

            // Rotate chevron
            const chevron = btn.querySelector('.material-symbols-outlined');
            if (chevron) {
                chevron.style.transform = isOpen ? '' : 'rotate(180deg)';
                chevron.style.transition = 'transform 0.2s ease';
            }
        });

        // Close on outside click
        document.addEventListener('click', function () {
            dropdown.classList.add('hidden');
            btn.setAttribute('aria-expanded', 'false');
            const chevron = btn.querySelector('.material-symbols-outlined');
            if (chevron) chevron.style.transform = '';
        });

        // Prevent dropdown clicks from closing it
        dropdown.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
