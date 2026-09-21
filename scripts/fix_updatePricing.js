const fs = require('fs');
const path = require('path');
const rootDir = path.join(__dirname, '..');

const replaceLogic = (content) => {
    // 1. Replace currentLength init
    content = content.replace(
        /let currentLength = '';[\s\S]*?if \(product\.prices_by_length\) \{/g,
        `let selectedLength = lengthFromUrl || '';
                                const defaultDisplayLength = '50';

                                if (product.prices_by_length) {`
    );

    // 2. Replace currentLength usage in btn.onclick
    content = content.replace(
        /currentLength = lengthFromUrl \|\| '';\s*\/\/\s*displayLength is used for initial price display \(50 if nothing selected\)\s*const defaultDisplayLength = '50';/g,
        ``
    );

    content = content.replace(
        /const isActive = l === currentLength;/g,
        `const isActive = l === selectedLength;`
    );

    content = content.replace(
        /currentLength = l;/g,
        `selectedLength = l;`
    );
    
    // 3. Replace the block that sets currentLength to defaultDisplayLength when empty
    const warningBlock = `// Disable Commander button
                                        const cmdBtn = document.getElementById('btn-commander');
                                        if (cmdBtn) {
                                            cmdBtn.disabled = true;
                                            cmdBtn.classList.add('opacity-50', 'cursor-not-allowed');
                                        }
                                        // Use displayLength for initial price preview
                                        currentLength = defaultDisplayLength;`;
    
    const newWarningBlock = `// Disable Commander button
                                        const cmdBtn = document.getElementById('btn-commander');
                                        if (cmdBtn) {
                                            cmdBtn.disabled = true;
                                            cmdBtn.classList.add('opacity-50', 'cursor-not-allowed');
                                        }`;
    
    content = content.replace(warningBlock, newWarningBlock);

    // 4. Update the updatePricing function completely
    const oldUpdatePricingStart = `function updatePricing() {`;
    const oldUpdatePricingEnd = `// Make currentLength available globally for handleCommanderClick
                                    window.currentProductLength = currentLength;
                                }`;
    
    const startIdx = content.indexOf(oldUpdatePricingStart);
    const endIdx = content.indexOf(oldUpdatePricingEnd) + oldUpdatePricingEnd.length;
    
    if (startIdx !== -1 && endIdx !== -1) {
        const newUpdatePricing = `function updatePricing() {
                                    let qty = parseInt(qtyInput ? qtyInput.value : 1) || 1;
                                    if (qty < 1) { qty = 1; if (qtyInput) qtyInput.value = 1; }
                                    
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
                                        if (qty < 2) {
                                            tier = 1; discountPercentage = 0; palettesNeededForNextTier = 2 - qty; nextTierPercentage = 4;
                                        } else if (qty >= 2 && qty <= 4) {
                                            tier = 2; discountPercentage = 4; palettesNeededForNextTier = 5 - qty; nextTierPercentage = 6;
                                        } else if (qty >= 5 && qty <= 9) {
                                            tier = 3; discountPercentage = 6; palettesNeededForNextTier = 10 - qty; nextTierPercentage = 8;
                                        } else if (qty >= 10 && qty <= 19) {
                                            tier = 4; discountPercentage = 8; palettesNeededForNextTier = 20 - qty; nextTierPercentage = 10;
                                        } else {
                                            tier = 5; discountPercentage = 10; palettesNeededForNextTier = 0; nextTierPercentage = 10;
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

                                    if (discountRow && discountAmtEl && discountBadge) {
                                        if (discountPercentage > 0) {
                                            discountRow.classList.remove('hidden');
                                            discountAmtEl.textContent = '-' + formatCurrency(basePrice * qty * (discountPercentage / 100) * 1.20);
                                            discountBadge.classList.remove('hidden');
                                        } else {
                                            discountRow.classList.add('hidden');
                                            discountBadge.classList.add('hidden');
                                        }
                                    }

                                    if (hasVolumeDiscount) {
                                        let tierName = "Standard";
                                        let progress = 5;
                                        if (tier === 2) { tierName = "Pro Initial"; progress = 25; }
                                        else if (tier === 3) { tierName = "Revendeur"; progress = 50; }
                                        else if (tier === 4) { tierName = "Volume Pro"; progress = 75; }
                                        else if (tier === 5) { tierName = pr.full_truckload || "Camion Complet"; progress = 100; }

                                        if (tierStatusEl) tierStatusEl.textContent = \`\${pr.tier_level} \${tierName}\`;
                                        if (discountPctEl) discountPctEl.textContent = \`-\${discountPercentage}%\`;
                                        if (progressBar) progressBar.style.width = \`\${progress}%\`;

                                        if (nextTierMsg) {
                                            if (palettesNeededForNextTier > 0) {
                                                let msg = pr.next_tier_incentive || "Ajoutez {count} palette(s) pour -{pct}%";
                                                msg = msg.replace('{count}', palettesNeededForNextTier).replace('{pct}', nextTierPercentage);
                                                nextTierMsg.innerHTML = msg;
                                                nextTierMsg.classList.remove('hidden');
                                            } else {
                                                nextTierMsg.innerHTML = \`<span class="text-primary font-bold">Remise maximale atteinte !</span>\`;
                                            }
                                        }
                                    }
                                    
                                    // Make selectedLength available globally for handleCommanderClick
                                    window.currentProductLength = selectedLength;
                                }`;
        content = content.substring(0, startIdx) + newUpdatePricing + content.substring(endIdx);
    } else {
        console.error("Could not find updatePricing block to replace.");
    }

    // 5. Update Commander logic
    const oldCommanderLogic = `if (isBuche && !window._userSelectedLength) {`;
    const newCommanderLogic = `if (isBuche && !selectedLength) {`;
    content = content.replace(oldCommanderLogic, newCommanderLogic);

    const oldCartAPIAdd = `CartAPI.add(product.id, qty, currentLength).then(res => {`;
    const newCartAPIAdd = `CartAPI.add(product.id, qty, selectedLength).then(res => {`;
    content = content.replace(oldCartAPIAdd, newCartAPIAdd);

    return content;
};

const dirs = ['.', 'en', 'de', 'nl'];

dirs.forEach(d => {
    const file = path.join(rootDir, d, 'produit.html');
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        const updated = replaceLogic(content);
        if (content !== updated) {
            fs.writeFileSync(file, updated, 'utf8');
            console.log(`[OK] Updated ${file}`);
        } else {
            console.log(`[WARN] No changes made to ${file} - regex may have failed.`);
        }
    }
});
