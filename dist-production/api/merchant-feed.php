<?php
declare(strict_types=1);

header('Content-Type: application/xml; charset=UTF-8');

// Disable caching for the feed script
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

$productsFile = __DIR__ . '/../data/products.json';
$configFile = __DIR__ . '/../data/merchant-config.json';

if (!file_exists($productsFile) || !file_exists($configFile)) {
    http_response_code(500);
    echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?><error>Missing configuration files.</error>";
    exit;
}

$products = json_decode(file_get_contents($productsFile), true);
$config = json_decode(file_get_contents($configFile), true);

$siteOrigin = $config['site_origin'] ?? 'https://www.sotramsbois.com';
$brand = !empty($config['brand']) ? $config['brand'] : 'Sotrams Bois';
$vatRate = $config['vat_rate'] ?? 0.20;
$currency = $config['currency'] ?? 'EUR';
$defaultLanguage = $config['default_language'] ?? 'fr';

$targetCountry = 'FR';
if (isset($config['merchant_center']['target_country'])) {
    $targetCountry = $config['merchant_center']['target_country'];
}

$xml = new XMLWriter();
$xml->openMemory();
$xml->setIndent(true);
$xml->startDocument('1.0', 'UTF-8');
$xml->startElement('rss');
$xml->writeAttribute('version', '2.0');
$xml->writeAttribute('xmlns:g', 'http://base.google.com/ns/1.0');

$xml->startElement('channel');
$xml->writeElement('title', $brand . ' - Produits');
$xml->writeElement('link', $siteOrigin);
$xml->writeElement('description', 'Flux produit Google Merchant Center pour ' . $brand);

foreach ($products as $product) {
    if (!isset($product['available']) || !$product['available']) {
        continue;
    }

    $id = $product['id'];
    $titleBase = $product['name'][$defaultLanguage] ?? $product['name']['fr'] ?? $id;
    $descBase = $product['species_material'][$defaultLanguage] ?? $product['species_material']['fr'] ?? $titleBase;
    
    // HTML entity decode and strip tags for clean text
    $descBase = html_entity_decode(strip_tags($descBase), ENT_QUOTES | ENT_XML1, 'UTF-8');
    
    $imageUrl = '';
    if (!empty($product['image_product'])) {
        $imageUrl = $siteOrigin . $product['image_product'];
    } elseif (!empty($product['image_packaging'])) {
        $imageUrl = $siteOrigin . $product['image_packaging'];
    }

    if (isset($product['prices_by_length']) && is_array($product['prices_by_length'])) {
        foreach ($product['prices_by_length'] as $length => $priceHT) {
            writeProduct($xml, [
                'id' => $id . '-' . $length,
                'title' => $titleBase . ' - ' . $length . ' cm',
                'description' => $descBase . ' - ' . $length . ' cm',
                'link' => $siteOrigin . '/produits/' . $id . '.html?length=' . $length,
                'image_link' => $imageUrl,
                'priceHT' => $priceHT,
                'vatRate' => $vatRate,
                'currency' => $currency,
                'brand' => $brand,
                'mpn' => $id . '-' . $length
            ]);
        }
    } else {
        $priceHT = $product['price'] ?? 0;
        writeProduct($xml, [
            'id' => $id,
            'title' => $titleBase,
            'description' => $descBase,
            'link' => $siteOrigin . '/produits/' . $id . '.html',
            'image_link' => $imageUrl,
            'priceHT' => $priceHT,
            'vatRate' => $vatRate,
            'currency' => $currency,
            'brand' => $brand,
            'mpn' => $id
        ]);
    }
}

$xml->endElement(); // channel
$xml->endElement(); // rss

echo $xml->outputMemory();

function writeProduct(XMLWriter $xml, array $data) {
    $priceTTC = $data['priceHT'] * (1 + $data['vatRate']);
    $priceFormatted = number_format($priceTTC, 2, '.', '') . ' ' . $data['currency'];

    $xml->startElement('item');
    $xml->writeElement('g:id', htmlspecialchars($data['id']));
    $xml->writeElement('g:title', htmlspecialchars($data['title']));
    $xml->writeElement('g:description', htmlspecialchars($data['description']));
    $xml->writeElement('g:link', htmlspecialchars($data['link']));
    
    if (!empty($data['image_link'])) {
        $xml->writeElement('g:image_link', htmlspecialchars($data['image_link']));
    }

    $xml->writeElement('g:price', $priceFormatted);
    $xml->writeElement('g:availability', 'in_stock'); // All items handled are filtered by available=true above
    $xml->writeElement('g:condition', 'new');
    $xml->writeElement('g:brand', htmlspecialchars($data['brand']));
    
    // As per instruction: "Si aucun GTIN n'existe, utiliser un MPN... identifier_exists=false"
    // GMC accepts MPN without GTIN if identifier_exists is false, or we can just set identifier_exists to no.
    $xml->writeElement('g:identifier_exists', 'no');
    
    $xml->endElement(); // item
}
