const fs = require("fs");
let content = fs.readFileSync("devis.html", "utf8");

const target1 =
  "                try {\n                    sessionStorage.setItem('thanks_email', formData.email);\n                } catch(e) {}";
const target2 =
  "                try {\r\n                    sessionStorage.setItem('thanks_email', formData.email);\r\n                } catch(e) {}";

const replace1 =
  "                try {\n                    sessionStorage.setItem('thanks_email', formData.email);\n                    sessionStorage.setItem('ads_conv_devis', '1');\n                } catch(e) {}";
const replace2 =
  "                try {\r\n                    sessionStorage.setItem('thanks_email', formData.email);\r\n                    sessionStorage.setItem('ads_conv_devis', '1');\r\n                } catch(e) {}";

content = content.replace(target1, replace1).replace(target2, replace2);
fs.writeFileSync("devis.html", content);
console.log("Fixed devis.html");
