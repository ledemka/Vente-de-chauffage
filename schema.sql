-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               MySQL
-- --------------------------------------------------------

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--
CREATE TABLE IF NOT EXISTS `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `company` varchar(255) NOT NULL,
  `siret` varchar(100) DEFAULT NULL,
  `contact_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `address` varchar(255) NOT NULL DEFAULT '',
  `city` varchar(100) NOT NULL DEFAULT '',
  `postal_code` varchar(20) NOT NULL DEFAULT '',
  `password_hash` varchar(255) NOT NULL,
  `is_admin` tinyint(1) DEFAULT '0',
  `lang` varchar(10) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '0',
  `activation_token` varchar(64) DEFAULT NULL,
  `token_expires_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `devis_requests`
--
CREATE TABLE IF NOT EXISTS `devis_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `product_id` varchar(50) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `format` varchar(50) NOT NULL,
  `delivery_date` date DEFAULT NULL,
  `truck_access` varchar(50) NOT NULL,
  `delivery_address` text NOT NULL,
  `company` varchar(255) NOT NULL,
  `siret` varchar(100) DEFAULT NULL,
  `contact_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `message` text,
  `lang` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--
CREATE TABLE IF NOT EXISTS `cart_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` int(11) DEFAULT NULL,
  `session_token` varchar(64) DEFAULT NULL,
  `product_id` varchar(50) NOT NULL,
  `quantity` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_client` (`client_id`),
  KEY `idx_session` (`session_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--
CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_reference` varchar(50) NOT NULL,
  `client_id` int(11) DEFAULT NULL,
  `company` varchar(255) NOT NULL,
  `siret` varchar(100) DEFAULT NULL,
  `contact_name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `delivery_address` text NOT NULL,
  `truck_access` varchar(50) NOT NULL,
  `items` json NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `discount_tier` int(11) NOT NULL,
  `discount_percent` decimal(5,2) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `payment_method` varchar(20) DEFAULT 'virement',
  `status` varchar(20) DEFAULT 'pending_payment',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `lang` varchar(10) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_reference` (`order_reference`),
  KEY `idx_client` (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `login_attempts`
--
CREATE TABLE IF NOT EXISTS `login_attempts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `attempt_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_ip` (`ip_address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `contact_attempts`
--
CREATE TABLE IF NOT EXISTS `contact_attempts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ip_address` varchar(45) NOT NULL,
  `attempt_time` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

COMMIT;
