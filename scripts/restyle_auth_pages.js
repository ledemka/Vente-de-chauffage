const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dirs = ['.', 'en', 'de', 'nl'];

const connexionContent = `<div class="min-h-[calc(100vh-128px)] flex flex-col lg:flex-row">
    <!-- Form Side -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div class="w-full max-w-md">
            <div class="flex flex-col items-center gap-2 mb-8">
                <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2 shadow-sm">
                    <span class="material-symbols-outlined text-[32px]">lock</span>
                </div>
                <h1 class="text-headline-xl font-headline-xl text-on-surface" data-i18n="auth.login_title">Connexion</h1>
                <p class="text-body-md text-on-surface-variant text-center" data-i18n="footer.desc">Solutions professionnelles de biomasse et bois de chauffage haute performance.</p>
            </div>
            
            <form id="login-form" class="flex flex-col gap-5 bg-surface-container p-8 rounded-xl shadow-md border border-outline/10">
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

            <div class="mt-8 text-center text-body-sm text-on-surface-variant">
                <p>Pas encore de compte professionnel ?</p>
                <a href="LINK_INSCRIPTION" class="text-primary font-bold hover:underline mt-2 inline-block">Créer un compte B2B</a>
            </div>
        </div>
    </div>
    
    <!-- Image Side -->
    <div class="hidden lg:block lg:w-1/2 relative bg-inverse-surface shadow-inner overflow-hidden">
        <img src="LINK_IMG_1" class="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60" alt="">
        <div class="absolute inset-0 bg-gradient-to-br from-primary/90 to-inverse-surface/80"></div>
        <div class="absolute inset-0 flex flex-col items-center justify-center p-16 text-center text-white">
            <span class="material-symbols-outlined text-6xl mb-6 text-primary-fixed drop-shadow-md">local_fire_department</span>
            <h2 class="text-headline-xl font-headline-xl mb-4 drop-shadow-md" data-i18n="hero.tagline">Grossiste Biomasse & Bois Énergie</h2>
            <div class="w-16 h-1 bg-primary-fixed rounded-full mx-auto mb-6 shadow-sm"></div>
            <div class="flex flex-col gap-4 items-center">
                <div class="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                    <span class="material-symbols-outlined text-primary-fixed">verified</span>
                    <span class="font-bold text-sm tracking-wide" data-i18n="footer.reassurance_1">Bois de Qualité Certifiée</span>
                </div>
                <div class="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/20">
                    <span class="material-symbols-outlined text-primary-fixed">local_shipping</span>
                    <span class="font-bold text-sm tracking-wide" data-i18n="metrics.metric_3_val">48h</span>
                    <span class="font-bold text-sm tracking-wide" data-i18n="metrics.metric_3_label">Délais d'Expédition</span>
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

const inscriptionContent = `<div class="min-h-[calc(100vh-128px)] flex flex-col lg:flex-row-reverse">
    <!-- Form Side -->
    <div class="w-full lg:w-3/5 flex items-center justify-center p-8 lg:p-12">
        <div class="w-full max-w-2xl">
            <div class="flex flex-col items-center gap-2 mb-8">
                <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2 shadow-sm">
                    <span class="material-symbols-outlined text-[32px]">person_add</span>
                </div>
                <h1 class="text-headline-xl font-headline-xl text-on-surface" data-i18n="auth.register_title">Création de compte B2B</h1>
                <p class="text-body-md text-on-surface-variant text-center font-medium" data-i18n="rating_badge">4,8/5 — Plus de 1 000 clients B2B satisfaits en Europe</p>
            </div>
            
            <form id="register-form" class="flex flex-col gap-5 bg-surface-container p-8 rounded-xl shadow-md border border-outline/10">
                <div id="register-error" class="hidden bg-error-container text-on-error-container p-3 rounded-md text-body-sm text-center font-medium"></div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div class="flex flex-col gap-2">
                        <label for="company" class="text-label-md font-label-md text-on-surface uppercase" data-i18n="auth.company">Société *</label>
                        <input type="text" id="company" required class="w-full bg-surface-container-highest border border-outline-variant rounded-md py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="siret" class="text-label-md font-label-md text-on-surface uppercase" data-i18n="auth.siret">SIRET / TVA (Optionnel)</label>
                        <input type="text" id="siret" class="w-full bg-surface-container-highest border border-outline-variant rounded-md py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div class="flex flex-col gap-2">
                        <label for="contact_name" class="text-label-md font-label-md text-on-surface uppercase" data-i18n="auth.contact_name">Nom et Prénom *</label>
                        <input type="text" id="contact_name" required class="w-full bg-surface-container-highest border border-outline-variant rounded-md py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="phone" class="text-label-md font-label-md text-on-surface uppercase" data-i18n="auth.phone">Téléphone *</label>
                        <input type="tel" id="phone" required class="w-full bg-surface-container-highest border border-outline-variant rounded-md py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                    </div>
                </div>

                <div class="flex flex-col gap-2">
                    <label for="email" class="text-label-md font-label-md text-on-surface uppercase" data-i18n="auth.email">Adresse Email Pro *</label>
                    <input type="email" id="email" required class="w-full bg-surface-container-highest border border-outline-variant rounded-md py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                </div>

                <div class="flex flex-col gap-2">
                    <label for="password" class="text-label-md font-label-md text-on-surface uppercase" data-i18n="auth.password">Mot de passe *</label>
                    <input type="password" id="password" required minlength="8" class="w-full bg-surface-container-highest border border-outline-variant rounded-md py-3 px-4 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                </div>

                <button type="submit" class="mt-4 bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-4 px-8 rounded-md transition-colors flex items-center justify-center gap-2 w-full shadow-sm">
                    <span data-i18n="auth.register_btn">Créer mon compte B2B</span>
                    <span class="material-symbols-outlined text-[20px]">person_add</span>
                </button>
            </form>

            <div class="mt-8 text-center text-body-sm text-on-surface-variant">
                <p>Vous avez déjà un compte ?</p>
                <a href="LINK_CONNEXION" class="text-primary font-bold hover:underline mt-2 inline-block">Se connecter</a>
            </div>
        </div>
    </div>
    
    <!-- Image Side -->
    <div class="hidden lg:block lg:w-2/5 relative bg-inverse-surface shadow-inner overflow-hidden border-r border-outline/20">
        <img src="LINK_IMG_2" class="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-50" alt="">
        <div class="absolute inset-0 bg-gradient-to-t from-inverse-surface to-inverse-surface/60"></div>
        <div class="absolute inset-0 flex flex-col p-12 text-white justify-center">
            <h2 class="text-headline-lg font-headline-lg mb-8 drop-shadow-md text-primary-fixed" data-i18n="footer.reassurance_title">Engagement Qualité Grossiste</h2>
            
            <div class="flex flex-col gap-8">
                <div class="flex items-start gap-5">
                    <div class="bg-primary/20 p-3 rounded-xl border border-primary/30 backdrop-blur-sm">
                        <span class="material-symbols-outlined text-primary-fixed text-3xl">forest</span>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg mb-1" data-i18n="footer.reassurance_1">Bois de Qualité Certifiée</h3>
                        <p class="text-sm text-white/70">Humidité contrôlée, traçabilité et pouvoir calorifique garanti pour chaque palette.</p>
                    </div>
                </div>
                <div class="flex items-start gap-5">
                    <div class="bg-primary/20 p-3 rounded-xl border border-primary/30 backdrop-blur-sm">
                        <span class="material-symbols-outlined text-primary-fixed text-3xl">local_shipping</span>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg mb-1" data-i18n="footer.reassurance_3">Livraison avec Haillon & Transpalette</h3>
                        <p class="text-sm text-white/70">Logistique sur-mesure pour vos approvisionnements industriels et reventes.</p>
                    </div>
                </div>
                <div class="flex items-start gap-5">
                    <div class="bg-primary/20 p-3 rounded-xl border border-primary/30 backdrop-blur-sm">
                        <span class="material-symbols-outlined text-primary-fixed text-3xl">payments</span>
                    </div>
                    <div>
                        <h3 class="font-bold text-lg mb-1" data-i18n="footer.reassurance_4">Conditions de Règlement B2B</h3>
                        <p class="text-sm text-white/70">Facturation centralisée, paiements par virement et accès aux grilles tarifaires dégressives.</p>
                    </div>
                </div>
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
            
            const data = {
                company: document.getElementById('company').value,
                siret: document.getElementById('siret').value,
                contact_name: document.getElementById('contact_name').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
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
            .replace(/LINK_PANIER/g, `${relPath}/panier.html`)
            .replace(/LINK_IMG_1/g, `${relPath}/assets/images/hero/hero-carousel-1.jpg`);

        content = content.replace(mainRegex, (match, p1) => {
            return match.replace(p1, customContent);
        });

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
            .replace(/LINK_IMG_2/g, `${relPath}/assets/images/hero/hero-carousel-2.jpg`);

        content = content.replace(mainRegex, (match, p1) => {
            return match.replace(p1, customContent);
        });

        fs.writeFileSync(inscrFilePath, content, 'utf8');
        modifiedInscriptionCount++;
    }
}

console.log(`Updated ${modifiedConnexionCount} connexion pages and ${modifiedInscriptionCount} inscription pages.`);
