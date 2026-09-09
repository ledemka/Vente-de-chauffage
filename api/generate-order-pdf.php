<?php
/**
 * B2B Orders API - Generate PDF
 */
declare(strict_types=1);

session_start();

if (!isset($_SESSION['client_id'])) {
    http_response_code(401);
    die('Non autorisé.');
}

$client_id = $_SESSION['client_id'];
$ref = $_GET['ref'] ?? '';

if (empty($ref)) {
    http_response_code(400);
    die('Référence de commande manquante.');
}

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/dompdf/autoload.inc.php';

use Dompdf\Dompdf;
use Dompdf\Options;

try {
    $db = new Database();
    $pdo = $db->getConnection();
    if ($pdo === null) throw new Exception("DB error");

    // Vérifier l'appartenance de la commande au client
    $stmt = $pdo->prepare("SELECT * FROM orders WHERE order_reference = ? AND client_id = ?");
    $stmt->execute([$ref, $client_id]);
    $order = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$order) {
        http_response_code(403);
        die('Commande introuvable ou accès refusé.');
    }

    // Récupérer les infos détaillées du client pour l'adresse de facturation/livraison complète
    $stmt = $pdo->prepare("SELECT * FROM clients WHERE id = ?");
    $stmt->execute([$client_id]);
    $client = $stmt->fetch(PDO::FETCH_ASSOC);

    // Données de la commande
    $items = json_decode($order['items'], true);
    if (!is_array($items)) $items = [];

    $date = date('d/m/Y', strtotime($order['created_at']));
    
    // Taux de TVA (Défaut français standard, à confirmer avec le client)
    $tva_rate = 0.20; 
    $total_ht = floatval($order['total']) / (1 + $tva_rate);
    $total_tva = floatval($order['total']) - $total_ht;
    $total_ttc = floatval($order['total']);

    // HTML Structure inspirée de sotramsbois, chartée sotramsbois
    $html = '<!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <title>Bon de commande - ' . htmlspecialchars($ref) . '</title>
        <style>
            body { font-family: "Helvetica", "Arial", sans-serif; font-size: 13px; color: #333; margin: 0; padding: 20px; }
            .header { width: 100%; border-bottom: 3px solid #802813; padding-bottom: 20px; margin-bottom: 30px; }
            .logo-placeholder { font-size: 28px; font-weight: bold; color: #802813; margin-bottom: 10px; }
            .company-info { font-size: 11px; color: #666; line-height: 1.5; }
            .doc-title { text-align: right; margin-top: -60px; }
            .doc-title h1 { color: #802813; font-size: 24px; margin: 0; text-transform: uppercase; }
            .doc-title p { margin: 5px 0 0 0; font-size: 14px; font-weight: bold; }
            .addresses { width: 100%; margin-bottom: 40px; }
            .address-box { width: 45%; padding: 15px; border: 1px solid #ddd; background-color: #f9f9f9; border-radius: 4px; }
            .address-box h3 { margin-top: 0; margin-bottom: 10px; font-size: 14px; color: #802813; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
            .address-box p { margin: 0 0 5px 0; line-height: 1.4; }
            table.items { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            table.items th { background-color: #802813; color: #fff; padding: 10px; text-align: left; font-size: 12px; }
            table.items td { padding: 10px; border-bottom: 1px solid #eee; }
            table.items th.right, table.items td.right { text-align: right; }
            table.items th.center, table.items td.center { text-align: center; }
            .totals { width: 40%; float: right; margin-bottom: 40px; }
            .totals table { width: 100%; border-collapse: collapse; }
            .totals table td { padding: 8px; border-bottom: 1px solid #eee; }
            .totals table tr.grand-total td { font-weight: bold; font-size: 16px; color: #802813; border-top: 2px solid #802813; border-bottom: none; }
            .payment-info { clear: both; background-color: #f5f5f5; border-left: 4px solid #802813; padding: 15px; margin-bottom: 40px; }
            .payment-info h4 { margin-top: 0; margin-bottom: 10px; color: #802813; }
            .payment-info p { margin: 0; font-size: 12px; }
            .footer { position: fixed; bottom: -20px; left: 0; right: 0; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #eee; padding-top: 10px; }
        </style>
    </head>
    <body>
        <table class="header">
            <tr>
                <td width="50%">
                    <div class="logo-placeholder">sotramsbois</div>
                    <div class="company-info">
                        [Adresse à compléter par le client]<br>
                        [Téléphone à compléter par le client]<br>
                        Email: [Email à compléter par le client]<br>
                        [SIRET à compléter par le client]
                    </div>
                </td>
                <td width="50%" class="doc-title">
                    <h1>BON DE COMMANDE</h1>
                    <p>Réf: ' . htmlspecialchars($ref) . '</p>
                    <p>Date: ' . $date . '</p>
                </td>
            </tr>
        </table>

        <table class="addresses">
            <tr>
                <td class="address-box" valign="top">
                    <h3>Facturé / Livré à</h3>
                    <p><strong>' . htmlspecialchars($client['company'] ?? $order['company']) . '</strong></p>
                    <p>' . htmlspecialchars($client['contact_name'] ?? $order['contact_name']) . '</p>
                    <p>' . nl2br(htmlspecialchars($order['delivery_address'] ?? $client['address'])) . '</p>
                    <p>' . htmlspecialchars(($client['postal_code'] ?? '') . ' ' . ($client['city'] ?? '')) . '</p>
                    <p>Tél: ' . htmlspecialchars($client['phone'] ?? $order['phone']) . '</p>
                    <p>Email: ' . htmlspecialchars($client['email'] ?? $order['email']) . '</p>
                </td>
                <td width="10%"></td>
                <td class="address-box" valign="top">
                    <h3>Informations de livraison</h3>
                    <p><strong>Accès camion:</strong> ' . htmlspecialchars($order['truck_access']) . '</p>
                    <p><strong>Statut de la commande:</strong> ' . htmlspecialchars($order['status']) . '</p>
                    <p><em>Nous vous contacterons rapidement pour planifier la livraison.</em></p>
                </td>
            </tr>
        </table>

        <table class="items">
            <thead>
                <tr>
                    <th>Désignation</th>
                    <th>Format</th>
                    <th class="center">Qté</th>
                    <th class="right">P.U. TTC</th>
                    <th class="right">Total TTC</th>
                </tr>
            </thead>
            <tbody>';

    foreach ($items as $item) {
        $pu = floatval($item['unit_price']);
        $qty = intval($item['quantity']);
        $lineTotal = $pu * $qty;
        
        $html .= '<tr>
            <td><strong>' . htmlspecialchars($item['name']) . '</strong></td>
            <td>' . htmlspecialchars($item['format'] ?? '') . '</td>
            <td class="center">' . $qty . '</td>
            <td class="right">' . number_format($pu, 2, ',', ' ') . ' €</td>
            <td class="right">' . number_format($lineTotal, 2, ',', ' ') . ' €</td>
        </tr>';
    }

    $html .= '</tbody>
        </table>

        <div class="totals">
            <table>
                <tr>
                    <td>Sous-total HT</td>
                    <td class="right">' . number_format($total_ht, 2, ',', ' ') . ' €</td>
                </tr>
                <tr>
                    <td>TVA (20%)</td>
                    <td class="right">' . number_format($total_tva, 2, ',', ' ') . ' €</td>
                </tr>
                <tr class="grand-total">
                    <td>TOTAL TTC</td>
                    <td class="right">' . number_format($total_ttc, 2, ',', ' ') . ' €</td>
                </tr>
            </table>
        </div>

        <div class="payment-info">
            <h4>Instructions de paiement</h4>
            <p><strong>Mode de paiement :</strong> Virement Bancaire</p>
            <p>[Coordonnées bancaires (IBAN/BIC) à transmettre par email après validation de la commande]</p>
        </div>

        <div class="footer">
            sotramsbois - Solutions professionnelles de biomasse et bois de chauffage haute performance<br>
            Bon de commande généré numériquement - ' . date('d/m/Y H:i') . '
        </div>
    </body>
    </html>';

    // Initialiser DOMPDF
    $options = new Options();
    $options->set('defaultFont', 'Helvetica');
    $options->set('isRemoteEnabled', true);
    
    $dompdf = new Dompdf($options);
    $dompdf->loadHtml($html);
    $dompdf->setPaper('A4', 'portrait');
    $dompdf->render();

    $dompdf->stream('bon-commande-' . $ref . '.pdf', ['Attachment' => true]);

} catch (Exception $e) {
    error_log("PDF Generation Error: " . $e->getMessage());
    http_response_code(500);
    die('Erreur serveur lors de la génération du PDF.');
}
