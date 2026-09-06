const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const langs = ['', 'en', 'de', 'nl'];

// TASK 1: Update api/auth.php
function updateAuthPHP() {
    const authPath = path.join(rootDir, 'api', 'auth.php');
    if (!fs.existsSync(authPath)) return;
    
    let content = fs.readFileSync(authPath, 'utf8');
    
    // Change HTTP Method check
    // FROM: if ($_SERVER['REQUEST_METHOD'] !== 'POST') { ... }
    // TO: if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'GET') { ... }
    content = content.replace(/if \(\$_SERVER\['REQUEST_METHOD'\] !== 'POST'\) \{/, "if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'GET') {");
    
    // Add check logic at the end or in the if-else block
    // It's structured as: if ($action === 'register') { ... } elseif ($action === 'login') { ... } elseif ($action === 'logout') { ... } else { respondError(400, 'Action invalide.'); }
    const checkLogic = `
    elseif ($action === 'check') {
        if (!isset($_SESSION['client_id'])) {
            http_response_code(401);
            echo json_encode(['authenticated' => false]);
            exit;
        }
        
        $stmt = $pdo->prepare("SELECT company, contact_name, email FROM clients WHERE id = ?");
        $stmt->execute([$_SESSION['client_id']]);
        $client = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($client) {
            echo json_encode([
                'authenticated' => true,
                'company' => $client['company'],
                'contact_name' => $client['contact_name'],
                'email' => $client['email']
            ]);
            exit;
        } else {
            http_response_code(401);
            echo json_encode(['authenticated' => false]);
            exit;
        }
    }`;
    
    if (!content.includes("$action === 'check'")) {
        content = content.replace("else {\n        respondError(400, 'Action invalide.');\n    }", checkLogic + "\n    else {\n        respondError(400, 'Action invalide.');\n    }");
        fs.writeFileSync(authPath, content);
        console.log('Updated api/auth.php');
    }
}

// TASK 2: Update tableau-de-bord.html
function updateDashboard() {
    langs.forEach(lang => {
        const file = path.join(rootDir, lang, 'tableau-de-bord.html');
        if (!fs.existsSync(file)) return;
        
        let content = fs.readFileSync(file, 'utf8');
        const prefix = lang ? '../' : './';
        
        // We will update the DOMContentLoaded script.
        // Currently it has:
        // const user = AuthAPI && AuthAPI.getUser();
        // if (!user) { window.location.href = './connexion.html'; return; }
        // document.getElementById('info-company').textContent = user.company || '-';
        // ...
        
        const oldScriptStart = "const user = AuthAPI && AuthAPI.getUser();";
        const oldScriptEnd = "document.getElementById('info-email').textContent = user.email || '-';";
        
        // We will replace that whole section with a fetch to api/auth.php?action=check
        const regex = /const user = AuthAPI && AuthAPI\.getUser\(\);[\s\S]*?document\.getElementById\('info-email'\)\.textContent = user\.email \|\| '-';/;
        
        const newScript = `
    try {
        const checkRes = await fetch('${prefix}api/auth.php?action=check', { method: 'POST' });
        if (!checkRes.ok) throw new Error('Not auth');
        const userData = await checkRes.json();
        
        if (!userData.authenticated) {
            throw new Error('Not auth');
        }
        
        document.getElementById('info-company').textContent = userData.company || '-';
        document.getElementById('info-contact').textContent = userData.contact_name || '-';
        document.getElementById('info-email').textContent = userData.email || '-';
        
        // Mettre à jour l'entête de bienvenue
        const h1 = document.querySelector('h1.text-headline-xl');
        if (h1 && userData.contact_name) {
            // Optionnel: ajouter le nom au titre
            // h1.textContent = \`Bonjour \${userData.contact_name}\`;
        }
        
    } catch (e) {
        localStorage.removeItem('user');
        window.location.href = '${prefix}connexion.html?redirect=tableau-de-bord.html';
        return;
    }
`;

        if (!content.includes('auth.php?action=check')) {
            content = content.replace(regex, newScript);
            fs.writeFileSync(file, content);
            console.log('Updated', file);
        }
    });
}

updateAuthPHP();
updateDashboard();
console.log('Done');
