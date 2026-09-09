<?php
/**
 * Contact Form API
 */
declare(strict_types=1);

require_once __DIR__ . '/db.php';

function respondError(int $code, string $message): void {
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respondError(405, 'Method not allowed.');
}

// 1. Honeypot check
$websiteUrl = $_POST['website_url'] ?? '';
if (!empty($websiteUrl)) {
    // Bot detected, silently accept
    echo json_encode(['success' => true]);
    exit;
}

// 2. Rate Limiting based on IP
$ipAddress = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';

$pdo = null;
try {
    $db = new Database();
    $pdo = $db->getConnection();
    if ($pdo) {
        // Create table if not exists
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS contact_attempts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                ip_address VARCHAR(45) NOT NULL,
                attempt_time DATETIME NOT NULL
            )
        ");

        // Delete old attempts (older than 1 hour)
        $pdo->exec("DELETE FROM contact_attempts WHERE attempt_time < DATE_SUB(NOW(), INTERVAL 1 HOUR)");

        // Check recent attempts
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM contact_attempts WHERE ip_address = ?");
        if ($stmt) {
            $stmt->execute([$ipAddress]);
            $attempts = (int)$stmt->fetchColumn();
            if ($attempts >= 3) {
                respondError(429, "Trop de demandes de contact. Veuillez réessayer plus tard.");
            }
        }
    }
} catch (Throwable $e) {
    error_log("Rate limit error: " . $e->getMessage());
    // On laisse passer l'erreur de BD pour ne pas bloquer l'envoi d'email légitime.
}

