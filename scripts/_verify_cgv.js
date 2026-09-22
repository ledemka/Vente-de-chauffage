const fs = require("fs");
const KEYS = ["cgv.art1_title", "cgv.art1_info", "cgv.art2_p2", "cgv.art4_p1", "cgv.access_desc"];
const FILES = ["cgv.html", "en/cgv.html", "de/cgv.html", "nl/cgv.html"];
for (const f of FILES) {
  const content = fs.readFileSync(f, "utf8");
  const missing = KEYS.filter(k => !content.includes('data-i18n="' + k + '"'));
  console.log(f + ": " + (missing.length === 0 ? "ALL 5 OK" : "MISSING: " + missing.join(", ")));
}
