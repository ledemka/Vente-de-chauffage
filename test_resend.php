<?php
header('Content-Type: application/json; charset=utf-8');

function getEnvVar(string $name, string $default = ''): string {
    $val = getenv($name);
    if ($val !== false) return $val;
    if (isset($_ENV[$name])) return (string)$_ENV[$name];
    static $envLoaded = false;
    if (!$envLoaded) {
        $envPath = __DIR__ . '/.env';
        if (file_exists($envPath)) {
            $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            foreach ($lines as $line) {
                if (strpos(trim($line), '#') === 0) continue;
                $parts = explode('=', $line, 2);
                if (count($parts) === 2) {
                    putenv(trim($parts[0]) . '=' . trim($parts[1]));
                    $_ENV[trim($parts[0])] = trim($parts[1]);
                }
            }
        }
        $envLoaded = true;
    }
    $val = getenv($name);
    return $val !== false ? $val : (isset($_ENV[$name]) ? (string)$_ENV[$name] : $default);
}

$resendApiKey = getEnvVar('RESEND_API_KEY');
$resendFromEmail = getEnvVar('RESEND_FROM_EMAIL');
if (empty($resendFromEmail)) $resendFromEmail = getEnvVar('FROM_EMAIL');
$resendFromName = getEnvVar('RESEND_FROM_NAME', 'sotramsbois');
$fromEmail = "{$resendFromName} <{$resendFromEmail}>";
$toEmail = getEnvVar('TO_EMAIL');

if (empty($resendApiKey)) {
    echo json_encode(['success' => false, 'message' => 'RESEND_API_KEY is missing in .env']);
    exit;
}

$to = empty($toEmail) ? 'roger.kamdem-youmbis@sotramsbois.com' : $toEmail; // Example test email

$url = 'https://api.resend.com/emails';
$data = [
    'from' => $fromEmail,
    'to' => [$to],
    'subject' => 'Test Resend Email',
    'html' => '<p>Ceci est un test de la configuration Resend de sotramsbois.</p>',
    'text' => 'Ceci est un test de la configuration Resend de sotramsbois.'
];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Authorization: Bearer ' . $resendApiKey,
    'Content-Type: application/json'
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// Do not expose API key in response
if (isset($data['headers'])) unset($data['headers']);
echo json_encode([
    'http_status' => $httpCode,
    'api_response' => json_decode($response, true) ?? $response,
    'sent_from' => $fromEmail
]);
