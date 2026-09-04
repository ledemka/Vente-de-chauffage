<?php
/**
 * B2B Order API
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

// Parse .env at project root
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
                $parts = explode('=', $line, 2);
                if (count($parts) === 2) {
                    $key = trim($parts[0]);
                    $value = trim($parts[1]);
                    if (preg_match('/^"([\s\S]*?)"$/', $value, $m)) $value = $m[1];
                    elseif (preg_match("/^'([\s\S]*?)'$/", $value, $m)) $value = $m[1];
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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respondError(405, 'Méthode non autorisée.');
}

$input = [];
$rawBody = file_get_contents('php://input');
if ($rawBody) {
    $decoded = json_decode($rawBody, true);
    if (is_array($decoded)) $input = $decoded;
}
$input = array_merge($input, $_POST);

// Validation
$required = ['delivery_address', 'company', 'contact_name', 'email', 'phone'];
foreach ($required as $req) {
    if (empty($input[$req])) respondError(400, "Le champ {$req} est obligatoire.");
}
if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) respondError(400, 'Email invalide.');

$client_id = $_SESSION['client_id'] ?? null;
$session_token = $input['session_token'] ?? '';
if (!$client_id && !$session_token) respondError(400, 'Session invalide.');

try {
    $db = new Database();
    $pdo = $db->getConnection();
    if ($pdo === null) throw new Exception("DB error");

    // 1. Get Cart Items
    if ($client_id) {
        $stmt = $pdo->prepare("SELECT product_id, quantity FROM cart_items WHERE client_id = ?");
        $stmt->execute([$client_id]);
    } else {
        $stmt = $pdo->prepare("SELECT product_id, quantity FROM cart_items WHERE session_token = ? AND client_id IS NULL");
        $stmt->execute([$session_token]);
    }
    $cartItems = $stmt->fetchAll();
    if (empty($cartItems)) respondError(400, 'Votre panier est vide.');

    // 2. Fetch products and calculate prices securely
    $json = @file_get_contents(__DIR__ . '/../data/products.json');
    $productsRaw = json_decode($json, true) ?: [];
    $productsMap = [];
    foreach ($productsRaw as $p) {
        $productsMap[$p['id']] = $p;
    }

    $orderItems = [];
    $subtotal = 0;
    
    foreach ($cartItems as $item) {
        $pid = $item['product_id'];
        if (isset($productsMap[$pid])) {
            $p = $productsMap[$pid];
            $qty = max(1, (int)$item['quantity']);
            $basePrice = (float)$p['wholesale_price'];
            
            // Calculate tier discount
            $tier = 1; $discountPercentage = 0;
            if ($qty < 2) { $tier = 1; $discountPercentage = 0; }
            elseif ($qty >= 2 && $qty <= 4) { $tier = 2; $discountPercentage = 4; }
            elseif ($qty >= 5 && $qty <= 9) { $tier = 3; $discountPercentage = 6; }
            elseif ($qty >= 10 && $qty <= 19) { $tier = 4; $discountPercentage = 8; }
            else { $tier = 5; $discountPercentage = 10; }
            
            $discountedUnitPrice = $basePrice * (1 - $discountPercentage / 100);
            $totalPrice = $discountedUnitPrice * $qty;
            
            $orderItems[] = [
                'product_id' => $pid,
                'name' => $p['name'],
                'format' => $p['format'],
                'quantity' => $qty,
                'wholesale_price' => $basePrice,
                'discount_percent' => $discountPercentage,
                'unit_price' => round($discountedUnitPrice, 2),
                'total' => round($totalPrice, 2)
            ];
            $subtotal += $totalPrice;
        }
    }

    // 3. Insert Order
    $orderRef = 'TF-' . date('Y') . '-' . strtoupper(bin2hex(random_bytes(3))); // e.g. TF-2026-A1B2C3
    
    $lang = strtolower(trim((string)($input['lang'] ?? 'fr')));
    $truck_access = trim((string)($input['truck_access'] ?? 'non_specifie'));
    
    $stmt = $pdo->prepare("INSERT INTO orders (
        order_reference, client_id, company, siret, contact_name, email, phone, 
        delivery_address, truck_access, items, subtotal, discount_tier, 
        discount_percent, total, payment_method, status, lang
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'virement', 'pending_payment', ?)");
    
    // Simplification for global discount tier logging based on max tier in cart
    $maxTier = 1; $maxDiscountPct = 0;
    foreach ($orderItems as $item) {
        if ($item['discount_percent'] > $maxDiscountPct) {
            $maxDiscountPct = $item['discount_percent'];
            // Re-derive tier approximately
            if ($maxDiscountPct == 4) $maxTier = 2;
            elseif ($maxDiscountPct == 6) $maxTier = 3;
            elseif ($maxDiscountPct == 8) $maxTier = 4;
            elseif ($maxDiscountPct == 10) $maxTier = 5;
        }
    }

    $stmt->execute([
        $orderRef,
        $client_id,
        trim((string)$input['company']),
        trim((string)($input['siret'] ?? '')),
        trim((string)$input['contact_name']),
        trim((string)$input['email']),
        trim((string)$input['phone']),
        trim((string)$input['delivery_address']),
        $truck_access,
        json_encode($orderItems, JSON_UNESCAPED_UNICODE),
        round($subtotal, 2),
        $maxTier,
        $maxDiscountPct,
        round($subtotal, 2), // Total is same as subtotal here since discounts are per-item
        $lang
    ]);
    $orderId = $pdo->lastInsertId();

    // 4. Clear Cart
    if ($client_id) {
        $pdo->prepare("DELETE FROM cart_items WHERE client_id = ?")->execute([$client_id]);
    } else {
        $pdo->prepare("DELETE FROM cart_items WHERE session_token = ? AND client_id IS NULL")->execute([$session_token]);
    }

    // 5. Send Confirmation Email (Virement Bancaire)
    $resendApiKey = getEnvVar('RESEND_API_KEY');
    $fromEmail = getEnvVar('FROM_EMAIL');
    $toEmail = getEnvVar('TO_EMAIL');

    if ($resendApiKey && $fromEmail && $toEmail) {
        $clientSubjectMap = [
            'fr' => "Confirmation de commande {$orderRef} - Virement attendu",
            'en' => "Order Confirmation {$orderRef} - Bank transfer required",
            'de' => "Bestellbestätigung {$orderRef} - Banküberweisung erforderlich",
            'nl' => "Orderbevestiging {$orderRef} - Bankoverschrijving vereist"
        ];
        $clientSubject = $clientSubjectMap[$lang] ?? $clientSubjectMap['fr'];

        $contactNameHtml = htmlspecialchars(trim((string)$input['contact_name']));
        $totalFmt = number_format(round($subtotal, 2), 2, ',', ' ') . ' €';

        $clientHtmlMap = [
            'fr' => "
                <h2>Merci pour votre commande {$orderRef}</h2>
                <p>Bonjour {$contactNameHtml},</p>
                <p>Votre commande d'un montant de <strong>{$totalFmt} HT</strong> a bien été enregistrée.</p>
                <p style='color:#d32f2f; font-weight:bold;'>IMPORTANT : Paiement par virement bancaire uniquement.</p>
                <p>Nos coordonnées bancaires (IBAN) vous seront communiquées séparément par notre service comptabilité après validation logistique.</p>
                <p>Votre commande sera expédiée dès réception du virement sur notre compte.</p>
                <p>Cordialement,<br>L'équipe Terre & Feu</p>
            ",
            'en' => "
                <h2>Thank you for your order {$orderRef}</h2>
                <p>Hello {$contactNameHtml},</p>
                <p>Your order for a total of <strong>{$totalFmt} (excl. tax)</strong> has been successfully registered.</p>
                <p style='color:#d32f2f; font-weight:bold;'>IMPORTANT: Payment by bank transfer only.</p>
                <p>Our bank details (IBAN) will be communicated to you separately by our accounting department after logistics validation.</p>
                <p>Your order will be shipped upon receipt of the transfer to our account.</p>
                <p>Best regards,<br>The Terre & Feu Team</p>
            ",
            // Fallback for others to english or simple translation
            'de' => "
                <h2>Vielen Dank für Ihre Bestellung {$orderRef}</h2>
                <p>Hallo {$contactNameHtml},</p>
                <p>Ihre Bestellung über insgesamt <strong>{$totalFmt} (exkl. MwSt.)</strong> wurde erfolgreich registriert.</p>
                <p style='color:#d32f2f; font-weight:bold;'>WICHTIG: Zahlung nur per Banküberweisung.</p>
                <p>Unsere Bankverbindung (IBAN) wird Ihnen nach der Logistikprüfung von unserer Buchhaltung separat mitgeteilt.</p>
                <p>Ihre Bestellung wird nach Eingang der Überweisung auf unserem Konto versandt.</p>
                <p>Mit freundlichen Grüßen,<br>Ihr Terre & Feu Team</p>
            ",
            'nl' => "
                <h2>Bedankt voor uw bestelling {$orderRef}</h2>
                <p>Hallo {$contactNameHtml},</p>
                <p>Uw bestelling voor een totaal van <strong>{$totalFmt} (excl. btw)</strong> is succesvol geregistreerd.</p>
                <p style='color:#d32f2f; font-weight:bold;'>BELANGRIJK: Betaling alleen via bankoverschrijving.</p>
                <p>Onze bankgegevens (IBAN) worden na logistieke validatie apart door onze boekhoudafdeling aan u gecommuniceerd.</p>
                <p>Uw bestelling wordt verzonden na ontvangst van de overschrijving op onze rekening.</p>
                <p>Met vriendelijke groet,<br>Het Terre & Feu Team</p>
            "
        ];
        $clientHtml = $clientHtmlMap[$lang] ?? $clientHtmlMap['fr'];
        
        $clientText = strip_tags(str_replace(['<br>', '<h2>', '</h2>', '<p>', '</p>'], ["\n", "\n\n", "\n\n", "", "\n\n"], $clientHtml));

        // Internal Notif
        $internalHtml = "<h2>Nouvelle Commande B2B: {$orderRef}</h2>
        <p>Montant: {$totalFmt} HT</p>
        <p>Client: " . htmlspecialchars(trim((string)$input['company'])) . " ({$contactNameHtml})</p>
        <p>Email: " . htmlspecialchars(trim((string)$input['email'])) . "</p>";

        function sendResendEmail(string $apiKey, string $from, string $to, string $subject, string $html, string $text): void {
            $url = 'https://api.resend.com/emails';
            $data = ['from' => $from, 'to' => [$to], 'subject' => $subject, 'html' => $html, 'text' => $text];
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . $apiKey, 'Content-Type: application/json']);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_exec($ch);
            curl_close($ch);
        }

        sendResendEmail($resendApiKey, $fromEmail, trim((string)$input['email']), $clientSubject, $clientHtml, $clientText);
        sendResendEmail($resendApiKey, $fromEmail, $toEmail, "[COMMANDE B2B] " . $orderRef, $internalHtml, strip_tags($internalHtml));
    }

    echo json_encode(['success' => true, 'order_reference' => $orderRef]);
    exit;

} catch (Exception $e) {
    error_log("Order Error: " . $e->getMessage());
    respondError(500, "Erreur interne lors de la commande.");
}
