const fs = require("fs");

const file = "confirmation-commande.html";
let content = fs.readFileSync(file, "utf8");

// Replace the block
const target =
  "    let email = null;\n    try { email = sessionStorage.getItem('thanks_email'); } catch(e) {}\n    const urlParams = new URLSearchParams(window.location.search);\n    if (!email) email = urlParams.get('email');\n    if (window.location.search) { window.history.replaceState(null, '', window.location.pathname); }";
const replacement =
  "    let email = null;\n    let ref = null;\n    try { \n        email = sessionStorage.getItem('thanks_email'); \n        ref = sessionStorage.getItem('thanks_ref');\n    } catch(e) {}\n    const urlParams = new URLSearchParams(window.location.search);\n    if (!email) email = urlParams.get('email');\n    if (!ref) ref = urlParams.get('ref');\n    if (window.location.search) { window.history.replaceState(null, '', window.location.pathname); }";

content = content.replace(target, replacement);

const targetWin =
  "    let email = null;\r\n    try { email = sessionStorage.getItem('thanks_email'); } catch(e) {}\r\n    const urlParams = new URLSearchParams(window.location.search);\r\n    if (!email) email = urlParams.get('email');\r\n    if (window.location.search) { window.history.replaceState(null, '', window.location.pathname); }";
const replacementWin =
  "    let email = null;\r\n    let ref = null;\r\n    try { \r\n        email = sessionStorage.getItem('thanks_email'); \r\n        ref = sessionStorage.getItem('thanks_ref');\r\n    } catch(e) {}\r\n    const urlParams = new URLSearchParams(window.location.search);\r\n    if (!email) email = urlParams.get('email');\r\n    if (!ref) ref = urlParams.get('ref');\r\n    if (window.location.search) { window.history.replaceState(null, '', window.location.pathname); }";

content = content.replace(targetWin, replacementWin);

fs.writeFileSync(file, content);
console.log("Fixed confirmation-commande.html");
