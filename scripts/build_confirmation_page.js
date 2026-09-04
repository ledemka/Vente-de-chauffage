const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dirs = ['.', 'en', 'de', 'nl'];

const newMainContent = `<div class="max-w-2xl mx-auto px-margin-mobile md:px-margin-desktop py-24">
    <div class="bg-surface-container rounded-xl p-10 shadow-md flex flex-col items-center text-center gap-6 border border-outline/20">
        
        <div class="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2 shadow-sm">
            <span class="material-symbols-outlined text-[40px]">check_circle</span>
        </div>
        
        <h1 class="text-headline-xl font-headline-xl text-on-surface" data-i18n="confirmation.title">Commande confirmée</h1>
        
        <div class="inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container px-4 py-2 rounded-full font-label-md text-label-md uppercase shadow-sm">
            <span class="material-symbols-outlined text-[18px]">schedule</span>
            <span>En attente de virement</span>
        </div>

        <div class="w-full bg-surface-container-highest rounded-lg p-6 my-4 border border-outline/20 shadow-sm flex flex-col gap-2">
            <span class="text-label-md font-label-md text-on-surface-variant uppercase" data-i18n="confirmation.ref">Référence de votre commande :</span>
            <span id="order-reference" class="text-headline-md font-data-mono font-bold text-primary tracking-widest">---</span>
        </div>

        <p class="text-body-lg text-on-surface-variant font-medium" data-i18n="confirmation.msg1">
            Votre commande a bien été enregistrée.
        </p>
        
        <div class="bg-surface-dim rounded-md p-5 text-left border-l-4 border-outline text-body-sm text-on-surface shadow-sm">
            <div class="flex gap-3 mb-2 font-bold">
                <span class="material-symbols-outlined text-outline">account_balance</span>
                <span>Rappel Virement</span>
            </div>
            <p data-i18n="confirmation.msg2">
                Virement bancaire uniquement. Un email contenant nos coordonnées bancaires vient de vous être envoyé.
            </p>
        </div>

        <a href="LINK_HOME" class="mt-6 bg-transparent hover:bg-surface-dim text-on-surface font-label-md text-label-md py-4 px-8 border border-outline rounded-md transition-colors shadow-sm">
            <span data-i18n="confirmation.back_home">Retour à l'accueil</span>
        </a>
    </div>
</div>`;

let modifiedCount = 0;

for (const dir of dirs) {
    const fullPath = path.join(rootDir, dir);
    if (!fs.existsSync(fullPath)) continue;
    
    const filePath = path.join(fullPath, 'confirmation-commande.html');
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        const mainRegex = /<main[^>]*>([\s\S]*?)<\/main>/i;
        
        const relPath = dir === '.' ? '.' : '..';
        let customContent = newMainContent.replace(/LINK_HOME/g, `${relPath}/index.html`);

        content = content.replace(mainRegex, (match, p1) => {
            return match.replace(p1, customContent);
        });

        fs.writeFileSync(filePath, content, 'utf8');
        modifiedCount++;
        console.log(`Updated ${path.join(dir, 'confirmation-commande.html')}`);
    }
}

console.log(`Updated ${modifiedCount} files.`);
