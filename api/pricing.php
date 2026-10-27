<?php
declare(strict_types=1);
/**
 * Common Server-Side Pricing Engine
 */
function getProductsData() {
    $json = @file_get_contents(__DIR__ . '/../data/products.json');
    if (!$json) return [];
    return json_decode($json, true) ?: [];
}

/**
 * Calculates the global discount percentage and tier based on total palettes in the order.
 */
function calculateGlobalDiscount(int $totalPalettes): array {
    $tier = 0;
    $discountPercentage = 0;
    
    if ($totalPalettes < 5) {
        $tier = 0;
        $discountPercentage = 0;
    } elseif ($totalPalettes === 5) {
        $tier = 1;
        $discountPercentage = 0;
    } elseif ($totalPalettes >= 6 && $totalPalettes <= 10) {
        $tier = 2;
        $discountPercentage = 4;
    } elseif ($totalPalettes >= 11 && $totalPalettes <= 15) {
        $tier = 3;
        $discountPercentage = 6;
    } elseif ($totalPalettes >= 16 && $totalPalettes <= 19) {
        $tier = 4;
        $discountPercentage = 8;
    } elseif ($totalPalettes >= 20 && $totalPalettes <= 24) {
        $tier = 5;
        $discountPercentage = 10;
    } else {
        $tier = 6;
        $discountPercentage = 10;
    }
    
    return [
        'tier' => $tier,
        'discount_percent' => $discountPercentage
    ];
}

/**
 * Calculates the final line prices given a product, its length, its quantity, and the global discount percent.
 */
function calculateLinePrice(array $product, ?string $length, int $quantity, float $globalDiscountPercent): array {
    $qty = max(1, $quantity);
    
    // Determine catalog base price
    $catalogPriceHT = 0;
    if (isset($product['prices_by_length']) && $length !== null && isset($product['prices_by_length'][$length])) {
        $catalogPriceHT = (float)$product['prices_by_length'][$length];
    } else {
        $catalogPriceHT = (float)($product['wholesale_price'] ?? 0);
    }
    
    $netUnitPriceHT = $catalogPriceHT * (1 - $globalDiscountPercent / 100);
    $totalHT = $netUnitPriceHT * $qty;
    
    return [
        'quantity' => $qty,
        'unit_price_catalog_ht' => $catalogPriceHT,
        'discount_percent' => $globalDiscountPercent,
        'unit_price_net_ht' => round($netUnitPriceHT, 2),
        'total_ht' => round($totalHT, 2)
    ];
}
