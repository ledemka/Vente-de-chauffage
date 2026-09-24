<?php
if (php_sapi_name() !== 'cli') { http_response_code(404); exit; }
require_once __DIR__ . '/db.php';

try {
    $db = new Database();
    $pdo = $db->getConnection();
    if (!$pdo) die("Failed to connect");

    function addColumn($pdo, $table, $columnDef, $desc) {
        try {
            $pdo->exec("ALTER TABLE $table ADD COLUMN $columnDef");
            echo "Added $desc.\n";
        } catch (PDOException $e) {
            if (strpos($e->getMessage(), 'Duplicate column name') !== false || strpos($e->getMessage(), 'already exists') !== false) {
                echo "Column $desc already exists. Skipping.\n";
            } else {
                echo "Error adding $desc: " . $e->getMessage() . "\n";
            }
        }
    }

    // 1. Add columns
    addColumn($pdo, 'clients', 'is_active TINYINT(1) NOT NULL DEFAULT 0', 'is_active column to clients');
    
    // 2. Grandfather existing accounts
    try {
        $stmt = $pdo->query("UPDATE clients SET is_active = 1 WHERE is_active = 0");
        echo "Grandfathered existing accounts: " . $stmt->rowCount() . " row(s) updated.\n";
    } catch (PDOException $e) {
        echo "Error updating is_active: " . $e->getMessage() . "\n";
    }
    
    // 3. Add token columns
    addColumn($pdo, 'clients', 'activation_token VARCHAR(64) DEFAULT NULL', 'activation_token column to clients');
    addColumn($pdo, 'clients', 'token_expires_at DATETIME DEFAULT NULL', 'token_expires_at column to clients');

    // 4. Add additional client profile columns
    addColumn($pdo, 'clients', 'first_name VARCHAR(255) NOT NULL DEFAULT \'\'', 'first_name column to clients');
    addColumn($pdo, 'clients', 'address_complement VARCHAR(255) DEFAULT NULL', 'address_complement column to clients');
    addColumn($pdo, 'clients', 'fonction VARCHAR(255) DEFAULT NULL', 'fonction column to clients');
    addColumn($pdo, 'clients', 'tva_intra VARCHAR(50) DEFAULT NULL', 'tva_intra column to clients');

    // 5. Add order snapshot columns
    addColumn($pdo, 'orders', 'first_name VARCHAR(255) DEFAULT NULL', 'first_name column to orders');
    addColumn($pdo, 'orders', 'postal_code VARCHAR(20) DEFAULT NULL', 'postal_code column to orders');
    addColumn($pdo, 'orders', 'city VARCHAR(100) DEFAULT NULL', 'city column to orders');

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
