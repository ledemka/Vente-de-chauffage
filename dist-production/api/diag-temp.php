<?php
/**
 * diag-temp.php — Diagnostic temporaire protégé par jeton.
 * Accès : /api/diag-temp.php?k=<DIAG_TOKEN>
 *
 * À SUPPRIMER dès le diagnostic terminé.
 * Ne jamais exposer de valeur secrète, chemin absolu ou trace complète.
 */
declare(strict_types=1);

// ─── 0. Chargement du .env (même logique que db.php) ──────────────────────
$envPath = __DIR__ . '/../.env';
if (file_exists($envPath)) {
    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        if (strpos($line, '=') === false) continue;
        [$k, $v] = explode('=', $line, 2);
        putenv(trim($k) . '=' . trim($v));
    }
}

// ─── 1. Protection par jeton ───────────────────────────────────────────────
$diagToken = (string)(getenv('DIAG_TOKEN') ?: '');
$provided   = (string)($_GET['k'] ?? '');

if ($diagToken === '' || $provided === '' || !hash_equals($diagToken, $provided)) {
    http_response_code(403);
    exit;
}

// ─── 2. Helpers ───────────────────────────────────────────────────────────
function ok(string $msg): array  { return ['ok' => true,  'msg' => $msg]; }
function fail(string $msg): array { return ['ok' => false, 'msg' => $msg]; }

/** Masque toute valeur qui ressemble à un mot de passe ou secret dans un message. */
function sanitize(string $msg): string {
    // Supprime les chemins absolus (remplace tout ce qui précède /api/ ou /www/)
    $msg = preg_replace('#[A-Za-z]:\\\\[^\s"\']+#', '[path]', $msg);
    $msg = preg_replace('#/[^ "\']+/(home|var|srv|www|public_html|htdocs)[^ "\']*#', '[path]', $msg);
    // Masque les chaînes après "password", "pass", "passwd", "secret", "key" (insensible à la casse)
    $msg = preg_replace('/\b(password|pass|passwd|secret|key|token)\s*[=:]\s*\S+/i', '$1=***', $msg);
    return $msg;
}

/** Indique si une variable d'env est présente et sa longueur, sans en révéler la valeur. */
function envKeyInfo(string $key): array {
    $val = getenv($key);
    if ($val === false || $val === '') {
        return ['present' => false, 'length' => 0];
    }
    return ['present' => true, 'length' => strlen($val)];
}

// ─── 3. Contrôles ─────────────────────────────────────────────────────────
$result = [];

// 3.1 .env trouvé ?
$result['env_file_found'] = file_exists($envPath)
    ? ok('.env trouvé')
    : fail('.env introuvable');

// 3.2 Clés présentes (jamais leur valeur)
$keysToCheck = ['DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS', 'RESEND_API_KEY'];
$keysMeta = [];
$allPresent = true;
foreach ($keysToCheck as $key) {
    $info = envKeyInfo($key);
    $keysMeta[$key] = $info;
    if (!$info['present']) $allPresent = false;
}
$result['env_keys_present'] = array_merge(
    $allPresent ? ok('Toutes les clés présentes') : fail('Une ou plusieurs clés manquantes'),
    ['keys' => $keysMeta]
);

// 3.3 Connexion DB
$dbHost = getenv('DB_HOST') ?: '127.0.0.1';
$dbName = getenv('DB_NAME') ?: '';
$dbUser = getenv('DB_USER') ?: '';
$dbPass = getenv('DB_PASS') ?: '';

$pdo = null;
try {
    $dsn = "mysql:host={$dbHost};dbname={$dbName};charset=utf8mb4";
    $pdo = new PDO($dsn, $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
        PDO::ATTR_TIMEOUT            => 5,
    ]);
    $result['db_connect'] = ok("Connexion PDO établie (host masqué, db: {$dbName})");
} catch (PDOException $e) {
    $safeMsg = sanitize($e->getMessage());
    // Masque toute occurrence du mot de passe réel dans le message d'erreur
    if ($dbPass !== '') {
        $safeMsg = str_replace($dbPass, '***', $safeMsg);
    }
    $result['db_connect'] = fail("Échec PDO : {$safeMsg}");
}

// 3.4 Table cart_items + colonne length
if ($pdo !== null) {
    try {
        $cols = $pdo->query("SHOW COLUMNS FROM `cart_items`")->fetchAll();
        $colNames = array_column($cols, 'Field');
        $hasLength = in_array('length', $colNames, true);
        $result['table_cart_items_exists'] = ok(
            'Table cart_items présente — colonne `length` : ' . ($hasLength ? 'OUI' : 'NON')
        );
        $result['table_cart_items_exists']['length_column'] = $hasLength;
    } catch (PDOException $e) {
        $result['table_cart_items_exists'] = fail('cart_items absente ou inaccessible : ' . sanitize($e->getMessage()));
    }
} else {
    $result['table_cart_items_exists'] = fail('Non testé (connexion DB échouée)');
}

// 3.5 products.json lisible et valide
$productsPath = __DIR__ . '/../data/products.json';
if (!file_exists($productsPath)) {
    $result['products_json_readable'] = fail('data/products.json introuvable');
} elseif (!is_readable($productsPath)) {
    $result['products_json_readable'] = fail('data/products.json non lisible (permissions ?)');
} else {
    $raw = file_get_contents($productsPath);
    $decoded = json_decode($raw, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        $result['products_json_readable'] = fail('JSON invalide : ' . json_last_error_msg());
    } else {
        $count = is_array($decoded) ? count($decoded) : '?';
        $result['products_json_readable'] = ok("JSON valide — {$count} entrée(s) au niveau racine");
    }
}

// 3.6 Version PHP
$result['php_version'] = ok(PHP_VERSION);

// ─── 4. Réponse JSON ──────────────────────────────────────────────────────
header('Content-Type: application/json; charset=utf-8');
http_response_code(200);
echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
