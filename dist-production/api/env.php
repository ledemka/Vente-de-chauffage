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
        $paths = [
            __DIR__ . '/../.env',      // Root of the site (public_html)
            __DIR__ . '/../ .env',     // Fallback for user typo
            __DIR__ . '/../../.env',   // One folder above web root
            __DIR__ . '/.env'          // Inside the api/ folder
        ];
        
        foreach ($paths as $envFile) {
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
                break; // Found it, stop searching
            }
        }
    }

    return $cache[$name] ?? $default;
}
