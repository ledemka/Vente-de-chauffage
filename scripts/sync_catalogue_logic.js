/**
 * sync_catalogue_logic_v2.js
 * Uses regex with 's' flag and normalizes line endings to handle CRLF.
 */

const fs = require('fs');
const path = require('path');
const rootDir = path.join(__dirname, '..');

// ============================================================
// LANGUAGE-SPECIFIC TEXTS
// ============================================================
const TEXTS = {
    en: {
        banner: 'The prices displayed correspond to the <strong>50 cm</strong> format. Please select your format before choosing your wood.',
        priceNote: 'Price for 50 cm',
        formatSelectedStr: 'Format ${selectedFormat} cm selected',
        formatSelectBadge: 'Select a format ↑',
        toast: 'Please select a format before choosing your wood.',
        noResults: 'No products match these criteria.',
        currencyLabel: '€ incl. VAT',
        currencyI18n: 'catalog.table.currency',
        formatLabelI18n: 'catalog.filters.format',
        formatLabel: 'Format:',
        unitPalette: 'UNIT / PALLET',
        palletWeight: 'PALLET WEIGHT',
        priceLabel: 'WHOLESALE PRICE / PALLET',
    },
    de: {
        banner: 'Die angezeigten Preise entsprechen dem Format <strong>50 cm</strong>. Bitte wählen Sie Ihr Format, bevor Sie Ihr Holz auswählen.',
        priceNote: 'Preis für 50 cm',
        formatSelectedStr: 'Format ${selectedFormat} cm ausgewählt',
        formatSelectBadge: 'Format auswählen ↑',
        toast: 'Bitte wählen Sie ein Format, bevor Sie Ihr Holz auswählen.',
        noResults: 'Keine Produkte entsprechen diesen Kriterien.',
        currencyLabel: '€ inkl. MwSt',
        currencyI18n: 'catalog.table.currency',
        formatLabelI18n: 'catalog.filters.format',
        formatLabel: 'Format:',
        unitPalette: 'EINHEIT / PALETTE',
        palletWeight: 'PALETTENGEWICHT',
        priceLabel: 'GROSSPREIS / PALETTE',
    },
    nl: {
        banner: 'De weergegeven prijzen komen overeen met het formaat <strong>50 cm</strong>. Selecteer uw formaat voordat u uw hout kiest.',
        priceNote: 'Prijs voor 50 cm',
        formatSelectedStr: 'Formaat ${selectedFormat} cm geselecteerd',
        formatSelectBadge: 'Selecteer een formaat ↑',
        toast: 'Selecteer een formaat voordat u uw hout kiest.',
        noResults: 'Geen producten voldoen aan deze criteria.',
        currencyLabel: '€ incl. btw',
        currencyI18n: 'catalog.table.currency',
        formatLabelI18n: 'catalog.filters.format',
        formatLabel: 'Formaat:',
        unitPalette: 'EENHEID / PALLET',
        palletWeight: 'PALLETGEWICHT',
        priceLabel: 'GROOTHANDELSPRIJS / PALLET',
    }
};

