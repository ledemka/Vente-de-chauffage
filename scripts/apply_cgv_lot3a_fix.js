"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");

// Fix: re-read each lang file and fix the broken art1_p1 translation
// The issue: "Conditions Generales de Vente" was substituted inside the art1_p1 paragraph

const fixes = {
    de: {
        broken: "Les pr\u00e9sentes Allgemeine Gesch\u00e4ftsbedingungen (CGV) constituent le socle de la n\u00e9gociation commerciale et sont syst\u00e9matiquement adress\u00e9es ou remises \u00e0 chaque acheteur pour lui permettre de passer commande.",
        correct: "Diese Allgemeinen Gesch\u00e4ftsbedingungen (AGB) bilden die Grundlage der Gesch\u00e4ftsverhandlung und werden jedem K\u00e4ufer systematisch zur Bestellung \u00fcbermittelt.",
    },
    en: {
        broken: "Les pr\u00e9sentes General Terms and Conditions of Sale (CGV) constituent le socle de la n\u00e9gociation commerciale et sont syst\u00e9matiquement adress\u00e9es ou remises \u00e0 chaque acheteur pour lui permettre de passer commande.",
        correct: "These General Terms and Conditions of Sale (\u201cGTC\u201d) form the basis of the commercial negotiation and are systematically provided to each buyer to enable them to place an order.",
    },
    nl: {
        broken: "Les pr\u00e9sentes Algemene Verkoopvoorwaarden (CGV) constituent le socle de la n\u00e9gociation commerciale et sont syst\u00e9matiquement adress\u00e9es ou remises \u00e0 chaque acheteur pour lui permettre de passer commande.",
        correct: "Deze Algemene Verkoopvoorwaarden vormen de basis van de commerci\u00eble onderhandeling en worden systematisch aan elke koper verstrekt om een bestelling te kunnen plaatsen.",
    },
};

for (const [lang, fix] of Object.entries(fixes)) {
    const fp = path.join(ROOT, lang, "cgv.html");
    let html = fs.readFileSync(fp, "utf8");
    if (html.includes(fix.broken)) {
        html = html.split(fix.broken).join(fix.correct);
        fs.writeFileSync(fp, html, "utf8");
        console.log("[FIXED] " + lang + "/cgv.html art1_p1");
    } else {
        // Try Unicode curly apostrophe variants
        const brokenAlt = fix.broken.replace(/\u2019/g, "'");
        if (html.includes(brokenAlt)) {
            html = html.split(brokenAlt).join(fix.correct);
            fs.writeFileSync(fp, html, "utf8");
            console.log("[FIXED-alt] " + lang + "/cgv.html art1_p1");
        } else {
            console.log("[OK-skip] " + lang + "/cgv.html art1_p1 - not found broken");
        }
    }
}
console.log("Fix complete.");
