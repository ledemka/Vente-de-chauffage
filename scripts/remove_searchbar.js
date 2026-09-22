"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = process.cwd();

// The exact search bar block to remove
const SEARCH_BAR = '<div class="flex-1 max-w-md px-gutter"><div class="relative"><span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span><input class="w-full bg-surface-container-highest/10 border border-outline/30 rounded-lg py-2 pl-10 pr-4 text-body-sm text-inverse-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary" placeholder="Rechercher un produit..." data-i18n="search_placeholder" type="text"/></div></div>';

// Translated variants too
const VARIANTS = [
    SEARCH_BAR,
    SEARCH_BAR.replace('placeholder="Rechercher un produit..."', 'placeholder="Search for a product..."'),
    SEARCH_BAR.replace('placeholder="Rechercher un produit..."', 'placeholder="Nach einem Produkt suchen..."'),
    SEARCH_BAR.replace('placeholder="Rechercher un produit..."', 'placeholder="Zoek een product..."'),
];

let fixed = 0;
let total = 0;

function scan(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
        const fp = path.join(dir, e.name);
        if (e.isDirectory()) {
            if ([".git", "node_modules", ".agent", ".tmp"].includes(e.name)) continue;
            scan(fp);
        } else if (e.name.endsWith(".html")) {
            total++;
            let content = fs.readFileSync(fp, "utf8");
            let changed = false;
            for (const variant of VARIANTS) {
                if (content.includes(variant)) {
                    content = content.split(variant).join("");
                    changed = true;
                }
            }
            if (changed) {
                fs.writeFileSync(fp, content, "utf8");
                fixed++;
                console.log("[FIXED] " + fp.replace(ROOT, ""));
            }
        }
    }
}

scan(ROOT);
console.log("\nDone. Fixed " + fixed + "/" + total + " HTML files.");
