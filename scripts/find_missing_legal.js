const fs = require('fs');

const missing = {
  'mentions-legales.html': [
    'CONTACT',
    'Le site sotramsbois est hébergé de manière sécurisée',
    'L\'ensemble de ce site relève de la législation française',
    'Pour toute question concernant le traitement de vos données',
    'dpo@sotramsbois.com' // Just guessing based on "les 2 phrases sur le contact du DPO"
  ],
  'cgv.html': [
    'Objet',
    'Produits',
    'Prix et Commande',
    'Livraison',
    'Paiement',
    'Rétractation',
    'NOUS CONTACTER',
    'Elles régissent exclusivement',
    'aux acheteurs professionnels (B2B)'
  ],
  'politique-confidentialite.html': [
    'Exécution du contrat',
    'Gérer les préférences',
    'Contacter le DPO'
  ],
  'politique-retour.html': [
    'Conditions Générales',
    'Logistique & Transport',
    'Processus de Remboursement',
    'Exceptions & Litiges',
    'Contacter le SAV',
    'Pour toute demande de retour',
    'Une fois le retour validé' // guessing 2 paragraphs
  ]
};

for (const file of Object.keys(missing)) {
    const html = fs.readFileSync(file, 'utf8');
    const notFound = [];
    console.log(`\n=== ${file} ===`);
    
    // Instead of my hardcoded guess, I'll extract all pure text nodes that lack data-i18n.
    const cheerio = require('cheerio');
    const $ = cheerio.load(html);
    
    $('*').each((i, el) => {
        if (['script', 'style', 'link', 'meta', 'title'].includes(el.tagName.toLowerCase())) return;
        if ($(el).closest('[data-i18n], [data-i18n-html]').length) return;
        
        const text = $(el).contents().filter(function() { return this.nodeType === 3; }).text().trim();
        
        if (text && text.length > 2 && /[a-z]/i.test(text) && !text.includes('sotramsbois') && !text.includes('€')) {
            console.log(`[${el.tagName}] ${text}`);
        }
    });
}
