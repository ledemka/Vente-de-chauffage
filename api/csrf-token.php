<?php
require_once __DIR__ . '/db.php';

header('Content-Type: application/json');
header('Cache-Control: no-store, private');

// Only allow POST requests (or GET for local tests, but POST is required to bypass cache)
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$token = getCsrfToken();
echo json_encode(['csrf_token' => $token]);

