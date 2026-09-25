const fs = require('fs');
const cheerio = require('cheerio');

let faqHtml = fs.readFileSync('faq.html', 'utf8');
const $faq = cheerio.load(faqHtml);

const scriptContent = `
        document.addEventListener('DOMContentLoaded', async () => {
            const lang = document.documentElement.lang || 'fr';
            const dataPath = window.resolveDataPath ? window.resolveDataPath('data/faq.json') : './data/faq.json';
            try {
                const res = await fetch(dataPath);
                const faqs = await res.json();
                const container = document.getElementById('faq-container');
                let html = '';
                let schemaItems = [];
                
                const catInfo = {
                    'commande': { icon: 'request_quote', title: { fr: 'Commande & Devis', en: 'Orders & Quotes', de: 'Bestellung & Angebot', nl: 'Bestelling & Offerte' } },
                    'livraison': { icon: 'local_shipping', title: { fr: 'Livraison & Logistique', en: 'Delivery & Logistics', de: 'Lieferung & Logistik', nl: 'Levering & Logistiek' } },
                    'qualite': { icon: 'forest', title: { fr: 'Produits & Qualité', en: 'Products & Quality', de: 'Produkte & Qualität', nl: 'Producten & Kwaliteit' } },
                    'retours': { icon: 'assignment_return', title: { fr: 'Retours & Garanties', en: 'Returns & Warranties', de: 'Rücksendungen & Garantien', nl: 'Retouren & Garanties' } },
                    'compte': { icon: 'person', title: { fr: 'Mon Compte & Sécurité', en: 'My Account & Security', de: 'Mein Konto & Sicherheit', nl: 'Mijn Account & Beveiliging' } },
                    'logistique': { icon: 'map', title: { fr: 'Réseau & Approvisionnement', en: 'Network & Supply', de: 'Netzwerk & Versorgung', nl: 'Netwerk & Voorziening' } }
                };

                const grouped = {};
                faqs.forEach(q => {
                    const cat = q.category || 'commande';
                    if (!grouped[cat]) grouped[cat] = [];
                    grouped[cat].push(q);
                });
                
                for (const cat in grouped) {
                    const info = catInfo[cat];
                    const catTitle = info.title[lang] || info.title.fr;
                    
                    html += '<div class="mb-12">';
                    html += '<div class="flex items-center gap-3 mb-6">';
                    html += '<div class="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-[#802813] shadow-sm">';
                    html += '<span class="material-symbols-outlined text-[28px]">' + info.icon + '</span>';
                    html += '</div>';
                    html += '<h2 class="text-headline-lg font-headline-lg text-on-surface">' + catTitle + '</h2>';
                    html += '</div>';
                    
                    html += '<div class="flex flex-col gap-4">';
                    grouped[cat].forEach(q => {
                        const question = q.question[lang] || q.question.fr;
                        const answer = q.answer[lang] || q.answer.fr;
                        
                        html += '<details class="bg-surface-container rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">';
                        html += '<summary class="cursor-pointer px-6 py-5 flex items-center justify-between list-none text-headline-md font-headline-md text-on-surface hover:bg-surface-variant transition-colors">';
                        html += '<span>' + question + '</span>';
                        html += '<span class="material-symbols-outlined text-[#802813] transition-transform duration-300 group-open:rotate-180">expand_more</span>';
                        html += '</summary>';
                        html += '<div class="px-6 pb-6 pt-2 text-body-md font-body-md text-on-surface-variant leading-relaxed">';
                        html += answer;
                        html += '</div>';
                        html += '</details>';
                        
                        schemaItems.push({
                            "@type": "Question",
                            "name": question,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": answer
                            }
                        });
                    });
                    html += '</div></div>';
                }
                container.innerHTML = html;
                
                // Add FAQ Schema
                const script = document.createElement('script');
                script.type = 'application/ld+json';
                script.text = JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "FAQPage",
                    "mainEntity": schemaItems
                });
                document.head.appendChild(script);
            } catch(e) {
                console.error('Failed to load FAQ', e);
            }
        });
`;

