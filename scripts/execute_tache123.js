const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const langs = ['', 'en', 'de', 'nl'];

// TASK 1: produit.html buttons
function fixProduit() {
    langs.forEach(lang => {
        const file = path.join(rootDir, lang, 'produit.html');
        if (!fs.existsSync(file)) return;
        
        let content = fs.readFileSync(file, 'utf-8');
        
        // Remove existing onclicks or hrefs just in case, then add ours.
        
        const commanderMatch = content.match(/<button id="btn-commander"[^>]*>/);
        if (commanderMatch) {
            let newTag = commanderMatch[0].replace(/onclick="[^"]*"/, '');
            newTag = newTag.replace(/>$/, ' onclick="handleCommanderClick(this)">');
            content = content.replace(commanderMatch[0], newTag);
        }

        const devisMatch = content.match(/<button id="btn-devis"[^>]*>/);
        if (devisMatch) {
            let newTag = devisMatch[0].replace(/onclick="[^"]*"/, '');
            const prefix = lang ? '../' : './';
            newTag = newTag.replace(/>$/, ` onclick="window.location.href='${prefix}devis.html?product=' + new URLSearchParams(window.location.search).get('id')">`);
            content = content.replace(devisMatch[0], newTag);
        }
        
        // Add the handleCommanderClick function before </body>
        if (!content.includes('function handleCommanderClick')) {
            const prefix = lang ? '../' : './';
            content = content.replace('</body>', `
<script>
window.handleCommanderClick = async function(btn) {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    if (!productId) return;
    const qtyInput = document.getElementById('qty-input');
    const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;
    if (window.CartAPI) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="material-symbols-outlined animate-spin">autorenew</span>';
        try {
            await window.CartAPI.add(productId, qty);
            window.location.href = '${prefix}panier.html';
        } catch (e) {
            console.error(e);
            btn.innerHTML = originalText;
        }
    }
};
</script>
</body>`);
        }
        
        fs.writeFileSync(file, content);
        console.log('Fixed produit.html for lang:', lang);
    });
}

