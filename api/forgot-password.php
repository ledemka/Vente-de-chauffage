<?php
/**
 * Forgot Password API
 */
declare(strict_types=1);

require_once __DIR__ . '/db.php';

function respondError(int $code, string $message): void {
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respondError(405, 'Méthode non autorisée.');
}

// 1. Honeypot check
$websiteUrl = $_POST['website_url'] ?? '';
if (!empty($websiteUrl)) {
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
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS contact_attempts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                ip_address VARCHAR(45) NOT NULL,
                attempt_time DATETIME NOT NULL
            )
        ");
        $pdo->exec("DELETE FROM contact_attempts WHERE attempt_time < DATE_SUB(NOW(), INTERVAL 1 HOUR)");

        $stmt = $pdo->prepare("SELECT COUNT(*) FROM contact_attempts WHERE ip_address = ?");
        if ($stmt) {
            $stmt->execute([$ipAddress]);
            $attempts = (int)$stmt->fetchColumn();
            if ($attempts >= 3) {
                respondError(429, "Trop de demandes. Veuillez réessayer plus tard.");
            }
        }
    }
} catch (Throwable $e) {
    error_log("Rate limit error: " . $e->getMessage());
}

if ($pdo) {
    try {
        $stmt = $pdo->prepare("INSERT INTO contact_attempts (ip_address, attempt_time) VALUES (?, NOW())");
        if ($stmt) $stmt->execute([$ipAddress]);
    } catch (Throwable $e) {}
}

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

function sendResendEmail(string $apiKey, string $from, string $to, string $subject, string $html, string $text): void {
    $url = 'https://api.resend.com/emails';
    $unsubscribeLink = 'mailto:' . getEnvVar('TO_EMAIL') . '?subject=unsubscribe';
    
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

// 3. Process Request
$email = trim((string)($_POST['email'] ?? ''));

if (!$pdo) respondError(500, "Erreur base de données.");

try {
    if (empty($email)) {
        respondError(400, "Email manquant.");
    }

    $stmt = $pdo->prepare("SELECT * FROM clients WHERE email = ?");
    $stmt->execute([$email]);
    $client = $stmt->fetch();
    
    // Obfuscated response for security
    $successMessage = "Si un compte est associé à cette adresse, un email de réinitialisation vient d'être envoyé.";

    if (!$client) {
        echo json_encode(['success' => true, 'message' => $successMessage]);
        exit;
    }

    $newToken = bin2hex(random_bytes(32));
    $expiresAt = date('Y-m-d H:i:s', strtotime('+1 hour'));

    $stmt = $pdo->prepare("UPDATE clients SET reset_token = ?, reset_token_expires_at = ? WHERE id = ?");
    $stmt->execute([$newToken, $expiresAt, $client['id']]);

    $lang = $client['lang'] ?? 'fr';
    $i18nPath = __DIR__ . "/../data/i18n/emails-{$lang}.json";
    if (!file_exists($i18nPath)) $i18nPath = __DIR__ . "/../data/i18n/emails-fr.json";
    
    $i18nData = json_decode(file_get_contents($i18nPath), true);
    $i18n = $i18nData['password_reset'] ?? $i18nData['fr']['password_reset'] ?? [
        'subject' => "Réinitialisation de votre mot de passe",
        'title' => "Mot de passe oublié ?",
        'intro' => "Nous avons reçu une demande pour réinitialiser le mot de passe de votre compte. Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe :",
        'cta' => "Réinitialiser mon mot de passe",
        'delay_info' => "Ce lien est valable 1 heure."
    ];

    $appUrl = rtrim(getEnvVar('APP_URL', 'https://sotramsbois.com'), '/');
    $resetLink = "{$appUrl}/reinitialiser-mot-de-passe.html?token={$newToken}";

    $templatePath = __DIR__ . '/templates/emails/password_reset.html';
    $htmlContent = file_exists($templatePath) ? file_get_contents($templatePath) : "";
    if (!empty($htmlContent)) {
        $htmlContent = str_replace(
            ['{{title}}', '{{intro}}', '{{cta_text}}', '{{reset_link}}', '{{delay_info}}', '{{app_url}}', '{{year}}'],
            [$i18n['title'], $i18n['intro'], $i18n['cta'], $resetLink, $i18n['delay_info'], $appUrl, date('Y')],
            $htmlContent
        );
    } else {
        $htmlContent = "<p>{$i18n['intro']}</p><p><a href='{$resetLink}'>{$i18n['cta']}</a></p><p>{$i18n['delay_info']}</p>";
    }

    $textContent = strip_tags(str_replace(['<br>', '<h2>', '</h2>', '<p>', '</p>'], ["\n", "\n\n", "\n\n", "", "\n\n"], $htmlContent)) . "\n\n" . $resetLink;

    $resendApiKey = getEnvVar('RESEND_API_KEY');
    $resendFromEmail = getEnvVar('RESEND_FROM_EMAIL') ?: getEnvVar('FROM_EMAIL');
    $resendFromName = getEnvVar('RESEND_FROM_NAME', 'sotramsbois');
    $fromEmailFull = "{$resendFromName} <{$resendFromEmail}>";

    if (!empty($resendApiKey) && !empty($fromEmailFull)) {
        sendResendEmail($resendApiKey, $fromEmailFull, $client['email'], $i18n['subject'], $htmlContent, $textContent);
    }

    echo json_encode(['success' => true, 'message' => $successMessage]);
} catch (Throwable $e) {
    error_log("Forgot Password Error: " . $e->getMessage());
    respondError(500, "Erreur interne.");
}
