const fs = require('fs');

// 1. Update recapitulatif-commande.html across all languages
const htmlFiles = [
    'recapitulatif-commande.html',
    'en/recapitulatif-commande.html',
    'de/recapitulatif-commande.html',
    'nl/recapitulatif-commande.html'
];

const addressUIPattern = /<div class="flex flex-col gap-2">\s*<label for="address".*?<\/label>\s*<input type="text" id="address".*?<\/div>/s;
const zipCityPattern = /<div class="grid grid-cols-1 md:grid-cols-2 gap-5">\s*<div class="flex flex-col gap-2">\s*<label for="zip_code".*?<\/div>\s*<div class="flex flex-col gap-2">\s*<label for="city".*?<\/div>\s*<\/div>/s;

const newAddressUI = `
                        <div class="flex flex-col gap-2 relative">
                            <label for="address" class="text-label-md font-label-md text-on-surface uppercase" data-i18n="checkout.address">Adresse de livraison *</label>
                            <input type="text" id="address" required autocomplete="off" placeholder="Saisissez votre adresse..." class="w-full bg-surface-container-highest border border-outline-variant rounded-md py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                            <div id="autocomplete-results" class="absolute top-full left-0 right-0 bg-surface border border-outline/30 rounded-lg shadow-lg z-50 hidden max-h-60 overflow-y-auto mt-1"></div>
                        </div>
                        
                        <div id="shipping-result" class="hidden flex flex-col gap-2 bg-surface p-4 rounded-lg border border-primary/20">
                            <div class="flex justify-between items-center text-body-sm text-on-surface-variant">
                                <span id="shipping-depot">Expédié depuis...</span>
                                <span class="font-data-mono" id="shipping-distance"></span>
                            </div>
                        </div>
                        <div id="shipping-error" class="hidden bg-error-container text-on-error-container p-4 rounded-lg text-body-sm flex flex-col gap-2">
                            <span class="font-bold flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">warning</span> Hors limite</span>
                            <span id="shipping-error-msg">Veuillez effectuer une demande de devis sur mesure.</span>
                            <a href="./devis.html" class="underline font-bold mt-1">Faire une demande de devis</a>
                        </div>
`;

htmlFiles.forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');
    
    // Replace address field and add new elements
    if (content.match(addressUIPattern) && !content.includes('id="shipping-result"')) {
        content = content.replace(addressUIPattern, newAddressUI);
    }
    
    // Remove zip code and city
    if (content.match(zipCityPattern)) {
        content = content.replace(zipCityPattern, '');
    }

    // Add Shipping row to totals block
    if (content.includes('id="checkout-discount"') && !content.includes('id="checkout-shipping"')) {
        content = content.replace(
            /(<div class="flex justify-between items-center text-body-sm text-primary">[\s\S]*?id="checkout-discount"[\s\S]*?<\/div>)/,
            `$1\n                            <div class="flex justify-between items-center text-body-sm text-on-surface-variant" id="checkout-shipping-row">\n                                <span>Frais de livraison HT</span>\n                                <span class="font-data-mono" id="checkout-shipping">À calculer</span>\n                            </div>`
        );
    }

    fs.writeFileSync(f, content);
    console.log('Updated ' + f);
});

// 2. Update assets/js/cart.js
let cartJs = fs.readFileSync('assets/js/cart.js', 'utf8');

// Insert new shipping state into renderCheckoutPage
if (!cartJs.includes('let checkoutShippingCost = null;')) {
    const stateVars = `
        let checkoutShippingCost = null;
        let validatedAddress = '';
        let isShippingCalculable = false;
        let checkoutTotalQty = 0;
        let checkoutSubtotal = 0;
        let checkoutDiscountAmt = 0;
        let isCalculating = false;
        
        function updateCheckoutTotal() {
            const totalHT = checkoutSubtotal - checkoutDiscountAmt + (checkoutShippingCost || 0);
            document.getElementById('checkout-total').textContent = this.formatPrice(totalHT);
            
            const btn = document.getElementById('submit-order-btn');
            if (btn && btn.id === 'submit-order-btn') {
                if (!validatedAddress || checkoutShippingCost === null || isCalculating) {
                    btn.disabled = true;
                    btn.innerHTML = 'Veuillez sélectionner une adresse valide';
                } else if (!isShippingCalculable) {
                    btn.disabled = true;
                    btn.innerHTML = 'Demande de devis requise';
                } else {
                    btn.disabled = false;
                    btn.innerHTML = 'Confirmer la commande';
                }
            }
        }
        updateCheckoutTotal = updateCheckoutTotal.bind(this);
    `;
    
    cartJs = cartJs.replace(/let subtotal = 0;\s*let totalQuantity = 0;/, stateVars + '\n        let subtotal = 0;\n        let totalQuantity = 0;');
}

// Update total rendering logic
if (!cartJs.includes('checkoutSubtotal = subtotal;')) {
    cartJs = cartJs.replace(
        /const discount = this\.calculateDiscount\(totalQuantity, subtotal\);\s*const totalHT = subtotal - discount;\s*document\.getElementById\('checkout-subtotal'\)\.textContent = this\.formatPrice\(subtotal\);\s*document\.getElementById\('checkout-discount'\)\.textContent = '-' \+ this\.formatPrice\(discount\);\s*document\.getElementById\('checkout-total'\)\.textContent = this\.formatPrice\(totalHT\);/,
        `const discount = this.calculateDiscount(totalQuantity, subtotal);
        
        checkoutSubtotal = subtotal;
        checkoutTotalQty = totalQuantity;
        checkoutDiscountAmt = discount;
        
        document.getElementById('checkout-subtotal').textContent = this.formatPrice(subtotal);
        document.getElementById('checkout-discount').textContent = '-' + this.formatPrice(discount);
        document.getElementById('checkout-shipping').textContent = 'À calculer';
        
        updateCheckoutTotal();`
    );
}

