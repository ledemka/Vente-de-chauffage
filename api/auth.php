<?php
/**
 * B2B Auth API (Register, Login, Logout)
 */

declare(strict_types=1);

// Set session lifetime to 7 days before session_start
$session_lifetime = 7 * 24 * 60 * 60;
session_set_cookie_params($session_lifetime);
session_start();

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/db.php';

function respondError(int $statusCode, string $message, array $details = []): void {
    http_response_code($statusCode);
    echo json_encode(['success' => false, 'message' => $message, 'details' => $details], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respondError(405, 'Méthode non autorisée. Utilisez POST.');
}

$action = $_GET['action'] ?? '';
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
        $email = trim((string)($input['email'] ?? ''));
        $password = (string)($input['password'] ?? '');
        $company = trim((string)($input['company'] ?? ''));
        $contact_name = trim((string)($input['contact_name'] ?? ''));
        $phone = trim((string)($input['phone'] ?? ''));
        $siret = trim((string)($input['siret'] ?? ''));
        $lang = strtolower(trim((string)($input['lang'] ?? 'fr')));

        if (!$email || !$password || !$company || !$contact_name || !$phone) {
            respondError(400, 'Tous les champs obligatoires doivent être remplis.');
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            respondError(400, 'Adresse e-mail invalide.');
        }
        
        $stmt = $pdo->prepare("SELECT id FROM clients WHERE email = ?");
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            respondError(409, 'Un compte existe déjà avec cette adresse email.');
        }

        $password_hash = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $pdo->prepare("INSERT INTO clients (company, siret, contact_name, email, phone, password_hash, lang) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$company, $siret ?: null, $contact_name, $email, $phone, $password_hash, $lang]);
        
        $client_id = $pdo->lastInsertId();
        
        $_SESSION['client_id'] = $client_id;
        $_SESSION['email'] = $email;
        $_SESSION['contact_name'] = $contact_name;
        
        echo json_encode(['success' => true, 'message' => 'Inscription réussie', 'client_id' => $client_id]);
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
            // Success: clear attempts
            $stmt = $pdo->prepare("DELETE FROM login_attempts WHERE email = ? OR ip_address = ?");
            $stmt->execute([$email, $ip_address]);

            session_regenerate_id(true);

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
    else {
        respondError(400, 'Action invalide.');
    }

} catch (Exception $e) {
    error_log("Auth Error: " . $e->getMessage());
    respondError(500, "Erreur interne.");
}
