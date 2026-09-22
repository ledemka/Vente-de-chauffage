"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const langs = ["", "en", "de", "nl"];

// We will do straightforward string replacements or regex replacements to fix the files.
// For Mentions Legales
const mentionsReplacements = [
    { from: `data-i18n="nav.contact" data-i18n="mentions.contact"`, to: `data-i18n="nav.contact"` },
    { from: `data-i18n="mentions.sec1" data-i18n="mentions.pub_info"`, to: `data-i18n="mentions.sec1"` },
    { from: `data-i18n="mentions.sec2" data-i18n="mentions.hosting"`, to: `data-i18n="mentions.sec2"` },
    { from: `data-i18n="mentions.sec3" data-i18n="mentions.ip"`, to: `data-i18n="mentions.sec3"` }
];

const mentionsHeaders = {
    "editeur": "mentions.pub_info",
    "hebergement": "mentions.hosting",
    "propriete": "mentions.ip"
};

// For Politique Confidentialite
const privacyReplacements = [
    { from: `data-i18n="privacy.sec1" data-i18n="privacy.collection"`, to: `data-i18n="privacy.sec1"` },
    { from: `data-i18n="privacy.sec2" data-i18n="privacy.use_data"`, to: `data-i18n="privacy.sec2"` },
    { from: `data-i18n="privacy.sec3" data-i18n="privacy.cookies"`, to: `data-i18n="privacy.sec3"` },
    { from: `data-i18n="privacy.sec4" data-i18n="privacy.rights"`, to: `data-i18n="privacy.sec4"` }
];

const privacyHeaders = {
    "collecte": "privacy.collection",
    "utilisation": "privacy.use_data",
    "cookies": "privacy.cookies",
    "droits": "privacy.rights"
};

function fixFile(page, fixes, headers) {
    for (const l of langs) {
        const fp = path.join(ROOT, l, page + ".html");
        if (!fs.existsSync(fp)) continue;
        let html = fs.readFileSync(fp, "utf8");

        // Apply fix for duplicates
        for (const fix of fixes) {
            html = html.split(fix.from).join(fix.to);
        }

        // Apply fix for missing data-i18n on headers
        // We look for: id="editeur" ... <h2 class="...">Title</h2>
        // And we inject data-i18n="..." into the h2
        for (const [id, i18n] of Object.entries(headers)) {
            const regex = new RegExp(`(id="${id}"[\\s\\S]*?<h2[^>]*?)(>)`, "i");
            html = html.replace(regex, (match, p1, p2) => {
                if (p1.includes(`data-i18n="${i18n}"`)) return match; // already has it
                if (p1.includes(`data-i18n=`)) return match; // already has some i18n
                return p1 + ` data-i18n="${i18n}"` + p2;
            });
        }

        fs.writeFileSync(fp, html, "utf8");
        console.log(`[FIXED] ${l === "" ? "fr" : l}/${page}.html`);
    }
}

fixFile("mentions-legales", mentionsReplacements, mentionsHeaders);
fixFile("politique-confidentialite", privacyReplacements, privacyHeaders);
console.log("Cleanup complete.");
