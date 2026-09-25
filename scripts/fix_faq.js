const fs = require('fs');
const cheerio = require('cheerio');

// 1. Reset faq.html from politique-retour.html
let html = fs.readFileSync('politique-retour.html', 'utf8');

const $ = cheerio.load(html, { decodeEntities: false });

// Update Head
$('title').text('Foire Aux Questions B2B | sotramsbois');
$('link[rel="canonical"]').attr('href', 'https://www.sotramsbois.com/faq.html');
$('link[hreflang="fr"]').attr('href', 'https://www.sotramsbois.com/faq.html');
$('link[hreflang="en"]').attr('href', 'https://www.sotramsbois.com/en/faq.html');
$('link[hreflang="de"]').attr('href', 'https://www.sotramsbois.com/de/faq.html');
$('link[hreflang="nl"]').attr('href', 'https://www.sotramsbois.com/nl/faq.html');
$('link[hreflang="x-default"]').attr('href', 'https://www.sotramsbois.com/faq.html');

// Replace main content
const mainContent = `
    <!-- Hero Section -->
    <section class="bg-surface-container py-16 md:py-24 relative overflow-hidden">
        <div class="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M54.627 0l1.373 1.373-1.373 1.373-1.373-1.373z\\' fill=\\'%23802813\\' fill-rule=\\'evenodd\\'/%3E%3C/svg%3E')]"></div>
        <div class="max-w-[1440px] mx-auto px-margin-desktop relative z-10 text-center">
            <h1 class="text-headline-xl font-headline-xl text-on-surface mb-6" data-i18n="faq.title">Foire Aux Questions</h1>
            <p class="text-body-lg font-body-lg text-on-surface-variant max-w-2xl mx-auto" data-i18n="faq.intro">
                Retrouvez les réponses aux questions fréquentes concernant nos produits, nos livraisons et notre politique B2B.
            </p>
        </div>
    </section>

    <!-- FAQ Container -->
    <section class="py-16 md:py-24 bg-surface">
        <div class="max-w-3xl mx-auto px-margin-desktop flex flex-col gap-4" id="faq-container">
            <!-- Loaded dynamically -->
        </div>
    </section>

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
        document.addEventListener('DOMContentLoaded', async () => {
            const lang = document.documentElement.lang || 'fr';
            const dataPath = window.resolveDataPath ? window.resolveDataPath('data/faq.json') : './data/faq.json';
            
            // Translations CTA
            const ctaT = {
              fr: { title: "Vous ne trouvez pas votre réponse ?", desc: "Nos conseillers sont à votre disposition pour toute demande spécifique concernant les gros volumes.", quote: "Demander un devis", contact: "Nous contacter" },
              en: { title: "Can\\'t find your answer?", desc: "Our advisors are at your disposal for any specific request concerning large volumes.", quote: "Request a quote", contact: "Contact us" },
              de: { title: "Finden Sie Ihre Antwort nicht?", desc: "Unsere Berater stehen Ihnen für spezifische Anfragen zu großen Mengen zur Verfügung.", quote: "Angebot anfordern", contact: "Kontaktieren Sie uns" },
              nl: { title: "Kunt u uw antwoord niet vinden?", desc: "Onze adviseurs staan tot uw beschikking voor specifieke verzoeken met betrekking tot grote volumes.", quote: "Offerte aanvragen", contact: "Neem contact op" }
            };
            
            if(ctaT[lang]) {
                const titleEl = document.getElementById('cta-faq-title');
                const descEl = document.getElementById('cta-faq-desc');
                const quoteEl = document.getElementById('cta-faq-quote');
                const contactEl = document.getElementById('cta-faq-contact');
                if (titleEl) titleEl.textContent = ctaT[lang].title;
                if (descEl) descEl.textContent = ctaT[lang].desc;
                if (quoteEl) quoteEl.textContent = ctaT[lang].quote;
                if (contactEl) contactEl.textContent = ctaT[lang].contact;
            }

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
    </script>
`;

$('main').html(mainContent);

let newHtml = $.html();
newHtml = newHtml.replace(/&#x3E;/g, '>').replace(/&#x3C;/g, '<').replace(/&#x22;/g, '"');

fs.writeFileSync('faq.html', newHtml);
console.log('Fixed faq.html');
