/**
 * Wood Heating B2B - Volume Pricing Engine
 * Calculates tier discounts based on wholesale price and quantity of palettes.
 * 
 * Grid:
 * Tier 1: 1 palette      => 0%
 * Tier 2: 2-4 palettes   => -4%
 * Tier 3: 5-9 palettes   => -6%
 * Tier 4: 10-19 palettes => -8%
 * Tier 5: >= 20 palettes => -10% (Full truckload)
 */

function calculateVolumeDiscount(wholesalePrice, quantity) {
    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const basePrice = parseFloat(wholesalePrice) || 0;

    let tier = 1;
    let discountPercentage = 0;
    let palettesNeededForNextTier = 0;
    let nextTierPercentage = 0;
    let isFullTruckload = false;

    if (qty < 2) {
        tier = 1;
        discountPercentage = 0;
        palettesNeededForNextTier = 2 - qty;
        nextTierPercentage = 4;
    } else if (qty >= 2 && qty <= 4) {
        tier = 2;
        discountPercentage = 4;
        palettesNeededForNextTier = 5 - qty;
        nextTierPercentage = 6;
    } else if (qty >= 5 && qty <= 9) {
        tier = 3;
        discountPercentage = 6;
        palettesNeededForNextTier = 10 - qty;
        nextTierPercentage = 8;
    } else if (qty >= 10 && qty <= 19) {
        tier = 4;
        discountPercentage = 8;
        palettesNeededForNextTier = 20 - qty;
        nextTierPercentage = 10;
    } else {
        // qty >= 20 (Cap at 10% for any quantity >= 20)
        tier = 5;
        discountPercentage = 10;
        palettesNeededForNextTier = 0;
        nextTierPercentage = 10;
        isFullTruckload = true;
    }

    const discountedUnitPrice = basePrice * (1 - discountPercentage / 100);
    const totalPrice = discountedUnitPrice * qty;

    return {
        quantity: qty,
        tier: tier,
        discountPercentage: discountPercentage,
        wholesaleBasePrice: basePrice,
        discountedUnitPrice: Math.round(discountedUnitPrice * 100) / 100,
        totalPrice: Math.round(totalPrice * 100) / 100,
        palettesNeededForNextTier: palettesNeededForNextTier,
        nextTierPercentage: nextTierPercentage,
        isFullTruckload: isFullTruckload
    };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { calculateVolumeDiscount };
}
