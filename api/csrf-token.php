<?php
require_once __DIR__ . '/db.php';

header('Content-Type: application/json');

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$token = getCsrfToken();
echo json_encode(['csrf_token' => $token]);
