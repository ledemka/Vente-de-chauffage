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

    // 4. Add additional client profile columns
    $pdo->exec("ALTER TABLE clients ADD COLUMN first_name VARCHAR(255) NOT NULL DEFAULT ''");
    $pdo->exec("ALTER TABLE clients ADD COLUMN address_complement VARCHAR(255) DEFAULT NULL");
    $pdo->exec("ALTER TABLE clients ADD COLUMN fonction VARCHAR(255) DEFAULT NULL");
    $pdo->exec("ALTER TABLE clients ADD COLUMN tva_intra VARCHAR(50) DEFAULT NULL");
    echo "Added new profile columns to clients.\n";

    // 5. Add order snapshot columns
    $pdo->exec("ALTER TABLE orders ADD COLUMN first_name VARCHAR(255) DEFAULT NULL");
    $pdo->exec("ALTER TABLE orders ADD COLUMN postal_code VARCHAR(20) DEFAULT NULL");
    $pdo->exec("ALTER TABLE orders ADD COLUMN city VARCHAR(100) DEFAULT NULL");
    echo "Added snapshot columns to orders.\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
