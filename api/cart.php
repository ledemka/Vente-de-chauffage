<?php
/**
 * B2B Cart API
 */
declare(strict_types=1);

session_start();
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

function respondError(int $statusCode, string $message, array $details = []): void {
    http_response_code($statusCode);
    echo json_encode(['success' => false, 'message' => $message, 'details' => $details], JSON_UNESCAPED_UNICODE);
    exit;
}

$input = [];
$rawBody = file_get_contents('php://input');
if ($rawBody) {
    $decoded = json_decode($rawBody, true);
    if (is_array($decoded)) {
        $input = $decoded;
    }
}
$input = array_merge($input, $_POST, $_GET);

$action = $input['action'] ?? '';
$session_token = $input['session_token'] ?? '';
$client_id = $_SESSION['client_id'] ?? null;

if (!$client_id && !$session_token) {
    // Generate a session token if none exists for guest
    $session_token = bin2hex(random_bytes(32));
}

try {
    $db = new Database();
    $pdo = $db->getConnection();
    if ($pdo === null) throw new Exception("DB Connection failed");

    // 1. Cleanup guest carts older than 30 days
    $pdo->exec("DELETE FROM cart_items WHERE client_id IS NULL AND session_token IS NOT NULL AND updated_at < NOW() - INTERVAL 30 DAY");

    // Helper: get products data
    function getProductsData() {
        $json = @file_get_contents(__DIR__ . '/../data/products.json');
        if (!$json) return [];
        return json_decode($json, true) ?: [];
    }

    function calculateVolumeDiscountPHP($wholesalePrice, $quantity) {
        $qty = max(1, (int)$quantity);
        $basePrice = (float)$wholesalePrice;
        $tier = 1;
        $discountPercentage = 0;
        
        if ($qty < 2) {
            $tier = 1; $discountPercentage = 0;
        } elseif ($qty >= 2 && $qty <= 4) {
            $tier = 2; $discountPercentage = 4;
        } elseif ($qty >= 5 && $qty <= 9) {
            $tier = 3; $discountPercentage = 6;
        } elseif ($qty >= 10 && $qty <= 19) {
            $tier = 4; $discountPercentage = 8;
        } else {
            $tier = 5; $discountPercentage = 10;
        }
        
        $discountedUnitPrice = $basePrice * (1 - $discountPercentage / 100);
        $totalPrice = $discountedUnitPrice * $qty;
        
        return [
            'quantity' => $qty,
            'tier' => $tier,
            'discountPercentage' => $discountPercentage,
            'wholesaleBasePrice' => $basePrice,
            'discountedUnitPrice' => round($discountedUnitPrice, 2),
            'totalPrice' => round($totalPrice, 2)
        ];
    }

    if ($action === 'sync' && $client_id && $session_token) {
        // User just logged in, merge guest cart into client cart
        $stmt = $pdo->prepare("SELECT product_id, quantity FROM cart_items WHERE session_token = ? AND client_id IS NULL");
        $stmt->execute([$session_token]);
        $guestItems = $stmt->fetchAll();

        foreach ($guestItems as $item) {
            // Check if user already has this product
            $chk = $pdo->prepare("SELECT id, quantity FROM cart_items WHERE client_id = ? AND product_id = ?");
            $chk->execute([$client_id, $item['product_id']]);
            $existing = $chk->fetch();

            if ($existing) {
                $upd = $pdo->prepare("UPDATE cart_items SET quantity = quantity + ? WHERE id = ?");
                $upd->execute([$item['quantity'], $existing['id']]);
            } else {
                $ins = $pdo->prepare("INSERT INTO cart_items (client_id, product_id, quantity) VALUES (?, ?, ?)");
                $ins->execute([$client_id, $item['product_id'], $item['quantity']]);
            }
        }
        // Delete guest cart items
        $pdo->prepare("DELETE FROM cart_items WHERE session_token = ? AND client_id IS NULL")->execute([$session_token]);
        
        echo json_encode(['success' => true, 'message' => 'Cart synced']);
        exit;
    }
    elseif ($action === 'add' || $action === 'update') {
        $product_id = $input['product_id'] ?? '';
        $quantity = max(1, (int)($input['quantity'] ?? 1));
        
        if (!$product_id) respondError(400, 'Produit manquant');
        
        // Find existing
        if ($client_id) {
            $stmt = $pdo->prepare("SELECT id, quantity FROM cart_items WHERE client_id = ? AND product_id = ?");
            $stmt->execute([$client_id, $product_id]);
        } else {
            $stmt = $pdo->prepare("SELECT id, quantity FROM cart_items WHERE session_token = ? AND product_id = ? AND client_id IS NULL");
            $stmt->execute([$session_token, $product_id]);
        }
        $existing = $stmt->fetch();

        if ($existing) {
            $newQty = $action === 'add' ? $existing['quantity'] + $quantity : $quantity;
            $pdo->prepare("UPDATE cart_items SET quantity = ? WHERE id = ?")->execute([$newQty, $existing['id']]);
        } else {
            if ($client_id) {
                $pdo->prepare("INSERT INTO cart_items (client_id, product_id, quantity) VALUES (?, ?, ?)")->execute([$client_id, $product_id, $quantity]);
            } else {
                $pdo->prepare("INSERT INTO cart_items (session_token, product_id, quantity) VALUES (?, ?, ?)")->execute([$session_token, $product_id, $quantity]);
            }
        }
        
        echo json_encode(['success' => true, 'session_token' => $session_token]);
        exit;
    }
    elseif ($action === 'remove') {
        $product_id = $input['product_id'] ?? '';
        if ($client_id) {
            $pdo->prepare("DELETE FROM cart_items WHERE client_id = ? AND product_id = ?")->execute([$client_id, $product_id]);
        } else {
            $pdo->prepare("DELETE FROM cart_items WHERE session_token = ? AND product_id = ? AND client_id IS NULL")->execute([$session_token, $product_id]);
        }
        echo json_encode(['success' => true]);
        exit;
    }
    elseif ($action === 'get') {
        if ($client_id) {
            $stmt = $pdo->prepare("SELECT product_id, quantity FROM cart_items WHERE client_id = ?");
            $stmt->execute([$client_id]);
        } else {
            $stmt = $pdo->prepare("SELECT product_id, quantity FROM cart_items WHERE session_token = ? AND client_id IS NULL");
            $stmt->execute([$session_token]);
        }
        $items = $stmt->fetchAll();
        
        $products = getProductsData();
        $productsMap = [];
        foreach ($products as $p) {
            $productsMap[$p['id']] = $p;
        }

        $cartData = [];
        $subtotal = 0;
        
        foreach ($items as $item) {
            $pid = $item['product_id'];
            if (isset($productsMap[$pid])) {
                $p = $productsMap[$pid];
                $calc = calculateVolumeDiscountPHP($p['wholesale_price'] ?? 0, $item['quantity']);
                
                $cartData[] = [
                    'product_id' => $pid,
                    'name' => $p['name'],
                    'format' => $p['format'],
                    'image' => $p['image_product'] ?? '',
                    'quantity' => $calc['quantity'],
                    'wholesale_price' => $calc['wholesaleBasePrice'],
                    'discount_percent' => $calc['discountPercentage'],
                    'unit_price' => $calc['discountedUnitPrice'],
                    'total' => $calc['totalPrice']
                ];
                $subtotal += $calc['totalPrice'];
            }
        }
        
        echo json_encode([
            'success' => true,
            'items' => $cartData,
            'subtotal' => round($subtotal, 2),
            'session_token' => $session_token
        ]);
        exit;
    }
    else {
        respondError(400, 'Action invalide');
    }

} catch (Exception $e) {
    error_log("Cart Error: " . $e->getMessage());
    respondError(500, "Erreur interne.");
}
