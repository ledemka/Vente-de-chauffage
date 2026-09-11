const fs = require('fs');

const files = [
    'produit.html',
    'en/produit.html',
    'de/produit.html',
    'nl/produit.html'
];

const shippingCalculatorHTML = `
<!-- Calculator de Livraison -->
<div class="bg-surface-container-low rounded-xl p-6 border border-outline/20 mt-4 flex flex-col gap-4">
    <div class="flex items-center gap-2 mb-2">
        <span class="material-symbols-outlined text-primary">local_shipping</span>
        <h3 class="text-body-lg font-headline-md text-on-surface">Calcul de Livraison</h3>
    </div>
    <div class="flex flex-col gap-2 relative">
        <label class="text-label-md font-label-md text-on-surface-variant uppercase">Adresse de destination</label>
        <input type="text" id="shipping-address" class="w-full bg-surface rounded-lg p-3 border border-outline/30 focus:outline-none focus:border-primary text-body-md" placeholder="Saisissez votre adresse..." autocomplete="off">
        <div id="autocomplete-results" class="absolute top-full left-0 right-0 bg-surface border border-outline/30 rounded-lg shadow-lg z-50 hidden max-h-60 overflow-y-auto mt-1"></div>
    </div>
    
    <div id="shipping-result" class="hidden flex flex-col gap-2 bg-surface p-4 rounded-lg border border-primary/20">
        <div class="flex justify-between items-center text-body-sm text-on-surface-variant">
            <span id="shipping-depot">Expédié depuis...</span>
            <span class="font-data-mono" id="shipping-distance"></span>
        </div>
        <div class="flex justify-between items-end mt-2">
            <span class="text-label-md font-label-md text-on-surface uppercase">Frais de livraison HT</span>
            <span class="text-headline-md font-data-mono text-primary" id="shipping-cost">0.00€</span>
        </div>
    </div>
    <div id="shipping-error" class="hidden bg-error-container text-on-error-container p-4 rounded-lg text-body-sm flex flex-col gap-2">
        <span class="font-bold flex items-center gap-2"><span class="material-symbols-outlined text-[18px]">warning</span> Hors limite ou quantité importante</span>
        <span id="shipping-error-msg">Veuillez effectuer une demande de devis sur mesure.</span>
        <a href="./devis.html" class="underline font-bold mt-1">Faire une demande de devis</a>
    </div>
    
    <div class="h-[1px] w-full bg-outline/20 my-2"></div>
    <div class="flex justify-between items-end">
        <span class="text-label-md font-label-md text-on-surface uppercase">Total Commande HT<br/><span class="text-xs text-on-surface-variant">(Produits + Livraison)</span></span>
        <span class="text-headline-md font-data-mono text-on-surface" id="grand-total"></span>
    </div>
</div>
`;

