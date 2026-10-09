const fs = require("fs");
let content = fs.readFileSync("merci-inscription.html", "utf8");

const target1 =
  "    const urlParams = new URLSearchParams(window.location.search);\n    const email = urlParams.get('email');";
const target2 =
  "    const urlParams = new URLSearchParams(window.location.search);\r\n    const email = urlParams.get('email');";

const replace1 =
  "    let email = null;\n    try { email = sessionStorage.getItem('thanks_email'); } catch(e) {}\n    const urlParams = new URLSearchParams(window.location.search);\n    if (!email) email = urlParams.get('email');\n    if (urlParams.has('email')) {\n        urlParams.delete('email');\n        const newSearch = urlParams.toString();\n        const newUrl = window.location.pathname + (newSearch ? '?' + newSearch : '');\n        window.history.replaceState(null, '', newUrl);\n    }";
const replace2 =
  "    let email = null;\r\n    try { email = sessionStorage.getItem('thanks_email'); } catch(e) {}\r\n    const urlParams = new URLSearchParams(window.location.search);\r\n    if (!email) email = urlParams.get('email');\r\n    if (urlParams.has('email')) {\r\n        urlParams.delete('email');\r\n        const newSearch = urlParams.toString();\r\n        const newUrl = window.location.pathname + (newSearch ? '?' + newSearch : '');\r\n        window.history.replaceState(null, '', newUrl);\r\n    }";

content = content.replace(target1, replace1).replace(target2, replace2);
fs.writeFileSync("merci-inscription.html", content);
console.log("Fixed merci-inscription.html");
