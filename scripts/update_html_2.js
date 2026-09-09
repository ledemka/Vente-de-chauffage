const fs = require('fs');
const path = require('path');

const files = [
    'merci-contact.html',
    'merci-devis.html',
    'merci-inscription.html',
    'confirmation-commande.html'
];

for (const file of files) {
    const filePath = path.join(__dirname, '..', file);
    if (!fs.existsSync(filePath)) continue;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the spam notice HTML structure
    const oldHtmlRegex = /<div id="spam-notice-container"[\s\S]*?<p id="spam-notice-text"[\s\S]*?<\/p>[\s\S]*?<\/div>/;
    
    const newHtml = `<div id="spam-notice-container" class="alert-warning mt-6 hidden" role="status">
            <div class="flex items-start gap-3">
                <span class="material-symbols-outlined mt-0.5">warning</span>
                <div>
                    <p class="font-bold text-label-md mb-1" data-i18n="confirmation.spam_notice_title">Vérifiez vos spams</p>
                    <p class="text-body-sm" data-i18n="confirmation.spam_notice"></p>
                </div>
            </div>
        </div>`;
                    
    content = content.replace(oldHtmlRegex, newHtml);
    
    fs.writeFileSync(filePath, content, 'utf8');
}
console.log('HTML structures updated successfully');
