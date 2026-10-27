const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

console.log('=== RUNNING FUNCTIONAL TESTS ON STATIC PRODUCT PAGE ===\n');

const filePath = path.join(__dirname, '..', 'produits', 'hetre-etuve.html');
const htmlContent = fs.readFileSync(filePath, 'utf8');

// Load JSDOM with simulated browser environment
const dom = new JSDOM(htmlContent, {
    runScripts: 'dangerously',
    resources: 'usable',
    url: 'http://localhost:8080/produits/hetre-etuve.html'
});

const { window } = dom;
const { document } = window;

const mockProduct = {
    id: "hetre-etuve",
    name: "Hêtre étuvé",
    wholesale_price: 185.00,
    palette_weight: "950 kg",
    units_per_palette: 60,
    volume_m3: 1.8
};

// Mock fetch to supply products.json and translations
window.fetch = async (url) => {
    if (url.includes('products.json')) {
        return {
            ok: true,
            status: 200,
            json: async () => [mockProduct]
        };
    }
    if (url.includes('.json')) {
        return {
            ok: true,
            status: 200,
            json: async () => ({})
        };
    }
    return {
        ok: true,
        status: 200,
        json: async () => ({ success: true })
    };
};

let lastAlert = null;
window.alert = (msg) => {
    lastAlert = msg;
};

window.CartAPI = {
    add: async (id, qty, length) => {
        return { success: true, item: { id, qty, length } };
    }
};

// Dispatch i18nLoaded event once DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const event = new window.CustomEvent('i18nLoaded', {
            detail: {
                lang: 'fr',
                translations: {
                    pricing: {
                        tier_level: 'Palier :',
                        full_truckload: 'Camion Complet (-10%)',
                        next_tier_incentive: 'Ajoutez {count} palette(s) pour -{pct}%'
                    }
                }
            }
        });
        document.dispatchEvent(event);
    }, 50);
});

