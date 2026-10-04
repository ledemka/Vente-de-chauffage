const fs = require('fs');
let content = fs.readFileSync('inscription.html', 'utf8');

const target1 = "                    const urlParams = new URLSearchParams(window.location.search);\n                    let redirectUrl = './merci-inscription.html?email=' + encodeURIComponent(data.email);\n                    if (urlParams.has('redirect')) {\n                        redirectUrl += '&redirect=' + encodeURIComponent(urlParams.get('redirect'));\n                    }\n                    window.location.href = redirectUrl;";
const target2 = "                    const urlParams = new URLSearchParams(window.location.search);\r\n                    let redirectUrl = './merci-inscription.html?email=' + encodeURIComponent(data.email);\r\n                    if (urlParams.has('redirect')) {\r\n                        redirectUrl += '&redirect=' + encodeURIComponent(urlParams.get('redirect'));\r\n                    }\r\n                    window.location.href = redirectUrl;";

const replace1 = "                    const urlParams = new URLSearchParams(window.location.search);\n                    try { sessionStorage.setItem('thanks_email', data.email); } catch(e) {}\n                    let redirectUrl = './merci-inscription.html';\n                    if (urlParams.has('redirect')) {\n                        redirectUrl += '?redirect=' + encodeURIComponent(urlParams.get('redirect'));\n                    }\n                    window.location.href = redirectUrl;";
const replace2 = "                    const urlParams = new URLSearchParams(window.location.search);\r\n                    try { sessionStorage.setItem('thanks_email', data.email); } catch(e) {}\r\n                    let redirectUrl = './merci-inscription.html';\r\n                    if (urlParams.has('redirect')) {\r\n                        redirectUrl += '?redirect=' + encodeURIComponent(urlParams.get('redirect'));\r\n                    }\r\n                    window.location.href = redirectUrl;";

content = content.replace(target1, replace1).replace(target2, replace2);
fs.writeFileSync('inscription.html', content);
console.log('Fixed inscription.html');
