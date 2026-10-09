const fs = require("fs");

const files = [
  "merci-devis.html",
  "merci-contact.html",
  "confirmation-commande.html",
];

for (let file of files) {
  let content = fs.readFileSync(file, "utf8");
  content = content.replace(
    "    const urlParams = new URLSearchParams(window.location.search);\r\n    const email = urlParams.get('email');",
    "    let email = null;\r\n    try { email = sessionStorage.getItem('thanks_email'); } catch(e) {}\r\n    const urlParams = new URLSearchParams(window.location.search);\r\n    if (!email) email = urlParams.get('email');\r\n    if (window.location.search) { window.history.replaceState(null, '', window.location.pathname); }",
  );
  // if windows newline didn't match, try linux
  content = content.replace(
    "    const urlParams = new URLSearchParams(window.location.search);\n    const email = urlParams.get('email');",
    "    let email = null;\n    try { email = sessionStorage.getItem('thanks_email'); } catch(e) {}\n    const urlParams = new URLSearchParams(window.location.search);\n    if (!email) email = urlParams.get('email');\n    if (window.location.search) { window.history.replaceState(null, '', window.location.pathname); }",
  );
  fs.writeFileSync(file, content);
  console.log(file + " updated.");
}
