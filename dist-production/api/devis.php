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
$fromEmail = getEnvVar('FROM_EMAIL');
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
$clientSubjectMap = [
    'fr' => "Confirmation de votre demande de devis B2B - Terre & Feu",
    'en' => "Confirmation of your B2B quote request - Terre & Feu",
    'de' => "Bestätigung Ihrer B2B-Angebotsanfrage - Terre & Feu",
    'nl' => "Bevestiging van uw B2B-offerteaanvraag - Terre & Feu"
];
$clientSubject = $clientSubjectMap[$lang] ?? $clientSubjectMap['fr'];

$clientHtmlMap = [
    'fr' => "
        <p>Bonjour " . htmlspecialchars($contactName) . ",</p>
        <p>Nous vous remercions pour l'intérêt que vous portez à <strong>Terre & Feu</strong>.</p>
        <p>Nous avons bien reçu votre demande de devis B2B numéro #{$insertedId} concernant le produit <strong>" . htmlspecialchars($productName) . "</strong>.</p>
        <p>Nos équipes vont étudier la faisabilité logistique et tarifaire de votre demande. Un conseiller commercial prendra contact avec vous dès que possible pour vous proposer une offre adaptée.</p>
        <p>Cordialement,<br/>L'équipe Terre & Feu</p>
    ",
    'en' => "
        <p>Hello " . htmlspecialchars($contactName) . ",</p>
        <p>Thank you for your interest in <strong>Terre & Feu</strong>.</p>
        <p>We have successfully received your B2B quote request #{$insertedId} regarding the product <strong>" . htmlspecialchars($productName) . "</strong>.</p>
        <p>Our teams will study the feasibility and pricing. A sales representative will contact you as soon as possible to present a custom offer.</p>
        <p>Best regards,<br/>The Terre & Feu Team</p>
    ",
    'de' => "
        <p>Hallo " . htmlspecialchars($contactName) . ",</p>
        <p>Vielen Dank für Ihr Interesse an <strong>Terre & Feu</strong>.</p>
        <p>Wir haben Ihre B2B-Angebotsanfrage #{$insertedId} für das Produkt <strong>" . htmlspecialchars($productName) . "</strong> erhalten.</p>
        <p>Unsere Teams werden die logistische und preisliche Machbarkeit prüfen. Ein Vertriebsmitarbeiter wird sich so schnell wie möglich mit Ihnen in Verbindung setzen, um Ihnen ein passendes Angebot zu unterbreiten.</p>
        <p>Mit freundlichen Grüßen,<br/>Ihr Terre & Feu Team</p>
    ",
    'nl' => "
        <p>Beste " . htmlspecialchars($contactName) . ",</p>
        <p>Bedankt voor uw interesse in <strong>Terre & Feu</strong>.</p>
        <p>We hebben uw B2B-offerteaanvraag #{$insertedId} voor het product <strong>" . htmlspecialchars($productName) . "</strong> goed ontvangen.</p>
        <p>Onze teams zullen de logistieke en financiële haalbaarheid bestuderen. Een commercieel adviseur zal zo snel mogelijk contact met u opnemen om u een passend voorstel te doen.</p>
        <p>Met vriendelijke groet,<br/>Het Terre & Feu Team</p>
    "
];
$clientHtml = $clientHtmlMap[$lang] ?? $clientHtmlMap['fr'];

$clientTextMap = [
    'fr' => "
Bonjour " . $contactName . ",

Nous vous remercions pour l'intérêt que vous portez à Terre & Feu.

Nous avons bien reçu votre demande de devis B2B numéro #{$insertedId} concernant le produit " . $productName . ".

Nos équipes vont étudier la faisabilité logistique et tarifaire de votre demande. Un conseiller commercial prendra contact avec vous dès que possible pour vous proposer une offre adaptée.

Cordialement,
L'équipe Terre & Feu
",
    'en' => "
Hello " . $contactName . ",

Thank you for your interest in Terre & Feu.

We have successfully received your B2B quote request #{$insertedId} regarding the product " . $productName . ".

Our teams will study the feasibility and pricing. A sales representative will contact you as soon as possible to present a custom offer.

Best regards,
The Terre & Feu Team
",
    'de' => "
Hallo " . $contactName . ",

Vielen Dank für Ihr Interesse an Terre & Feu.

Wir haben Ihre B2B-Angebotsanfrage #{$insertedId} für das Produkt " . $productName . " erhalten.

Unsere Teams werden die logistische und preisliche Machbarkeit prüfen. Ein Vertriebsmitarbeiter wird sich so schnell wie möglich mit Ihnen in Verbindung setzen, um Ihnen ein passendes Angebot zu unterbreiten.

Mit freundlichen Grüßen,
Ihr Terre & Feu Team
",
    'nl' => "
Beste " . $contactName . ",

Bedankt voor uw interesse in Terre & Feu.

We hebben uw B2B-offerteaanvraag #{$insertedId} voor het product " . $productName . " goed ontvangen.

Onze teams zullen de logistieke en financiële haalbaarheid bestuderen. Een commercieel adviseur zal zo snel mogelijk contact met u opnemen om u een passend voorstel te doen.

Met vriendelijke groet,
Het Terre & Feu Team
"
];
$clientText = $clientTextMap[$lang] ?? $clientTextMap['fr'];

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