// TASK 2.5: Create tableau-de-bord.html
function createDashboard() {
    const tplFrPath = path.join(rootDir, 'connexion.html'); // base template
    if (!fs.existsSync(tplFrPath)) return;
    
    let baseHtml = fs.readFileSync(tplFrPath, 'utf-8');
    const mainRegex = /<main[^>]*>[\s\S]*?<\/main>/;
    
    langs.forEach(lang => {
        let tpl = lang ? fs.readFileSync(path.join(rootDir, lang, 'connexion.html'), 'utf-8') : baseHtml;
        const prefix = lang ? '../' : './';
        
        let dashboardMain = `
<main class="w-full pt-[128px] bg-background min-h-screen">
    <div class="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-16">
        <div class="flex justify-between items-center mb-10">
            <h1 class="text-headline-xl font-headline-xl text-on-surface" data-i18n="dashboard.title">Mon Tableau de Bord</h1>
            <button onclick="handleLogout()" class="bg-surface-container-highest hover:bg-surface-dim text-on-surface font-label-md text-label-md py-2 px-6 rounded-md transition-colors flex items-center gap-2 border border-outline/20 shadow-sm">
                <span class="material-symbols-outlined text-[20px]">logout</span>
                <span data-i18n="dashboard.logout">Déconnexion</span>
            </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-1">
                <div class="bg-surface-container p-6 rounded-xl border border-outline/10 shadow-sm h-full">
                    <h2 class="text-headline-md font-headline-md text-on-surface mb-6 flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary">badge</span>
                        <span data-i18n="dashboard.my_info">Mes Informations</span>
                    </h2>
                    
                    <div class="flex flex-col gap-4">
                        <div>
                            <span class="text-label-md font-label-md text-outline-variant block mb-1" data-i18n="dashboard.company">Société</span>
                            <span id="info-company" class="text-body-md text-on-surface font-bold">-</span>
                        </div>
                        <div>
                            <span class="text-label-md font-label-md text-outline-variant block mb-1" data-i18n="dashboard.contact">Contact</span>
                            <span id="info-contact" class="text-body-md text-on-surface">-</span>
                        </div>
                        <div>
                            <span class="text-label-md font-label-md text-outline-variant block mb-1" data-i18n="dashboard.email">Email</span>
                            <span id="info-email" class="text-body-md text-on-surface">-</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="lg:col-span-2">
                <div class="bg-surface-container p-6 rounded-xl border border-outline/10 shadow-sm h-full">
                    <h2 class="text-headline-md font-headline-md text-on-surface mb-6 flex items-center gap-2">
                        <span class="material-symbols-outlined text-primary">list_alt</span>
                        <span data-i18n="dashboard.my_orders">Mes Commandes</span>
                    </h2>
                    
                    <div id="orders-container" class="overflow-x-auto">
                        <div class="text-center py-10 text-on-surface-variant flex flex-col items-center justify-center">
                            <span class="material-symbols-outlined animate-spin text-[32px] mb-4">autorenew</span>
                            <span data-i18n="dashboard.loading">Chargement...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</main>
<script>
document.addEventListener('DOMContentLoaded', async () => {
    const user = AuthAPI && AuthAPI.getUser();
    if (!user) {
        window.location.href = '${prefix}connexion.html';
        return;
    }
    
    document.getElementById('info-company').textContent = user.company || '-';
    document.getElementById('info-contact').textContent = user.contact_name || '-';
    document.getElementById('info-email').textContent = user.email || '-';

    const ordersContainer = document.getElementById('orders-container');
    try {
        const formData = new URLSearchParams();
        formData.append('action', 'list');
        const res = await fetch('${prefix}api/orders.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString()
        });
        const data = await res.json();
        
        if (data.success && data.orders && data.orders.length > 0) {
            let html = '<table class="w-full text-left border-collapse"><thead class="border-b border-outline/20"><tr><th class="py-3 pr-2 text-label-md font-label-md text-on-surface-variant">Référence</th><th class="py-3 px-2 text-label-md font-label-md text-on-surface-variant">Date</th><th class="py-3 px-2 text-label-md font-label-md text-on-surface-variant">Statut</th><th class="py-3 pl-2 text-label-md font-label-md text-on-surface-variant text-right">Total HT</th></tr></thead><tbody>';
            
            data.orders.forEach(order => {
                const dateObj = new Date(order.created_at);
                const dateStr = dateObj.toLocaleDateString();
                const statusMap = {
                    'pending_payment': 'En attente de virement',
                    'paid': 'Payée',
                    'shipped': 'Expédiée',
                    'delivered': 'Livrée',
                    'cancelled': 'Annulée'
                };
                const statusTxt = statusMap[order.status] || order.status;
                const totalFmt = parseFloat(order.total).toFixed(2) + ' €';
                
                html += \`<tr class="border-b border-outline/10">
                    <td class="py-4 pr-2 text-body-md font-bold text-on-surface">\${order.order_reference}</td>
                    <td class="py-4 px-2 text-body-sm text-on-surface-variant">\${dateStr}</td>
                    <td class="py-4 px-2 text-body-sm"><span class="px-2 py-1 bg-surface-container-highest rounded text-on-surface-variant">\${statusTxt}</span></td>
                    <td class="py-4 pl-2 text-right text-body-md font-data-mono font-bold text-primary">\${totalFmt}</td>
                </tr>\`;
            });
            html += '</tbody></table>';
            ordersContainer.innerHTML = html;
        } else {
            ordersContainer.innerHTML = '<div class="text-center py-10 text-on-surface-variant"><span class="material-symbols-outlined text-[48px] opacity-50 mb-4 block">inventory_2</span><p data-i18n="dashboard.no_orders">Aucune commande pour le moment.</p></div>';
        }
    } catch (err) {
        ordersContainer.innerHTML = '<div class="text-center py-10 text-error">Erreur lors du chargement des commandes.</div>';
    }
});

async function handleLogout() {
    if (window.AuthAPI) {
        await AuthAPI.logout();
        window.location.href = '${prefix}connexion.html';
    }
}
</script>
`;
        
        let resultHtml = tpl.replace(mainRegex, dashboardMain);
        resultHtml = resultHtml.replace(/<title>.*?<\/title>/, '<title>Mon Tableau de Bord | sotramsbois</title>');
        
        const dest = path.join(rootDir, lang, 'tableau-de-bord.html');
        fs.writeFileSync(dest, resultHtml);
        console.log('Created tableau-de-bord.html for lang:', lang);
    });
}

