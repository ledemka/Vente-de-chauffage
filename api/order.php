<?php
/**
 * B2B Order API
 */
declare(strict_types=1);

require_once __DIR__ . '/db.php';
session_start();

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
}

require_once __DIR__ . '/dompdf/autoload.inc.php';
use Dompdf\Dompdf;
use Dompdf\Options;

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

// Validation — "company" est facultatif (utile pour les particuliers, obligatoire seulement côté pro à l'inscription)
$required = ['delivery_address', 'contact_name', 'email', 'phone'];
foreach ($required as $req) {
    if (empty($input[$req])) respondError(400, "Le champ {$req} est obligatoire.");
}
if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) respondError(400, 'Email invalide.');

$company = trim((string)($input['company'] ?? ''));

$client_id = $_SESSION['client_id'] ?? null;
$session_token = $input['session_token'] ?? '';
if (!$client_id && !$session_token) respondError(400, 'Session invalide.');

try {
    $db = new Database();
    $pdo = $db->getConnection();
    if ($pdo === null) throw new Exception("DB error");

    // 1. Get Cart Items
    if ($client_id) {
        $stmt = $pdo->prepare("SELECT product_id, length, quantity FROM cart_items WHERE client_id = ?");
        $stmt->execute([$client_id]);
    } else {
        $stmt = $pdo->prepare("SELECT product_id, length, quantity FROM cart_items WHERE session_token = ? AND client_id IS NULL");
        $stmt->execute([$session_token]);
    }
    $cartItems = $stmt->fetchAll();
    if (empty($cartItems)) respondError(400, 'Votre panier est vide.');

    require_once __DIR__ . '/pricing.php';

    // 2. Fetch products and calculate prices securely
    $productsRaw = getProductsData();
    $productsMap = [];
    foreach ($productsRaw as $p) {
        $productsMap[$p['id']] = $p;
    }

    // Calculate total palettes
    $totalPalettes = 0;
    foreach ($cartItems as $item) {
        $totalPalettes += max(1, (int)$item['quantity']);
    }

    // Get global discount
    $globalDiscount = calculateGlobalDiscount($totalPalettes);
    $globalDiscountPercent = $globalDiscount['discount_percent'];
    $globalTier = $globalDiscount['tier'];

    $orderItems = [];
    $subtotal = 0;

    $lang = strtolower(trim((string)($input['lang'] ?? 'fr')));

    foreach ($cartItems as $item) {
        $pid = $item['product_id'];
        $len = $item['length'];

        if (isset($productsMap[$pid])) {
            $p = $productsMap[$pid];

            if ($len !== null && (!isset($p['prices_by_length']) || !isset($p['prices_by_length'][$len]))) {
                continue;
            }

            $calc = calculateLinePrice($p, $len, (int)$item['quantity'], (float)$globalDiscountPercent);

            $orderItems[] = [
                'product_id' => $pid,
                'name' => is_array($p['name']) ? ($p['name'][$lang] ?? $p['name']['fr']) : $p['name'],
                'length' => $len,
                'format' => $len ? $len . ' cm' : $p['format'],
                'quantity' => $calc['quantity'],
                'unit_price_catalog_ht' => $calc['unit_price_catalog_ht'],
                'discount_percent' => $calc['discount_percent'],
                'unit_price_net_ht' => $calc['unit_price_net_ht'],
                'total_ht' => $calc['total_ht']
            ];
            $subtotal += $calc['total_ht'];
        }
    }

    // 3. Insert Order
    $orderRef = 'TF-' . date('Y') . '-' . strtoupper(bin2hex(random_bytes(3)));

    $truck_access = trim((string)($input['truck_access'] ?? 'non_specifie'));

    $client_first_name = null;
    $client_postal_code = null;
    $client_city = null;

    if ($client_id) {
        $stmtClient = $pdo->prepare("SELECT first_name, postal_code, city FROM clients WHERE id = ?");
        $stmtClient->execute([$client_id]);
        $cData = $stmtClient->fetch(PDO::FETCH_ASSOC);
        if ($cData) {
            $client_first_name = $cData['first_name'];
            $client_postal_code = $cData['postal_code'];
            $client_city = $cData['city'];
        }
    }

    $stmt = $pdo->prepare("INSERT INTO orders (
        order_reference, client_id, company, siret, contact_name, first_name, email, phone, 
        delivery_address, postal_code, city, truck_access, items, subtotal, discount_tier, 
        discount_percent, total, payment_method, status, lang
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'virement', 'pending_payment', ?)");

    $stmt->execute([
        $orderRef,
        $client_id,
        $company,
        trim((string)($input['siret'] ?? '')),
        trim((string)$input['contact_name']),
        $client_first_name,
        trim((string)$input['email']),
        trim((string)$input['phone']),
        trim((string)$input['delivery_address']),
        $client_postal_code,
        $client_city,
        $truck_access,
        json_encode($orderItems, JSON_UNESCAPED_UNICODE),
        round($subtotal, 2),
        $globalTier,
        $globalDiscountPercent,
        round($subtotal, 2),
        $lang
    ]);
    $orderId = $pdo->lastInsertId();

    // 3b. Generate PDF in memory for email attachment
    $pdfBytes = null;
    try {
        $tva_rate  = 0.20;
        $total_ht  = round($subtotal, 2);
        $total_tva = round($total_ht * $tva_rate, 2);
        $total_ttc = round($total_ht + $total_tva, 2);
        $date      = date('d/m/Y');

        $clientBlockName = $company !== '' ? $company : trim((string)$input['contact_name']);

        $pdfHtml = '<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><title>Bon de commande - ' . htmlspecialchars($orderRef) . '</title>
<style>
  body{font-family:"Helvetica","Arial",sans-serif;font-size:13px;color:#333;margin:0;padding:20px}
  .header{width:100%;border-bottom:3px solid #802813;padding-bottom:20px;margin-bottom:30px}
  .logo{font-size:28px;font-weight:bold;color:#802813;margin-bottom:10px}
  .co-info{font-size:11px;color:#666;line-height:1.5}
  .doc-title{text-align:right;margin-top:-60px}
  .doc-title h1{color:#802813;font-size:24px;margin:0;text-transform:uppercase}
  .doc-title p{margin:5px 0 0 0;font-size:14px;font-weight:bold}
  .addresses{width:100%;margin-bottom:40px}
  .address-box{width:45%;padding:15px;border:1px solid #ddd;background:#f9f9f9;border-radius:4px}
  .address-box h3{margin-top:0;margin-bottom:10px;font-size:14px;color:#802813;border-bottom:1px solid #ddd;padding-bottom:5px}
  .address-box p{margin:0 0 5px 0;line-height:1.4}
  table.items{width:100%;border-collapse:collapse;margin-bottom:30px}
  table.items th{background:#802813;color:#fff;padding:10px;text-align:left;font-size:12px}
  table.items td{padding:10px;border-bottom:1px solid #eee}
  table.items th.right,table.items td.right{text-align:right}
  table.items th.center,table.items td.center{text-align:center}
  .totals{width:40%;float:right;margin-bottom:40px}
  .totals table{width:100%;border-collapse:collapse}
  .totals table td{padding:8px;border-bottom:1px solid #eee}
  .totals table tr.grand-total td{font-weight:bold;font-size:16px;color:#802813;border-top:2px solid #802813;border-bottom:none}
  .payment-info{clear:both;background:#f5f5f5;border-left:4px solid #802813;padding:15px;margin-bottom:40px}
  .payment-info h4{margin-top:0;margin-bottom:10px;color:#802813}
  .footer{position:fixed;bottom:-20px;left:0;right:0;text-align:center;font-size:10px;color:#999;border-top:1px solid #eee;padding-top:10px}
</style></head><body>
<table class="header"><tr>
  <td width="50%"><div class="logo">sotramsbois</div><div class="co-info">[Adresse à compléter]</div></td>
  <td width="50%" class="doc-title"><h1>BON DE COMMANDE</h1><p>Réf: ' . htmlspecialchars($orderRef) . '</p><p>Date: ' . $date . '</p></td>
</tr></table>
<table class="addresses"><tr>
  <td class="address-box" valign="top">
    <h3>Facturé / Livré à</h3>
    <p><strong>' . htmlspecialchars($clientBlockName) . '</strong></p>
    <p>' . htmlspecialchars(trim((string)$input['contact_name'])) . '</p>
    <p>' . nl2br(htmlspecialchars(trim((string)$input['delivery_address']))) . '</p>
    <p>Tél: ' . htmlspecialchars(trim((string)$input['phone'])) . '</p>
    <p>Email: ' . htmlspecialchars(trim((string)$input['email'])) . '</p>
  </td>
  <td width="10%"></td>
  <td class="address-box" valign="top">
    <h3>Informations de livraison</h3>
    <p><strong>Statut:</strong> En attente de paiement</p>
    <p><em>Nous vous contacterons pour planifier la livraison.</em></p>
  </td>
</tr></table>
<table class="items"><thead><tr>
  <th>Désignation</th><th>Format</th><th class="center">Qté</th><th class="right">Prix cat. HT</th><th class="right">Remise</th><th class="right">Prix net HT</th><th class="right">Total HT</th>
</tr></thead><tbody>';

        foreach ($orderItems as $oi) {
            $pu_ht    = floatval($oi['unit_price_net_ht'] ?? 0);
            $catalog_ht = floatval($oi['unit_price_catalog_ht'] ?? 0);
            $discount = floatval($oi['discount_percent'] ?? 0);
            $oi_qty   = intval($oi['quantity']);
            $line_ht  = floatval($oi['total_ht'] ?? 0);

            $discountStr = $discount > 0 ? "-{$discount}%" : '';

            $pdfHtml .= '<tr>
  <td><strong>' . htmlspecialchars($oi['name']) . '</strong></td>
  <td>' . htmlspecialchars($oi['format'] ?? '') . '</td>
  <td class="center">' . $oi_qty . '</td>
  <td class="right">' . number_format($catalog_ht, 2, ',', ' ') . ' €</td>
  <td class="right">' . $discountStr . '</td>
  <td class="right">' . number_format($pu_ht, 2, ',', ' ') . ' €</td>
  <td class="right">' . number_format($line_ht, 2, ',', ' ') . ' €</td>
</tr>';
        }

        $pdfHtml .= '</tbody></table>
<div class="totals"><table>
  <tr><td>Sous-total HT</td><td class="right">' . number_format($total_ht, 2, ',', ' ') . ' €</td></tr>
  <tr><td>TVA (20%)</td><td class="right">' . number_format($total_tva, 2, ',', ' ') . ' €</td></tr>
  <tr class="grand-total"><td>TOTAL TTC</td><td class="right">' . number_format($total_ttc, 2, ',', ' ') . ' €</td></tr>
</table></div>
<div class="payment-info">
  <h4>Instructions de paiement</h4>
  <table style="width:100%;border-collapse:collapse;font-size:13px">
    <tr><td style="padding:4px 0;width:40%"><strong>Mode :</strong></td><td style="padding:4px 0">Virement Bancaire (SEPA)</td></tr>
    <tr><td style="padding:4px 0"><strong>Bénéficiaire :</strong></td><td style="padding:4px 0">CAMARA LANSANA</td></tr>
    <tr><td style="padding:4px 0"><strong>Pour :</strong></td><td style="padding:4px 0">SOTRAMSBOIS</td></tr>
    <tr><td style="padding:4px 0"><strong>Banque :</strong></td><td style="padding:4px 0">Qonto</td></tr>
    <tr><td style="padding:4px 0"><strong>IBAN :</strong></td><td style="padding:4px 0">FR76 1695 8000 0154 3879 6652 982</td></tr>
    <tr><td style="padding:4px 0"><strong>BIC :</strong></td><td style="padding:4px 0">QNTOFR P1XXX</td></tr>
    <tr><td style="padding:4px 0"><strong>Référence obligatoire à rappeler :</strong></td><td style="padding:4px 0">' . htmlspecialchars($orderRef) . '</td></tr>
  </table>
  <p style="font-size:11px;font-style:italic;margin-top:10px;color:#666">Votre commande sera validée dès réception du virement.</p>
</div>
<div class="footer">sotramsbois — Bon de commande généré numériquement le ' . date('d/m/Y H:i') . '</div>
</body></html>';

        $opts = new Options();
        $opts->set('defaultFont', 'Helvetica');
        $opts->set('isRemoteEnabled', false);
        $dom = new Dompdf($opts);
        $dom->loadHtml($pdfHtml);
        $dom->setPaper('A4', 'portrait');
        $dom->render();
        $pdfBytes = $dom->output();
    } catch (Exception $pdfEx) {
        error_log('PDF attachment generation failed: ' . $pdfEx->getMessage());
    }

    // 4. Clear Cart
    if ($client_id) {
        $pdo->prepare("DELETE FROM cart_items WHERE client_id = ?")->execute([$client_id]);
    } else {
        $pdo->prepare("DELETE FROM cart_items WHERE session_token = ? AND client_id IS NULL")->execute([$session_token]);
    }

    // 5. Send Confirmation Email (Virement Bancaire)
    $resendApiKey = getEnvVar('RESEND_API_KEY');
    $resendFromEmail = getEnvVar('RESEND_FROM_EMAIL');
    if (empty($resendFromEmail)) $resendFromEmail = getEnvVar('FROM_EMAIL');
    $resendFromName = getEnvVar('RESEND_FROM_NAME', 'sotramsbois');
    $fromEmail = "{$resendFromName} <{$resendFromEmail}>";
    $toEmail = getEnvVar('TO_EMAIL');
    $appUrl = rtrim(getEnvVar('APP_URL', 'https://sotramsbois.com'), '/');

    if ($resendApiKey && $fromEmail && $toEmail) {
        $contactNameHtml = htmlspecialchars(trim((string)$input['contact_name']));
        $totalFmt = number_format(round($subtotal, 2), 2, ',', ' ') . ' €';
        $totalTtcFmt = number_format(round($subtotal * 1.20, 2), 2, ',', ' ') . ' €';

        $i18nPath = __DIR__ . "/../data/i18n/emails-{$lang}.json";
        if (!file_exists($i18nPath)) {
            $i18nPath = __DIR__ . "/../data/i18n/emails-fr.json";
        }
        $i18nData = json_decode(file_get_contents($i18nPath), true);
        $i18n = $i18nData['order_confirmation'] ?? $i18nData['fr']['order_confirmation'] ?? [];
        if (isset($i18n['total_label'])) {
            $i18n['total_label'] = str_replace('HT', 'TTC', $i18n['total_label']);
        }
        if (empty($i18n)) {
            $i18n = [
                'subject' => "Confirmation de commande {$orderRef}",
                'title' => "Merci pour votre commande !",
                'intro' => "Bonjour {$contactNameHtml}, votre commande a bien été enregistrée.",
                'sepa_notice' => "IMPORTANT : L'expédition interviendra après réception de votre virement bancaire.",
                'cta_account' => "Connectez-vous à votre espace client pour télécharger votre bon de commande",
                'ref_label' => "Référence :",
                'total_label' => "Montant TTC :"
            ];
        }

        $clientSubject = str_replace('{{order_ref}}', $orderRef, $i18n['subject']);

        $templatePath = __DIR__ . '/templates/emails/order_confirmation.html';
        $clientHtml = file_exists($templatePath) ? file_get_contents($templatePath) : "";

        if (!empty($clientHtml)) {
            $clientHtml = str_replace(
                ['{{title}}', '{{intro}}', '{{order_ref}}', '{{total}}', '{{sepa_notice}}', '{{cta_account}}', '{{ref_label}}', '{{total_label}}', '{{app_url}}', '{{year}}', '{{pdf_url}}'],
                [
                    $i18n['title'],
                    $i18n['intro'] . (strpos($i18n['intro'], 'Bonjour') === false ? " Bonjour {$contactNameHtml}," : ""),
                    $orderRef,
                    $totalTtcFmt . ' <span style="font-size: 11px; font-weight: normal; color: #666666;">(soit ' . $totalFmt . ' HT)</span>',
                    $i18n['sepa_notice'],
                    $i18n['cta_account'],
                    $i18n['ref_label'],
                    $i18n['total_label'],
                    $appUrl,
                    date('Y'),
                    $appUrl . '/connexion.html'
                ],
                $clientHtml
            );
        } else {
            $clientHtml = "<p>Votre commande <strong>{$orderRef}</strong> de {$totalTtcFmt} TTC (soit {$totalFmt} HT) est confirmée.</p>";
        }

        $clientText = strip_tags(str_replace(['<br>', '<h2>', '</h2>', '<p>', '</p>'], ["\n", "\n\n", "\n\n", "", "\n\n"], $clientHtml));

        $internalHtml = "<h2>Nouvelle Commande B2B: {$orderRef}</h2>
        <p>Montant: {$totalTtcFmt} TTC (soit {$totalFmt} HT)</p>
        <p>Client: " . htmlspecialchars($clientBlockName) . " ({$contactNameHtml})</p>
        <p>Email: " . htmlspecialchars(trim((string)$input['email'])) . "</p>";

        function sendResendEmail(string $apiKey, string $from, string $to, string $subject, string $html, string $text, array $attachments = []): void {
            $url  = 'https://api.resend.com/emails';
            $data = ['from' => $from, 'to' => [$to], 'subject' => $subject, 'html' => $html, 'text' => $text];
            if (!empty($attachments)) {
                $data['attachments'] = $attachments;
            }
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . $apiKey, 'Content-Type: application/json']);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
            curl_exec($ch);
            curl_close($ch);
        }

        $emailAttachments = [];
        if ($pdfBytes !== null) {
            $emailAttachments[] = [
                'filename' => 'bon-commande-' . $orderRef . '.pdf',
                'content'  => base64_encode($pdfBytes),
            ];
        }

        sendResendEmail($resendApiKey, $fromEmail, trim((string)$input['email']), $clientSubject, $clientHtml, $clientText, $emailAttachments);
        sendResendEmail($resendApiKey, $fromEmail, $toEmail, "[COMMANDE B2B] " . $orderRef, $internalHtml, strip_tags($internalHtml), $emailAttachments);
    }

    echo json_encode(['success' => true, 'order_reference' => $orderRef]);
    exit;

} catch (\Throwable $e) {
    error_log("Order Error: " . $e->getMessage());
    respondError(500, "Erreur interne lors de la commande.");
}
