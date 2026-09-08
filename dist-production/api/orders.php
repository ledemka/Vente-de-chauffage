<?php
/**
 * B2B Orders API - List orders
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
if ($action !== 'list') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Action invalide.']);
    exit;
}

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

    $stmt = $pdo->prepare("SELECT order_reference, total, status, created_at FROM orders WHERE client_id = ? ORDER BY created_at DESC");
    $stmt->execute([$client_id]);
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'orders' => $orders]);

} catch (Exception $e) {
    error_log("Orders API Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur serveur.']);
}
