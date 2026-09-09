<?php
require_once __DIR__ . '/db.php';

try {
    $db = new Database();
    $pdo = $db->getConnection();
    if (!$pdo) die("Failed to connect");

    // 1. Add columns
    $pdo->exec("ALTER TABLE clients ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 0");
    echo "Added is_active column.\n";
    
    // 2. Grandfather existing accounts
    $stmt = $pdo->query("UPDATE clients SET is_active = 1");
    echo "Grandfathered existing accounts: " . $stmt->rowCount() . " row(s) updated.\n";
    
    // 3. Add token columns
    $pdo->exec("ALTER TABLE clients ADD COLUMN activation_token VARCHAR(64) DEFAULT NULL");
    $pdo->exec("ALTER TABLE clients ADD COLUMN token_expires_at DATETIME DEFAULT NULL");
    echo "Added activation token columns.\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
