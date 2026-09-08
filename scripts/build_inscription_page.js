const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dirs = ['.', 'en', 'de', 'nl'];

const newMainContent = `<div class="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-16">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        <!-- Left Side: Information -->
        <div class="flex flex-col gap-8">
            <div class="flex flex-col gap-4">
                <div class="flex items-center gap-2 text-primary font-label-md text-label-md uppercase tracking-wider">
                    <span class="material-symbols-outlined text-[18px]">verified</span>
                    <span>Portail B2B Exclusif</span>
                </div>
                <h1 class="text-[40px] leading-[1.2] font-headline-xl text-on-surface">
                    Ouvrez votre compte professionnel sotramsbois
                </h1>
                <p class="text-body-lg text-on-surface-variant">
                    Bénéficiez d'une tarification dégressive en gros, d'une logistique sur-mesure et d'un accompagnement dédié pour vos besoins en biomasse et bois de chauffage haute performance.
                </p>
            </div>

            <div class="flex flex-col gap-4">
                <!-- Feature 1 -->
                <div class="bg-surface-container rounded-xl p-5 flex gap-4 items-start border border-outline/10">
                    <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <span class="material-symbols-outlined text-[20px]">local_shipping</span>
                    </div>
                    <div class="flex flex-col gap-1">
                        <h3 class="font-headline-md text-label-md text-on-surface">Livraison semi-remorque & vrac</h3>
                        <p class="text-body-sm text-on-surface-variant">Acheminement direct sur plateforme ou site de production avec hayon et transpalette.</p>
                    </div>
                </div>
                
                <!-- Feature 2 -->
                <div class="bg-surface-container rounded-xl p-5 flex gap-4 items-start border border-outline/10">
                    <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <span class="material-symbols-outlined text-[20px]">percent</span>
                    </div>
                    <div class="flex flex-col gap-1">
                        <h3 class="font-headline-md text-label-md text-on-surface">Tarifs professionnels HT</h3>
                        <p class="text-body-sm text-on-surface-variant">Visualisation immédiate des remises quantitatives et facturation centralisée.</p>
                    </div>
                </div>

                <!-- Feature 3 -->
                <div class="bg-surface-container rounded-xl p-5 flex gap-4 items-start border border-outline/10">
                    <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <span class="material-symbols-outlined text-[20px]">support_agent</span>
                    </div>
                    <div class="flex flex-col gap-1">
                        <h3 class="font-headline-md text-label-md text-on-surface">Conseiller dédié</h3>
                        <p class="text-body-sm text-on-surface-variant">Un interlocuteur unique pour le suivi de vos commandes et contrats annuels.</p>
                    </div>
                </div>
            </div>

            <div class="bg-surface-container-high rounded-xl p-4 flex gap-3 items-center border border-outline/10">
                <span class="material-symbols-outlined text-primary text-[20px] shrink-0">info</span>
                <p class="text-body-sm text-on-surface-variant">Les comptes professionnels sont validés sous 24h ouvrées après vérification des informations légales.</p>
            </div>
        </div>

        <!-- Right Side: Form -->
        <div class="bg-surface-container rounded-2xl p-8 shadow-sm border border-outline/10 h-fit">
            <div class="mb-8">
                <h2 class="text-headline-md font-headline-md text-on-surface mb-2">Formulaire d'inscription</h2>
                <p class="text-body-sm text-on-surface-variant">Renseignez vos coordonnées professionnelles pour créer votre accès.</p>
            </div>

            <form id="register-form" class="flex flex-col gap-6">
                <div id="register-error" class="hidden bg-error-container text-on-error-container p-3 rounded-md text-body-sm text-center font-medium"></div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div class="flex flex-col gap-2">
                        <label for="company" class="text-label-md font-label-md text-on-surface">Société / Raison Sociale <span class="text-primary">*</span></label>
                        <input type="text" id="company" required placeholder="Ex: SAS Bois Énergie Grand Est" class="w-full bg-surface-container-lowest border border-outline/20 rounded-md py-3 px-4 text-body-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="siret" class="text-label-md font-label-md text-on-surface">Numéro SIRET <span class="text-outline-variant font-normal">(Optionnel)</span></label>
                        <input type="text" id="siret" placeholder="Ex: 823 456 789 00012" class="w-full bg-surface-container-lowest border border-outline/20 rounded-md py-3 px-4 text-body-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div class="flex flex-col gap-2">
                        <label for="contact_name" class="text-label-md font-label-md text-on-surface">Nom du contact <span class="text-primary">*</span></label>
                        <input type="text" id="contact_name" required placeholder="Ex: Jean Dupont" class="w-full bg-surface-container-lowest border border-outline/20 rounded-md py-3 px-4 text-body-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="fonction" class="text-label-md font-label-md text-on-surface">Fonction <span class="text-primary">*</span></label>
                        <input type="text" id="fonction" required placeholder="Ex: Responsable Achats" class="w-full bg-surface-container-lowest border border-outline/20 rounded-md py-3 px-4 text-body-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div class="flex flex-col gap-2">
                        <label for="email" class="text-label-md font-label-md text-on-surface">Email professionnel <span class="text-primary">*</span></label>
                        <input type="email" id="email" required placeholder="Ex: j.dupont@bois-energie.fr" class="w-full bg-surface-container-lowest border border-outline/20 rounded-md py-3 px-4 text-body-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="phone" class="text-label-md font-label-md text-on-surface">Téléphone <span class="text-primary">*</span></label>
                        <input type="tel" id="phone" required placeholder="Ex: +33 3 88 00 00 00" class="w-full bg-surface-container-lowest border border-outline/20 rounded-md py-3 px-4 text-body-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div class="flex flex-col gap-2">
                        <label for="password" class="text-label-md font-label-md text-on-surface">Mot de passe <span class="text-primary">*</span></label>
                        <div class="relative">
                            <input type="password" id="password" required minlength="8" placeholder="••••••••••••" class="w-full bg-surface-container-lowest border border-outline/20 rounded-md py-3 px-4 pr-12 text-body-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                            <button type="button" class="toggle-password absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors flex items-center justify-center p-1 rounded-full focus:outline-none" aria-label="Afficher le mot de passe">
                                <span class="material-symbols-outlined text-[20px]">visibility</span>
                            </button>
                        </div>
                    </div>
                    <div class="flex flex-col gap-2">
                        <label for="password_confirm" class="text-label-md font-label-md text-on-surface">Confirmer le mot de passe <span class="text-primary">*</span></label>
                        <div class="relative">
                            <input type="password" id="password_confirm" required minlength="8" placeholder="••••••••••••" class="w-full bg-surface-container-lowest border border-outline/20 rounded-md py-3 px-4 pr-12 text-body-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all">
                            <button type="button" class="toggle-password absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-primary transition-colors flex items-center justify-center p-1 rounded-full focus:outline-none" aria-label="Afficher le mot de passe">
                                <span class="material-symbols-outlined text-[20px]">visibility</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="flex items-start gap-3 mt-2">
                    <input type="checkbox" id="cgv" required class="mt-1 w-4 h-4 text-primary bg-surface-container-lowest border-outline rounded focus:ring-primary focus:ring-2">
                    <label for="cgv" class="text-body-sm text-on-surface-variant leading-tight">
                        J'accepte les <a href="LINK_CGV" class="text-primary hover:underline">Conditions Générales de Vente (CGV)</a> ainsi que la politique de confidentialité de sotramsbois. <span class="text-primary">*</span>
                    </label>
                </div>

                <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-6 border-t border-outline/10">
                    <div class="text-body-sm text-on-surface-variant">
                        <span>Déjà un compte ?</span>
                        <a href="LINK_CONNEXION" class="text-primary font-bold hover:underline ml-1">Se connecter</a>
                    </div>
                    <button type="submit" class="w-full sm:w-auto bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-3 px-8 rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm">
                        <span>Créer mon compte</span>
                        <span class="material-symbols-outlined text-[20px]">arrow_forward</span>
                    </button>
                </div>
            </form>
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
        window.location.href = 'LINK_PANIER';
    }

    const form = document.getElementById('register-form');
    const errorDiv = document.getElementById('register-error');

    if(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            errorDiv.classList.add('hidden');
            
            const password = document.getElementById('password').value;
            const passwordConfirm = document.getElementById('password_confirm').value;
            
            if (password !== passwordConfirm) {
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
                password: password
            };
            
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="material-symbols-outlined animate-spin">autorenew</span>';
            btn.disabled = true;

            try {
                const res = await (typeof window.AuthAPI !== 'undefined' ? window.AuthAPI.register(data) : AuthAPI.register(data));
                if (res.success) {
                    window.location.href = 'LINK_CONNEXION';
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

let modifiedCount = 0;

for (const dir of dirs) {
    const fullPath = path.join(rootDir, dir);
    if (!fs.existsSync(fullPath)) continue;
    
    const filePath = path.join(fullPath, 'inscription.html');
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Find the <main> tag content to replace
        const mainRegex = /<main[^>]*>([\s\S]*?)<\/main>/i;
        
        // Fix relative links based on dir
        const relPath = dir === '.' ? '.' : '..';
        let customContent = newMainContent
            .replace(/LINK_CONNEXION/g, `${relPath}/connexion.html`)
            .replace(/LINK_PANIER/g, `${relPath}/panier.html`)
            .replace(/LINK_CGV/g, `${relPath}/cgv.html`);

        content = content.replace(mainRegex, (match, p1) => {
            return match.replace(p1, customContent);
        });

        // Also fix canonical links in the head
        content = content.replace(/connexion\.html/g, 'inscription.html');

        fs.writeFileSync(filePath, content, 'utf8');
        modifiedCount++;
        console.log(`Updated ${path.join(dir, 'inscription.html')}`);
    }
}

console.log(`Updated ${modifiedCount} files.`);
