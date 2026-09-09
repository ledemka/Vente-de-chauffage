<?php
/**
 * Account Activation Endpoint
 */
declare(strict_types=1);

require_once __DIR__ . '/db.php';

function respondError(int $code, string $message): void {
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'GET') {
    respondError(405, 'Méthode non autorisée.');
}

$token = $_POST['token'] ?? $_GET['token'] ?? '';
if (empty($token)) {
    respondError(400, "Jeton d'activation manquant.");
}

try {
    $db = new Database();
    $pdo = $db->getConnection();
    if (!$pdo) throw new Exception("Erreur de base de données.");

    $stmt = $pdo->prepare("SELECT id, is_active, token_expires_at FROM clients WHERE activation_token = ?");
    $stmt->execute([$token]);
    $client = $stmt->fetch();

    if (!$client) {
        respondError(400, "Lien d'activation invalide ou compte déjà activé.");
    }

    if ((int)$client['is_active'] === 1) {
        // Already active
        echo json_encode(['success' => true, 'message' => "Votre compte est déjà actif."]);
        exit;
    }

    $expiresAt = strtotime($client['token_expires_at']);
    if (time() > $expiresAt) {
        respondError(400, "expired_token"); // Code spécial pour afficher le bouton "Renvoyer" côté frontend
    }

    // Activate account
    $stmt = $pdo->prepare("UPDATE clients SET is_active = 1, activation_token = NULL, token_expires_at = NULL WHERE id = ?");
    $stmt->execute([$client['id']]);

    echo json_encode(['success' => true, 'message' => "Votre compte a été activé avec succès ! Vous pouvez maintenant vous connecter."]);
    
} catch (Throwable $e) {
    error_log("Activation Error: " . $e->getMessage());
    respondError(500, "Une erreur s'est produite lors de l'activation.");
}