// TASK 2: Create api/orders.php
function createApiOrders() {
    const dest = path.join(rootDir, 'api', 'orders.php');
    const content = `<?php
/**
 * B2B Orders API - List orders
 */
declare(strict_types=1);

session_start();
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

$action = $_POST['action'] ?? $_GET['action'] ?? '';
if ($action !== 'list') {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Action invalide.']);
    exit;
}

$client_id = $_SESSION['client_id'] ?? null;
if (!$client_id) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Non autorisé.']);
    exit;
}

try {
    $db = new Database();
    $pdo = $db->getConnection();
    if ($pdo === null) throw new Exception("DB error");

    $stmt = $pdo->prepare("SELECT order_reference, total, status, created_at FROM orders WHERE client_id = ? ORDER BY created_at DESC");
    $stmt->execute([$client_id]);
    $orders = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'orders' => $orders]);

} catch (Exception $e) {
    error_log("Orders API Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur serveur.']);
}
`;
    fs.writeFileSync(dest, content);
    console.log('Created api/orders.php');
}

// TASK 3: Contextual redirect on connexion.html
function fixConnexion() {
    langs.forEach(lang => {
        const file = path.join(rootDir, lang, 'connexion.html');
        if (!fs.existsSync(file)) return;
        
        let content = fs.readFileSync(file, 'utf-8');
        
        const replaceStr = `if (res.success) {
                    const urlParams = new URLSearchParams(window.location.search);
                    const redirect = urlParams.get('redirect');
                    if (redirect) {
                        window.location.href = './' + redirect;
                    } else {
                        window.location.href = './tableau-de-bord.html';
                    }
                }`;
                
        const topReplace = `if (user) {
        const params = new URLSearchParams(window.location.search);
        const redir = params.get('redirect');
        window.location.href = redir ? './' + redir : './tableau-de-bord.html';
    }`;
    
        content = content.replace(/if\s*\(res\.success\)\s*\{\s*window\.location\.href\s*=\s*'(\.\/)?panier\.html';\s*\}/, replaceStr);
        content = content.replace(/if\s*\(user\)\s*window\.location\.href\s*=\s*'(\.\/)?panier\.html';/, topReplace);

        fs.writeFileSync(file, content);
        console.log('Fixed connexion.html for lang:', lang);
    });
}

// TASK 3.5: recapitulatif-commande.html pointing to ?redirect
function fixRecap() {
    langs.forEach(lang => {
        const file = path.join(rootDir, lang, 'recapitulatif-commande.html');
        if (!fs.existsSync(file)) return;
        
        let content = fs.readFileSync(file, 'utf-8');
        content = content.replace(/href="([^"]*?)connexion\.html"/g, 'href="$1connexion.html?redirect=recapitulatif-commande.html"');
        
        fs.writeFileSync(file, content);
        console.log('Fixed recapitulatif-commande.html for lang:', lang);
    });
}

// TASK 2.6: Footer updates
function updateFooters() {
    const filesToUpdate = [];
    function findHtmlFiles(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory() && ['api', 'assets', 'dist-production', '.git', 'node_modules'].includes(entry.name)) continue;
            if (entry.isDirectory()) {
                findHtmlFiles(fullPath);
            } else if (entry.isFile() && entry.name.endsWith('.html')) {
                filesToUpdate.push(fullPath);
            }
        }
    }
    findHtmlFiles(rootDir);
    
    for (const file of filesToUpdate) {
        let content = fs.readFileSync(file, 'utf-8');
        if (content.includes('footer.client_link_2')) {
            const linkRegex = /(<a[^>]*href="[^"]*connexion\.html"[^>]*>.*?<\/a>)/;
            const match = content.match(linkRegex);
            if (match && !content.includes('tableau-de-bord.html')) {
                const isSubdir = file.split(path.sep).length > rootDir.split(path.sep).length + 1;
                const prefix = isSubdir ? '../' : './';
                
                const newLink = `\n<a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="${prefix}tableau-de-bord.html"><span data-i18n="nav.dashboard">Mon Tableau de bord</span></a>`;
                content = content.replace(linkRegex, '$1' + newLink);
                fs.writeFileSync(file, content);
                console.log('Updated footer in:', file);
            }
        }
    }
}

// Execute all
fixProduit();
createDashboard();
createApiOrders();
fixConnexion();
fixRecap();
updateFooters();
console.log('All done!');
