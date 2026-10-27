const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

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

console.log(`Processing ${allFiles.length} product files...`);

allFiles.forEach(filePath => {
    const relPath = path.relative(rootDir, filePath);
    let lang = 'fr';
    if (relPath.startsWith('en' + path.sep)) lang = 'en';
    else if (relPath.startsWith('de' + path.sep)) lang = 'de';
    else if (relPath.startsWith('nl' + path.sep)) lang = 'nl';

    let minusTitle = 'Quantit&eacute; minimale : 5 palettes';
    let minNotice = 'Commande minimum : 5 palettes. Il n&rsquo;est pas possible de commander moins de 5 palettes.';
    let minWarning = 'Quantit&eacute; minimale autoris&eacute;e : 5 palettes.';
    let minusTitleJs = 'Quantit\\u00e9 minimale : 5 palettes';
    let commanderMinAlert = 'Commande non autoris\\u00e9e. Commande minimum : 5 palettes.';

    if (lang === 'en') {
        minusTitle = 'Minimum quantity: 5 pallets';
        minNotice = 'Minimum order: 5 pallets. It is not possible to order fewer than 5 pallets.';
        minWarning = 'Minimum authorized quantity: 5 pallets.';
        minusTitleJs = 'Minimum quantity: 5 pallets';
        commanderMinAlert = 'Unauthorized order. Minimum order: 5 pallets.';
    } else if (lang === 'de') {
        minusTitle = 'Mindestbestellmenge: 5 Paletten';
        minNotice = 'Mindestbestellmenge: 5 Paletten. Es ist nicht m&ouml;glich, weniger als 5 Paletten zu bestellen.';
        minWarning = 'Mindestbestellmenge erlaubt: 5 Paletten.';
        minusTitleJs = 'Mindestbestellmenge: 5 Paletten';
        commanderMinAlert = 'Nicht autorisierte Bestellung. Mindestbestellmenge: 5 Paletten.';
    } else if (lang === 'nl') {
        minusTitle = 'Minimale bestelling: 5 pallets';
        minNotice = 'Minimale bestelling: 5 pallets. Het is niet mogelijk om minder dan 5 pallets te bestellen.';
        minWarning = 'Minimaal toegestane hoeveelheid: 5 pallets.';
        minusTitleJs = 'Minimale bestelling: 5 pallets';
        commanderMinAlert = 'Niet-geautoriseerde bestelling. Minimale bestelling: 5 pallets.';
    }

    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Ensure recap-info-banner exists before Total Calculation
    if (!content.includes('id="recap-info-banner"')) {
        content = content.replace('<!-- Total Calculation -->', '<div id="recap-info-banner" class="hidden rounded-lg p-3 text-body-sm font-semibold flex items-center gap-2 mb-1"></div>\n<!-- Total Calculation -->');
    }

    // 2. Quantity selector HTML
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
    } else {
        console.warn(`Selector regex failed on ${relPath}`);
    }

    // 3. Clean any existing helper functions before updatePricing
    content = content.replace(/(?:\s*let\s+minQtyAlertTimeout[\s\S]*?function\s+updateMinusButtonState\([^\)]*\)\s*\{[\s\S]*?\}\s*)+/g, '\n                                ');

    // 4. Replace from "function updatePricing()" up to "window.handleCommanderClick = (btn) => {"
    const commercialSectionRegex = /function\s+updatePricing\(\)\s*\{[\s\S]*?(?=window\.handleCommanderClick\s*=\s*\(btn\)\s*=>\s*\{)/;

    const newCommercialJs = `function updatePricing() {
                                    let qty = parseInt(qtyInput ? qtyInput.value : 5, 10);
                                    if (isNaN(qty) || qty < 5) {
                                        qty = 5;
                                    }
                                    updateMinusButtonState(qty);
                                    
                                    let basePrice = product.wholesale_price || 0;
                                    let hasVolumeDiscount = true; // Toujours vrai car les remises sont globales

                                    if (product.prices_by_length) {
                                        const priceLength = selectedLength || defaultDisplayLength;
                                        basePrice = product.prices_by_length[priceLength];
                                        const specLong = document.getElementById('spec-longueur');
                                        if (specLong) {
                                            specLong.textContent = priceLength + ' cm';
                                        }
                                    }
                                    
                                    let tier = 1;
                                    let discountPercentage = 0;
                                    let palettesNeededForNextTier = 0;
                                    let nextTierPercentage = 0;

                                    if (hasVolumeDiscount) {
                                        if (qty < 5) {
                                            tier = 0; discountPercentage = 0; palettesNeededForNextTier = 5 - qty; nextTierPercentage = 0;
                                        } else if (qty === 5) {
                                            tier = 1; discountPercentage = 0; palettesNeededForNextTier = 1; nextTierPercentage = 4;
                                        } else if (qty >= 6 && qty <= 10) {
                                            tier = 2; discountPercentage = 4; palettesNeededForNextTier = 11 - qty; nextTierPercentage = 6;
                                        } else if (qty >= 11 && qty <= 15) {
                                            tier = 3; discountPercentage = 6; palettesNeededForNextTier = 16 - qty; nextTierPercentage = 8;
                                        } else if (qty >= 16 && qty <= 19) {
                                            tier = 4; discountPercentage = 8; palettesNeededForNextTier = 20 - qty; nextTierPercentage = 10;
                                        } else if (qty >= 20 && qty <= 24) {
                                            tier = 5; discountPercentage = 10; palettesNeededForNextTier = 0; nextTierPercentage = 10;
                                        } else {
                                            tier = 6; discountPercentage = 10; palettesNeededForNextTier = 0; nextTierPercentage = 10;
                                        }
                                    }
                                    
                                    const discountProgressUi = document.getElementById('discount-progress-ui');
                                    if (discountProgressUi) {
                                        discountProgressUi.style.display = hasVolumeDiscount ? 'block' : 'none';
                                    }

                                    const discountedUnitPrice = basePrice * (1 - discountPercentage / 100);
                                    const totalPrice = discountedUnitPrice * qty;
                                    
                                    const subtotalTtc = (basePrice * qty) * 1.20;
                                    const totalTtc = totalPrice * 1.20;
                                    const taxAmt = totalTtc - totalPrice;
                                    
                                    const unitPriceTtcEl = document.getElementById('unit-price-ttc');
                                    if (unitPriceTtcEl) unitPriceTtcEl.textContent = formatCurrency(discountedUnitPrice * 1.20);
                                    if (unitPriceEl) unitPriceEl.textContent = formatCurrency(discountedUnitPrice);

                                    if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotalTtc);
                                    if (totalEl) totalEl.textContent = formatCurrency(totalTtc);
                                    
                                    const taxEl = document.getElementById('tax-amt');
                                    const totalHtEl = document.getElementById('total-ht');
                                    if (taxEl) taxEl.textContent = formatCurrency(taxAmt);
                                    if (totalHtEl) totalHtEl.textContent = formatCurrency(totalPrice);

                                    if (discountRow && discountAmtEl) {
                                        if (discountPercentage > 0) {
                                            discountRow.classList.remove('hidden');
                                            discountAmtEl.textContent = '-' + formatCurrency(basePrice * qty * (discountPercentage / 100) * 1.20);
                                            const discountPctBadge = document.getElementById('discount-pct-badge');
                                            if (discountPctBadge) discountPctBadge.textContent = '-' + discountPercentage + '%';
                                            if (discountBadge) discountBadge.classList.remove('hidden');
                                        } else {
                                            discountRow.classList.add('hidden');
                                            if (discountBadge) discountBadge.classList.add('hidden');
                                        }
                                    }

                                    if (hasVolumeDiscount) {
                                        let tierName = "Standard (5 pal.)";
                                        let progress = 20;
                                        if (qty < 5) {
                                            tierName = "Commande non autoris\\u00e9e";
                                            progress = Math.max(5, (qty / 5) * 20);
                                        } else if (tier === 1) {
                                            tierName = "Standard (5 pal.)";
                                            progress = 20;
                                        } else if (tier === 2) {
                                            tierName = "Palier 1 (-4%)";
                                            progress = 40;
                                        } else if (tier === 3) {
                                            tierName = "Palier 2 (-6%)";
                                            progress = 60;
                                        } else if (tier === 4) {
                                            tierName = "Palier 3 (-8%)";
                                            progress = 80;
                                        } else if (tier === 5) {
                                            tierName = qty === 24 ? (pr.full_truckload || "Camion Complet (-10%)") : "Palier 4 (-10%)";
                                            progress = 100;
                                        } else {
                                            tierName = "Sur devis";
                                            progress = 100;
                                        }

                                        if (tierStatusEl) tierStatusEl.textContent = \`\${pr.tier_level || 'Palier :'} \${tierName}\`;
                                        if (discountPctEl) discountPctEl.textContent = \`-\${discountPercentage}%\`;
                                        if (progressBar) progressBar.style.width = \`\${progress}%\`;

                                        if (nextTierMsg) {
                                            if (qty < 5) {
                                                nextTierMsg.innerHTML = \`<span class="text-error font-bold flex items-center justify-center gap-1"><span class="material-symbols-outlined text-[16px]">warning</span> Commande minimum : 5 palettes</span>\`;
                                                nextTierMsg.classList.remove('hidden');
                                            } else if (qty > 24) {
                                                nextTierMsg.innerHTML = \`<span class="text-primary font-bold flex items-center justify-center gap-1"><span class="material-symbols-outlined text-[16px]">info</span> Pour toute commande sup\\u00e9rieure \\u00e0 24 palettes, demandez un devis personnalis\\u00e9</span>\`;
                                                nextTierMsg.classList.remove('hidden');
                                            } else if (qty === 24) {
                                                nextTierMsg.innerHTML = \`<span class="text-emerald-700 font-bold flex items-center justify-center gap-1"><span class="material-symbols-outlined text-[16px]">local_shipping</span> Camion complet : 24 palettes. Vous b\\u00e9n\\u00e9ficiez de 10 % de remise !</span>\`;
                                                nextTierMsg.classList.remove('hidden');
                                            } else if (qty >= 20 && qty < 24) {
                                                nextTierMsg.innerHTML = \`<span class="text-primary font-bold">Remise de 10% appliqu\\u00e9e !</span> <span class="text-xs text-on-surface-variant block mt-0.5">Plus que \${24 - qty} palette(s) pour un <strong>camion complet (24 palettes)</strong></span>\`;
                                                nextTierMsg.classList.remove('hidden');
                                            } else if (palettesNeededForNextTier > 0) {
                                                let msg = pr.next_tier_incentive || "Ajoutez {count} palette(s) pour -{pct}%";
                                                msg = msg.replace('{count}', palettesNeededForNextTier).replace('{pct}', nextTierPercentage);
                                                nextTierMsg.innerHTML = msg;
                                                nextTierMsg.classList.remove('hidden');
                                            }
                                        }

                                        // Recap Information Banner
                                        const recapInfoBanner = document.getElementById('recap-info-banner');
                                        if (recapInfoBanner) {
                                            if (qty < 5) {
                                                recapInfoBanner.className = 'bg-amber-50 border border-amber-300 text-amber-900 rounded-lg p-3 text-body-sm font-semibold flex items-center gap-2 mb-1';
                                                recapInfoBanner.innerHTML = \`<span class="material-symbols-outlined text-amber-600 shrink-0">warning</span><span>Commande minimum : 5 palettes</span>\`;
                                                recapInfoBanner.classList.remove('hidden');
                                            } else if (qty === 24) {
                                                recapInfoBanner.className = 'bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-lg p-3 text-body-sm font-semibold flex items-center gap-2 mb-1';
                                                recapInfoBanner.innerHTML = \`<span class="material-symbols-outlined text-emerald-600 shrink-0">local_shipping</span><span>Camion complet : 24 palettes. Vous b\\u00e9n\\u00e9ficiez de 10 % de remise !</span>\`;
                                                recapInfoBanner.classList.remove('hidden');
                                            } else if (qty > 24) {
                                                recapInfoBanner.className = 'bg-amber-50 border border-amber-300 text-amber-900 rounded-lg p-3 text-body-sm font-semibold flex items-center gap-2 mb-1';
                                                recapInfoBanner.innerHTML = \`<span class="material-symbols-outlined text-amber-600 shrink-0">info</span><span>Pour toute commande sup\\u00e9rieure \\u00e0 24 palettes, demandez un devis personnalis\\u00e9</span>\`;
                                                recapInfoBanner.classList.remove('hidden');
                                            } else {
                                                recapInfoBanner.classList.add('hidden');
                                            }
                                        }

                                        // Button state management
                                        const cmdBtn = document.getElementById('btn-commander');
                                        const btnDevis = document.getElementById('btn-devis');
                                        if (qty < 5) {
                                            if (cmdBtn) {
                                                cmdBtn.disabled = true;
                                                cmdBtn.classList.add('opacity-50', 'cursor-not-allowed');
                                            }
                                            if (btnDevis) {
                                                btnDevis.className = "w-full bg-transparent border-2 border-outline hover:border-primary text-on-surface font-label-md text-label-md uppercase tracking-wider py-3.5 rounded-md transition-colors flex items-center justify-center gap-2";
                                            }
                                        } else if (qty > 24) {
                                            if (cmdBtn) {
                                                cmdBtn.disabled = true;
                                                cmdBtn.classList.add('opacity-50', 'cursor-not-allowed');
                                            }
                                            if (btnDevis) {
                                                btnDevis.className = "w-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md uppercase tracking-wider py-4 rounded-md transition-colors flex items-center justify-center gap-2 shadow-md ring-2 ring-primary ring-offset-2 font-bold";
                                            }
                                        } else {
                                            if (cmdBtn) {
                                                if (typeof isBuche === 'undefined' || !isBuche || selectedLength) {
                                                    cmdBtn.disabled = false;
                                                    cmdBtn.classList.remove('opacity-50', 'cursor-not-allowed');
                                                }
                                            }
                                            if (btnDevis) {
                                                btnDevis.className = "w-full bg-transparent border-2 border-outline hover:border-primary text-on-surface font-label-md text-label-md uppercase tracking-wider py-3.5 rounded-md transition-colors flex items-center justify-center gap-2";
                                            }
                                        }
                                    }
                                    
                                    // Make selectedLength available globally for handleCommanderClick
                                    window.currentProductLength = selectedLength;
                                }

                                btnDecrease.addEventListener('click', () => {
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

                                const btnDevis = document.getElementById('btn-devis');
                                if (btnDevis) {
                                    btnDevis.addEventListener('click', () => {
                                        let url = window.resolveDataPath('devis.html') + '?product=' + product.id;
                                        if (selectedLength) {
                                            url += '&length=' + selectedLength;
                                        }
                                        url += '&qty=' + (parseInt(qtyInput.value, 10) || 5);
                                        window.location.href = url;
                                    });
                                }

                                `;

    const helpersDef = `let minQtyAlertTimeout = null;
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

                                `;

    if (commercialSectionRegex.test(content)) {
        content = content.replace(commercialSectionRegex, helpersDef + newCommercialJs);
    } else {
        console.warn(`Commercial JS regex failed on ${relPath}`);
    }

    // 5. Update handleCommanderClick: inject min qty guard at beginning
    const commanderHeaderRegex = /window\.handleCommanderClick\s*=\s*\(btn\)\s*=>\s*\{(?:\s*let\s+qty\s*=\s*parseInt[\s\S]*?alert\([^\)]+\);\s*return;\s*\}[\s\S]*?return;\s*\})?/;
    const newCommanderHeader = `window.handleCommanderClick = (btn) => {
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
                                    }`;

    if (commanderHeaderRegex.test(content)) {
        content = content.replace(commanderHeaderRegex, newCommanderHeader);
    } else {
        console.warn(`Commander header regex failed on ${relPath}`);
    }

    // 6. Ensure CartAPI.add uses qty and doesn't redefine "const qty = ..." right before it
    content = content.replace(/const\s+qty\s*=\s*parseInt\(qtyInput\.value\)\s*\|\|\s*[0-9]+;\s*(\r?\n\s*CartAPI\.add)/g, '$1');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`OK: ${relPath}`);
});

console.log('All files processed.');
