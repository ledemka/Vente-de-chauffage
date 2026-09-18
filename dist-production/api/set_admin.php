<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';

try {
    $db = new Database();
    $pdo = $db->getConnection();
    if ($pdo === null) throw new Exception("Erreur de connexion à la base de données.");

    $stmt = $pdo->prepare("UPDATE clients SET is_admin = 1 WHERE email = 'ledemka@yahoo.fr'");
    $stmt->execute();
    
    if ($stmt->rowCount() > 0) {
        echo "✅ Succès : Le compte ledemka@yahoo.fr a été mis à jour comme Administrateur.";
    } else {
        // Vérifie si le compte existe
        $check = $pdo->prepare("SELECT is_admin FROM clients WHERE email = 'ledemka@yahoo.fr'");
        $check->execute();
        $result = $check->fetch(PDO::FETCH_ASSOC);
        
        if ($result) {
            if ($result['is_admin'] == 1) {
                echo "✅ Le compte ledemka@yahoo.fr est DEJA administrateur.";
            } else {
                echo "❌ Le compte existe mais la mise à jour a échoué.";
            }
        } else {
            echo "❌ Erreur : Aucun compte trouvé avec l'adresse email ledemka@yahoo.fr.";
        }
    }
} catch (Exception $e) {
    echo "❌ Erreur : " . $e->getMessage();
}
