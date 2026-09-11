<?php
/**
 * Delivery calculator & HERE API Proxy
 */
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

function respondError(int $statusCode, string $message, array $details = []): void {
    http_response_code($statusCode);
    echo json_encode(['success' => false, 'message' => $message, 'details' => $details], JSON_UNESCAPED_UNICODE);
    exit;
}

function getEnvVar(string $name, string $default = ''): string {
    $val = getenv($name);
    if ($val !== false) return $val;
    if (isset($_ENV[$name])) return (string)$_ENV[$name];
    
    static $envLoaded = false;
    static $envData = [];
    if (!$envLoaded) {
        $envPath = __DIR__ . '/../.env';
        if (file_exists($envPath)) {
            $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (strpos(trim($line), '#') === 0) continue;
                if (strpos($line, '=') !== false) {
                    list($key, $value) = explode('=', $line, 2);
                    $key = trim($key);
                    $value = trim($value, " \t\n\r\0\x0B\"'");
                    $envData[$key] = $value;
                    $_ENV[$key] = $value;
                    putenv("$key=$value");
                }
            }
        }
        $envLoaded = true;
    }
    return $envData[$name] ?? $default;
}

$action = $_GET['action'] ?? '';
$hereApiKey = getEnvVar('HERE_API_KEY');

if (!$hereApiKey) {
    respondError(500, 'HERE API KEY not configured.');
}

if ($action === 'autocomplete') {
    $q = $_GET['q'] ?? '';
    if (!$q) respondError(400, 'Missing query parameter q.');
    
    // Country restriction: Focus on western/central europe based on the user's business
    $url = "https://autocomplete.search.hereapi.com/v1/autocomplete?q=" . urlencode($q) . "&apiKey=" . $hereApiKey . "&in=countryCode:FRA,BEL,CHE,DEU,NLD,LUX,ESP,ITA";
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $res = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode !== 200) respondError(500, 'Autocomplete failed.', ['here_response' => $res]);
    
    echo $res;
    exit;
}

// Haversine formula
function haversineDistance($lat1, $lon1, $lat2, $lon2) {
    $earthRadius = 6371; // km
    $lat1 = deg2rad((float)$lat1);
    $lon1 = deg2rad((float)$lon1);
    $lat2 = deg2rad((float)$lat2);
    $lon2 = deg2rad((float)$lon2);

    $dlat = $lat2 - $lat1;
    $dlon = $lon2 - $lon1;

    $a = sin($dlat / 2) * sin($dlat / 2) + cos($lat1) * cos($lat2) * sin($dlon / 2) * sin($dlon / 2);
    $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
    return $earthRadius * $c;
}

if ($action === 'calculate') {
    $address = $_GET['address'] ?? '';
    $quantity = (int)($_GET['quantity'] ?? 1);
    
    if (!$address) respondError(400, 'Missing address.');
    if ($quantity < 1) respondError(400, 'Invalid quantity.');
    
    if ($quantity > 24) {
        echo json_encode(['calculable' => false, 'reason' => 'out_of_bounds_qty']);
        exit;
    }
    
    // 1. Geocode Address
    $geoUrl = "https://geocode.search.hereapi.com/v1/geocode?q=" . urlencode($address) . "&apiKey=" . $hereApiKey;
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $geoUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $geoRes = curl_exec($ch);
    curl_close($ch);
    
    $geoData = json_decode($geoRes, true);
    if (empty($geoData['items'])) {
        respondError(404, 'Address not found.');
    }
    
    $userLat = $geoData['items'][0]['position']['lat'];
    $userLng = $geoData['items'][0]['position']['lng'];
    
    // Load Depots
    $depotsJson = @file_get_contents(__DIR__ . '/../data/depots.json');
    $depots = json_decode($depotsJson, true) ?: [];
    
    // Sort depots by haversine distance
    foreach ($depots as &$d) {
        if (!isset($d['lat']) || !isset($d['lng'])) {
            $d['haversine_distance'] = 999999;
            continue;
        }
        $d['haversine_distance'] = haversineDistance($userLat, $userLng, $d['lat'], $d['lng']);
    }
    usort($depots, function($a, $b) {
        return $a['haversine_distance'] <=> $b['haversine_distance'];
    });
    
    $topDepots = array_slice($depots, 0, 3);
    $bestDepot = null;
    $shortestDistanceKm = 999999;
    
    // Fast path for qty 20-24: routing is unnecessary since price is 0 (as confirmed by user)
    // We still pick the closest depot by haversine for informational purposes
    if ($quantity >= 20 && $quantity <= 24) {
        $bestDepot = $topDepots[0];
        $shortestDistanceKm = $bestDepot['haversine_distance']; // Mock distance, not billed anyway
    } else {
        // Routing API for top 3
        foreach ($topDepots as $d) {
            $origin = $d['lat'] . ',' . $d['lng'];
            $dest = $userLat . ',' . $userLng;
            // return=summary gives distance/duration without large polyline. 
            // This is explicitely a one-way (aller simple) route from origin to destination.
            $routeUrl = "https://router.hereapi.com/v8/routes?transportMode=truck&origin={$origin}&destination={$dest}&return=summary&apiKey=" . $hereApiKey;
            
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $routeUrl);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $routeRes = curl_exec($ch);
            curl_close($ch);
            
            $routeData = json_decode($routeRes, true);
            if (isset($routeData['routes'][0]['sections'][0]['summary']['length'])) {
                $distKm = $routeData['routes'][0]['sections'][0]['summary']['length'] / 1000; // meters to km
                if ($distKm < $shortestDistanceKm) {
                    $shortestDistanceKm = $distKm;
                    $bestDepot = $d;
                }
            }
        }
    }
    
    if (!$bestDepot || $shortestDistanceKm > 1000) {
        echo json_encode(['calculable' => false, 'reason' => 'out_of_bounds_dist']);
        exit;
    }
    
    // Pricing
    $basePrice = 0;
    if ($quantity == 1) $basePrice = 70;
    elseif ($quantity >= 2 && $quantity <= 4) $basePrice = 100;
    elseif ($quantity >= 5 && $quantity <= 9) $basePrice = 140;
    elseif ($quantity >= 10 && $quantity <= 19) $basePrice = 180;
    elseif ($quantity >= 20 && $quantity <= 24) $basePrice = 0;
    
    $shippingPrice = $basePrice;
    
    if ($basePrice > 0 && $shortestDistanceKm > 50) {
        // 20€ par tranche entière supplémentaire de 50km
        $extraTranches = max(0, ceil($shortestDistanceKm / 50) - 1);
        $shippingPrice += ($extraTranches * 20);
    }
    
    echo json_encode([
        'calculable' => true,
        'shipping_price' => $shippingPrice,
        'distance_km' => round($shortestDistanceKm, 1),
        'depot' => $bestDepot['ville'],
        'depot_country' => $bestDepot['pays'],
        'quantity' => $quantity
    ]);
    exit;
}

respondError(400, 'Invalid action');
