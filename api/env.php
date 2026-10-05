<?php
declare(strict_types=1);

function getEnvVar(string $name, string $default = ''): string {
    static $cache = null;

    $val = getenv($name);
    if ($val !== false && trim((string)$val) !== '') {
        $val = trim((string)$val);
        return trim($val, "\"'");
    }

    if (isset($_ENV[$name]) && trim((string)$_ENV[$name]) !== '') {
        $val = trim((string)$_ENV[$name]);
        return trim($val, "\"'");
    }

    if ($cache === null) {
        $cache = [];
        $envFile = __DIR__ . '/../.env';
        if (file_exists($envFile)) {
            $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
            if ($lines !== false) {
                foreach ($lines as $line) {
                    $line = trim($line);
                    if (strpos($line, '#') === 0) continue;
                    $parts = explode('=', $line, 2);
                    if (count($parts) === 2) {
                        $k = trim($parts[0]);
                        $v = trim($parts[1]);
                        // Remove single or double quotes
                        $cache[$k] = trim($v, "\"'");
                    }
                }
            }
        }
    }

    return $cache[$name] ?? $default;
}
