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
    
    // Replace the HTML structure
    // Old:
    // <div class="bg-surface-container-low border border-outline/20 rounded-md p-4 mt-6">
    //     <div class="flex items-start gap-3">
    //         <span class="material-symbols-outlined text-on-surface-variant mt-0.5">info</span>
    //         <div>
    //             <h3 class="text-label-md font-label-md text-on-surface mb-1" data-i18n="confirmation.spam_notice_title">Vérifiez vos spams</h3>
    //             <p id="spam-notice-text" class="text-body-sm text-on-surface-variant"></p>
    //         </div>
    //     </div>
    // </div>
    
    // Some pages might have a different old structure, let's use regex to replace the container
    const oldHtmlRegex = /<div class="bg-surface-container-low border border-outline\/20 rounded-md p-4 mt-6(?:[^>]*?)>[\s\S]*?<h3[^>]*data-i18n="confirmation.spam_notice_title"[^>]*>.*?<\/h3>[\s\S]*?<p id="spam-notice-text"[\s\S]*?<\/p>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>/;
    
    const newHtml = `<div class="alert-warning mt-6" role="status">
                        <div class="flex items-start gap-3">
                            <span class="material-symbols-outlined mt-0.5">warning</span>
                            <div>
                                <p class="font-bold text-label-md mb-1" data-i18n="confirmation.spam_notice_title">Vérifiez vos spams</p>
                                <p class="text-body-sm" data-i18n="confirmation.spam_notice"></p>
                            </div>
                        </div>
                    </div>`;
                    
    content = content.replace(oldHtmlRegex, newHtml);
    
    // Now update the JS targeting.
    // Old JS has:
    // const spamText = document.getElementById('spam-notice-text');
    // if (spamText) { ... replace {{email}} ... }
    
    // Actually, we don't need JS to replace {{email}} in spam notice anymore.
    // Instead, we need to inject {{email}} in the main body paragraph.
    // The main body paragraph usually has: data-i18n="merci.xxx_body" or "confirmation.msg2"
    
    // Let's modify the JS block at the bottom
    // The script block usually looks like:
    /*
    <script>
    document.addEventListener('DOMContentLoaded', () => {
        ...
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');
        if (email) {
            const spamText = document.getElementById('spam-notice-text');
            if (spamText) {
                // Wait for i18n to load
                setTimeout(() => {
                    const originalText = spamText.textContent;
                    spamText.textContent = originalText.replace('{{email}}', email);
                }, 100);
            }
        }
    });
    </script>
    */
    
    const i18nKeyMap = {
        'merci-contact.html': 'merci.contact_body',
        'merci-devis.html': 'merci.devis_body',
        'merci-inscription.html': 'merci.inscription_body',
        'confirmation-commande.html': 'confirmation.msg2'
    };
    
    const i18nKey = i18nKeyMap[file];
    
    // We add an id to the main paragraph so JS can target it easily
    const paragraphRegex = new RegExp(`<p([^>]*)data-i18n="${i18nKey}"([^>]*)>`);
    content = content.replace(paragraphRegex, `<p id="main-body-text"$1data-i18n="${i18nKey}"$2>`);
    
    const oldJsRegex = /const spamText = document\.getElementById\('spam-notice-text'\);[\s\S]*?if \(spamText\) \{[\s\S]*?setTimeout\(\(\) => \{[\s\S]*?const originalText = spamText\.textContent;[\s\S]*?spamText\.textContent = originalText\.replace\('\{\{email\}\}', email\);[\s\S]*?\}, 100\);[\s\S]*?\}/;
    
    const newJs = `const mainBodyText = document.getElementById('main-body-text');
            if (mainBodyText) {
                // Wait for i18n to load
                setTimeout(() => {
                    const originalText = mainBodyText.textContent;
                    mainBodyText.textContent = originalText.replace('{{email}}', email);
                }, 100);
            }`;
            
    content = content.replace(oldJsRegex, newJs);
    
    fs.writeFileSync(filePath, content, 'utf8');
}
console.log('HTML files updated');