function buildNewCatalogueScript(lang) {
    const tx = TEXTS[lang];

    return `<script>
                document.addEventListener('DOMContentLoaded', () => {
                    document.addEventListener('i18nLoaded', async (e) => {
                        const t = e.detail.translations;
                        const lang = e.detail.lang;
                        const relPath = lang === 'fr' ? '.' : '..';

                        try {
                        // Injected getProductName helper
                        if (typeof window.getProductName === 'undefined') {
                            window.getProductName = (p) => {
                                const l = document.documentElement.lang || 'fr';
                                return p ? (typeof p.name === 'string' ? p.name : (p.name[l] || p.name.fr)) : '';
                            };
                        }

                            const res = await fetch('../data/products.json?v=' + Date.now());
                            const allProducts = await res.json();

                            const subGroups = [
                                { id: 1, name: t.categories.logs },
                                { id: 2, name: t.categories.briquettes_compressed },
                                { id: 3, name: t.categories.briquettes },
                                { id: 4, name: t.categories.pellets },
                                { id: 5, name: t.categories.coal_starters }
                            ];

                            // DOM Elements
                            const container = document.getElementById('catalog-container');
                            const categoryInputs = document.querySelectorAll('.filter-category');
                            const humiditySlider = document.getElementById('humidity-slider');
                            const moistureSection = document.getElementById('moisture-filter-section');
                            const resetButton = document.getElementById('reset-filters');

                            // -------------------------------------------------------
                            // STATE: two separate variables for Bûches format
                            // selectedFormat = "" → no format actually chosen by user
                            // displayFormat  = "50" → used only for price display
                            // -------------------------------------------------------
                            let selectedFormat = '';   // empty = not yet chosen
                            const displayFormat = '50'; // default display price

                            // Helper: get effective price for a Bûche product
                            function getBuchePrice(p, fmt) {
                                if (p.prices_by_length && p.prices_by_length[fmt]) {
                                    return Number(p.prices_by_length[fmt]);
                                }
                                if (p.prices_by_length) {
                                    return Math.min(...Object.values(p.prices_by_length).map(Number));
                                }
                                return p.wholesale_price || 0;
                            }

                            // Handler for clicking a Bûche product card
                            window.handleBucheClick = function(productId) {
                                if (!selectedFormat) {
                                    const formatContainer = document.getElementById('buche-format-selector');
                                    if (formatContainer) {
                                        formatContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                                        formatContainer.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
                                        setTimeout(() => formatContainer.classList.remove('ring-2', 'ring-primary', 'ring-offset-2'), 2000);
                                    }
                                    showToast('${tx.toast}');
                                    return;
                                }
                                const basePath = lang === 'fr' ? './' : \`../\${lang}/\`;
                                window.location.href = \`\${basePath}produit.html?id=\${productId}&length=\${selectedFormat}\`;
                            };

                            // Simple toast notification
                            function showToast(message) {
                                let toast = document.getElementById('catalogue-toast');
                                if (!toast) {
                                    toast = document.createElement('div');
                                    toast.id = 'catalogue-toast';
                                    toast.className = 'fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-inverse-surface text-inverse-on-surface px-6 py-3 rounded-xl shadow-2xl text-body-sm font-bold flex items-center gap-3 transition-all duration-300 opacity-0 translate-y-4';
                                    toast.innerHTML = \`<span class="material-symbols-outlined text-primary" style="font-variation-settings:'FILL' 1">straighten</span><span id="catalogue-toast-msg"></span>\`;
                                    document.body.appendChild(toast);
                                }
                                document.getElementById('catalogue-toast-msg').textContent = message;
                                toast.classList.remove('opacity-0', 'translate-y-4');
                                setTimeout(() => toast.classList.add('opacity-0', 'translate-y-4'), 3000);
                            }

                            // Render catalog
                            function renderCatalog(filteredProducts) {
                                container.innerHTML = '';

                                const visibleSubGroups = subGroups.map(sg => ({
                                    ...sg,
                                    products: filteredProducts.filter(p => p.subgroup_id === sg.id)
                                })).filter(sg => sg.products.length > 0);

                                if (visibleSubGroups.length === 0) {
                                    container.innerHTML = \`<div class="text-center py-20 text-on-surface-variant font-body-lg">${tx.noResults}</div>\`;
                                    return;
                                }

                                visibleSubGroups.forEach((sg, idx) => {
                                    const isBuche = sg.id === 1;
                                    const section = document.createElement('section');
                                    section.className = 'flex flex-col gap-6';
                                    section.id = \`subgroup-\${sg.id}\`;

                                    // Build format selector HTML (only for Bûches)
                                    const formatSelectorHtml = isBuche ? \`
                                        <div id="buche-format-selector" class="flex flex-col gap-3 bg-surface-container-high rounded-xl p-5 border border-outline/20 transition-all duration-300">
                                            <div id="buche-format-banner" class="\${selectedFormat ? 'hidden' : ''} flex items-start gap-3 bg-amber-50 border border-amber-300 text-amber-900 rounded-lg px-4 py-3 text-body-sm">
                                                <span class="material-symbols-outlined text-amber-600 shrink-0" style="font-variation-settings:'FILL' 1">info</span>
                                                <span>${tx.banner}</span>
                                            </div>
                                            <div class="flex items-center gap-4 flex-wrap">
                                                <span data-i18n="${tx.formatLabelI18n}" class="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider shrink-0">${tx.formatLabel}</span>
                                                <div class="flex flex-wrap gap-2" id="buche-format-buttons">
                                                    \${['20','30','33','40','50'].map(f => \`
                                                        <button onclick="selectBucheFormat('\${f}')" id="fmt-btn-\${f}"
                                                            class="px-4 py-2 rounded-md font-data-mono text-body-sm transition-all border \${selectedFormat === f ? 'bg-primary text-on-primary border-primary font-bold' : 'bg-surface text-on-surface border-outline/40 hover:border-primary hover:text-primary'}">
                                                            \${f} cm
                                                        </button>
                                                    \`).join('')}
                                                </div>
                                                \${selectedFormat ? \`<span class="text-body-sm text-primary font-bold flex items-center gap-1"><span class="material-symbols-outlined text-[16px]" style="font-variation-settings:'FILL' 1">check_circle</span> ${tx.formatSelectedStr}</span>\` : ''}
                                            </div>
                                        </div>
                                    \` : '';

                                    section.innerHTML = \`
                                        <div class="flex items-end justify-between border-b-2 border-outline pb-4">
                                            <div class="flex flex-col gap-1">
                                                <span class="text-label-md font-label-md text-primary tracking-widest uppercase">CATÉGORIE 0\${sg.id}</span>
                                                <h2 class="text-headline-lg font-headline-lg text-on-surface">\${sg.name}</h2>
                                            </div>
                                            <span class="text-body-sm font-body-sm text-on-surface-variant">\${sg.products.length} </span>
                                        </div>
                                        \${formatSelectorHtml}
                                        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                            \${sg.products.map(p => {
                                                const showBadge = p.positioning && p.positioning !== '';
                                                const badgeHtml = showBadge ? \`
                                                    <div class="absolute top-3 left-3 bg-surface text-primary px-2 py-1 rounded text-label-md font-label-md flex items-center gap-1 shadow-sm">
                                                        <span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>
                                                        \${p.positioning.toUpperCase()}
                                                    </div>
                                                \` : '';

                                                let displayPrice = 0;
                                                let priceNote = '';

                                                if (isBuche) {
                                                    const effectiveFmt = selectedFormat || displayFormat;
                                                    displayPrice = getBuchePrice(p, effectiveFmt);
                                                    if (!selectedFormat) {
                                                        priceNote = \`<div class="text-[11px] text-amber-700 font-medium mt-0.5">${tx.priceNote}</div>\`;
                                                    }
                                                } else {
                                                    displayPrice = p.wholesale_price || 0;
                                                }

                                                const clickHandler = isBuche
                                                    ? \`handleBucheClick('\${p.id}')\`
                                                    : \`window.location.href='../\${lang}/produit.html?id=\${p.id}'\`;

                                                return \`
                                                    <article onclick="\${clickHandler}" class="bg-[#F1E4D8] rounded-lg p-6 flex flex-col gap-6 border border-outline hover:border-primary hover:border-2 transition-all cursor-pointer group \${isBuche && !selectedFormat ? 'opacity-80' : ''}">
                                                        <div class="relative w-full h-48 rounded bg-surface-container overflow-hidden">
                                                            <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="\${p.image_product}" alt="\${getProductName(p)}"/>
                                                            \${badgeHtml}
                                                            \${isBuche && !selectedFormat ? \`<div class="absolute inset-0 bg-black/10 flex items-end justify-center pb-3"><span data-i18n="catalog.filters.format_select" class="bg-amber-600 text-white text-[11px] font-bold px-3 py-1 rounded-full">${tx.formatSelectBadge}</span></div>\` : ''}
                                                        </div>
                                                        <div class="flex flex-col gap-2">
                                                            <h3 class="text-headline-md font-headline-md text-on-surface leading-tight">\${getProductName(p)}</h3>
                                                            <p class="text-body-sm font-body-sm text-on-surface-variant">\${p.species_material}</p>
                                                        </div>
                                                        <div class="flex flex-col gap-2 mt-auto">
                                                            <div class="flex justify-between py-2 border-b border-outline/50">
                                                                <span data-i18n="catalog.table.format" class="text-label-md font-label-md text-on-surface-variant">FORMAT</span>
                                                                <span class="text-data-mono font-data-mono text-on-surface">\${isBuche ? (selectedFormat ? selectedFormat + ' cm' : '50 cm*') : p.format}</span>
                                                            </div>
                                                            <div class="flex justify-between py-2 border-b border-outline/50">
                                                                <span data-i18n="catalog.table.unit_pallet" class="text-label-md font-label-md text-on-surface-variant">${tx.unitPalette}</span>
                                                                <span class="text-data-mono font-data-mono text-on-surface">\${p.units_per_palette} unités/palette</span>
                                                            </div>
                                                            <div class="flex justify-between py-2 border-b border-outline/50">
                                                                <span data-i18n="catalog.table.weight" class="text-label-md font-label-md text-on-surface-variant">${tx.palletWeight}</span>
                                                                <span class="text-data-mono font-data-mono text-on-surface">\${p.palette_weight}</span>
                                                            </div>
                                                        </div>
                                                        <div class="flex items-end justify-between mt-2">
                                                            <div class="flex flex-col">
                                                                <span data-i18n="catalog.table.price" class="text-label-md font-label-md text-on-surface-variant">${tx.priceLabel}</span>
                                                                <div class="flex items-baseline gap-1">
                                                                    <span class="text-headline-lg font-headline-lg text-primary">\${(displayPrice * 1.2).toFixed(2)}</span>
                                                                    <span data-i18n="${tx.currencyI18n}" class="text-body-md font-body-md text-primary">${tx.currencyLabel}</span>
                                                                </div>
                                                                \${priceNote}
                                                            </div>
                                                            <button class="w-12 h-12 \${isBuche && !selectedFormat ? 'bg-outline/40 cursor-not-allowed' : 'bg-primary hover:bg-primary/90'} text-on-primary rounded flex items-center justify-center transition-colors">
                                                                <span class="material-symbols-outlined">add_shopping_cart</span>
                                                            </button>
                                                        </div>
                                                    </article>
                                                \`;
                                            }).join('')}
                                        </div>
                                    \`;

                                    container.appendChild(section);

                                    if (idx < visibleSubGroups.length - 1) {
                                        const divider = document.createElement('div');
                                        divider.className = 'w-full h-px bg-outline/30 relative flex justify-center my-12';
                                        divider.innerHTML = \`<div class="absolute -top-3 bg-background px-4 text-outline text-label-md font-label-md tracking-widest uppercase">\${t.nav.catalog} B2B</div>\`;
                                        container.appendChild(divider);
                                    }
                                });
                            }

                            // Handle format selection for Bûches
                            window.selectBucheFormat = function(fmt) {
                                if (selectedFormat === fmt) {
                                    selectedFormat = '';
                                } else {
                                    selectedFormat = fmt;
                                }
                                applyFilters();
                            };

                            // Filter logic
                            function applyFilters() {
                                const checkedBoxes = Array.from(categoryInputs).filter(input => input.checked);
                                const selectedSubgroupIds = checkedBoxes.map(input => parseInt(input.dataset.subgroup));

                                const isBucheVisible = selectedSubgroupIds.length === 0 || selectedSubgroupIds.includes(1);
                                if (isBucheVisible) {
                                    moistureSection.classList.remove('hidden');
                                } else {
                                    moistureSection.classList.add('hidden');
                                }

                                const filtered = allProducts.filter(p => {
                                    if (selectedSubgroupIds.length > 0 && !selectedSubgroupIds.includes(p.subgroup_id)) {
                                        return false;
                                    }
                                    if (p.subgroup_id === 1 && p.humidity_bucket) {
                                        const hVal = parseInt(humiditySlider.value);
                                        if (hVal === 1 && p.humidity_bucket !== '<20%') return false;
                                        if (hVal === 2 && p.humidity_bucket !== '20-25%') return false;
                                        if (hVal === 3 && p.humidity_bucket !== 'non spécifié') return false;
                                    }
                                    return true;
                                });

                                renderCatalog(filtered);
                            }

                            // Event Listeners
                            categoryInputs.forEach(input => {
                                input.addEventListener('change', applyFilters);
                            });

                            humiditySlider.addEventListener('input', applyFilters);

                            resetButton.addEventListener('click', () => {
                                categoryInputs.forEach(input => input.checked = false);
                                selectedFormat = '';
                                humiditySlider.value = 0;
                                applyFilters();
                            });

                            // Initial load — check URL param
                            const subgroupParam = new URLSearchParams(window.location.search).get('subgroup');
                            if (subgroupParam && parseInt(subgroupParam) >= 1 && parseInt(subgroupParam) <= 5) {
                                const targetCheckbox = document.querySelector(\`.filter-category[data-subgroup="\${parseInt(subgroupParam)}"]\`);
                                if (targetCheckbox) {
                                    targetCheckbox.checked = true;
                                }
                            }
                            applyFilters();

                        } catch (err) {
                            console.error('Error loading catalogue products:', err);
                        }
                    });
                });
            </script>`;
}

