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
    
    // Replace the JS block
    const oldJsRegex = /const spamNotice = window\.i18nData\?\.confirmation\?\.spam_notice \|\| "--- \{\{email\}\} ---";\s*const noticeText = spamNotice\.replace\('\{\{email\}\}', '<strong>' \+ email \+ '<\/strong>'\);\s*document\.getElementById\('spam-notice-text'\)\.innerHTML = noticeText;\s*document\.getElementById\('spam-notice-container'\)\.classList\.remove\('hidden'\);/;
    
    const newJs = `const mainBodyText = document.getElementById('main-body-text');
        if (mainBodyText) {
            // Wait slightly for i18n to load if needed
            setTimeout(() => {
                const originalText = mainBodyText.innerHTML;
                if(originalText.includes('{{email}}')) {
                    mainBodyText.innerHTML = originalText.replace('{{email}}', '<strong>' + email + '</strong>');
                } else if(window.i18nData) {
                   // Fallback if i18n replaces text after our initial check
                   let key = '';
                   if(window.location.pathname.includes('contact')) key = 'merci.contact_body';
                   else if(window.location.pathname.includes('devis')) key = 'merci.devis_body';
                   else if(window.location.pathname.includes('inscription')) key = 'merci.inscription_body';
                   else if(window.location.pathname.includes('confirmation')) key = 'confirmation.msg2';
                   
                   const parts = key.split('.');
                   let text = window.i18nData[parts[0]] ? window.i18nData[parts[0]][parts[1]] : '';
                   if(text) mainBodyText.innerHTML = text.replace('{{email}}', '<strong>' + email + '</strong>');
                }
                document.getElementById('spam-notice-container').classList.remove('hidden');
            }, 150);
        } else {
             document.getElementById('spam-notice-container').classList.remove('hidden');
        }`;
        
    content = content.replace(oldJsRegex, newJs);
    fs.writeFileSync(filePath, content, 'utf8');
}
console.log('JS blocks updated successfully');
