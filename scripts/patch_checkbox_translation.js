const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../data/i18n');
const langs = ['fr', 'en', 'de', 'nl'];

const extraDict = {
  'fr': { 'check_box_required': 'Veuillez cocher cette case si vous souhaitez continuer.' },
  'en': { 'check_box_required': 'Please check this box if you want to proceed.' },
  'de': { 'check_box_required': 'Bitte aktivieren Sie dieses Kontrollkästchen, um fortzufahren.' },
  'nl': { 'check_box_required': 'Vink dit vakje aan als u wilt doorgaan.' }
};

langs.forEach(lang => {
    let data = JSON.parse(fs.readFileSync(path.join(dir, lang + '.json'), 'utf8'));
    if (!data.checkout) data.checkout = {};
    for (let k in extraDict[lang]) {
        data.checkout[k] = extraDict[lang][k];
    }
    fs.writeFileSync(path.join(dir, lang + '.json'), JSON.stringify(data, null, 2));
});
console.log('Added check_box_required to JSON.');

const jsPath = path.join(__dirname, '../assets/js/cart.js');
let js = fs.readFileSync(jsPath, 'utf8');

// Add checkbox validation logic in renderCheckoutPage
const injection = `
        const termsCheckbox = document.getElementById('truck_access');
        if (termsCheckbox) {
            termsCheckbox.oninvalid = function(e) {
                e.target.setCustomValidity(window.i18n ? window.i18n.t('checkout.check_box_required', 'Veuillez cocher cette case si vous souhaitez continuer.') : 'Veuillez cocher cette case si vous souhaitez continuer.');
            };
            termsCheckbox.oninput = function(e) {
                e.target.setCustomValidity('');
            };
        }
`;

js = js.replace(
    "const shippingAddress = document.getElementById('address');",
    injection + "\n        const shippingAddress = document.getElementById('address');"
);

fs.writeFileSync(jsPath, js);
console.log('Patched cart.js for custom validity');
