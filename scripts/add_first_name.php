<?php
require_once __DIR__ . '/../api/db.php';
try {
    $db = new Database();
    $pdo = $db->getConnection();
    if (!$pdo) die("Failed to connect\n");
    $pdo->exec("ALTER TABLE clients ADD COLUMN first_name VARCHAR(255) NOT NULL DEFAULT ''");
    echo "Successfully added first_name column to clients.\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
