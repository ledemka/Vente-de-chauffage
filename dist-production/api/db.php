<?php
/**
 * PHP / PDO Skeleton for B2B Wood Heating Catalog Database Connection
 * Prepared for Step 2 product data integration and B2B quote handling.
 */

declare(strict_types=1);

class Database {
    private string $host = '127.0.0.1';
    private string $db_name = 'bois_chauffage_b2b';
    private string $username = 'root';
    private string $password = '';
    private ?PDO $conn = null;

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
            
            // Auto-create devis_requests table if it doesn't exist
            $sql = "CREATE TABLE IF NOT EXISTS devis_requests (
                id INT AUTO_INCREMENT PRIMARY KEY,
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
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
            $this->conn->exec($sql);

            // Create clients table
            $sql = "CREATE TABLE IF NOT EXISTS clients (
                id INT AUTO_INCREMENT PRIMARY KEY,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                company VARCHAR(255) NOT NULL,
                siret VARCHAR(100) NULL,
                contact_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                phone VARCHAR(50) NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                is_admin TINYINT(1) DEFAULT 0,
                lang VARCHAR(10) NOT NULL
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
            $this->conn->exec($sql);

            // Create cart_items table
            $sql = "CREATE TABLE IF NOT EXISTS cart_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                client_id INT NULL,
                session_token VARCHAR(64) NULL,
                product_id VARCHAR(50) NOT NULL,
                quantity INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_client (client_id),
                INDEX idx_session (session_token)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
            $this->conn->exec($sql);

            // Create orders table
            $sql = "CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
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
                lang VARCHAR(10) NOT NULL,
                INDEX idx_client (client_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
            $this->conn->exec($sql);

            // Create login_attempts table for brute-force protection
            $sql = "CREATE TABLE IF NOT EXISTS login_attempts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                ip_address VARCHAR(45) NOT NULL,
                attempt_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_email (email),
                INDEX idx_ip (ip_address)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;";
            $this->conn->exec($sql);

        } catch (PDOException $e) {
            // Logging connection error silently in production
            error_log("Database connection error: " . $e->getMessage());
        }

        return $this->conn;
    }
}
