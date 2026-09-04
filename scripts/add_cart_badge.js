const fs = require('fs');
const path = require('path');

const loaderJsPath = path.join(__dirname, '..', 'assets', 'js', 'i18n-loader.js');
let loaderContent = fs.readFileSync(loaderJsPath, 'utf8');

const badgeLogic = `
    // 3. Cart Badge Logic
    const updateCartBadge = () => {
        try {
            const cart = JSON.parse(localStorage.getItem('mock_cart')) || [];
            const count = cart.reduce((acc, item) => acc + (parseInt(item.quantity) || 0), 0);
            let badge = document.getElementById('cart-badge');
            
            if (!badge) {
                const cartLinks = Array.from(document.querySelectorAll('a')).filter(a => a.getAttribute('href') && a.getAttribute('href').endsWith('panier.html'));
                if (cartLinks.length > 0) {
                    // Header link is usually the first one
                    const headerCartLink = cartLinks[0];
                    headerCartLink.classList.add('relative');
                    badge = document.createElement('span');
                    badge.id = 'cart-badge';
                    badge.className = 'absolute -top-1 -right-2 bg-[#802813] text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center';
                    headerCartLink.appendChild(badge);
                }
            }
            
            if (badge) {
                if (count > 0) {
                    badge.textContent = count > 99 ? '99+' : count;
                    badge.style.display = 'flex';
                } else {
                    badge.style.display = 'none';
                }
            }
        } catch(e) {}
    };
    
    updateCartBadge();
    window.updateCartBadge = updateCartBadge;
`;

if (!loaderContent.includes('updateCartBadge')) {
    // Inject at the end of DOMContentLoaded callback
    loaderContent = loaderContent.replace(/\}\);\s*$/, badgeLogic + '\n});\n');
    fs.writeFileSync(loaderJsPath, loaderContent, 'utf8');
    console.log('Badge logic added to i18n-loader.js');
}

const cartJsPath = path.join(__dirname, '..', 'assets', 'js', 'cart.js');
let cartContent = fs.readFileSync(cartJsPath, 'utf8');
if (!cartContent.includes('window.updateCartBadge()')) {
    cartContent = cartContent.replace(/if\(window\.i18n\) window\.i18n\.translateDOM\(container\);/g, 'if(window.i18n) window.i18n.translateDOM(container);\n        if(window.updateCartBadge) window.updateCartBadge();');
    fs.writeFileSync(cartJsPath, cartContent, 'utf8');
    console.log('Cart.js updated to refresh badge');
}
