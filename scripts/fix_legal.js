const fs = require('fs');
const path = require('path');

const dirs = ['.', 'en', 'de', 'nl'];
const files = ['mentions-legales.html', 'cgv.html', 'politique-confidentialite.html'];

dirs.forEach(dir => {
    files.forEach(file => {
        const filepath = path.join(__dirname, '..', dir, file);
        if (!fs.existsSync(filepath)) return;
        
        let content = fs.readFileSync(filepath, 'utf8');
        
        // Task 1 replacements
        content = content.replace(/Terre & Feu SAS/g, '[Raison sociale à compléter]');
        content = content.replace(/500 000 €/g, '[Capital social à compléter]');
        content = content.replace(/12 Rue de l'Industrie, 67000 Strasbourg, France/g, '[Adresse du siège social à compléter]');
        content = content.replace(/Strasbourg B 823 456 789/g, '[RCS à compléter]');
        content = content.replace(/FR 12 823456789/g, '[N° TVA intracommunautaire à compléter]');
        content = content.replace(/Jean-Marc Dubois/g, '[Nom du directeur de la publication à compléter]');
        
        // Emails and phones
        content = content.replace(/>contact@terreetfeu\.pro</g, '>[Email de contact à compléter]<');
        content = content.replace(/"mailto:contact@terreetfeu\.pro"/g, '"mailto:[Email de contact à compléter]"');
        
        content = content.replace(/>\+33 \(0\)3 88 00 00 00</g, '>[Téléphone à compléter]<');
        content = content.replace(/"tel:\+33388000000"/g, '"tel:[Téléphone à compléter]"');
        
        content = content.replace(/>dpo@terreetfeu\.pro</g, '>[Email du DPO à compléter]<');
        content = content.replace(/"mailto:dpo@terreetfeu\.pro"/g, '"mailto:[Email du DPO à compléter]"');
        
        // Hébergeur block in mentions-legales
        const hebergeurBlockRegex = /<div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12 w-full">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/;
        content = content.replace(hebergeurBlockRegex, '<div class="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12 w-full">[Hébergeur à compléter par le client]</div></div></div></section>');
        
        // Dates and versions
        content = content.replace(/15 Octobre 2024/g, '[Date à compléter à la mise en ligne]');
        content = content.replace(/Octobre 2023/g, '[Date à compléter à la mise en ligne]');
        
        const versionBlockRegex = /<div class="mt-6 pt-6 border-t border-outline\/20">\s*<h3 class="text-label-md font-label-md text-on-surface mb-2">Version du document<\/h3>\s*<div class="text-data-mono font-data-mono text-on-surface-variant">v2\.4\.1-FR<\/div>\s*<\/div>/g;
        content = content.replace(versionBlockRegex, '');
        
        // Task 2: Politique TOC
        if (file === 'politique-confidentialite.html') {
            const partageLinkRegex = /<a[^>]*href="#partage"[^>]*>3\. Partage & Logistique<\/a>\s*/;
            content = content.replace(partageLinkRegex, '');
            
            content = content.replace(/>4\. Gestion des Cookies<\/a>/g, '>3. Gestion des Cookies</a>');
            content = content.replace(/>5\. Vos droits \(RGPD\)<\/a>/g, '>4. Vos droits (RGPD)</a>');
            
            // Fix big numbers in circles for Cookies and Droits
            content = content.replace(
                /<div class="w-10 h-10 bg-primary\/10 rounded-full flex items-center justify-center text-primary font-headline-md text-headline-md">4<\/div>\s*<h2 class="font-headline-lg text-headline-lg text-on-surface">Gestion des Cookies<\/h2>/g,
                '<div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-headline-md text-headline-md">3</div>\n<h2 class="font-headline-lg text-headline-lg text-on-surface">Gestion des Cookies</h2>'
            );
            
            content = content.replace(
                /<div class="w-10 h-10 bg-primary\/10 rounded-full flex items-center justify-center text-primary font-headline-md text-headline-md">5<\/div>\s*<h2 class="font-headline-lg text-headline-lg text-on-surface">Vos droits \(RGPD\)<\/h2>/g,
                '<div class="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-headline-md text-headline-md">4</div>\n<h2 class="font-headline-lg text-headline-lg text-on-surface">Vos droits (RGPD)</h2>'
            );
        }
        
        // Task 3: CGV replacements
        if (file === 'cgv.html') {
            content = content.replace(
                /<strong>Minimum de commande \(MOQ\) :<\/strong> Fixé à 5 palettes ou 10 stères pour bénéficier des tarifs grossistes\./g,
                '<strong>Minimum de commande (MOQ) :</strong> La commande minimum est 1 palette, les paliers de remise s\'appliquant ensuite selon la grille en place.'
            );
            
            content = content.replace(
                /15 jours calendaires/g,
                '[Durée de validité des devis à confirmer]'
            );
            
            content = content.replace(
                /Paiement comptant à la commande par virement bancaire pour les trois premières opérations commerciales\./g,
                'Conditions de Règlement B2B'
            );
            
            content = content.replace(
                /30 jours nets date de facture, par virement bancaire ou prélèvement SEPA, sous réserve d'encours garanti\./g,
                'Conditions de Règlement B2B'
            );
        }
        
        fs.writeFileSync(filepath, content, 'utf8');
        console.log("Fixed " + filepath);
    });
});
