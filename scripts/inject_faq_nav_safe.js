const fs = require('fs');

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // 1. Desktop Nav
    const desktopSearch = '<a class="text-on-surface-variant hover:text-primary text-label-md font-label-md transition-colors py-3" data-i18n="nav.depots" href="./depots.html"><span data-i18n="nav.depots">Dépôts</span></a>';
    const faqDesktopLink = '<a class="text-on-surface-variant hover:text-primary text-label-md font-label-md transition-colors py-3" data-i18n="nav.faq" href="./faq.html"><span data-i18n="nav.faq">FAQ</span></a>';
    if (content.includes(desktopSearch) && !content.includes(faqDesktopLink)) {
        content = content.replace(desktopSearch, desktopSearch + '\n                      ' + faqDesktopLink);
    }
    
    // Also try the active state for depots if it was active
    const desktopSearchActive = '<a class="text-primary font-bold border-b-2 border-primary text-label-md font-label-md transition-colors py-3" data-i18n="nav.depots" href="./depots.html"><span data-i18n="nav.depots">Dépôts</span></a>';
    if (content.includes(desktopSearchActive) && !content.includes(faqDesktopLink)) {
        content = content.replace(desktopSearchActive, desktopSearchActive + '\n                      ' + faqDesktopLink);
    }

    // 2. Mobile Nav
    const mobileSearch = '<a class="block py-4 border-b border-outline-variant/30 text-headline-md font-headline-md text-on-surface" data-i18n="nav.depots" href="./depots.html">Dépôts</a>';
    const faqMobileLink = '<a class="block py-4 border-b border-outline-variant/30 text-headline-md font-headline-md text-on-surface" data-i18n="nav.faq" href="./faq.html">FAQ</a>';
    if (content.includes(mobileSearch) && !content.includes(faqMobileLink)) {
        content = content.replace(mobileSearch, mobileSearch + '\n                        ' + faqMobileLink);
    }
    
    // 3. Footer Nav
    const footerSearch = '<a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="./contact.html"><span data-i18n="nav.contact">Contact</span></a></nav></div><div class="flex flex-col gap-4"><h4 class="text-label-md font-label-md text-primary-fixed"><span data-i18n="footer.client_space_title">';
    const faqFooterLink = '<a class="text-body-sm text-outline-variant hover:text-inverse-on-surface" href="./faq.html"><span data-i18n="nav.faq">FAQ</span></a>';
    if (content.includes(footerSearch) && !content.includes(faqFooterLink)) {
        content = content.replace(footerSearch, faqFooterLink + footerSearch);
    }

    fs.writeFileSync(file, content, 'utf8');
});

// Update the active state for faq.html itself
let faqContent = fs.readFileSync('faq.html', 'utf8');
const faqDesktopInactive = '<a class="text-on-surface-variant hover:text-primary text-label-md font-label-md transition-colors py-3" data-i18n="nav.faq" href="./faq.html"><span data-i18n="nav.faq">FAQ</span></a>';
const faqDesktopActive = '<a class="text-primary font-bold border-b-2 border-primary text-label-md font-label-md transition-colors py-3" data-i18n="nav.faq" href="./faq.html"><span data-i18n="nav.faq">FAQ</span></a>';
faqContent = faqContent.replace(faqDesktopInactive, faqDesktopActive);
fs.writeFileSync('faq.html', faqContent, 'utf8');

console.log('Navigation properly injected via string replacement!');
