<?php
/**
 * Reset Password API
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

$token = trim((string)($_POST['token'] ?? ''));
$password = (string)($_POST['password'] ?? '');

if (empty($token) || empty($password)) {
    respondError(400, "Token ou mot de passe manquant.");
}

if (strlen($password) < 8) {
    respondError(400, "Le mot de passe doit contenir au moins 8 caractères.");
}

$pdo = null;
try {
    $db = new Database();
    $pdo = $db->getConnection();
} catch (Throwable $e) {
    respondError(500, "Erreur base de données.");
}

if (!$pdo) respondError(500, "Erreur base de données.");

try {
    $stmt = $pdo->prepare("SELECT * FROM clients WHERE reset_token = ?");
    $stmt->execute([$token]);
    $client = $stmt->fetch();

    if (!$client) {
        respondError(400, "Ce lien de réinitialisation est invalide ou a déjà été utilisé.");
    }

    $expiresAt = strtotime($client['reset_token_expires_at'] ?? '0');
    if (time() > $expiresAt) {
        respondError(400, "Ce lien de réinitialisation a expiré.");
    }

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("UPDATE clients SET password_hash = ?, reset_token = NULL, reset_token_expires_at = NULL WHERE id = ?");
    $stmt->execute([$hashedPassword, $client['id']]);

    echo json_encode(['success' => true, 'message' => "Votre mot de passe a été réinitialisé avec succès."]);
} catch (Throwable $e) {
    error_log("Reset Password Error: " . $e->getMessage());
    respondError(500, "Erreur interne.");
}