const jsSnippet = `
// Shipping Logic
const shippingAddress = document.getElementById('shipping-address');
const autocompleteResults = document.getElementById('autocomplete-results');
const shippingResult = document.getElementById('shipping-result');
const shippingError = document.getElementById('shipping-error');
const shippingCostEl = document.getElementById('shipping-cost');
const shippingDistanceEl = document.getElementById('shipping-distance');
const shippingDepotEl = document.getElementById('shipping-depot');
const grandTotalEl = document.getElementById('grand-total');

let shippingCost = 0;
let currentAddress = '';
let debounceTimer;

shippingAddress.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    const q = e.target.value;
    if (q.length < 3) {
        autocompleteResults.classList.add('hidden');
        return;
    }
    debounceTimer = setTimeout(async () => {
        try {
            const res = await fetch(\`../api/shipping.php?action=autocomplete&q=\${encodeURIComponent(q)}\`);
            const data = await res.json();
            if (data.items && data.items.length > 0) {
                autocompleteResults.innerHTML = '';
                data.items.forEach(item => {
                    const div = document.createElement('div');
                    div.className = 'p-3 hover:bg-surface-container-low cursor-pointer text-body-sm border-b border-outline/10 last:border-b-0';
                    div.textContent = item.address.label;
                    div.addEventListener('click', () => {
                        shippingAddress.value = item.address.label;
                        currentAddress = item.address.label;
                        autocompleteResults.classList.add('hidden');
                        calculateShipping();
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

// Hide autocomplete on click outside
document.addEventListener('click', (e) => {
    if (!shippingAddress.contains(e.target) && !autocompleteResults.contains(e.target)) {
        autocompleteResults.classList.add('hidden');
    }
});

async function calculateShipping() {
    if (!currentAddress) return;
    
    let qty = parseInt(qtyInput.value) || 1;
    shippingAddress.disabled = true;
    
    try {
        const res = await fetch(\`../api/shipping.php?action=calculate&address=\${encodeURIComponent(currentAddress)}&quantity=\${qty}\`);
        const data = await res.json();
        
        if (data.calculable) {
            shippingError.classList.add('hidden');
            shippingResult.classList.remove('hidden');
            shippingCost = parseFloat(data.shipping_price);
            shippingCostEl.textContent = formatCurrency(shippingCost);
            shippingDistanceEl.textContent = data.distance_km + ' km';
            shippingDepotEl.textContent = 'Expédié depuis ' + data.depot + ' (' + data.depot_country + ')';
        } else {
            shippingResult.classList.add('hidden');
            shippingError.classList.remove('hidden');
            shippingCost = 0;
            if (data.reason === 'out_of_bounds_qty') {
                document.getElementById('shipping-error-msg').textContent = "Quantité supérieure à 24 palettes. Veuillez demander un devis.";
            } else {
                document.getElementById('shipping-error-msg').textContent = "Distance supérieure à 1000km. Veuillez demander un devis.";
            }
        }
    } catch (err) {
        console.error('Shipping calc error', err);
        shippingCost = 0;
    }
    shippingAddress.disabled = false;
    updateGrandTotal();
}

function updateGrandTotal() {
    let qty = parseInt(qtyInput.value) || 1;
    const calc = calculateVolumeDiscount(product.wholesale_price, qty);
    const totalProduits = calc.totalPrice;
    
    grandTotalEl.textContent = formatCurrency(totalProduits + shippingCost);
}

// Intercept qty update to recalculate shipping
const originalUpdatePricing = updatePricing;
updatePricing = function() {
    originalUpdatePricing();
    if (currentAddress) {
        calculateShipping(); // Recalculate if qty changes
    } else {
        updateGrandTotal(); // Just update grand total with 0 shipping
    }
};
`;

files.forEach(f => {
    if (!fs.existsSync(f)) return;
    let content = fs.readFileSync(f, 'utf8');
    
    // 1. Add volume row if not present
    if (!content.includes('id="spec-volume-m3"')) {
        content = content.replace(
            /<span class="text-body-md font-data-mono text-on-surface text-right" id="spec-volume">.*?<\/span>/,
            '<span class="text-body-md font-data-mono text-on-surface text-right" id="spec-volume-m3"></span>'
        );
    }
    
    // Update JS to set volume
    if (!content.includes('spec-volume-m3')) {
        content = content.replace(
            /document\.getElementById\('spec-volume'\)\.textContent = '1 Palette standard';/,
            "document.getElementById('spec-volume-m3').textContent = (product.volume_m3 || '2.16') + ' m³ / palette';"
        );
    }
    
    // 2. Add shipping calculator HTML after Total Calculation block
    if (!content.includes('id="shipping-address"')) {
        content = content.replace(
            /(<!-- Actions -->\s*<div class="flex flex-col gap-3">)/,
            shippingCalculatorHTML + '\n$1'
        );
    }
    
    // 3. Add JS snippet
    if (!content.includes('shippingAddress.addEventListener')) {
        content = content.replace(
            /(updatePricing\(\);\s*const btnCommander = document\.getElementById\('btn-commander'\);)/,
            jsSnippet + '\n$1'
        );
    }
    
    // Fix API endpoint paths for translated pages (they are in subfolders)
    if (f !== 'produit.html') {
        content = content.replace(/..\/api\/shipping.php/g, '../../api/shipping.php');
    } else {
        content = content.replace(/..\/api\/shipping.php/g, './api/shipping.php');
    }
    
    fs.writeFileSync(f, content);
    console.log('Updated', f);
});
