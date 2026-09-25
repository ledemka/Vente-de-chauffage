const fs = require('fs');

function replaceMainContent(file, newContent) {
    const html = fs.readFileSync(file, 'utf8');
    const startTag = '<main';
    const endTag = '</main>';
    
    const startIndex = html.indexOf(startTag);
    const endIndex = html.indexOf(endTag) + endTag.length;
    
    if (startIndex !== -1 && endIndex !== -1) {
        // Find the actual end of the <main ...> tag
        const startTagEnd = html.indexOf('>', startIndex) + 1;
        
        const newHtml = html.substring(0, startTagEnd) + '\n' + newContent + '\n' + html.substring(endIndex - endTag.length);
        fs.writeFileSync(file, newHtml, 'utf8');
        console.log(`Updated ${file}`);
    } else {
        console.log(`Could not find <main> in ${file}`);
    }
}

// 1. MENTIONS LEGALES
const mentionsHtml = `
    <div class="container mx-auto px-4 py-12 max-w-4xl">
        <h1 class="text-display-sm font-display-sm text-on-surface mb-8 text-center" data-i18n="mentions.title">Mentions Légales</h1>
        
        <div class="bg-surface-container rounded-2xl p-8 shadow-sm flex flex-col gap-8">
            <section>
                <h2 class="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-3">
                    <span class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-body-md font-bold">1</span>
                    <span data-i18n="mentions.sec1_title">1. Éditeur du site</span>
                </h2>
                <p class="text-body-md font-body-md text-on-surface-variant leading-relaxed" data-i18n-html="mentions.sec1_text">
                    [Raison sociale à compléter], [forme juridique à compléter] au capital de [montant à compléter]€. Siège social : [Adresse du siège à compléter]. RCS [Ville RCS à compléter] [Numéro RCS à compléter]. TVA intracommunautaire : [Numéro de TVA à compléter]. Email : [Email de contact à compléter] — Téléphone : [Téléphone à compléter]<br>Directeur de la publication : [Nom du directeur de la publication à compléter]
                </p>
            </section>
            
            <section>
                <h2 class="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-3">
                    <span class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-body-md font-bold">2</span>
                    <span data-i18n="mentions.sec2_title">2. Hébergement</span>
                </h2>
                <p class="text-body-md font-body-md text-on-surface-variant leading-relaxed" data-i18n-html="mentions.sec2_text">
                    Ce site est hébergé par [Hébergeur à compléter par le client], [Adresse de l'hébergeur à compléter].
                </p>
            </section>
            
            <section>
                <h2 class="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-3">
                    <span class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-body-md font-bold">3</span>
                    <span data-i18n="mentions.sec3_title">3. Propriété intellectuelle</span>
                </h2>
                <p class="text-body-md font-body-md text-on-surface-variant leading-relaxed" data-i18n-html="mentions.sec3_text">
                    Le contenu de ce site (textes, images, logos) est la propriété exclusive de sotramsbois et est protégé par le droit de la propriété intellectuelle. Toute reproduction est interdite sans autorisation préalable.
                </p>
            </section>
            
            <section>
                <h2 class="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-3">
                    <span class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-body-md font-bold">4</span>
                    <span data-i18n="mentions.sec4_title">4. Données personnelles</span>
                </h2>
                <p class="text-body-md font-body-md text-on-surface-variant leading-relaxed" data-i18n-html="mentions.sec4_text">
                    Le traitement de vos données personnelles est décrit dans notre <a href="./politique-confidentialite.html" class="text-primary hover:underline">politique de confidentialité</a>.
                </p>
            </section>
        </div>
    </div>
`;