// ============================================================
// MAIN PROCESSING
// ============================================================
const langs = ['en', 'de', 'nl'];

langs.forEach(lang => {
    const filePath = path.join(rootDir, lang, 'catalogue.html');
    if (!fs.existsSync(filePath)) {
        console.error(`[SKIP] Not found: ${filePath}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    // Normalize to LF for regex matching
    const originalEnding = content.includes('\r\n') ? '\r\n' : '\n';
    content = content.replace(/\r\n/g, '\n');

    // 1. Remove old sidebar Format Filter section entirely
    // Pattern: the <div> block starting with <!-- Format Filter --> up to its closing </div></div>
    content = content.replace(
        /\s*<!-- Format Filter -->\n\s*<div class="flex flex-col gap-3">[\s\S]*?<\/div>\n\s*<\/div>\s*(?=\s*<!-- Moisture Filter)/,
        '\n            '
    );

    // Alternative simpler pattern
    content = content.replace(
        /\n\s*<!-- Format Filter -->\s*\n\s*<div class="flex flex-col gap-3">\s*\n[\s\S]*?<\/div>\s*\n\s*<\/div>/,
        ''
    );

    // 2. Replace the entire catalogue script block
    // Strategy: find <script> that contains "selectedFormats" and replace it completely
    // The script block starts after the i18n-loader.js script tag
    const scriptStartMarker = '<script src="../assets/js/i18n-loader.js"></script>';
    const mobileMenuScriptStart = '<script>\n            document.addEventListener(\'DOMContentLoaded\', () => {\n                const btn';
    const catalogueScriptStart = '\n\n            <script>\n                document.addEventListener(\'DOMContentLoaded\', () => {\n                    document.addEventListener(\'i18nLoaded\'';
    const userMenuScript = '\n<script src="../assets/js/user-menu.js"></script>';

    // Find index of the catalogue script (the one with i18nLoaded)
    const i18nScriptIdx = content.indexOf("document.addEventListener('i18nLoaded'");
    if (i18nScriptIdx === -1) {
        console.error(`[ERROR] ${lang}: Cannot find i18nLoaded listener`);
        return;
    }

    // Find the <script> opening tag before i18nLoaded
    const scriptOpenIdx = content.lastIndexOf('<script>', i18nScriptIdx);
    if (scriptOpenIdx === -1) {
        console.error(`[ERROR] ${lang}: Cannot find <script> before i18nLoaded`);
        return;
    }

    // Find the closing </script> tag after i18nLoaded
    const scriptCloseIdx = content.indexOf('</script>', i18nScriptIdx);
    if (scriptCloseIdx === -1) {
        console.error(`[ERROR] ${lang}: Cannot find </script> after i18nLoaded`);
        return;
    }

    const before = content.substring(0, scriptOpenIdx);
    const after = content.substring(scriptCloseIdx + '</script>'.length);

    const newScript = buildNewCatalogueScript(lang);
    content = before + newScript + after;

    // Restore original line endings if needed
    if (originalEnding === '\r\n') {
        content = content.replace(/\n/g, '\r\n');
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`[DONE] ${lang}/catalogue.html — new logic injected (${content.length} bytes)`);

    // Verify key markers
    const verify = [
        'selectedFormat',
        'displayFormat',
        'getBuchePrice',
        'handleBucheClick',
        'prices_by_length',
        'buche-format-selector',
    ];
    const missing = verify.filter(m => !content.includes(m));
    if (missing.length > 0) {
        console.error(`  [WARN] Missing markers: ${missing.join(', ')}`);
    } else {
        console.log(`  [OK] All 6 key markers present`);
    }

    // Verify old markers are gone
    const banned = ['selectedFormats', 'selectedFormats.push', 'selectedFormats.filter'];
    const found = banned.filter(m => content.includes(m));
    if (found.length > 0) {
        console.error(`  [WARN] Old logic still present: ${found.join(', ')}`);
    } else {
        console.log(`  [OK] Old selectedFormats[] logic removed`);
    }
});

console.log('\nDone. Check above for any warnings, then run: node scripts/generate-dist.js');
