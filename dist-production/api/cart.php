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

    require_once __DIR__ . '/pricing.php';

    if ($action === 'sync' && $client_id && $session_token) {
        // User just logged in, merge guest cart into client cart
        $stmt = $pdo->prepare("SELECT product_id, length, quantity FROM cart_items WHERE session_token = ? AND client_id IS NULL");
        $stmt->execute([$session_token]);
        $guestItems = $stmt->fetchAll();

        foreach ($guestItems as $item) {
            // Check if user already has this product and length
            $chk = $pdo->prepare("SELECT id, quantity FROM cart_items WHERE client_id = ? AND product_id = ? AND (length = ? OR (length IS NULL AND ? IS NULL))");
            $chk->execute([$client_id, $item['product_id'], $item['length'], $item['length']]);
            $existing = $chk->fetch();

            if ($existing) {
                $upd = $pdo->prepare("UPDATE cart_items SET quantity = quantity + ? WHERE id = ?");
                $upd->execute([$item['quantity'], $existing['id']]);
            } else {
                $ins = $pdo->prepare("INSERT INTO cart_items (client_id, product_id, length, quantity) VALUES (?, ?, ?, ?)");
                $ins->execute([$client_id, $item['product_id'], $item['length'], $item['quantity']]);
            }
        }
        // Delete guest cart items
        $pdo->prepare("DELETE FROM cart_items WHERE session_token = ? AND client_id IS NULL")->execute([$session_token]);
        
        echo json_encode(['success' => true, 'message' => 'Cart synced']);
        exit;
    }
    elseif ($action === 'add' || $action === 'update') {
        $product_id = $input['product_id'] ?? '';
        $length = $input['length'] ?? null;
        if ($length === '') $length = null;
        $quantity = max(1, (int)($input['quantity'] ?? 1));
        
        if (!$product_id) respondError(400, 'Produit manquant');
        
        // Find existing
        if ($client_id) {
            $stmt = $pdo->prepare("SELECT id, quantity FROM cart_items WHERE client_id = ? AND product_id = ? AND (length = ? OR (length IS NULL AND ? IS NULL))");
            $stmt->execute([$client_id, $product_id, $length, $length]);
        } else {
            $stmt = $pdo->prepare("SELECT id, quantity FROM cart_items WHERE session_token = ? AND product_id = ? AND client_id IS NULL AND (length = ? OR (length IS NULL AND ? IS NULL))");
            $stmt->execute([$session_token, $product_id, $length, $length]);
        }
        $existing = $stmt->fetch();

        if ($existing) {
            $newQty = $action === 'add' ? $existing['quantity'] + $quantity : $quantity;
            $pdo->prepare("UPDATE cart_items SET quantity = ? WHERE id = ?")->execute([$newQty, $existing['id']]);
        } else {
            if ($client_id) {
                $pdo->prepare("INSERT INTO cart_items (client_id, product_id, length, quantity) VALUES (?, ?, ?, ?)")->execute([$client_id, $product_id, $length, $quantity]);
            } else {
                $pdo->prepare("INSERT INTO cart_items (session_token, product_id, length, quantity) VALUES (?, ?, ?, ?)")->execute([$session_token, $product_id, $length, $quantity]);
            }
        }
        
        echo json_encode(['success' => true, 'session_token' => $session_token]);
        exit;
    }
    elseif ($action === 'remove') {
        $product_id = $input['product_id'] ?? '';
        $length = $input['length'] ?? null;
        if ($length === '') $length = null;

        if ($client_id) {
            $pdo->prepare("DELETE FROM cart_items WHERE client_id = ? AND product_id = ? AND (length = ? OR (length IS NULL AND ? IS NULL))")->execute([$client_id, $product_id, $length, $length]);
        } else {
            $pdo->prepare("DELETE FROM cart_items WHERE session_token = ? AND product_id = ? AND client_id IS NULL AND (length = ? OR (length IS NULL AND ? IS NULL))")->execute([$session_token, $product_id, $length, $length]);
        }
        echo json_encode(['success' => true]);
        exit;
    }
    elseif ($action === 'clear') {
        if ($client_id) {
            $pdo->prepare("DELETE FROM cart_items WHERE client_id = ?")->execute([$client_id]);
        } else {
            $pdo->prepare("DELETE FROM cart_items WHERE session_token = ? AND client_id IS NULL")->execute([$session_token]);
        }
        echo json_encode(['success' => true]);
        exit;
    }
    elseif ($action === 'get') {
        if ($client_id) {
            $stmt = $pdo->prepare("SELECT product_id, length, quantity FROM cart_items WHERE client_id = ?");
            $stmt->execute([$client_id]);
        } else {
            $stmt = $pdo->prepare("SELECT product_id, length, quantity FROM cart_items WHERE session_token = ? AND client_id IS NULL");
            $stmt->execute([$session_token]);
        }
        $items = $stmt->fetchAll();
        
        $products = getProductsData();
        $productsMap = [];
        foreach ($products as $p) {
            $productsMap[$p['id']] = $p;
        }

        // 1. Calculate total palettes
        $totalPalettes = 0;
        foreach ($items as $item) {
            $totalPalettes += max(1, (int)$item['quantity']);
        }
        
        // 2. Get global discount
        $globalDiscount = calculateGlobalDiscount($totalPalettes);
        $globalDiscountPercent = $globalDiscount['discount_percent'];

        $cartData = [];
        $subtotal = 0;
        
        foreach ($items as $item) {
            $pid = $item['product_id'];
            if (isset($productsMap[$pid])) {
                $p = $productsMap[$pid];
                $len = $item['length'];
                
                // If a length was requested but the product doesn't support it or the length doesn't exist, we skip it
                if ($len !== null && (!isset($p['prices_by_length']) || !isset($p['prices_by_length'][$len]))) {
                    continue; // Skip invalid lengths added maliciously
                }
                
                $calc = calculateLinePrice($p, $len, (int)$item['quantity'], (float)$globalDiscountPercent);

                $cartData[] = [
                    'product_id' => $pid,
                    'name' => $p['name'],
                    'length' => $len,
                    'format' => $len ? $len . ' cm' : $p['format'],
                    'image' => $p['image_product'] ?? '',
                    'quantity' => $calc['quantity'],
                    'wholesale_price' => $calc['unit_price_catalog_ht'],
                    'discount_percent' => $calc['discount_percent'],
                    'unit_price' => $calc['unit_price_net_ht'],
                    'total' => $calc['total_ht']
                ];
                $subtotal += $calc['total_ht'];
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
