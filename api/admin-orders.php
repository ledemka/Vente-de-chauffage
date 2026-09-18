<?php
/**
 * B2B Admin Orders API - List and update all orders
 */
declare(strict_types=1);

session_start();
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

$action = $_POST['action'] ?? $_GET['action'] ?? '';
$client_id = $_SESSION['client_id'] ?? null;

if (!$client_id) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Non autorisé.']);
    exit;
}

try {
    $db = new Database();
    $pdo = $db->getConnection();
    if ($pdo === null) throw new Exception("DB error");

    // Vérifier si l'utilisateur est admin
    $stmtAdmin = $pdo->prepare("SELECT is_admin FROM clients WHERE id = ?");
    $stmtAdmin->execute([$client_id]);
    $isAdmin = (bool)($stmtAdmin->fetchColumn());

    if (!$isAdmin) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Accès refusé. Vous n\'êtes pas administrateur.']);
        exit;
    }

    if ($action === 'list') {
        // Retourne toutes les commandes de tous les clients
        $stmt = $pdo->query("SELECT * FROM orders ORDER BY created_at DESC");
        $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'orders' => $orders]);
        exit;
    } 
    elseif ($action === 'update_status') {
        $ref = $_POST['ref'] ?? '';
        $new_status = $_POST['status'] ?? '';

        $allowed_statuses = ['pending_payment', 'paid', 'shipped', 'delivered'];
        
        if (empty($ref) || empty($new_status)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Référence ou statut manquant.']);
            exit;
        }

        if (!in_array($new_status, $allowed_statuses, true)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'Statut invalide.']);
            exit;
        }

        $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE order_reference = ?");
        $stmt->execute([$new_status, $ref]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Statut mis à jour.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Commande introuvable ou statut identique.']);
        }
        exit;
    }
    else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Action invalide.']);
        exit;
    }

} catch (Exception $e) {
    error_log("Admin Orders API Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur serveur.']);
}
