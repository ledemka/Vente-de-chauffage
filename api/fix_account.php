<?php
declare(strict_types=1);
require_once __DIR__ . '/db.php';

try {
    $db = new Database();
    $pdo = $db->getConnection();
    if ($pdo === null) throw new Exception("Erreur de connexion à la base de données.");

    $email = 'ledemka@yahoo.fr';
    $password = 'Trafalgar1995!';
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("UPDATE clients SET password_hash = ?, is_active = 1, is_admin = 1 WHERE email = ?");
    $stmt->execute([$hashed_password, $email]);
    
    if ($stmt->rowCount() > 0) {
        echo "✅ Succès : Le compte {$email} a été activé et son mot de passe a été réinitialisé/haché correctement.";
    } else {
        // Vérifie si le compte existe
        $check = $pdo->prepare("SELECT id FROM clients WHERE email = ?");
        $check->execute([$email]);
        if ($check->fetch()) {
            echo "✅ Le compte {$email} est déjà à jour (mot de passe identique et déjà actif).";
        } else {
            echo "❌ Erreur : Aucun compte trouvé avec l'adresse email {$email}.";
        }
    }
} catch (Exception $e) {
    echo "❌ Erreur : " . $e->getMessage();
}