// 3. Validation
$name = trim((string)($_POST['nom'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$phone = trim((string)($_POST['telephone'] ?? ''));
$message = trim((string)($_POST['message'] ?? ''));
$lang = trim((string)($_POST['lang'] ?? 'fr'));

if (empty($name) || empty($email) || empty($message)) {
    respondError(400, "Veuillez remplir tous les champs obligatoires.");
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respondError(400, "L'adresse email fournie est invalide.");
}

// Log attempt
if ($pdo) {
    try {
        $stmt = $pdo->prepare("INSERT INTO contact_attempts (ip_address, attempt_time) VALUES (?, NOW())");
        if ($stmt) $stmt->execute([$ipAddress]);
    } catch (Throwable $e) {
        // Ignore
    }
}

// 4. Send Emails via Resend
function getEnvVar(string $key, string $default = ''): string {
    $envFile = __DIR__ . '/../.env';
    if (!file_exists($envFile)) return $default;
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($k, $v) = explode('=', $line, 2) + [NULL, NULL];
        if (trim((string)$k) === $key) return trim((string)$v);
    }
    return $default;
}

$resendApiKey = getEnvVar('RESEND_API_KEY');
$resendFromEmail = getEnvVar('RESEND_FROM_EMAIL');
if (empty($resendFromEmail)) $resendFromEmail = getEnvVar('FROM_EMAIL');
$resendFromName = getEnvVar('RESEND_FROM_NAME', 'sotramsbois');
$fromEmail = "{$resendFromName} <{$resendFromEmail}>";
$toEmail = getEnvVar('TO_EMAIL');
$appUrl = rtrim(getEnvVar('APP_URL', 'https://sotramsbois.com'), '/');

if (empty($resendApiKey) || empty($fromEmail) || empty($toEmail)) {
    error_log("Resend configuration incomplete for contact.php");
    respondError(500, "Erreur de configuration serveur.");
}

// 5. Additional Fields
$societe = trim((string)($_POST['societe'] ?? ''));
$siret = trim((string)($_POST['siret'] ?? ''));
$fonction = trim((string)($_POST['fonction'] ?? ''));
$besoin = trim((string)($_POST['besoin'] ?? ''));

foreach ([&$societe, &$siret, &$fonction, &$besoin] as &$champ) {
    if ($champ === 'null') $champ = '';
}
unset($champ);

$societeHtml = $societe !== '' ? "\n<p><strong>Société :</strong> " . htmlspecialchars($societe) . "</p>" : '';
$siretHtml = $siret !== '' ? "\n<p><strong>SIRET :</strong> " . htmlspecialchars($siret) . "</p>" : '';
$fonctionHtml = $fonction !== '' ? "\n<p><strong>Fonction :</strong> " . htmlspecialchars($fonction) . "</p>" : '';
$besoinHtml = $besoin !== '' ? "\n<p><strong>Besoin :</strong> " . htmlspecialchars($besoin) . "</p>" : '';

// Internal Admin Email
$internalSubject = "Nouveau message de contact - " . htmlspecialchars($name);
$internalHtml = "
<h2>Nouveau message depuis le formulaire de contact</h2>
<p><strong>Nom :</strong> " . htmlspecialchars($name) . "</p>
<p><strong>Email :</strong> " . htmlspecialchars($email) . "</p>
<p><strong>Téléphone :</strong> " . htmlspecialchars($phone) . "</p>{$societeHtml}{$siretHtml}{$fonctionHtml}{$besoinHtml}
<hr/>
<p><strong>Message :</strong><br/>" . nl2br(htmlspecialchars($message)) . "</p>
";
$internalText = strip_tags(str_replace(['<br>', '<hr/>', '<h2>', '</h2>', '<p>', '</p>'], ["\n", "\n---\n", "\n\n", "\n\n", "", "\n\n"], $internalHtml));

// Client Accusé de réception
$i18nPath = __DIR__ . "/../data/i18n/emails-{$lang}.json";
if (!file_exists($i18nPath)) {
    $i18nPath = __DIR__ . "/../data/i18n/emails-fr.json";
}
$i18nData = json_decode(file_get_contents($i18nPath), true);
$i18n = $i18nData['contact_receipt'] ?? $i18nData['fr']['contact_receipt'] ?? [];
if (empty($i18n)) {
    $i18n = [
        'subject' => "Accusé de réception - Votre message",
        'title' => "Nous avons bien reçu votre message",
        'intro' => "Merci de nous avoir contactés. Voici un récapitulatif de votre demande :",
        'delay_info' => "Notre service client vous répondra dans les plus brefs délais.",
        'cta_home' => "Retourner sur le site"
    ];
}

$clientSubject = $i18n['subject'];
$templatePath = __DIR__ . '/templates/emails/contact_receipt.html';
$clientHtml = file_exists($templatePath) ? file_get_contents($templatePath) : "";

$messageSummary = mb_substr(htmlspecialchars($message), 0, 150);
if (mb_strlen($message) > 150) $messageSummary .= "...";

if (!empty($clientHtml)) {
    $clientHtml = str_replace(
        ['{{title}}', '{{intro}}', '{{message_summary}}', '{{delay_info}}', '{{cta_home}}', '{{app_url}}', '{{year}}'],
        [
            $i18n['title'],
            $i18n['intro'],
            $messageSummary,
            $i18n['delay_info'],
            $i18n['cta_home'],
            $appUrl,
            date('Y')
        ],
        $clientHtml
    );
} else {
    $clientHtml = "<p>{$i18n['intro']}</p><blockquote>{$messageSummary}</blockquote>";
}

$clientText = strip_tags(str_replace(['<br>', '<h2>', '</h2>', '<p>', '</p>'], ["\n", "\n\n", "\n\n", "", "\n\n"], $clientHtml));

function sendResendEmail(string $apiKey, string $from, string $to, string $subject, string $html, string $text): void {
    $url = 'https://api.resend.com/emails';
    global $toEmail;
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
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer ' . $apiKey, 'Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_exec($ch);
    curl_close($ch);
}

// Send Admin
sendResendEmail($resendApiKey, $fromEmail, $toEmail, $internalSubject, $internalHtml, $internalText);
// Send Client
sendResendEmail($resendApiKey, $fromEmail, $email, $clientSubject, $clientHtml, $clientText);

echo json_encode(['success' => true, 'message' => "Votre message a bien été envoyé."]);