// Attach Autocomplete events
if (!cartJs.includes('// Initialize shipping autocomplete')) {
    const autocompleteLogic = `
        // Initialize shipping autocomplete
        const shippingAddress = document.getElementById('address');
        const autocompleteResults = document.getElementById('autocomplete-results');
        const shippingResult = document.getElementById('shipping-result');
        const shippingError = document.getElementById('shipping-error');
        const shippingCostEl = document.getElementById('checkout-shipping');
        const shippingDistanceEl = document.getElementById('shipping-distance');
        const shippingDepotEl = document.getElementById('shipping-depot');
        let debounceTimer;
        
        if (shippingAddress) {
            shippingAddress.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                validatedAddress = '';
                checkoutShippingCost = null;
                isShippingCalculable = false;
                shippingResult.classList.add('hidden');
                shippingError.classList.add('hidden');
                shippingCostEl.textContent = 'À calculer';
                updateCheckoutTotal();
                
                const q = e.target.value;
                if (q.length < 3) {
                    autocompleteResults.classList.add('hidden');
                    return;
                }
                
                debounceTimer = setTimeout(async () => {
                    try {
                        const res = await fetch(\`./api/shipping.php?action=autocomplete&q=\${encodeURIComponent(q)}\`);
                        const data = await res.json();
                        if (data.items && data.items.length > 0) {
                            autocompleteResults.innerHTML = '';
                            data.items.forEach(item => {
                                const div = document.createElement('div');
                                div.className = 'p-3 hover:bg-surface-container-low cursor-pointer text-body-sm border-b border-outline/10 last:border-b-0';
                                div.textContent = item.address.label;
                                div.addEventListener('click', async () => {
                                    shippingAddress.value = item.address.label;
                                    autocompleteResults.classList.add('hidden');
                                    await calculateCheckoutShipping(item.address.label);
                                });
                                autocompleteResults.appendChild(div);
                            });
                            autocompleteResults.classList.remove('hidden');
                        }
                    } catch (err) {
                        console.error('Autocomplete error', err);
                    }
                }, 300);
            });

            document.addEventListener('click', (e) => {
                if (!shippingAddress.contains(e.target) && !autocompleteResults.contains(e.target)) {
                    autocompleteResults.classList.add('hidden');
                }
            });
        }
        
        async function calculateCheckoutShipping(address) {
            isCalculating = true;
            updateCheckoutTotal();
            shippingAddress.disabled = true;
            
            try {
                const res = await fetch(\`./api/shipping.php?action=calculate&address=\${encodeURIComponent(address)}&quantity=\${checkoutTotalQty}\`);
                const data = await res.json();
                
                if (data.calculable) {
                    shippingError.classList.add('hidden');
                    shippingResult.classList.remove('hidden');
                    
                    checkoutShippingCost = parseFloat(data.shipping_price);
                    validatedAddress = address;
                    isShippingCalculable = true;
                    
                    shippingCostEl.textContent = this.formatPrice(checkoutShippingCost);
                    shippingDistanceEl.textContent = data.distance_km + ' km';
                    shippingDepotEl.textContent = 'Expédié depuis ' + data.depot + ' (' + data.depot_country + ')';
                } else {
                    shippingResult.classList.add('hidden');
                    shippingError.classList.remove('hidden');
                    
                    checkoutShippingCost = 0;
                    validatedAddress = address;
                    isShippingCalculable = false;
                    
                    shippingCostEl.textContent = '-';
                    if (data.reason === 'out_of_bounds_qty') {
                        document.getElementById('shipping-error-msg').textContent = "Quantité supérieure à 24 palettes. Veuillez demander un devis.";
                    } else {
                        document.getElementById('shipping-error-msg').textContent = "Distance supérieure à 1000km. Veuillez demander un devis.";
                    }
                }
            } catch (err) {
                console.error('Shipping calc error', err);
                checkoutShippingCost = 0;
            }
            
            shippingAddress.disabled = false;
            isCalculating = false;
            updateCheckoutTotal();
        }
        calculateCheckoutShipping = calculateCheckoutShipping.bind(this);
    `;
    
    // Insert before "// Handle form submission"
    cartJs = cartJs.replace(/\/\/\s*Handle form submission/s, autocompleteLogic + '\n\n        // Handle form submission');
}

// Update form submission delivery_address mapping
if (cartJs.includes('document.getElementById(\'zip_code\').value')) {
    cartJs = cartJs.replace(
        /delivery_address:\s*document\.getElementById\('address'\)\.value \+ ' ' \+ document\.getElementById\('zip_code'\)\.value \+ ' ' \+ document\.getElementById\('city'\)\.value,/,
        "delivery_address: validatedAddress || document.getElementById('address').value,"
    );
}

fs.writeFileSync('assets/js/cart.js', cartJs);
console.log('Updated assets/js/cart.js');

