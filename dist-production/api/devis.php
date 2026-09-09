<?php
/**
 * Real B2B Quote Submission Handler API
 * Handles database persistence and Resend email alerts.
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/db.php';

// Parse .env at project root
function getEnvVar(string $name, string $default = ''): string {
    $val = getenv($name);
    if ($val !== false) {
        return $val;
    }
    if (isset($_ENV[$name])) {
        return (string)$_ENV[$name];
    }
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
                    // Strip quotes
                    if (preg_match('/^"([\s\S]*?)"$/', $value, $m)) {
                        $value = $m[1];
                    } elseif (preg_match("/^'([\s\S]*?)'$/", $value, $m)) {
                        $value = $m[1];
                    }
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

// Allowed product mapping
$productsMap = [
    'buches_chene' => 'Bûches de Chêne - Premium',
    'buches_hetre' => 'Bûches de Hêtre - Densité',
    'pellets_din' => 'Granulés (Pellets) - DINplus',
    'bois_cuisson' => 'Bois de Cuisson Pro',
    'bois_allumage' => "Bois d'Allumage"
];

// Helper to return JSON error response
function respondError(int $statusCode, string $message, array $details = []): void {
    http_response_code($statusCode);
    echo json_encode([
        'success' => false,
        'message' => $message,
        'details' => $details
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// 1. Check Request Method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respondError(450, 'Méthode non autorisée. Utilisez POST.');
}

// 2. Read Request Parameters (handling JSON as well as application/x-www-form-urlencoded / multipart)
$input = [];
$rawBody = file_get_contents('php://input');
if ($rawBody) {
    $decoded = json_decode($rawBody, true);
    if (is_array($decoded)) {
        $input = $decoded;
    }
}
// Merge standard post variables
$input = array_merge($input, $_POST);

// 3. Validation of Mandatory Fields
$errors = [];
$requiredFields = [
    'product_type' => 'Le type de produit est obligatoire.',
    'format' => 'Le format de conditionnement est obligatoire.',
    'quantity' => 'La quantité est obligatoire.',
    'delivery_address' => 'L\'adresse de livraison est obligatoire.',
    'company' => 'Le nom de l\'entreprise est obligatoire.',
    'contact_name' => 'Le nom du contact est obligatoire.',
    'email' => 'L\'adresse email est obligatoire.',
    'phone' => 'Le numéro de téléphone est obligatoire.',
    'lang' => 'La langue de la demande est obligatoire.'
];

foreach ($requiredFields as $field => $errMsg) {
    if (!isset($input[$field]) || trim((string)$input[$field]) === '') {
        $errors[$field] = $errMsg;
    }
}

if (!empty($errors)) {
    respondError(400, 'Validation du formulaire échouée.', $errors);
}

// Validate specific fields
$productType = trim((string)$input['product_type']);
if (!array_key_exists($productType, $productsMap)) {
    respondError(400, 'Type de produit invalide.');
}
$productName = $productsMap[$productType];

$quantity = intval($input['quantity']);
if ($quantity <= 0) {
    respondError(400, 'La quantité doit être supérieure à 0.');
}

$email = trim((string)$input['email']);
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respondError(400, 'Adresse e-mail invalide.');
}

// Optional fields
$deliveryDate = !empty($input['delivery_date']) ? trim((string)$input['delivery_date']) : null;
$truckAccess = !empty($input['truck_access']) ? trim((string)$input['truck_access']) : 'non_specifie';
$siret = !empty($input['siret']) ? trim((string)$input['siret']) : null;
$message = !empty($input['message']) ? trim((string)$input['message']) : null;
$format = trim((string)$input['format']);
$company = trim((string)$input['company']);
$contactName = trim((string)$input['contact_name']);
$phone = trim((string)$input['phone']);
$lang = strtolower(trim((string)$input['lang']));

// 4. Save into Database
try {
    $db = new Database();
    $pdo = $db->getConnection();
    if ($pdo === null) {
        throw new Exception("Impossible de se connecter à la base de données.");
    }

    $stmt = $pdo->prepare("INSERT INTO devis_requests (
        product_id, product_name, quantity, format, delivery_date, 
        truck_access, delivery_address, company, siret, contact_name, 
        email, phone, message, lang
    ) VALUES (
        :product_id, :product_name, :quantity, :format, :delivery_date, 
        :truck_access, :delivery_address, :company, :siret, :contact_name, 
        :email, :phone, :message, :lang
    )");

    $stmt->execute([
        ':product_id' => $productType,
        ':product_name' => $productName,
        ':quantity' => $quantity,
        ':format' => $format,
        ':delivery_date' => $deliveryDate,
        ':truck_access' => $truckAccess,
        ':delivery_address' => $deliveryAddress = trim((string)$input['delivery_address']),
        ':company' => $company,
        ':siret' => $siret,
        ':contact_name' => $contactName,
        ':email' => $email,
        ':phone' => $phone,
        ':message' => $message,
        ':lang' => $lang
    ]);
    
    $insertedId = $pdo->lastInsertId();

} catch (Exception $e) {
    error_log("Database Save Error: " . $e->getMessage());
    respondError(500, "Erreur interne lors de la sauvegarde de la demande de devis.");
}

// 5. Read Environment Variables for Email sending
$resendApiKey = getEnvVar('RESEND_API_KEY');
$resendFromEmail = getEnvVar('RESEND_FROM_EMAIL');
if (empty($resendFromEmail)) $resendFromEmail = getEnvVar('FROM_EMAIL');
$resendFromName = getEnvVar('RESEND_FROM_NAME', 'sotramsbois');
$fromEmail = "{$resendFromName} <{$resendFromEmail}>";
$toEmail = getEnvVar('TO_EMAIL');

// Check Resend Configuration
if (empty($resendApiKey) || empty($fromEmail) || empty($toEmail)) {
    error_log("Resend configuration incomplete. RESEND_API_KEY, FROM_EMAIL or TO_EMAIL is missing.");
    respondError(500, "Erreur de configuration email. Clé API Resend ou destinataire manquant.");
}

// 6. Build Emails

// A. Internal notification email (HTML and Plain Text)
$internalSubject = "[DEVIS B2B] Nouvelle demande de devis #{$insertedId} [{$company}] ({$lang})";
$internalHtml = "
<h2>Nouvelle demande de devis #{$insertedId}</h2>
<p><strong>Langue :</strong> " . htmlspecialchars($lang) . "</p>
<p><strong>Date de création :</strong> " . date('Y-m-d H:i:s') . "</p>
<hr/>
<h3>Détails du produit</h3>
<p><strong>Produit :</strong> " . htmlspecialchars($productName) . " (" . htmlspecialchars($productType) . ")</p>
<p><strong>Format / Conditionnement :</strong> " . htmlspecialchars($format) . "</p>
<p><strong>Quantité demandée :</strong> " . htmlspecialchars((string)$quantity) . " unité(s)</p>
<hr/>
<h3>Détails Logistiques</h3>
<p><strong>Adresse de livraison :</strong><br/>" . nl2br(htmlspecialchars($deliveryAddress)) . "</p>
<p><strong>Date de livraison souhaitée :</strong> " . htmlspecialchars((string)($deliveryDate ?? 'Non spécifiée')) . "</p>
<p><strong>Accès Poids Lourd :</strong> " . htmlspecialchars($truckAccess) . "</p>
<hr/>
<h3>Coordonnées Client</h3>
<p><strong>Entreprise :</strong> " . htmlspecialchars($company) . "</p>
<p><strong>SIRET / TVA :</strong> " . htmlspecialchars((string)($siret ?? 'Non spécifié')) . "</p>
<p><strong>Nom du Contact :</strong> " . htmlspecialchars($contactName) . "</p>
<p><strong>Email :</strong> " . htmlspecialchars($email) . "</p>
<p><strong>Téléphone :</strong> " . htmlspecialchars($phone) . "</p>
<p><strong>Notes complémentaires :</strong><br/>" . nl2br(htmlspecialchars((string)($message ?? 'Aucune note'))) . "</p>
";

$internalText = "
NOUVELLE DEMANDE DE DEVIS #{$insertedId}
Langue : {$lang}
Date de création : " . date('Y-m-d H:i:s') . "

PRODUIT
Produit : {$productName} ({$productType})
Format : {$format}
Quantité : {$quantity}

LOGISTIQUE
Adresse : {$deliveryAddress}
Date souhaitée : " . ($deliveryDate ?? 'Non spécifiée') . "
Accès : {$truckAccess}

COORDONNÉES CLIENT
Entreprise : {$company}
SIRET / TVA : " . ($siret ?? 'Non spécifié') . "
Contact : {$contactName}
Email : {$email}
Téléphone : {$phone}
Notes : " . ($message ?? 'Aucune note') . "
";

// B. Client confirmation email (HTML and Plain Text)
$appUrl = rtrim(getEnvVar('APP_URL', 'https://sotramsbois.com'), '/');

$i18nPath = __DIR__ . "/../data/i18n/emails-{$lang}.json";
if (!file_exists($i18nPath)) {
    $i18nPath = __DIR__ . "/../data/i18n/emails-fr.json";
}
$i18nData = json_decode(file_get_contents($i18nPath), true);
$i18n = $i18nData['quote_sent'] ?? $i18nData['fr']['quote_sent'] ?? [];
if (empty($i18n)) {
    $i18n = [
        'subject' => "Votre demande de devis est confirmée",
        'title' => "Demande de cotation reçue",
        'intro' => "Bonjour {$contactName}, notre équipe commerciale étudie votre demande pour le produit suivant :",
        'product_label' => "Produit :",
        'qty_label' => "Quantité demandée :",
        'delay_info' => "Vous recevrez une proposition tarifaire sous 24h ouvrées.",
        'cta_product' => "Voir le produit"
    ];
}

$clientSubject = $i18n['subject'];

$templatePath = __DIR__ . '/templates/emails/quote_sent.html';
$clientHtml = file_exists($templatePath) ? file_get_contents($templatePath) : "";

if (!empty($clientHtml)) {
    $clientHtml = str_replace(
        ['{{title}}', '{{intro}}', '{{product_label}}', '{{product_name}}', '{{qty_label}}', '{{quantity}}', '{{delay_info}}', '{{cta_product}}', '{{app_url}}', '{{year}}', '{{product_url}}'],
        [
            $i18n['title'],
            $i18n['intro'] . (strpos($i18n['intro'], 'Bonjour') === false && strpos($i18n['intro'], 'Hello') === false && strpos($i18n['intro'], 'Hallo') === false && strpos($i18n['intro'], 'Beste') === false ? " Bonjour {$contactName}," : ""),
            $i18n['product_label'],
            htmlspecialchars($productName),
            $i18n['qty_label'],
            htmlspecialchars((string)$quantity),
            $i18n['delay_info'],
            $i18n['cta_product'],
            $appUrl,
            date('Y'),
            $appUrl . '/produit.html?product=' . urlencode((string)$productType)
        ],
        $clientHtml
    );
} else {
    $clientHtml = "<p>Demande reçue pour {$productName}.</p>";
}

$clientText = strip_tags(str_replace(['<br>', '<h2>', '</h2>', '<p>', '</p>'], ["\n", "\n\n", "\n\n", "", "\n\n"], $clientHtml));

// Helper to make API request to Resend
function sendResendEmail(string $apiKey, string $from, string $to, string $subject, string $html, string $text): bool {
    global $toEmail;
    $url = 'https://api.resend.com/emails';
    $unsubscribeLink = 'mailto:' . $toEmail . '?subject=unsubscribe';
    $data = [
        'from' => $from,
        'to' => [$to],
        'subject' => $subject,
        'html' => $html,
        'text' => $text,
        'headers' => [
            'List-Unsubscribe' => "<{$unsubscribeLink}>"
        ]
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $apiKey,
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode >= 200 && $httpCode < 300) {
        return true;
    }

    error_log("Resend API failed. HTTP: {$httpCode}, Response: {$response}");
    return false;
}

// 7. Send Emails and handle results
$internalSent = sendResendEmail($resendApiKey, $fromEmail, $toEmail, $internalSubject, $internalHtml, $internalText);
if (!$internalSent) {
    respondError(500, "Échec de l'envoi de la notification interne d'email.");
}

$clientSent = sendResendEmail($resendApiKey, $fromEmail, $email, $clientSubject, $clientHtml, $clientText);
if (!$clientSent) {
    respondError(500, "Échec de l'envoi de l'email de confirmation de réception au client.");
}

// 8. Return success response
echo json_encode([
    'success' => true,
    'message' => 'Votre demande de devis a été enregistrée et envoyée avec succès.',
    'devis_id' => $insertedId
], JSON_UNESCAPED_UNICODE);
