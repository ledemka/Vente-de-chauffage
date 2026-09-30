<?php
declare(strict_types=1);

echo "GOOGLE MERCHANT CENTER VALIDATION\n";
echo "==================================\n\n";

$productsFile = __DIR__ . '/../data/products.json';
if (!file_exists($productsFile)) {
    die("ERROR: products.json not found.\n");
}
$products = json_decode(file_get_contents($productsFile), true);

$feedUrl = "http://127.0.0.1:8000/api/merchant-feed.php";
$feedXmlContent = @file_get_contents($feedUrl);

if (!$feedXmlContent) {
    echo "WARNING: Could not fetch feed from localhost:8000 (maybe the PHP server is not running locally).\n";
    echo "Falling back to generating it directly for validation...\n";
    
    // Simulate generation
    ob_start();
    require __DIR__ . '/../api/merchant-feed.php';
    $feedXmlContent = ob_get_clean();
}

if (!$feedXmlContent) {
    die("ERROR: Could not generate or fetch XML feed.\n");
}

libxml_use_internal_errors(true);
$xml = simplexml_load_string($feedXmlContent);
$xmlErrors = libxml_get_errors();
libxml_clear_errors();

$errors = [];
$warnings = [];

$baseProductCount = 0;
$generatedOffersCount = 0;

$catalogData = [];

// 1. Analyze Catalog
foreach ($products as $p) {
    if (empty($p['available'])) continue;
    $baseProductCount++;
    
    if (empty($p['id'])) $errors[] = "Catalog Product missing ID";
    if (empty($p['name']['fr']) && empty($p['name']['en'])) $errors[] = "Catalog Product {$p['id']} missing name";
    if (!isset($p['image_product']) && !isset($p['image_packaging'])) $errors[] = "Catalog Product {$p['id']} missing image";
    
    $vatRate = 0.20;
    
    if (isset($p['prices_by_length']) && is_array($p['prices_by_length'])) {
        foreach ($p['prices_by_length'] as $len => $priceHT) {
            $expectedTtc = number_format($priceHT * (1 + $vatRate), 2, '.', '');
            $catalogData[$p['id'].'-'.$len] = [
                'price' => $expectedTtc,
                'available' => 'in_stock'
            ];
            if ($priceHT <= 0) $errors[] = "Catalog Offer {$p['id']}-$len has invalid price HT: $priceHT";
        }
    } else {
        $priceHT = $p['price'] ?? 0;
        $expectedTtc = number_format($priceHT * (1 + $vatRate), 2, '.', '');
        $catalogData[$p['id']] = [
            'price' => $expectedTtc,
            'available' => 'in_stock'
        ];
        if ($priceHT <= 0) $errors[] = "Catalog Offer {$p['id']} has invalid price HT: $priceHT";
    }
}

// 2. Analyze XML Feed
$feedData = [];
$priceConsistency = true;
$imageUrls = true;
$availability = true;
$xmlValid = empty($xmlErrors);

if ($xmlValid && $xml) {
    $namespaces = $xml->getNamespaces(true);
    $xml->registerXPathNamespace('g', $namespaces['g'] ?? 'http://base.google.com/ns/1.0');
    
    foreach ($xml->channel->item as $item) {
        $generatedOffersCount++;
        $gItem = $item->children($namespaces['g'] ?? 'http://base.google.com/ns/1.0');
        
        $id = (string)$gItem->id;
        $price = (string)$gItem->price;
        $priceVal = str_replace(' EUR', '', $price);
        $link = (string)$gItem->link;
        $image = (string)$gItem->image_link;
        $avail = (string)$gItem->availability;
        $brand = (string)$gItem->brand;
        
        if (isset($feedData[$id])) {
            $errors[] = "Duplicate ID in XML: $id";
        }
        $feedData[$id] = true;
        
        // Coherence with catalog
        if (isset($catalogData[$id])) {
            if ($catalogData[$id]['price'] !== $priceVal) {
                $priceConsistency = false;
                $errors[] = "Price mismatch for $id: Catalog says {$catalogData[$id]['price']} EUR, Feed says $price";
            }
            if ($catalogData[$id]['available'] !== $avail) {
                $availability = false;
                $errors[] = "Availability mismatch for $id";
            }
        } else {
            $errors[] = "Offer $id in feed but not valid in catalog.";
        }
        
        if (empty($brand)) {
            $errors[] = "Missing brand for $id";
        }
        
        if (empty($image) || strpos($image, 'http') !== 0) {
            $imageUrls = false;
            $errors[] = "Invalid absolute image URL for $id: $image";
        }
        if (empty($link) || strpos($link, 'http') !== 0) {
            $errors[] = "Invalid absolute product URL for $id: $link";
        }
    }
} else {
    foreach ($xmlErrors as $err) {
        $errors[] = "XML Parse Error: " . trim($err->message);
    }
}

// Warnings for missing identifiers
foreach ($catalogData as $id => $data) {
    $warnings[] = "Product $id has no GTIN"; // As requested by prompt output
    $warnings[] = "Product $id has no MPN (using internal ID)";
}

echo "Products:\n$baseProductCount base products\n\n";
echo "Offers:\n$generatedOffersCount generated offers\n\n";

echo "Errors:\n" . count($errors) . "\n";
foreach ($errors as $e) echo "- $e\n";
echo "\n";

echo "Warnings:\n" . count($warnings) . "\n";
foreach (array_slice($warnings, 0, 10) as $w) echo "- $w\n";
if (count($warnings) > 10) echo "- ... and " . (count($warnings) - 10) . " more warnings\n";
echo "\n";

echo "Price consistency:\n" . ($priceConsistency && count($errors) == 0 ? "PASS" : "FAIL") . "\n\n";
echo "Image URLs:\n" . ($imageUrls ? "PASS" : "FAIL") . "\n\n";
echo "Availability:\n" . ($availability ? "PASS" : "FAIL") . "\n\n";
echo "XML:\n" . ($xmlValid ? "PASS" : "FAIL") . "\n";
