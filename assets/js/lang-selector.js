/**
 * lang-selector.js
 * Handles the language selector dropdown toggle behavior.
 */
(function () {
    function init() {
        const btn = document.getElementById('lang-selector-btn');
        const dropdown = document.getElementById('lang-dropdown');
        if (!btn || !dropdown) return;

        // Update active language UI
        const lang = document.documentElement.lang || 'fr';
        const langNames = { 'fr': 'Français', 'en': 'English', 'de': 'Deutsch', 'nl': 'Nederlands' };
        
        // Find the matching link in the dropdown
        const links = dropdown.querySelectorAll('a');
        let activeLink = null;
        links.forEach(link => {
            const span = link.querySelector('span');
            if (span && span.textContent.trim() === langNames[lang]) {
                activeLink = link;
                
                // Add the checkmark if it doesn't have it
                if (!link.querySelector('.material-symbols-outlined')) {
                    const check = document.createElement('span');
                    check.className = 'material-symbols-outlined text-[14px] ml-auto';
                    check.textContent = 'check';
                    link.appendChild(check);
                    
                    // Add active styling
                    link.classList.remove('text-on-surface', 'hover:bg-surface-container');
                    link.classList.add('bg-surface-container-high', 'text-primary', 'font-semibold');
                }
            } else {
                // Remove checkmark from others if they have it
                const check = link.querySelector('.material-symbols-outlined');
                if (check) check.remove();
                
                // Remove active styling
                link.classList.add('text-on-surface', 'hover:bg-surface-container');
                link.classList.remove('bg-surface-container-high', 'text-primary', 'font-semibold');
            }
        });
        
        // Update the button UI
        if (activeLink) {
            const svg = activeLink.querySelector('svg');
            if (svg) {
                const btnSvg = btn.querySelector('svg');
                if (btnSvg) btn.replaceChild(svg.cloneNode(true), btnSvg);
            }
            
            // Text is inside a span with font-label-md
            const textSpan = btn.querySelector('span.font-label-md');
            if (textSpan) {
                textSpan.textContent = lang.toUpperCase();
            }
        }
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
