const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dirs = ['.', 'en', 'de', 'nl'];

const newMainContent = `<div class="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-16">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        <!-- Left Side: Information -->
        <div class="flex flex-col gap-8">
            <div class="flex flex-col gap-6">
                <div class="inline-flex items-center gap-2 bg-surface-container-high border border-outline/10 text-primary font-label-md text-label-md uppercase tracking-wider py-2 px-4 rounded-full w-fit">
                    <span class="material-symbols-outlined text-[18px]">verified</span>
                    <span>Espace Professionnel B2B</span>
                </div>
                <h1 class="text-[48px] leading-[1.1] font-headline-xl text-on-surface">
                    Optimisez vos approvisionnements en biomasse.
                </h1>
                <p class="text-body-lg text-on-surface-variant max-w-xl">
                    Accédez à vos grilles tarifaires négociées, suivez vos livraisons de bois haute performance en temps réel et gérez vos commandes en gros en toute simplicité.
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <!-- Feature 1 -->
                <div class="bg-surface-container rounded-xl p-6 flex flex-col gap-3 border border-outline/10">
                    <div class="text-primary">
                        <span class="material-symbols-outlined text-[28px]">local_shipping</span>
                    </div>
                    <div class="flex flex-col gap-1">
                        <h3 class="font-headline-md text-[18px] font-semibold text-on-surface">Livraison Palette</h3>
                        <p class="text-body-sm text-on-surface-variant">Suivi logistique précis sur toute la France.</p>
                    </div>
                </div>
                
                <!-- Feature 2 -->
                <div class="bg-surface-container rounded-xl p-6 flex flex-col gap-3 border border-outline/10">
                    <div class="text-primary">
                        <span class="material-symbols-outlined text-[28px]">receipt_long</span>
                    </div>
                    <div class="flex flex-col gap-1">
                        <h3 class="font-headline-md text-[18px] font-semibold text-on-surface">Facturation Pro</h3>
                        <p class="text-body-sm text-on-surface-variant">Gestion centralisée et bons de livraison dématérialisés.</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right Side: Form -->
        <div class="bg-surface-container rounded-2xl p-8 shadow-md border border-outline/10 max-w-lg ml-auto w-full">
            <div class="mb-8">
                <h2 class="text-[32px] font-headline-lg text-on-surface mb-2">Connexion B2B</h2>
                <p class="text-body-sm text-on-surface-variant">Entrez vos identifiants professionnels pour accéder à votre espace.</p>
            </div>

            <form id="login-form" class="flex flex-col gap-6">
                <div id="login-error" class="hidden bg-error-container text-on-error-container p-3 rounded-md text-body-sm text-center font-medium"></div>
                
                <!-- Email Field -->
                <div class="flex flex-col gap-2">
                    <label for="email" class="text-label-md font-label-md text-on-surface">Email Professionnel</label>
                    <div class="relative">
                        <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant text-[20px]">mail</span>
                        <input type="email" id="email" required placeholder="[Ex: contact@entreprise.fr]" class="w-full bg-surface-container-lowest border border-outline/20 rounded-md py-3 pl-12 pr-4 text-body-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                    </div>
                </div>

                <!-- Password Field -->
                <div class="flex flex-col gap-2">
                    <div class="flex justify-between items-center">
                        <label for="password" class="text-label-md font-label-md text-on-surface">Mot de passe</label>
                        <a href="#" class="text-label-md font-label-md text-primary hover:underline">Mot de passe oublié ?</a>
                    </div>
                    <div class="relative">
                        <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant text-[20px]">lock</span>
                        <input type="password" id="password" required placeholder="[Votre mot de passe sécurisé]" class="w-full bg-surface-container-lowest border border-outline/20 rounded-md py-3 pl-12 pr-12 text-body-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                        <button type="button" class="toggle-password absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors flex items-center justify-center p-1 rounded-full focus:outline-none" aria-label="Afficher le mot de passe">
                            <span class="material-symbols-outlined text-[20px]">visibility</span>
                        </button>
                    </div>
                </div>

                <!-- Remember me -->
                <div class="flex items-center gap-3 mt-2">
                    <input type="checkbox" id="remember" class="w-4 h-4 text-primary bg-surface-container-lowest border-outline rounded focus:ring-primary focus:ring-2">
                    <label for="remember" class="text-body-sm text-on-surface-variant">Rester connecté</label>
                </div>

                <!-- Submit Button -->
                <button type="submit" class="mt-2 w-full bg-[#752614] hover:bg-primary-container text-white font-label-md text-label-md py-3.5 px-8 rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <span>Se connecter</span>
                    <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
            </form>

            <div class="relative flex py-6 items-center">
                <div class="flex-grow border-t border-outline/20"></div>
                <span class="flex-shrink-0 mx-4 text-outline-variant text-body-sm">ou</span>
                <div class="flex-grow border-t border-outline/20"></div>
            </div>

            <!-- Guest Button -->
            <a href="LINK_CATALOGUE" class="w-full bg-surface-container-lowest border border-outline/30 hover:bg-surface-container-high text-on-surface font-label-md text-label-md py-3.5 px-8 rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm mb-6">
                <span class="material-symbols-outlined text-[20px]">shopping_bag</span>
                <span>Continuer en tant qu'invité</span>
            </a>

            <!-- Register Link -->
            <div class="text-center text-body-sm text-on-surface-variant pt-2">
                <span>Pas encore de compte ?</span>
                <a href="LINK_INSCRIPTION" class="text-[#752614] font-semibold hover:underline ml-1">S'inscrire</a>
            </div>
        </div>
    </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    // Password visibility toggle
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            const icon = btn.querySelector('.material-symbols-outlined');
            if (input.type === 'password') {
                input.type = 'text';
                icon.textContent = 'visibility_off';
                btn.setAttribute('aria-label', 'Masquer le mot de passe');
            } else {
                input.type = 'password';
                icon.textContent = 'visibility';
                btn.setAttribute('aria-label', 'Afficher le mot de passe');
            }
        });
    });

    // Check if already logged in
    const user = typeof window.AuthAPI !== 'undefined' ? window.AuthAPI.getUser() : null;
    if (user) {
        window.location.href = 'LINK_TABLEAU_DE_BORD';
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
                const res = await (typeof window.AuthAPI !== 'undefined' ? window.AuthAPI.login(email, password) : AuthAPI.login(email, password));
                if (res.success) {
                    window.location.href = 'LINK_TABLEAU_DE_BORD';
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
            .replace(/LINK_TABLEAU_DE_BORD/g, `${relPath}/tableau-de-bord.html`)
            .replace(/LINK_CATALOGUE/g, `${relPath}/catalogue.html`);

        content = content.replace(mainRegex, (match, p1) => {
            return match.replace(p1, customContent);
        });

        fs.writeFileSync(filePath, content, 'utf8');
        modifiedCount++;
        console.log(`Updated ${path.join(dir, 'connexion.html')}`);
    }
}

console.log(`Updated ${modifiedCount} files.`);
