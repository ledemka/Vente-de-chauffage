const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dirs = ['.', 'en', 'de', 'nl'];

const connexionContent = `<div class="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-16">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <!-- Content Side (Left) -->
        <div class="flex flex-col gap-8">
            <div>
                <div class="inline-flex items-center gap-2 bg-primary/10 text-primary font-label-md text-label-md uppercase px-3 py-1.5 rounded-full mb-6">
                    <span class="material-symbols-outlined text-[18px]">business_center</span>
                    <span>ESPACE PROFESSIONNEL B2B</span>
                </div>
                <h1 class="text-headline-xl font-headline-xl text-on-surface mb-6">Optimisez vos approvisionnements en biomasse.</h1>
                <p class="text-body-lg text-on-surface-variant max-w-lg" data-i18n="hero.subtitle">Accédez à vos grilles tarifaires négociées, suivez vos livraisons de bois haute performance en temps réel et gérez vos commandes en gros en toute simplicité.</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div class="bg-surface-container-highest p-6 rounded-xl border border-outline/10 shadow-sm">
                    <span class="material-symbols-outlined text-primary text-[32px] mb-4">local_shipping</span>
                    <h3 class="text-headline-md font-headline-md text-on-surface mb-2" data-i18n="footer.reassurance_3">Livraison Palette</h3>
                    <p class="text-body-sm text-on-surface-variant">Logistique optimisée sur toute la France et l'Europe.</p>
                </div>
                <div class="bg-surface-container-highest p-6 rounded-xl border border-outline/10 shadow-sm">
                    <span class="material-symbols-outlined text-primary text-[32px] mb-4">receipt_long</span>
                    <h3 class="text-headline-md font-headline-md text-on-surface mb-2" data-i18n="footer.reassurance_4">Facturation Pro</h3>
                    <p class="text-body-sm text-on-surface-variant">Gestion centralisée et bons de livraison dématérialisés.</p>
                </div>
            </div>
        </div>
        
        <!-- Form Side (Right) -->
        <div class="flex justify-center lg:justify-end">
            <div class="w-full max-w-md bg-surface-container p-8 md:p-10 rounded-2xl shadow-md border border-outline/10">
                <div class="mb-8 text-center">
                    <h2 class="text-headline-lg font-headline-lg text-on-surface" data-i18n="auth.login_title">Connexion B2B</h2>
                    <p class="text-body-sm text-on-surface-variant mt-2">Entrez vos identifiants professionnels pour accéder à votre espace.</p>
                </div>
                
                <form id="login-form" class="flex flex-col gap-5">
                    <div id="login-error" class="hidden bg-error-container text-on-error-container p-3 rounded-md text-body-sm text-center font-medium"></div>
                    
                    <div class="flex flex-col gap-2">
                        <label for="email" class="text-label-md font-label-md text-on-surface uppercase" data-i18n="auth.email">Email Professionnel *</label>
                        <div class="relative">
                            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">mail</span>
                            <input type="email" id="email" required placeholder="(Ex: contact@entreprise.fr)" class="w-full bg-surface-container-highest border border-outline/30 rounded-md py-3 pl-10 pr-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                        </div>
                    </div>

                    <div class="flex flex-col gap-2">
                        <div class="flex justify-between">
                            <label for="password" class="text-label-md font-label-md text-on-surface uppercase" data-i18n="auth.password">Mot de passe *</label>
                            <a href="#" class="text-label-md font-label-md text-primary hover:underline">Mot de passe oublié ?</a>
                        </div>
                        <div class="relative">
                            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant">lock</span>
                            <input type="password" id="password" required placeholder="(Votre mot de passe sécurisé)" class="w-full bg-surface-container-highest border border-outline/30 rounded-md py-3 pl-10 pr-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-2 mt-2">
                        <input type="checkbox" id="remember" class="w-4 h-4 border-outline-variant rounded cursor-pointer accent-primary">
                        <label for="remember" class="text-body-sm text-on-surface-variant cursor-pointer">Rester connecté</label>
                    </div>

                    <button type="submit" class="mt-2 bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-4 px-8 rounded-md transition-colors flex items-center justify-center gap-2 w-full shadow-sm">
                        <span data-i18n="auth.login_btn">Se connecter</span>
                        <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </button>
                    
                    <div class="relative flex py-4 items-center">
                        <div class="flex-grow border-t border-outline/20"></div>
                        <span class="flex-shrink-0 mx-4 text-outline-variant text-body-sm">OU</span>
                        <div class="flex-grow border-t border-outline/20"></div>
                    </div>
                    
                    <a href="LINK_PANIER" class="bg-surface-container-highest hover:bg-surface-dim text-on-surface font-label-md text-label-md py-3 px-8 rounded-md transition-colors flex items-center justify-center gap-2 w-full border border-outline/20 shadow-sm">
                        <span class="material-symbols-outlined text-[20px]">shopping_cart</span>
                        <span data-i18n="auth.guest_btn">Continuer en tant qu'invité</span>
                    </a>
                </form>

                <div class="mt-8 text-center text-body-sm text-on-surface-variant">
                    <p>Pas encore de compte ? <a href="LINK_INSCRIPTION" class="text-primary font-bold hover:underline ml-1">S'inscrire</a></p>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
document.addEventListener('DOMContentLoaded', () => {
    const user = AuthAPI && AuthAPI.getUser();
    if (user) window.location.href = 'LINK_PANIER';

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

const inscriptionContent = `<div class="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-16">
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        <!-- Content Side (Left) -->
        <div class="lg:col-span-5 flex flex-col gap-8">
            <div>
                <div class="inline-flex items-center gap-2 bg-primary/10 text-primary font-label-md text-label-md uppercase px-3 py-1.5 rounded-full mb-6">
                    <span class="material-symbols-outlined text-[18px]">verified</span>
                    <span>PORTAIL B2B EXCLUSIF</span>
                </div>
                <h1 class="text-headline-xl font-headline-xl text-on-surface mb-6">Ouvrez votre compte professionnel Terre & Feu</h1>
                <p class="text-body-lg text-on-surface-variant mb-8" data-i18n="hero.subtitle">Bénéficiez d'une tarification dégressive en gros, d'une logistique sur-mesure et d'un accompagnement dédié pour vos besoins en biomasse et bois de chauffage haute performance.</p>
            </div>
            
            <div class="flex flex-col gap-6">
                <div class="flex items-start gap-4">
                    <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                        <span class="material-symbols-outlined">star</span>
                    </div>
                    <div>
                        <h3 class="font-bold text-on-surface mb-1">Abonnement sans engagement</h3>
                        <p class="text-body-sm text-on-surface-variant">Accédez librement à notre catalogue B2B et commandez à votre rythme.</p>
                    </div>
                </div>
                <div class="flex items-start gap-4">
                    <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                        <span class="material-symbols-outlined">trending_down</span>
                    </div>
                    <div>
                        <h3 class="font-bold text-on-surface mb-1" data-i18n="pricing.discount_title">Tarifs préférentiels HT</h3>
                        <p class="text-body-sm text-on-surface-variant">Visualisation immédiate des remises quantitatives et de la facturation centralisée.</p>
                    </div>
                </div>
                <div class="flex items-start gap-4">
                    <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                        <span class="material-symbols-outlined">support_agent</span>
                    </div>
                    <div>
                        <h3 class="font-bold text-on-surface mb-1">Conseiller dédié</h3>
                        <p class="text-body-sm text-on-surface-variant">Un interlocuteur unique pour le suivi de vos commandes et contrats annuels.</p>
                    </div>
                </div>
            </div>
            
            <div class="mt-8 bg-surface-container-highest p-4 rounded-lg flex gap-3 border border-outline/10 text-body-sm text-on-surface-variant">
                <span class="material-symbols-outlined text-outline">info</span>
                <p>Les comptes professionnels sont validés sous 24h ouvrées après vérification des informations légales.</p>
            </div>
        </div>
        
        <!-- Form Side (Right) -->
        <div class="lg:col-span-7">
            <div class="w-full bg-surface-container p-8 md:p-10 rounded-2xl shadow-md border border-outline/10">
                <div class="mb-8">
                    <h2 class="text-headline-lg font-headline-lg text-on-surface">Formulaire d'inscription</h2>
                    <p class="text-body-sm text-on-surface-variant mt-2">Renseignez vos coordonnées professionnelles pour créer votre accès.</p>
                </div>
                
                <form id="register-form" class="flex flex-col gap-6">
                    <div id="register-error" class="hidden bg-error-container text-on-error-container p-3 rounded-md text-body-sm text-center font-medium"></div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="flex flex-col gap-2">
                            <label for="company" class="text-label-md font-label-md text-on-surface uppercase" data-i18n="auth.company">Société / Raison Sociale *</label>
                            <input type="text" id="company" required placeholder="(Ex: SARL Bois Énergie Grand Est)" class="w-full bg-surface-container-highest border border-outline/30 rounded-md py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="siret" class="text-label-md font-label-md text-on-surface uppercase" data-i18n="auth.siret">Numéro SIRET (Optionnel)</label>
                            <input type="text" id="siret" placeholder="(Ex: 823 456 789 00012)" class="w-full bg-surface-container-highest border border-outline/30 rounded-md py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="flex flex-col gap-2">
                            <label for="contact_name" class="text-label-md font-label-md text-on-surface uppercase" data-i18n="auth.contact_name">Nom du contact *</label>
                            <input type="text" id="contact_name" required placeholder="(Ex: Jean Dupont)" class="w-full bg-surface-container-highest border border-outline/30 rounded-md py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="phone" class="text-label-md font-label-md text-on-surface uppercase" data-i18n="auth.phone">Téléphone *</label>
                            <input type="tel" id="phone" required placeholder="(Ex: +33 3 88 00 00 00)" class="w-full bg-surface-container-highest border border-outline/30 rounded-md py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                        </div>
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="email" class="text-label-md font-label-md text-on-surface uppercase" data-i18n="auth.email">Email Professionnel *</label>
                        <input type="email" id="email" required placeholder="(Ex: j.dupont@sarl-energie.fr)" class="w-full bg-surface-container-highest border border-outline/30 rounded-md py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="flex flex-col gap-2">
                            <label for="password" class="text-label-md font-label-md text-on-surface uppercase" data-i18n="auth.password">Mot de passe *</label>
                            <input type="password" id="password" required minlength="8" class="w-full bg-surface-container-highest border border-outline/30 rounded-md py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                        </div>
                        <div class="flex flex-col gap-2">
                            <label for="password_confirm" class="text-label-md font-label-md text-on-surface uppercase">Confirmez le mot de passe *</label>
                            <input type="password" id="password_confirm" required minlength="8" class="w-full bg-surface-container-highest border border-outline/30 rounded-md py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                        </div>
                    </div>
                    
                    <label class="flex items-start gap-3 mt-4 cursor-pointer group">
                        <div class="relative flex items-center justify-center mt-0.5">
                            <input type="checkbox" required class="peer appearance-none w-5 h-5 border-2 border-outline-variant rounded bg-surface-container-highest checked:bg-primary checked:border-primary transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1">
                            <span class="material-symbols-outlined absolute text-on-primary text-[16px] opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity">check</span>
                        </div>
                        <span class="text-body-sm text-on-surface-variant group-hover:text-on-surface transition-colors">
                            J'accepte les <a href="LINK_CGV" class="text-primary hover:underline">Conditions Générales de Vente (CGV)</a> ainsi que la politique de confidentialité de Terre & Feu. *
                        </span>
                    </label>

                    <div class="flex flex-col sm:flex-row items-center justify-between gap-6 mt-6 pt-6 border-t border-outline/10">
                        <a href="LINK_CONNEXION" class="text-body-sm text-on-surface-variant hover:text-primary font-bold">Déjà un compte ? Se connecter</a>
                        <button type="submit" class="w-full sm:w-auto bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-4 px-8 rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm">
                            <span data-i18n="auth.register_btn">Créer mon compte</span>
                            <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