// Replace script content
$faq('script:not([src])').text(scriptContent);

// Add CTA Section at the end of <main>
const ctaTranslations = {
  fr: { title: "Vous ne trouvez pas votre réponse ?", desc: "Nos conseillers sont à votre disposition pour toute demande spécifique.", quote: "Demander un devis", contact: "Nous contacter" },
  en: { title: "Can't find your answer?", desc: "Our advisors are at your disposal for any specific request.", quote: "Request a quote", contact: "Contact us" },
  de: { title: "Finden Sie Ihre Antwort nicht?", desc: "Unsere Berater stehen Ihnen für spezifische Anfragen zur Verfügung.", quote: "Angebot anfordern", contact: "Kontaktieren Sie uns" },
  nl: { title: "Kunt u uw antwoord niet vinden?", desc: "Onze adviseurs staan tot uw beschikking voor specifieke verzoeken.", quote: "Offerte aanvragen", contact: "Neem contact op" }
};

// We will inject the CTA natively in the HTML, using a script to inject the right localized strings.
const ctaHtml = `
    <!-- CTA Block -->
    <section class="py-16 md:py-24 bg-surface">
        <div class="max-w-4xl mx-auto px-margin-desktop">
            <div class="bg-surface-container rounded-2xl p-10 md:p-16 shadow-md flex flex-col items-center text-center relative overflow-hidden">
                <div class="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml,%3Csvg width=\\'40\\' height=\\'40\\' viewBox=\\'0 0 40 40\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M20 0l20 20-20 20L0 20z\\' fill=\\'%23802813\\' fill-rule=\\'evenodd\\'/%3E%3C/svg%3E')]"></div>
                <h3 class="text-headline-lg font-headline-lg text-on-surface mb-4 relative z-10" id="cta-faq-title">Vous ne trouvez pas votre réponse ?</h3>
                <p class="text-body-lg font-body-lg text-on-surface-variant mb-8 max-w-xl relative z-10" id="cta-faq-desc">
                    Nos conseillers sont à votre disposition pour toute demande spécifique concernant les gros volumes.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 relative z-10">
                    <a href="./devis.html" class="bg-primary text-on-primary hover:bg-primary/90 px-8 py-4 rounded-full text-label-md font-label-md transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined text-[20px]">request_quote</span>
                        <span id="cta-faq-quote">Demander un devis</span>
                    </a>
                    <a href="./contact.html" class="bg-surface-container-high text-on-surface hover:bg-surface-variant border border-outline/20 px-8 py-4 rounded-full text-label-md font-label-md transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2">
                        <span class="material-symbols-outlined text-[20px]">mail</span>
                        <span id="cta-faq-contact">Nous contacter</span>
                    </a>
                </div>
            </div>
        </div>
    </section>
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            const l = document.documentElement.lang || 'fr';
            const ctaT = ${JSON.stringify(ctaTranslations)};
            if(ctaT[l]) {
                document.getElementById('cta-faq-title').textContent = ctaT[l].title;
                document.getElementById('cta-faq-desc').textContent = ctaT[l].desc;
                document.getElementById('cta-faq-quote').textContent = ctaT[l].quote;
                document.getElementById('cta-faq-contact').textContent = ctaT[l].contact;
            }
        });
    </script>
`;

// Remove old CTA if exists, then append
$faq('section').last().nextAll().remove();
$faq('#faq-container').parent().after(ctaHtml);

let newHtml = $faq.html();
// Restore escaped tags from Cheerio
newHtml = newHtml.replace(/&#x3E;/g, '>').replace(/&#x3C;/g, '<').replace(/&#x22;/g, '"');
fs.writeFileSync('faq.html', newHtml);
console.log('Updated faq.html with groups and CTA');
