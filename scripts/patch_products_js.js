const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// Find all product files
const allFiles = [];

if (fs.existsSync(path.join(rootDir, 'produit.html'))) {
    allFiles.push(path.join(rootDir, 'produit.html'));
}
const rootProduits = path.join(rootDir, 'produits');
if (fs.existsSync(rootProduits)) {
    fs.readdirSync(rootProduits).filter(f => f.endsWith('.html')).forEach(f => {
        allFiles.push(path.join(rootProduits, f));
    });
}

['en', 'de', 'nl'].forEach(lang => {
    const langProd = path.join(rootDir, lang, 'produit.html');
    if (fs.existsSync(langProd)) allFiles.push(langProd);
    const langProduits = path.join(rootDir, lang, 'produits');
    if (fs.existsSync(langProduits)) {
        fs.readdirSync(langProduits).filter(f => f.endsWith('.html')).forEach(f => {
            allFiles.push(path.join(langProduits, f));
        });
    }
});

console.log(`Found ${allFiles.length} product files to process.`);

allFiles.forEach(filePath => {
    const relPath = path.relative(rootDir, filePath);
    let lang = 'fr';
    if (relPath.startsWith('en' + path.sep)) lang = 'en';
    else if (relPath.startsWith('de' + path.sep)) lang = 'de';
    else if (relPath.startsWith('nl' + path.sep)) lang = 'nl';

    let minusTitle = 'Quantit&eacute; minimale : 5 palettes';
    let minNotice = 'Commande minimum : 5 palettes. Il n&rsquo;est pas possible de commander moins de 5 palettes.';
    let minWarning = 'Quantit&eacute; minimale autoris&eacute;e : 5 palettes.';
    let commanderMinAlert = 'Commande non autoris\\u00e9e. Commande minimum : 5 palettes.';
    let minusTitleJs = 'Quantit\\u00e9 minimale : 5 palettes';

    if (lang === 'en') {
        minusTitle = 'Minimum quantity: 5 pallets';
        minNotice = 'Minimum order: 5 pallets. It is not possible to order fewer than 5 pallets.';
        minWarning = 'Minimum authorized quantity: 5 pallets.';
        commanderMinAlert = 'Unauthorized order. Minimum order: 5 pallets.';
        minusTitleJs = 'Minimum quantity: 5 pallets';
    } else if (lang === 'de') {
        minusTitle = 'Mindestbestellmenge: 5 Paletten';
        minNotice = 'Mindestbestellmenge: 5 Paletten. Es ist nicht m&ouml;glich, weniger als 5 Paletten zu bestellen.';
        minWarning = 'Mindestbestellmenge erlaubt: 5 Paletten.';
        commanderMinAlert = 'Nicht autorisierte Bestellung. Mindestbestellmenge: 5 Paletten.';
        minusTitleJs = 'Mindestbestellmenge: 5 Paletten';
    } else if (lang === 'nl') {
        minusTitle = 'Minimale bestelling: 5 pallets';
        minNotice = 'Minimale bestelling: 5 pallets. Het is niet mogelijk om minder dan 5 pallets te bestellen.';
        minWarning = 'Minimaal toegestane hoeveelheid: 5 pallets.';
        commanderMinAlert = 'Niet-geautoriseerde bestelling. Minimale bestelling: 5 pallets.';
        minusTitleJs = 'Minimale bestelling: 5 pallets';
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Quantity selector HTML
    const selectorRegex = /<div class="flex items-center gap-4 bg-surface rounded-lg p-2 border border-outline\/30 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">[\s\S]*?<button[^>]*?id="btn-decrease"[^>]*>[\s\S]*?<input[^>]*?id="qty-input"[^>]*>[\s\S]*?<button[^>]*?id="btn-increase"[^>]*>[\s\S]*?<\/div>(?:[\s\r\n]*<!-- Minimum Order Permanent Notice -->[\s\S]*?<\/div>[\s\r\n]*<!-- Temporary \/ Persistent Alert[\s\S]*?<\/div>)?/;
    const newSelectorHtml = `<div class="flex items-center gap-4 bg-surface rounded-lg p-2 border border-outline/30 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
<button class="w-12 h-12 rounded bg-surface-container flex items-center justify-center hover:bg-outline-variant/30 text-on-surface transition-colors disabled:opacity-40 disabled:cursor-not-allowed opacity-40 cursor-not-allowed" id="btn-decrease" type="button" disabled title="${minusTitle}">
<span class="material-symbols-outlined">remove</span>
</button>
<input class="flex-1 w-full min-w-0 bg-transparent text-center text-headline-lg font-data-mono text-on-surface focus:outline-none" id="qty-input" min="5" type="number" value="5">
<button class="w-12 h-12 rounded bg-surface-container flex items-center justify-center hover:bg-outline-variant/30 text-on-surface transition-colors" id="btn-increase" type="button">
<span class="material-symbols-outlined">add</span>
</button>
</div>
<!-- Minimum Order Permanent Notice -->
<div id="min-qty-permanent-notice" class="flex items-center gap-2 px-3.5 py-2.5 bg-surface-container-low border border-outline/30 rounded-lg text-body-sm text-on-surface-variant font-medium">
<span class="material-symbols-outlined text-[18px] text-primary shrink-0">info</span>
<span data-i18n="product.min_order_notice">${minNotice}</span>
</div>
<!-- Temporary / Persistent Alert when trying to decrease under 5 -->
<div id="min-qty-alert" class="hidden flex items-center gap-2 px-3.5 py-2.5 bg-amber-50 border border-amber-300 text-amber-900 rounded-lg text-body-sm font-semibold transition-all">
<span class="material-symbols-outlined text-[20px] text-amber-600 shrink-0">warning</span>
<span data-i18n="product.min_qty_warning">${minWarning}</span>
</div>`;

    if (selectorRegex.test(content)) {
        content = content.replace(selectorRegex, newSelectorHtml);
    }

    // 2. Remove any previous helper declarations
    content = content.replace(/(?:\s*let\s+minQtyAlertTimeout[\s\S]*?function\s+updateMinusButtonState\([^\)]*\)\s*\{[\s\S]*?\}\s*)+/g, '\n                                ');

    // 3. Helper functions and start of updatePricing
    const helpersAndStart = `\n                                let minQtyAlertTimeout = null;
                                function showMinQtyAlert() {
                                    const alertEl = document.getElementById('min-qty-alert');
                                    if (alertEl) {
                                        alertEl.classList.remove('hidden');
                                        if (minQtyAlertTimeout) clearTimeout(minQtyAlertTimeout);
                                        minQtyAlertTimeout = setTimeout(() => {
                                            alertEl.classList.add('hidden');
                                        }, 4000);
                                    }
                                }
                                function hideMinQtyAlert() {
                                    const alertEl = document.getElementById('min-qty-alert');
                                    if (alertEl) {
                                        alertEl.classList.add('hidden');
                                        if (minQtyAlertTimeout) clearTimeout(minQtyAlertTimeout);
                                    }
                                }
                                function updateMinusButtonState(qty) {
                                    if (!btnDecrease) return;
                                    if (qty <= 5) {
                                        btnDecrease.disabled = true;
                                        btnDecrease.classList.add('opacity-40', 'cursor-not-allowed');
                                        btnDecrease.setAttribute('title', '${minusTitleJs}');
                                    } else {
                                        btnDecrease.disabled = false;
                                        btnDecrease.classList.remove('opacity-40', 'cursor-not-allowed');
                                        btnDecrease.removeAttribute('title');
                                    }
                                }

                                function updatePricing() {
                                    let qty = parseInt(qtyInput ? qtyInput.value : 5, 10);
                                    if (isNaN(qty) || qty < 5) {
                                        qty = 5;
                                    }
                                    updateMinusButtonState(qty);
                                    
                                    `;

    const updatePricingRegex = /function\s+updatePricing\(\)\s*\{[\s\S]*?(?=let\s+basePrice)/;
    if (updatePricingRegex.test(content)) {
        content = content.replace(updatePricingRegex, helpersAndStart);
    } else {
        console.warn(`Could not match updatePricing in ${relPath}`);
    }

    // 4. Buttons and input listeners
    const listenersRegex = /btnDecrease\.addEventListener\('click'[\s\S]*?updatePricing\(\);(?:\r?\n\s*const\s+btnDevis|\r?\n\s*window\.handleCommanderClick)/;
    const newListenersCode = `btnDecrease.addEventListener('click', () => {
                                    let currentQty = parseInt(qtyInput.value, 10) || 5;
                                    if (currentQty <= 5) {
                                        qtyInput.value = 5;
                                        updateMinusButtonState(5);
                                        showMinQtyAlert();
                                        updatePricing();
                                    } else {
                                        qtyInput.value = currentQty - 1;
                                        updateMinusButtonState(currentQty - 1);
                                        hideMinQtyAlert();
                                        updatePricing();
                                    }
                                });

                                btnIncrease.addEventListener('click', () => {
                                    let currentQty = parseInt(qtyInput.value, 10) || 5;
                                    if (currentQty < 5) currentQty = 5;
                                    qtyInput.value = currentQty + 1;
                                    updateMinusButtonState(currentQty + 1);
                                    hideMinQtyAlert();
                                    updatePricing();
                                });

                                qtyInput.addEventListener('input', () => {
                                    let val = parseInt(qtyInput.value, 10);
                                    if (!isNaN(val) && val < 5) {
                                        showMinQtyAlert();
                                        updateMinusButtonState(5);
                                    } else if (!isNaN(val)) {
                                        hideMinQtyAlert();
                                        updateMinusButtonState(val);
                                    }
                                    updatePricing();
                                });

                                qtyInput.addEventListener('change', () => {
                                    let val = parseInt(qtyInput.value, 10);
                                    if (isNaN(val) || val < 5) {
                                        qtyInput.value = 5;
                                        showMinQtyAlert();
                                        updateMinusButtonState(5);
                                    } else {
                                        updateMinusButtonState(val);
                                    }
                                    updatePricing();
                                });

                                qtyInput.addEventListener('blur', () => {
                                    let val = parseInt(qtyInput.value, 10);
                                    if (isNaN(val) || val < 5) {
                                        qtyInput.value = 5;
                                        showMinQtyAlert();
                                        updateMinusButtonState(5);
                                    } else {
                                        updateMinusButtonState(val);
                                    }
                                    updatePricing();
                                });

                                updatePricing();

                                const btnDevis`;

    if (listenersRegex.test(content)) {
        content = content.replace(listenersRegex, newListenersCode);
    } else {
        const listenersRegex2 = /btnDecrease\.addEventListener\('click'[\s\S]*?updatePricing\(\);[\s\r\n]*window\.handleCommanderClick/;
        const newListenersCode2 = newListenersCode.replace('const btnDevis', 'window.handleCommanderClick');
        if (listenersRegex2.test(content)) {
            content = content.replace(listenersRegex2, newListenersCode2);
        } else {
            console.warn(`Could not match button listeners in ${relPath}`);
        }
    }

    // 5. btnDevis fallback quantity
    content = content.replace(/url\s*\+=\s*'&qty='\s*\+\s*\(parseInt\(qtyInput\.value(?:,\s*10)?\)\s*\|\|\s*1\);/g, "url += '&qty=' + (parseInt(qtyInput.value, 10) || 5);");

    // 6. handleCommanderClick guard
    const commanderGuardRegex = /window\.handleCommanderClick\s*=\s*\(btn\)\s*=>\s*\{[\s\S]*?(?=\/\/\s*Guard:\s*B|if\s*\(isBuche\s*&&)/;
    const newCommanderGuard = `window.handleCommanderClick = (btn) => {
                                    let qty = parseInt(qtyInput.value, 10) || 5;
                                    if (qty < 5) {
                                        qtyInput.value = 5;
                                        updatePricing();
                                        showMinQtyAlert();
                                        alert('${commanderMinAlert}');
                                        return;
                                    }
                                    if (qty > 24) {
                                        alert('Pour toute commande sup\\u00e9rieure \\u00e0 24 palettes, demandez un devis personnalis\\u00e9.');
                                        window.location.href = window.resolveDataPath('devis.html') + '?product=' + product.id + '&qty=' + qty;
                                        return;
                                    }
                                    `;
    if (commanderGuardRegex.test(content)) {
        content = content.replace(commanderGuardRegex, newCommanderGuard);
    }

    // Remove duplicate "const qty = parseInt(qtyInput.value) || 1;" right before CartAPI.add
    content = content.replace(/const\s+qty\s*=\s*parseInt\(qtyInput\.value\)\s*\|\|\s*[0-9]+;\s*(\r?\n\s*CartAPI\.add)/g, '$1');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Patched: ${relPath}`);
});

console.log('All files processed successfully.');
