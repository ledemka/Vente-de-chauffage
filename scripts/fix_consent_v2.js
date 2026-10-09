const fs = require("fs");
let content = fs.readFileSync("assets/js/consent-ads.js", "utf8");

// 1. Remove gtag initialization at the top because it's now in <head>
const topInitRegex =
  /\/\/ Initialize dataLayer and gtag\s*window\.dataLayer = window\.dataLayer \|\| \[\];\s*function gtag\(\)\{dataLayer\.push\(arguments\);\}\s*\/\/ Default consent: denied\s*gtag\('consent', 'default', \{\s*'ad_storage': 'denied',\s*'ad_user_data': 'denied',\s*'ad_personalization': 'denied',\s*'analytics_storage': 'denied'\s*\}\);/g;
content = content.replace(topInitRegex, "");

// 2. Remove loadGoogleAds function entirely
const loadGoogleAdsRegex =
  /\s*function loadGoogleAds\(\) \{[\s\S]*?gtag\('config', GOOGLE_ADS_ID(?:, \{ page_location: cleanUrl \})?\);\s*\}/g;
content = content.replace(loadGoogleAdsRegex, "");

// 3. Remove loadGoogleAds call from applyConsent
const callLoadGoogleAdsRegex = /\s*loadGoogleAds\(\);/g;
content = content.replace(callLoadGoogleAdsRegex, "");

// 4. Ensure analytics_storage is not updated if we follow strict instructions,
// wait, user said "Si le projet considère réellement le bouton Accepter comme un consentement global... alors analytics_storage peut rester granted". I'll keep it.

fs.writeFileSync("assets/js/consent-ads.js", content);
console.log("Fixed consent-ads.js");
