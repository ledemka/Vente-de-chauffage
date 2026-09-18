<?php
require_once __DIR__ . '/api/db.php';
try {
    $db = new Database();
    $pdo = $db->getConnection();
    if ($pdo === null) die("No DB connection");
    
    // Check orders statuses
    $stmt = $pdo->query("SELECT DISTINCT status FROM orders");
    $statuses = $stmt->fetchAll(PDO::FETCH_COLUMN);
    echo "Existing statuses in orders:\n" . implode("\n", $statuses) . "\n\n";

    // Check if is_admin column exists and its values
    $stmt2 = $pdo->query("SELECT DISTINCT is_admin FROM clients");
    $admins = $stmt2->fetchAll(PDO::FETCH_COLUMN);
    echo "is_admin values in clients:\n" . implode("\n", $admins) . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