// 2. POLITIQUE DE CONFIDENTIALITE
const privacyHtml = `
    <div class="container mx-auto px-4 py-12 max-w-4xl">
        <h1 class="text-display-sm font-display-sm text-on-surface mb-8 text-center" data-i18n="privacy.title">Politique de Confidentialité</h1>
        
        <div class="bg-surface-container rounded-2xl p-8 shadow-sm flex flex-col gap-8">
            <section>
                <h2 class="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-3">
                    <span class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-body-md font-bold">1</span>
                    <span data-i18n="privacy.sec1_title">1. Collecte des données</span>
                </h2>
                <p class="text-body-md font-body-md text-on-surface-variant leading-relaxed" data-i18n-html="privacy.sec1_text">
                    Nous collectons les informations nécessaires au traitement de vos commandes et devis professionnels : identité (nom, prénom, fonction, entreprise), coordonnées (email, téléphone, adresse de livraison), et données techniques de navigation (adresse IP, type de navigateur).<br><br>Ce site utilise des cookies techniques nécessaires à son fonctionnement (panier, connexion).
                </p>
            </section>
            
            <section>
                <h2 class="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-3">
                    <span class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-body-md font-bold">2</span>
                    <span data-i18n="privacy.sec2_title">2. Utilisation des données</span>
                </h2>
                <p class="text-body-md font-body-md text-on-surface-variant leading-relaxed" data-i18n-html="privacy.sec2_text">
                    Vos données servent à traiter vos devis et commandes, et à vous contacter dans le cadre de notre relation commerciale. Aucune communication marketing ne vous sera envoyée sans votre consentement explicite.
                </p>
            </section>
            
            <section>
                <h2 class="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-3">
                    <span class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-body-md font-bold">3</span>
                    <span data-i18n="privacy.sec3_title">3. Conservation et sécurité</span>
                </h2>
                <p class="text-body-md font-body-md text-on-surface-variant leading-relaxed" data-i18n-html="privacy.sec3_text">
                    Vos données sont hébergées sur des serveurs situés dans l'Union Européenne et conservées pour la durée nécessaire à la relation commerciale, conformément au RGPD.
                </p>
            </section>
            
            <section>
                <h2 class="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-3">
                    <span class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-body-md font-bold">4</span>
                    <span data-i18n="privacy.sec4_title">4. Vos droits</span>
                </h2>
                <p class="text-body-md font-body-md text-on-surface-variant leading-relaxed" data-i18n-html="privacy.sec4_text">
                    Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données.
                </p>
            </section>
            
            <section>
                <h2 class="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-3">
                    <span class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-body-md font-bold">5</span>
                    <span data-i18n="privacy.sec5_title">5. Contact</span>
                </h2>
                <p class="text-body-md font-body-md text-on-surface-variant leading-relaxed" data-i18n-html="privacy.sec5_text">
                    Pour exercer ces droits, contactez notre Délégué à la Protection des Données : [Email du DPO à compléter].
                </p>
            </section>
        </div>
    </div>
`;

