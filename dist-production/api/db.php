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

        } catch (PDOException $e) {
            // Logging connection error silently in production
            error_log("Database connection error: " . $e->getMessage());
        }

        return $this->conn;
    }
}
