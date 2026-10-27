const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'produit.html');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Safe pr definition
content = content.replace(
    'const pr = t.pricing;',
    'const pr = (t && t.pricing) ? t.pricing : {};'
);

// 2. Safe pStrings in updatePricing
const oldBlock = `if (hasVolumeDiscount) {
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
                                        }`;

const newBlock = `if (hasVolumeDiscount) {
                                        const pStrings = (typeof pr !== 'undefined' && pr) ? pr : ((typeof t !== 'undefined' && t && t.pricing) ? t.pricing : (window.i18n && window.i18n.data && window.i18n.data.pricing ? window.i18n.data.pricing : {}));
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
                                            tierName = qty === 24 ? (pStrings.full_truckload || "Camion Complet (-10%)") : "Palier 4 (-10%)";
                                            progress = 100;
                                        } else {
                                            tierName = "Sur devis";
                                            progress = 100;
                                        }

                                        if (tierStatusEl) tierStatusEl.textContent = \`\${pStrings.tier_level || 'Palier :'} \${tierName}\`;
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
                                                let msg = pStrings.next_tier_incentive || "Ajoutez {count} palette(s) pour -{pct}%";
                                                msg = msg.replace('{count}', palettesNeededForNextTier).replace('{pct}', nextTierPercentage);
                                                nextTierMsg.innerHTML = msg;
                                                nextTierMsg.classList.remove('hidden');
                                            }
                                        }`;

content = content.replace(oldBlock, newBlock);

fs.writeFileSync(filePath, content, 'utf8');
console.log('produit.html updated with safe pStrings.');