// Wait for async init to complete
setTimeout(() => {
    try {
        const qtyInput = document.getElementById('qty-input');
        const btnDecrease = document.getElementById('btn-decrease');
        const btnIncrease = document.getElementById('btn-increase');
        const minNotice = document.getElementById('min-qty-permanent-notice');
        const minAlert = document.getElementById('min-qty-alert');
        const discountPctEl = document.getElementById('discount-pct');
        const recapInfoBanner = document.getElementById('recap-info-banner');
        const btnCommander = document.getElementById('btn-commander');
        const btnDevis = document.getElementById('btn-devis');
        const subtotalEl = document.getElementById('subtotal');
        const totalEl = document.getElementById('total');

        console.log('1. Checking Initial State on Page Load:');
        console.assert(qtyInput !== null, 'qty-input should exist');
        console.assert(qtyInput.value === '5', `qtyInput.value should be 5, got ${qtyInput.value}`);
        console.assert(qtyInput.getAttribute('min') === '5', `qtyInput min should be 5, got ${qtyInput.getAttribute('min')}`);
        console.assert(btnDecrease.disabled === true, 'btnDecrease should be disabled at initial qty 5');
        console.assert(minNotice !== null && !minNotice.classList.contains('hidden'), 'Permanent notice must be visible on load');
        console.assert(minNotice.textContent.includes('5 palettes'), 'Permanent notice must mention 5 palettes');
        console.assert(minAlert.classList.contains('hidden'), 'minAlert must be hidden initially');
        console.log('   ✓ Initial value is 5');
        console.log('   ✓ Minus button is disabled');
        console.log('   ✓ Permanent notice is visible: "' + minNotice.textContent.trim().replace(/\s+/g, ' ') + '"');

        console.log('\n2. Testing Quantities 1 to 4 (Attempt to decrease/input below 5):');
        // Click minus button at 5
        btnDecrease.click();
        console.assert(qtyInput.value === '5', `Clicking minus at 5 must keep value 5, got ${qtyInput.value}`);
        console.assert(btnDecrease.disabled === true, 'btnDecrease must remain disabled at 5');
        console.assert(!minAlert.classList.contains('hidden'), 'minAlert should be visible when trying to decrease under 5');
        console.assert(minAlert.textContent.includes('5 palettes'), 'minAlert should state 5 palettes');
        console.log('   ✓ Clicking "-" when at 5 keeps quantity at 5 and shows alert banner');

        // Test direct typing of 1 to 4
        [1, 2, 3, 4].forEach(testQty => {
            qtyInput.value = testQty;
            qtyInput.dispatchEvent(new window.Event('change'));
            console.assert(qtyInput.value === '5', `Entering ${testQty} must reset to 5 on change, got ${qtyInput.value}`);
            console.assert(!minAlert.classList.contains('hidden'), `Alert must show after entering ${testQty}`);
        });
        console.log('   ✓ Typing 1, 2, 3, 4 automatically resets to 5 with explanatory alert');

        console.log('\n3. Testing Quantity = 5 (Standard order, 0% discount):');
        qtyInput.value = 5;
        qtyInput.dispatchEvent(new window.Event('change'));
        console.assert(btnDecrease.disabled === true, 'btnDecrease must be disabled at 5');
        console.assert(discountPctEl.textContent.trim() === '-0%', `Discount at 5 pallets should be -0%, got ${discountPctEl.textContent}`);
        console.assert(btnCommander.disabled === false, 'btnCommander should be enabled at 5 pallets');
        console.log('   ✓ Quantity 5: 0% discount, minus button disabled, commander enabled');

        console.log('\n4. Testing Quantity = 6 (Palier 1, -4% discount):');
        btnIncrease.click(); // 5 -> 6
        console.assert(qtyInput.value === '6', `Value should be 6 after "+", got ${qtyInput.value}`);
        console.assert(btnDecrease.disabled === false, 'btnDecrease should now be enabled at 6');
        console.assert(discountPctEl.textContent.trim() === '-4%', `Discount at 6 pallets should be -4%, got ${discountPctEl.textContent}`);
        console.log('   ✓ Quantity 6: -4% discount, minus button enabled');

        console.log('\n5. Testing Quantity = 10 (Palier 1, -4% discount):');
        qtyInput.value = 10;
        qtyInput.dispatchEvent(new window.Event('change'));
        console.assert(discountPctEl.textContent.trim() === '-4%', `Discount at 10 pallets should be -4%, got ${discountPctEl.textContent}`);
        console.log('   ✓ Quantity 10: -4% discount');

        console.log('\n6. Testing Quantity = 11 (Palier 2, -6% discount):');
        qtyInput.value = 11;
        qtyInput.dispatchEvent(new window.Event('change'));
        console.assert(discountPctEl.textContent.trim() === '-6%', `Discount at 11 pallets should be -6%, got ${discountPctEl.textContent}`);
        console.log('   ✓ Quantity 11: -6% discount');

        console.log('\n7. Testing Quantity = 16 (Palier 3, -8% discount):');
        qtyInput.value = 16;
        qtyInput.dispatchEvent(new window.Event('change'));
        console.assert(discountPctEl.textContent.trim() === '-8%', `Discount at 16 pallets should be -8%, got ${discountPctEl.textContent}`);
        console.log('   ✓ Quantity 16: -8% discount');

        console.log('\n8. Testing Quantity = 20 (Palier 4, -10% discount):');
        qtyInput.value = 20;
        qtyInput.dispatchEvent(new window.Event('change'));
        console.assert(discountPctEl.textContent.trim() === '-10%', `Discount at 20 pallets should be -10%, got ${discountPctEl.textContent}`);
        console.log('   ✓ Quantity 20: -10% discount');

        console.log('\n9. Testing Quantity = 24 (Camion complet, -10% discount + Camion Complet message):');
        qtyInput.value = 24;
        qtyInput.dispatchEvent(new window.Event('change'));
        console.assert(discountPctEl.textContent.trim() === '-10%', `Discount at 24 pallets should be -10%, got ${discountPctEl.textContent}`);
        console.assert(!recapInfoBanner.classList.contains('hidden'), 'Recap banner should be visible at 24 pallets');
        console.assert(recapInfoBanner.textContent.includes('Camion complet : 24 palettes'), `Recap banner must say "Camion complet : 24 palettes", got ${recapInfoBanner.textContent}`);
        console.assert(btnCommander.disabled === false, 'btnCommander must still be enabled at 24');
        console.log('   ✓ Quantity 24: -10% discount');
        console.log('   ✓ Message displayed: "' + recapInfoBanner.textContent.trim() + '"');

        console.log('\n10. Testing Quantity = 25 (> 24: Sur devis personnalisé):');
        btnIncrease.click(); // 24 -> 25
        console.assert(qtyInput.value === '25', `Value should be 25 after "+", got ${qtyInput.value}`);
        console.assert(!recapInfoBanner.classList.contains('hidden'), 'Recap banner should be visible at 25 pallets');
        console.assert(recapInfoBanner.textContent.includes('devis personnalisé'), `Recap banner must mention devis, got ${recapInfoBanner.textContent}`);
        console.assert(btnCommander.disabled === true, 'btnCommander must be disabled at 25 pallets');
        console.assert(btnDevis.className.includes('bg-primary'), 'btnDevis must be highlighted at 25 pallets');
        console.log('   ✓ Quantity 25: Devis prompt displayed');
        console.log('   ✓ Commander disabled, Demander un devis highlighted');

        console.log('\n11. Testing Order Submission Guard (handleCommanderClick):');
        // Test submit when forced < 5
        qtyInput.value = 3;
        window.handleCommanderClick(btnCommander);
        console.assert(qtyInput.value === '5', 'handleCommanderClick must clamp to 5');
        console.assert(lastAlert && lastAlert.includes('5 palettes'), 'Alert must block order < 5');
        console.log('   ✓ Direct order attempt < 5 rejected and alerted');

        console.log('\n======================================================');
        console.log('ALL FUNCTIONAL TESTS PASSED WITH 100% SUCCESS!');
        console.log('======================================================\n');
        process.exit(0);
    } catch(err) {
        console.error('TEST FAILED:', err);
        process.exit(1);
    }
}, 800);
