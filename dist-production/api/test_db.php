<?php
require 'db.php';
$db = new Database(); $pdo = $db->getConnection();
$c = $pdo->query('SELECT * FROM clients LIMIT 1')->fetch(PDO::FETCH_ASSOC);
if (!$c) {
    // Create one
    $pdo->exec("INSERT INTO clients (company, contact_name, email, phone, address, city, postal_code, password_hash, lang) VALUES ('Test Co', 'Test Name', 'test@test.com', '0102030405', '1 rue test', 'Test City', '75000', '" . password_hash('password', PASSWORD_DEFAULT) . "', 'fr')");
    $c = $pdo->query('SELECT * FROM clients LIMIT 1')->fetch(PDO::FETCH_ASSOC);
}

$o = $pdo->query('SELECT * FROM orders WHERE client_id = ' . $c['id'] . ' LIMIT 1')->fetch(PDO::FETCH_ASSOC);
if (!$o) {
    // Create order
    $items = json_encode([['name' => 'Produit Test', 'format' => 'Palette', 'quantity' => 1, 'unit_price' => 100]]);
    $ref = 'TEST-' . time();
    $pdo->exec("INSERT INTO orders (order_reference, client_id, company, contact_name, email, phone, delivery_address, truck_access, items, subtotal, discount_tier, discount_percent, total, lang) VALUES ('$ref', {$c['id']}, '{$c['company']}', '{$c['contact_name']}', '{$c['email']}', '{$c['phone']}', '{$c['address']}', 'Oui', '$items', 100, 0, 0, 100, 'fr')");
    $o = $pdo->query('SELECT * FROM orders WHERE client_id = ' . $c['id'] . ' LIMIT 1')->fetch(PDO::FETCH_ASSOC);
}
echo json_encode(['client' => $c, 'order' => $o]);
