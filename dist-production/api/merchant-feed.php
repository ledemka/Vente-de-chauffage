<?php
declare(strict_types=1);
header('Content-Type: application/xml; charset=UTF-8');
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

if (isset($config['publish']) && $config['publish'] !== true) {
    http_response_code(503);
    die("Feed not published");
}

$siteOrigin = rtrim($config['site_origin'] ?? 'https://www.sotramsbois.com', '/');
$brand = !empty($config['brand']) ? $config['brand'] : '';
if (empty($brand)) {
    http_response_code(503);
    die("Brand not configured");
}
$vatRate = (float)($config['vat_rate'] ?? 0.20);
$currency = $config['currency'] ?? 'EUR';
$defaultLanguage = $config['default_language'] ?? 'fr';

function escapeXml($string) {
    if ($string === null) return '';
    return htmlspecialchars((string)$string, ENT_XML1 | ENT_COMPAT, 'UTF-8');
}

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">' . "\n";
echo '<channel>' . "\n";
echo '<title>' . escapeXml($brand . ' - Produits') . '</title>' . "\n";
echo '<link>' . escapeXml($siteOrigin) . '</link>' . "\n";
echo '<description>' . escapeXml('Flux produit Google Merchant Center pour ' . $brand) . '</description>' . "\n";

foreach ($products as $product) {
    $id = $product['id'];
    $titleBase = $product['name'][$defaultLanguage] ?? $product['name']['fr'] ?? $id;
    
    // Richer description
    $descParts = [];
    $descParts[] = $titleBase;
    if (!empty($product['species_material'][$defaultLanguage])) {
        $descParts[] = "Matière : " . $product['species_material'][$defaultLanguage];
    } elseif (!empty($product['species_material']['fr'])) {
        $descParts[] = "Matière : " . $product['species_material']['fr'];
    }
    
    if (!empty($product['units_per_palette'])) {
        $descParts[] = $product['units_per_palette'] . " unités par palette";
    }
    if (!empty($product['palette_weight'])) {
        $descParts[] = "Poids de la palette : " . $product['palette_weight'];
    }
    if (!empty($product['format'][$defaultLanguage])) {
        $descParts[] = "Format : " . $product['format'][$defaultLanguage];
    } elseif (!empty($product['format']['fr'])) {
        $descParts[] = "Format : " . $product['format']['fr'];
    }
    
    $descBase = implode(' | ', $descParts);
    $descBase = html_entity_decode(strip_tags($descBase), ENT_QUOTES | ENT_XML1, 'UTF-8');
    
    $imageUrl = '';
    $additionalImage = '';
    if (!empty($product['image_product'])) {
        $imageUrl = $siteOrigin . '/' . ltrim($product['image_product'], '/');
    }
    if (!empty($product['image_packaging'])) {
        $imgP = $siteOrigin . '/' . ltrim($product['image_packaging'], '/');
        if (empty($imageUrl)) {
            $imageUrl = $imgP;
        } else {
            $additionalImage = $imgP;
        }
    }

    $availability = (!empty($product['available']) && $product['available'] === true) ? 'in_stock' : 'out_of_stock';

    $gtin = $product['gtin'] ?? null;
    $mpn = $product['mpn'] ?? null;
    $hasIdentifier = ($gtin || $mpn);
    
    $productType = null;
    if (isset($product['subgroup_name'])) {
        if (is_array($product['subgroup_name'])) {
            $productType = $product['subgroup_name']['fr'] ?? $product['subgroup_name'][$defaultLanguage] ?? reset($product['subgroup_name']);
        } else {
            $productType = (string)$product['subgroup_name'];
        }
    }
    
    $shippingWeight = !empty($product['palette_weight']) ? (string)$product['palette_weight'] : null;

    if (isset($product['prices_by_length']) && is_array($product['prices_by_length'])) {
        foreach ($product['prices_by_length'] as $length => $priceHT) {
            writeProductItem([
                'id' => $id . '-' . $length,
                'item_group_id' => $id,
                'title' => $titleBase . ' - ' . $length . ' cm',
                'description' => $descBase . ' - Longueur : ' . $length . ' cm',
                'link' => $siteOrigin . '/produits/' . $id . '.html?length=' . $length,
                'image_link' => $imageUrl,
                'additional_image_link' => $additionalImage,
                'priceHT' => $priceHT,
                'vatRate' => $vatRate,
                'currency' => $currency,
                'brand' => $brand,
                'gtin' => $gtin,
                'mpn' => $mpn,
                'hasIdentifier' => $hasIdentifier,
                'availability' => $availability,
                'product_type' => $productType,
                'shipping_weight' => $shippingWeight
            ]);
        }
    } else {
        $priceHT = $product['wholesale_price'] ?? $product['price'] ?? 0;
        writeProductItem([
            'id' => $id,
            'title' => $titleBase,
            'description' => $descBase,
            'link' => $siteOrigin . '/produits/' . $id . '.html',
            'image_link' => $imageUrl,
            'additional_image_link' => $additionalImage,
            'priceHT' => $priceHT,
            'vatRate' => $vatRate,
            'currency' => $currency,
            'brand' => $brand,
            'gtin' => $gtin,
            'mpn' => $mpn,
            'hasIdentifier' => $hasIdentifier,
            'availability' => $availability,
            'product_type' => $productType,
            'shipping_weight' => $shippingWeight
        ]);
    }
}

