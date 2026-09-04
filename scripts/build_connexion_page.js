const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dirs = ['.', 'en', 'de', 'nl'];

const newMainContent = `<div class="max-w-md mx-auto px-margin-mobile md:px-margin-desktop py-16">
    <div class="bg-surface-container rounded-xl p-8 shadow-md flex flex-col gap-6 border border-outline/20">
        <div class="flex flex-col items-center gap-2 mb-4">
            <div class="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
                <span class="material-symbols-outlined text-[28px]">lock</span>
            </div>
            <h1 class="text-headline-lg font-headline-lg text-on-surface" data-i18n="auth.login_title">Connexion</h1>
        </div>

        <form id="login-form" class="flex flex-col gap-5">
            <div id="login-error" class="hidden bg-error-container text-on-error-container p-3 rounded-md text-body-sm text-center font-medium"></div>
            
            <div class="flex flex-col gap-2">
                <label for="email" class="text-label-md font-label-md text-on-surface uppercase" data-i18n="auth.email">Adresse Email</label>
                <input type="email" id="email" required class="w-full bg-surface-container-highest border border-outline-variant rounded-md py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
            </div>

            <div class="flex flex-col gap-2">
                <label for="password" class="text-label-md font-label-md text-on-surface uppercase" data-i18n="auth.password">Mot de passe</label>
                <input type="password" id="password" required class="w-full bg-surface-container-highest border border-outline-variant rounded-md py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
            </div>

            <button type="submit" class="mt-4 bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-4 px-8 rounded-md transition-colors flex items-center justify-center gap-2 w-full shadow-sm">
                <span data-i18n="auth.login_btn">Se connecter</span>
                <span class="material-symbols-outlined text-[20px]">login</span>
            </button>
        </form>

        <div class="mt-6 text-center text-body-sm text-on-surface-variant border-t border-outline/20 pt-6">
            <p>Pas encore de compte professionnel ?</p>
            <a href="LINK_INSCRIPTION" class="text-primary font-bold hover:underline mt-2 inline-block">Créer un compte B2B</a>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    const user = AuthAPI && AuthAPI.getUser();
    if (user) {
        window.location.href = 'LINK_PANIER';
    }

    const form = document.getElementById('login-form');
    const errorDiv = document.getElementById('login-error');

    if(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorDiv.classList.add('hidden');
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="material-symbols-outlined animate-spin">autorenew</span>';
            btn.disabled = true;

            try {
                const res = await AuthAPI.login(email, password);
                if (res.success) {
                    window.location.href = 'LINK_PANIER';
                } else {
                    errorDiv.textContent = res.message || 'Erreur de connexion';
                    errorDiv.classList.remove('hidden');
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }
            } catch (err) {
                errorDiv.textContent = 'Erreur réseau. Veuillez réessayer.';
                errorDiv.classList.remove('hidden');
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        });
    }
});
</script>`;

let modifiedCount = 0;

for (const dir of dirs) {
    const fullPath = path.join(rootDir, dir);
    if (!fs.existsSync(fullPath)) continue;
    
    const filePath = path.join(fullPath, 'connexion.html');
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Find the <main> tag content to replace
        const mainRegex = /<main[^>]*>([\s\S]*?)<\/main>/i;
        
        // Fix relative links based on dir
        const relPath = dir === '.' ? '.' : '..';
        let customContent = newMainContent
            .replace(/LINK_INSCRIPTION/g, `${relPath}/inscription.html`)
            .replace(/LINK_PANIER/g, `${relPath}/panier.html`);

        content = content.replace(mainRegex, (match, p1) => {
            return match.replace(p1, customContent);
        });

        fs.writeFileSync(filePath, content, 'utf8');
        modifiedCount++;
        console.log(`Updated ${path.join(dir, 'connexion.html')}`);
    }
}

console.log(`Updated ${modifiedCount} files.`);
