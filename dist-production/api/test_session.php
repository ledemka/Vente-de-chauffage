<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();

if (!isset($_SESSION['count'])) {
    $_SESSION['count'] = 0;
}
$_SESSION['count']++;

echo json_encode([
    'session_id' => session_id(),
    'session_save_path' => session_save_path(),
    'count' => $_SESSION['count'],
    'cookies_received' => $_COOKIE
]);
