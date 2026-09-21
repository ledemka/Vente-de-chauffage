const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');

const replaceLogic = (content) => {
    // Replace the currentLength init block
    content = content.replace(
        /let\s+currentLength\s*=\s*'';\s*if\s*\(product\.prices_by_length\)\s*\{/g,
        `let selectedLength = lengthFromUrl || '';
                                const defaultDisplayLength = '50';

                                if (product.prices_by_length) {`
    );

    // Remove the defaultDisplayLength assignment
    content = content.replace(
        /currentLength\s*=\s*lengthFromUrl\s*\|\|\s*'';\s*\/\/\s*displayLength is used for initial price display \(50 if nothing selected\)\s*const defaultDisplayLength = '50';/g,
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

    // Replace warning block setting currentLength
    content = content.replace(
        /\/\/\s*Use displayLength for initial price preview\s*currentLength\s*=\s*defaultDisplayLength;/g,
        ``
    );

    // Now, replace the entire updatePricing function accurately using a RegExp
    const updatePricingRegex = /function\s+updatePricing\(\)\s*\{[\s\S]*?\/\/\s*Make\s+currentLength\s+available\s+globally\s+for\s+handleCommanderClick\s*window\.currentProductLength\s*=\s*currentLength;\s*\}/g;
    
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
    
    if (updatePricingRegex.test(content)) {
        content = content.replace(updatePricingRegex, newUpdatePricing);
    } else {
        console.error("Could not find updatePricing block to replace using regex!");
    }

    // Replace Commander Logic
    content = content.replace(/if\s*\(isBuche\s*&&\s*!window\._userSelectedLength\)/g, `if (isBuche && !selectedLength)`);
    content = content.replace(/CartAPI\.add\(product\.id,\s*qty,\s*currentLength\)/g, `CartAPI.add(product.id, qty, selectedLength)`);

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