// 3. CGV
const cgvHtml = `
    <div class="container mx-auto px-4 py-12 max-w-4xl">
        <h1 class="text-display-sm font-display-sm text-on-surface mb-8 text-center" data-i18n="cgv.title">Conditions Générales de Vente B2B</h1>
        
        <div class="bg-surface-container rounded-2xl p-8 shadow-sm flex flex-col gap-8">
            <section>
                <h2 class="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-3">
                    <span class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-body-md font-bold">1</span>
                    <span data-i18n="cgv.sec1_title">1. Objet</span>
                </h2>
                <p class="text-body-md font-body-md text-on-surface-variant leading-relaxed" data-i18n-html="cgv.sec1_text">
                    Les présentes Conditions Générales de Vente régissent les ventes de bois de chauffage, granulés, briquettes et combustibles biomasse par sotramsbois à des acheteurs professionnels (B2B).
                </p>
            </section>
            
            <section>
                <h2 class="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-3">
                    <span class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-body-md font-bold">2</span>
                    <span data-i18n="cgv.sec2_title">2. Prix et Commande</span>
                </h2>
                <p class="text-body-md font-body-md text-on-surface-variant leading-relaxed" data-i18n-html="cgv.sec2_text">
                    Les prix affichés sont en euros, hors taxes (HT). Toute commande implique l'acceptation sans réserve des présentes conditions.
                </p>
            </section>
            
            <section>
                <h2 class="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-3">
                    <span class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-body-md font-bold">3</span>
                    <span data-i18n="cgv.sec3_title">3. Livraison</span>
                </h2>
                <p class="text-body-md font-body-md text-on-surface-variant leading-relaxed" data-i18n-html="cgv.sec3_text">
                    Les délais de livraison sont fournis à titre indicatif. La livraison nécessite un accès poids-lourd et, selon les sites, un moyen de déchargement (quai ou chariot élévateur) — voir notre page Livraison pour le détail. sotramsbois ne saurait être tenu responsable des retards liés au transporteur.
                </p>
            </section>
            
            <section>
                <h2 class="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-3">
                    <span class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-body-md font-bold">4</span>
                    <span data-i18n="cgv.sec4_title">4. Paiement</span>
                </h2>
                <p class="text-body-md font-body-md text-on-surface-variant leading-relaxed" data-i18n-html="cgv.sec4_text">
                    Le paiement s'effectue par virement bancaire (SEPA), avant expédition, sauf accord contraire.
                </p>
            </section>
            
            <section>
                <h2 class="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-3">
                    <span class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-body-md font-bold">5</span>
                    <span data-i18n="cgv.sec5_title">5. Absence de droit de rétractation</span>
                </h2>
                <p class="text-body-md font-body-md text-on-surface-variant leading-relaxed" data-i18n-html="cgv.sec5_text">
                    Conformément à l'article L221-3 du Code de la consommation, les ventes entre professionnels ne bénéficient pas du droit de rétractation applicable aux consommateurs.
                </p>
            </section>
        </div>
    </div>
`;

// 4. POLITIQUE RETOUR
const returnHtml = `
    <div class="container mx-auto px-4 py-12 max-w-4xl">
        <h1 class="text-display-sm font-display-sm text-on-surface mb-8 text-center" data-i18n="return.title">Politique de Retour & SAV</h1>
        
        <div class="bg-surface-container rounded-2xl p-8 shadow-sm flex flex-col gap-8">
            <section>
                <h2 class="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-3">
                    <span class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-body-md font-bold">1</span>
                    <span data-i18n="return.sec1_title">1. Conditions générales de retour</span>
                </h2>
                <p class="text-body-md font-body-md text-on-surface-variant leading-relaxed" data-i18n-html="return.sec1_text">
                    En raison de la nature volumineuse de nos produits (palettes de bois), les retours sont soumis à des conditions spécifiques : produit non ouvert, dans son emballage d'origine, demande effectuée sous [durée à compléter] jours après livraison.
                </p>
            </section>
            
            <section>
                <h2 class="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-3">
                    <span class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-body-md font-bold">2</span>
                    <span data-i18n="return.sec2_title">2. Logistique et frais de retour</span>
                </h2>
                <p class="text-body-md font-body-md text-on-surface-variant leading-relaxed" data-i18n-html="return.sec2_text">
                    Le retour peut s'effectuer par reprise sur site ([montant à compléter]€ TTC / palette) ou par vos propres moyens. Les frais de retour sont à la charge du client, sauf produit non conforme.
                </p>
            </section>
            
            <section>
                <h2 class="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-3">
                    <span class="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-body-md font-bold">3</span>
                    <span data-i18n="return.sec3_title">3. Remboursement</span>
                </h2>
                <p class="text-body-md font-body-md text-on-surface-variant leading-relaxed" data-i18n-html="return.sec3_text">
                    Le remboursement est effectué après contrôle du produit retourné, sous [délai à compléter] jours ouvrés.
                </p>
            </section>
        </div>
    </div>
`;

replaceMainContent('mentions-legales.html', mentionsHtml);
replaceMainContent('politique-confidentialite.html', privacyHtml);
replaceMainContent('cgv.html', cgvHtml);
replaceMainContent('politique-retour.html', returnHtml);
