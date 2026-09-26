<?php
/**
 * B2B Auth API (Register, Login, Logout)
 */

declare(strict_types=1);

require_once __DIR__ . '/db.php';

session_start();

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'] ?? '';




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

function respondError(int $statusCode, string $message, array $details = []): void {
    http_response_code($statusCode);
    echo json_encode(['success' => false, 'message' => $message, 'details' => $details], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'GET') {
    respondError(405, 'Méthode non autorisée. Utilisez POST.');
}

$action = $_POST['action'] ?? $_GET['action'] ?? '';
$input = [];
$rawBody = file_get_contents('php://input');
if ($rawBody) {
    $decoded = json_decode($rawBody, true);
    if (is_array($decoded)) {
        $input = $decoded;
    }
}
$input = array_merge($input, $_POST);

try {
    $db = new Database();
    $pdo = $db->getConnection();
    if ($pdo === null) throw new Exception("Impossible de se connecter à la base de données.");

    if ($action === 'register') {
        $first_name = trim((string)($input['first_name'] ?? ''));
        $email = trim((string)($input['email'] ?? ''));
        $password = (string)($input['password'] ?? '');
        $company = trim((string)($input['company'] ?? ''));
        $contact_name = trim((string)($input['contact_name'] ?? ''));
        $phone = trim((string)($input['phone'] ?? ''));
        $siret = trim((string)($input['siret'] ?? ''));
        $address = trim((string)($input['address'] ?? ''));
        $postal_code = trim((string)($input['postal_code'] ?? ''));
        $city = trim((string)($input['city'] ?? ''));
        $address_complement = trim((string)($input['address_complement'] ?? ''));
        $fonction = trim((string)($input['fonction'] ?? ''));
        $tva_intra = trim((string)($input['tva_intra'] ?? ''));
        $lang = strtolower(trim((string)($input['lang'] ?? 'fr')));
        $is_professional = !empty($input['is_professional']) && $input['is_professional'] !== '0';

        if (!$email) respondError(400, 'L\'adresse e-mail est obligatoire.');
        if (!$password) respondError(400, 'Le mot de passe est obligatoire.');
        if (!$contact_name) respondError(400, 'Le nom du contact est obligatoire.');
        if (!$phone) respondError(400, 'Le numéro de téléphone est obligatoire.');
        if (!$address || !$postal_code || !$city) respondError(400, 'L\'adresse complète (rue, code postal, ville) est obligatoire.');
        if ($is_professional && !$company) respondError(400, 'Le nom de la société est obligatoire pour un compte professionnel.');
        
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) respondError(400, 'Adresse e-mail invalide.');
        if (!preg_match('/^\d{5}$/', $postal_code)) respondError(400, 'Le code postal doit contenir exactement 5 chiffres.');
        
        $cleanPhone = preg_replace('/[\s\-\+]/', '', $phone);
        if (strlen($cleanPhone) < 6) respondError(400, 'Le numéro de téléphone est invalide.');
        
        if ($siret !== '' && !preg_match('/^\d{14}$/', $siret)) respondError(400, 'Le SIRET doit contenir exactement 14 chiffres.');
        
        $stmt = $pdo->prepare("SELECT id FROM clients WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            respondError(409, 'Un compte existe déjà avec cette adresse email.');
        }

        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        $token = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', strtotime('+24 hours'));

        $stmt = $pdo->prepare("INSERT INTO clients (first_name, company, siret, contact_name, email, phone, address, postal_code, city, address_complement, fonction, tva_intra, password_hash, lang, is_active, activation_token, token_expires_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)");
        $stmt->execute([$first_name, $company, $siret ?: null, $contact_name, $email, $phone, $address, $postal_code, $city, $address_complement ?: null, $fonction ?: null, $tva_intra ?: null, $password_hash, $lang, $token, $expiresAt]);
        
        $client_id = $pdo->lastInsertId();
        
        // Load i18n
        $i18nPath = __DIR__ . "/../data/i18n/emails-{$lang}.json";
        if (!file_exists($i18nPath)) {
            $i18nPath = __DIR__ . "/../data/i18n/emails-fr.json";
        }
        $i18nData = json_decode(file_get_contents($i18nPath), true);
        $i18n = $i18nData['account_activation'] ?? $i18nData['fr']['account_activation'] ?? [];
        if (empty($i18n)) {
            $i18n = [
                'subject' => "Activez votre compte",
                'title' => "Bienvenue !",
                'intro' => "Merci de vous être inscrit. Veuillez activer votre compte en cliquant sur le lien ci-dessous :",
                'cta' => "Activer mon compte",
                'delay_info' => "Ce lien est valable 24 heures."
            ];
        }

        $appUrl = rtrim(getEnvVar('APP_URL', 'https://sotramsbois.com'), '/');
        $activationLink = "{$appUrl}/activation.html?token={$token}";

        $templatePath = __DIR__ . '/templates/emails/account_activation.html';
        $htmlContent = file_exists($templatePath) ? file_get_contents($templatePath) : "";
        if (!empty($htmlContent)) {
            $htmlContent = str_replace(
                ['{{title}}', '{{intro}}', '{{cta_text}}', '{{activation_link}}', '{{delay_info}}', '{{app_url}}', '{{year}}'],
                [
                    $i18n['title'],
                    $i18n['intro'],
                    $i18n['cta'],
                    $activationLink,
                    $i18n['delay_info'],
                    $appUrl,
                    date('Y')
                ],
                $htmlContent
            );
        } else {
            $htmlContent = "<p>{$i18n['intro']}</p><p><a href='{$activationLink}'>{$i18n['cta']}</a></p><p>{$i18n['delay_info']}</p>";
        }

        $textContent = strip_tags(str_replace(['<br>', '<h2>', '</h2>', '<p>', '</p>'], ["\n", "\n\n", "\n\n", "", "\n\n"], $htmlContent));
        $textContent .= "\n\n" . $activationLink;

        $resendApiKey = getEnvVar('RESEND_API_KEY');
        $resendFromEmail = getEnvVar('RESEND_FROM_EMAIL') ?: getEnvVar('FROM_EMAIL');
        $resendFromName = getEnvVar('RESEND_FROM_NAME', 'sotramsbois');
        $fromEmailFull = "{$resendFromName} <{$resendFromEmail}>";

        if (!empty($resendApiKey) && !empty($fromEmailFull)) {
            sendResendEmail($resendApiKey, $fromEmailFull, $email, $i18n['subject'], $htmlContent, $textContent);
        }
        
        echo json_encode(['success' => true, 'message' => 'Inscription réussie. Un email d\'activation vous a été envoyé.', 'client_id' => $client_id]);
        exit;
    } 
    elseif ($action === 'login') {
        $email = trim((string)($input['email'] ?? ''));
        $password = (string)($input['password'] ?? '');
        $ip_address = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
        
        if (!$email || !$password) {
            respondError(400, 'Email et mot de passe requis.');
        }

        // Brute-force protection: max 5 attempts in last 15 minutes
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM login_attempts WHERE (email = ? OR ip_address = ?) AND attempt_time > NOW() - INTERVAL 15 MINUTE");
        $stmt->execute([$email, $ip_address]);
        $attempts = (int)$stmt->fetchColumn();
        if ($attempts >= 5) {
            respondError(429, 'Trop de tentatives échouées. Veuillez réessayer dans 15 minutes.');
        }

        $stmt = $pdo->prepare("SELECT * FROM clients WHERE email = ?");
        $stmt->execute([$email]);
        $client = $stmt->fetch();

        if ($client && password_verify($password, $client['password_hash'])) {
            if ((int)$client['is_active'] === 0) {
                respondError(403, 'Veuillez activer votre compte via le lien envoyé par email avant de vous connecter.');
            }

            // Success: clear attempts
            $stmt = $pdo->prepare("DELETE FROM login_attempts WHERE email = ? OR ip_address = ?");
            $stmt->execute([$email, $ip_address]);

            $_SESSION['client_id'] = $client['id'];
            $_SESSION['email'] = $client['email'];
            $_SESSION['contact_name'] = $client['contact_name'];
            
            unset($client['password_hash']);
            
            // Note: Fusion du panier invité vers ce client_id sera gérée dans cart.php
            
            echo json_encode(['success' => true, 'message' => 'Connexion réussie', 'client' => $client]);
            exit;
        } else {
            // Failed
            $stmt = $pdo->prepare("INSERT INTO login_attempts (email, ip_address) VALUES (?, ?)");
            $stmt->execute([$email, $ip_address]);
            respondError(401, 'Email ou mot de passe incorrect.');
        }
    }
    elseif ($action === 'logout') {
        session_unset();
        session_destroy();
        echo json_encode(['success' => true, 'message' => 'Déconnexion réussie']);
        exit;
    }
    
    elseif ($action === 'check') {
        if (!isset($_SESSION['client_id'])) {
            http_response_code(401);
            echo json_encode(['authenticated' => false]);
            exit;
        }
        
        $stmt = $pdo->prepare("SELECT first_name, company, siret, contact_name, email, phone, address, city, postal_code, address_complement, fonction, tva_intra, is_admin FROM clients WHERE id = ?");
        $stmt->execute([$_SESSION['client_id']]);
        $client = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($client) {
            echo json_encode([
                'authenticated' => true,
                'first_name' => $client['first_name'],
                'company' => $client['company'],
                'siret' => $client['siret'],
                'contact_name' => $client['contact_name'],
                'email' => $client['email'],
                'phone' => $client['phone'],
                'address' => $client['address'],
                'city' => $client['city'],
                'postal_code' => $client['postal_code'],
                'address_complement' => $client['address_complement'],
                'fonction' => $client['fonction'],
                'tva_intra' => $client['tva_intra'],
                'is_admin' => (int)($client['is_admin'] ?? 0)
            ]);
            exit;
        } else {
            http_response_code(401);
            echo json_encode(['authenticated' => false]);
            exit;
        }
    }
    elseif ($action === 'update_profile') {
        if (!isset($_SESSION['client_id'])) {
            respondError(401, 'Non autorisé.');
        }

        $first_name = trim((string)($input['first_name'] ?? ''));
        $company = trim((string)($input['company'] ?? ''));
        $siret = trim((string)($input['siret'] ?? ''));
        $contact_name = trim((string)($input['contact_name'] ?? ''));
        $email = trim((string)($input['email'] ?? ''));
        $phone = trim((string)($input['phone'] ?? ''));
        $address = trim((string)($input['address'] ?? ''));
        $city = trim((string)($input['city'] ?? ''));
        $postal_code = trim((string)($input['postal_code'] ?? ''));
        $address_complement = trim((string)($input['address_complement'] ?? ''));
        $fonction = trim((string)($input['fonction'] ?? ''));
        $tva_intra = trim((string)($input['tva_intra'] ?? ''));

        if (!$first_name || !$address || !$city || !$postal_code || !$contact_name || !$email || !$phone) {
            respondError(400, 'Tous les champs obligatoires doivent être remplis.');
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            respondError(400, 'Adresse e-mail invalide.');
        }
        if (!preg_match('/^\d{5}$/', $postal_code)) respondError(400, 'Le code postal doit contenir exactement 5 chiffres.');
        
        $cleanPhone = preg_replace('/[\s\-\+]/', '', $phone);
        if (strlen($cleanPhone) < 6) respondError(400, 'Le numéro de téléphone est invalide.');
        
        if ($siret !== '' && !preg_match('/^\d{14}$/', $siret)) respondError(400, 'Le SIRET doit contenir exactement 14 chiffres.');

        if ($email !== $_SESSION['email']) {
            $stmt = $pdo->prepare("SELECT id FROM clients WHERE email = ? AND id != ?");
            $stmt->execute([$email, $_SESSION['client_id']]);
            if ($stmt->fetch()) {
                respondError(409, 'Un compte existe déjà avec cette adresse email.');
            }
        }

        $stmt = $pdo->prepare("UPDATE clients SET first_name = ?, company = ?, siret = ?, contact_name = ?, email = ?, phone = ?, address = ?, city = ?, postal_code = ?, address_complement = ?, fonction = ?, tva_intra = ? WHERE id = ?");
        $stmt->execute([$first_name, $company ?: null, $siret ?: null, $contact_name, $email, $phone, $address, $city, $postal_code, $address_complement ?: null, $fonction ?: null, $tva_intra ?: null, $_SESSION['client_id']]);

        $_SESSION['email'] = $email;
        $_SESSION['contact_name'] = $contact_name;

        echo json_encode([
            'success' => true, 
            'message' => 'Profil mis à jour.',
            'client' => [
                'first_name' => $first_name,
                'company' => $company,
                'siret' => $siret,
                'contact_name' => $contact_name,
                'email' => $email,
                'phone' => $phone,
                'address' => $address,
                'city' => $city,
                'postal_code' => $postal_code,
                'address_complement' => $address_complement,
                'fonction' => $fonction,
                'tva_intra' => $tva_intra
            ]
        ]);
        exit;
    }
    else {
        respondError(400, 'Action invalide.');
    }

} catch (Exception $e) {
    error_log("Auth Error: " . $e->getMessage());
    respondError(500, "Erreur interne.");
}
