<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

$dir = realpath(__DIR__ . '/..');
$files = scandir($dir);
$env_status = [];

$paths = [
    __DIR__ . '/../.env',
    __DIR__ . '/../../.env',
    __DIR__ . '/.env',
    __DIR__ . '/../.env.txt'
];

foreach ($paths as $p) {
    $env_status[$p] = [
        'file_exists' => file_exists($p),
        'is_readable' => is_readable($p),
        'realpath' => realpath($p)
    ];
}

echo json_encode([
    'parent_directory' => $dir,
    'files_in_parent' => $files,
    'path_tests' => $env_status
], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
