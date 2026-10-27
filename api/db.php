<?php
declare(strict_types=1);
/**
 * PHP / PDO Skeleton for B2B Wood Heating Catalog Database Connection
 * Prepared for Step 2 product data integration and B2B quote handling.
 */
class Database {
    private string $host;
    private string $db_name;
    private string $username;
    private string $password;
    private ?PDO $conn = null;

    public function __construct() {
        $envVars = [];
        $paths = [
            __DIR__ . '/../.env',      // Root of the site (public_html)
            __DIR__ . '/../ .env',     // Fallback for user typo (leading space)
            __DIR__ . '/../../.env',   // One folder above web root
            __DIR__ . '/.env'          // Inside the api/ folder
        ];
        
        $foundEnvPath = null;
        foreach ($paths as $envPath) {
            if (file_exists($envPath)) {
                $foundEnvPath = $envPath;
                $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
                foreach ($lines as $line) {
                    if (strpos(trim($line), '#') === 0) continue;
                    if (strpos($line, '=') === false) continue;
                    [$key, $value] = explode('=', $line, 2);
                    $key = trim($key);
                    $value = trim(trim($value, '"'), "'"); 
                    putenv("$key=$value");
                    $_ENV[$key] = $value;
                    $envVars[$key] = $value;
                }
                break;
            }
        }

        $this->host = $envVars['DB_HOST'] ?? $_ENV['DB_HOST'] ?? getenv('DB_HOST') ?: '127.0.0.1';
        $this->db_name = $envVars['DB_NAME'] ?? $_ENV['DB_NAME'] ?? getenv('DB_NAME') ?: 'bois_chauffage_b2b';
        $this->username = $envVars['DB_USER'] ?? $_ENV['DB_USER'] ?? getenv('DB_USER') ?: 'root';
        $this->password = $envVars['DB_PASS'] ?? $_ENV['DB_PASS'] ?? getenv('DB_PASS') ?: '';
    }

    public function getConnection(): ?PDO {
        if ($this->conn !== null) {
            return $this->conn;
        }

        try {
            $dsn = "mysql:host={$this->host};dbname={$this->db_name};charset=utf8mb4";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ];
            $this->conn = new PDO($dsn, $this->username, $this->password, $options);
        } catch (PDOException $e) {
            error_log("Database connection error: " . $e->getMessage() . " - Falling back to SQLite.");
            try {
                $sqlitePath = __DIR__ . '/database.sqlite';
                $this->conn = new PDO("sqlite:" . $sqlitePath, null, null, [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]);
            } catch (PDOException $sqliteEx) {
                error_log("SQLite connection error: " . $sqliteEx->getMessage());
                return null;
            }
        }

        if ($this->conn !== null) {
            $isSqlite = $this->conn->getAttribute(PDO::ATTR_DRIVER_NAME) === 'sqlite';
            $idCol = $isSqlite ? 'INTEGER PRIMARY KEY AUTOINCREMENT' : 'INT AUTO_INCREMENT PRIMARY KEY';
            $tableOpts = $isSqlite ? '' : ' ENGINE=InnoDB DEFAULT CHARSET=utf8mb4';

            // Auto-create devis_requests table if it doesn't exist
            $sql = "CREATE TABLE IF NOT EXISTS devis_requests (
                id $idCol,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                product_id VARCHAR(50) NOT NULL,
                product_name VARCHAR(255) NOT NULL,
                quantity INT NOT NULL,
                format VARCHAR(50) NOT NULL,
                delivery_date DATE NULL,
                truck_access VARCHAR(50) NOT NULL,
                delivery_address TEXT NOT NULL,
                company VARCHAR(255) NOT NULL,
                siret VARCHAR(100) NULL,
                contact_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50) NOT NULL,
                message TEXT NULL,
                lang VARCHAR(10) NOT NULL
            )$tableOpts;";
            $this->conn->exec($sql);

            // Create clients table
            $sql = "CREATE TABLE IF NOT EXISTS clients (
                id $idCol,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                company VARCHAR(255) NOT NULL,
                siret VARCHAR(100) NULL,
                contact_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                phone VARCHAR(50) NOT NULL,
                address VARCHAR(255) NOT NULL DEFAULT '',
                city VARCHAR(100) NOT NULL DEFAULT '',
                postal_code VARCHAR(20) NOT NULL DEFAULT '',
                password_hash VARCHAR(255) NOT NULL,
                is_admin TINYINT(1) DEFAULT 0,
                lang VARCHAR(10) NOT NULL
            )$tableOpts;";
            $this->conn->exec($sql);

            if (!$isSqlite) {
                try {
                    $this->conn->exec("ALTER TABLE clients 
                        ADD COLUMN address VARCHAR(255) NOT NULL DEFAULT '' AFTER phone,
                        ADD COLUMN city VARCHAR(100) NOT NULL DEFAULT '' AFTER address,
                        ADD COLUMN postal_code VARCHAR(20) NOT NULL DEFAULT '' AFTER city;");
                } catch (PDOException $e) {}
            }

            // Create cart_items table
            $sql = "CREATE TABLE IF NOT EXISTS cart_items (
                id $idCol,
                client_id INT NULL,
                session_token VARCHAR(64) NULL,
                product_id VARCHAR(50) NOT NULL,
                length VARCHAR(10) NULL,
                quantity INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )$tableOpts;";
            $this->conn->exec($sql);

            // Create orders table
            $sql = "CREATE TABLE IF NOT EXISTS orders (
                id $idCol,
                order_reference VARCHAR(50) NOT NULL UNIQUE,
                client_id INT NULL,
                company VARCHAR(255) NOT NULL,
                siret VARCHAR(100) NULL,
                contact_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                phone VARCHAR(50) NOT NULL,
                delivery_address TEXT NOT NULL,
                truck_access VARCHAR(50) NOT NULL,
                items JSON NOT NULL,
                subtotal DECIMAL(10,2) NOT NULL,
                discount_tier INT NOT NULL,
                discount_percent DECIMAL(5,2) NOT NULL,
                total DECIMAL(10,2) NOT NULL,
                payment_method VARCHAR(20) DEFAULT 'virement',
                status VARCHAR(20) DEFAULT 'pending_payment',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                lang VARCHAR(10) NOT NULL
            )$tableOpts;";
            $this->conn->exec($sql);

            // Create login_attempts table for brute-force protection
            $sql = "CREATE TABLE IF NOT EXISTS login_attempts (
                id $idCol,
                email VARCHAR(255) NOT NULL,
                ip_address VARCHAR(45) NOT NULL,
                attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )$tableOpts;";
            $this->conn->exec($sql);
        }

        return $this->conn;
    }
}