echo '</channel>' . "\n";
echo '</rss>' . "\n";

function writeProductItem(array $data) {
    if ((float)$data['priceHT'] <= 0) {
        return; // Skip invalid prices
    }
    
    $priceTTC = $data['priceHT'] * (1 + $data['vatRate']);
    $priceFormatted = number_format($priceTTC, 2, '.', '') . ' ' . $data['currency'];

    echo '<item>' . "\n";
    echo '  <g:id>' . escapeXml($data['id']) . '</g:id>' . "\n";
    echo '  <g:title>' . escapeXml($data['title']) . '</g:title>' . "\n";
    echo '  <g:description>' . escapeXml($data['description']) . '</g:description>' . "\n";
    echo '  <g:link>' . escapeXml($data['link']) . '</g:link>' . "\n";
    
    if (!empty($data['image_link'])) {
        echo '  <g:image_link>' . escapeXml($data['image_link']) . '</g:image_link>' . "\n";
    }
    if (!empty($data['additional_image_link'])) {
        echo '  <g:additional_image_link>' . escapeXml($data['additional_image_link']) . '</g:additional_image_link>' . "\n";
    }

    echo '  <g:price>' . escapeXml($priceFormatted) . '</g:price>' . "\n";
    echo '  <g:availability>' . escapeXml($data['availability']) . '</g:availability>' . "\n";
    echo '  <g:condition>new</g:condition>' . "\n";
    echo '  <g:brand>' . escapeXml($data['brand']) . '</g:brand>' . "\n";
    
    if (!empty($data['product_type'])) {
        echo '  <g:product_type>' . escapeXml($data['product_type']) . '</g:product_type>' . "\n";
    }
    
    if (!empty($data['gtin'])) {
        echo '  <g:gtin>' . escapeXml($data['gtin']) . '</g:gtin>' . "\n";
    }
    
    if (!empty($data['mpn'])) {
        echo '  <g:mpn>' . escapeXml($data['mpn']) . '</g:mpn>' . "\n";
    }
    
    if (!$data['hasIdentifier']) {
        echo '  <g:identifier_exists>no</g:identifier_exists>' . "\n";
    }

    if (!empty($data['item_group_id'])) {
        echo '  <g:item_group_id>' . escapeXml($data['item_group_id']) . '</g:item_group_id>' . "\n";
    }

    if (!empty($data['shipping_weight'])) {
        echo '  <g:shipping_weight>' . escapeXml($data['shipping_weight']) . '</g:shipping_weight>' . "\n";
    }
    
    echo '</item>' . "\n";
}