<script>
document.addEventListener('DOMContentLoaded', () => {
    const user = AuthAPI && AuthAPI.getUser();
    if (user) window.location.href = 'LINK_PANIER';

    const form = document.getElementById('register-form');
    const errorDiv = document.getElementById('register-error');

    if(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorDiv.classList.add('hidden');
            
            const pwd = document.getElementById('password').value;
            const pwdConf = document.getElementById('password_confirm').value;
            
            if (pwd !== pwdConf) {
                errorDiv.textContent = 'Les mots de passe ne correspondent pas.';
                errorDiv.classList.remove('hidden');
                return;
            }
            
            const data = {
                company: document.getElementById('company').value,
                siret: document.getElementById('siret').value,
                contact_name: document.getElementById('contact_name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                password: pwd
            };
            
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="material-symbols-outlined animate-spin">autorenew</span>';
            btn.disabled = true;

            try {
                const res = await AuthAPI.register(data);
                if (res.success) {
                    window.location.href = 'LINK_PANIER';
                } else {
                    errorDiv.textContent = res.message || 'Erreur lors de la création';
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

let modifiedConnexionCount = 0;
let modifiedInscriptionCount = 0;

for (const dir of dirs) {
    const fullPath = path.join(rootDir, dir);
    if (!fs.existsSync(fullPath)) continue;
    const relPath = dir === '.' ? '.' : '..';
    const mainRegex = /<main[^>]*>([\s\S]*?)<\/main>/i;

    // Process connexion.html
    const connFilePath = path.join(fullPath, 'connexion.html');
    if (fs.existsSync(connFilePath)) {
        let content = fs.readFileSync(connFilePath, 'utf8');
        let customContent = connexionContent
            .replace(/LINK_INSCRIPTION/g, `${relPath}/inscription.html`)
            .replace(/LINK_PANIER/g, `${relPath}/panier.html`);
        content = content.replace(mainRegex, (match, p1) => match.replace(p1, customContent));
        fs.writeFileSync(connFilePath, content, 'utf8');
        modifiedConnexionCount++;
    }

    // Process inscription.html
    const inscrFilePath = path.join(fullPath, 'inscription.html');
    if (fs.existsSync(inscrFilePath)) {
        let content = fs.readFileSync(inscrFilePath, 'utf8');
        let customContent = inscriptionContent
            .replace(/LINK_CONNEXION/g, `${relPath}/connexion.html`)
            .replace(/LINK_PANIER/g, `${relPath}/panier.html`)
            .replace(/LINK_CGV/g, `${relPath}/cgv.html`);
        content = content.replace(mainRegex, (match, p1) => match.replace(p1, customContent));
        fs.writeFileSync(inscrFilePath, content, 'utf8');
        modifiedInscriptionCount++;
    }
}

console.log(`Updated ${modifiedConnexionCount} connexion pages and ${modifiedInscriptionCount} inscription pages.`);
