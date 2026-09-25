const fs = require('fs');

const langs = ['fr', 'en', 'de', 'nl'];

const translations = {
  fr: "L'Exigence Thermique<br>au Service des Professionnels.",
  en: "Thermal Excellence<br>for Professionals.",
  de: "Thermische Exzellenz<br>für Profis.",
  nl: "Thermische Uitmuntendheid<br>voor Professionals."
};

for (const lang of langs) {
  const path = `data/i18n/${lang}.json`;
  if (fs.existsSync(path)) {
    const data = JSON.parse(fs.readFileSync(path, 'utf8'));
    
    if (data.hero) {
      data.hero.title_html = translations[lang];
      console.log(`Updated title_html in ${lang}.json`);
    }
    
    fs.writeFileSync(path, JSON.stringify(data, null, 2), 'utf8');
  }
}

console.log('Hero title_html translations updated.');
