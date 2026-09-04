const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dirs = ['.', 'en', 'de', 'nl'];

let modifiedCount = 0;

for (const dir of dirs) {
    const fullPath = path.join(rootDir, dir);
    if (!fs.existsSync(fullPath)) continue;
    
    const filePath = path.join(fullPath, 'produit.html');
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        // 1. Add id="btn-commander"
        content = content.replace(
            /<button\s+class="w-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md uppercase tracking-wider py-4 rounded-md transition-colors flex items-center justify-center gap-2 shadow-md">/g,
            '<button id="btn-commander" class="w-full bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md uppercase tracking-wider py-4 rounded-md transition-colors flex items-center justify-center gap-2 shadow-md">'
        );
        
        // 2. Add id="btn-devis"
        content = content.replace(
            /<button\s+class="w-full bg-transparent border-2 border-outline hover:border-primary text-on-surface font-label-md text-label-md uppercase tracking-wider py-3\.5 rounded-md transition-colors flex items-center justify-center gap-2">/g,
            '<button id="btn-devis" class="w-full bg-transparent border-2 border-outline hover:border-primary text-on-surface font-label-md text-label-md uppercase tracking-wider py-3.5 rounded-md transition-colors flex items-center justify-center gap-2">'
        );
        
        // 3. Inject cart.js script next to i18n-loader.js if not already present
        if (!content.includes('cart.js')) {
            content = content.replace(
                /(<script src="([^"]*)i18n-loader\.js"><\/script>)/g,
                '$1\n<script src="$2cart.js"></script>'
            );
        }
        
        // 4. Inject button logic if not already present
        if (!content.includes('btn-commander\');')) {
            const insertionPoint = `qtyInput.addEventListener('input', () => {
                                    updatePricing();
                                });

                                updatePricing();`;
                                
            const newLogic = `qtyInput.addEventListener('input', () => {
                                    updatePricing();
                                });

                                updatePricing();

                                const btnCommander = document.getElementById('btn-commander');
                                if (btnCommander) {
                                    btnCommander.addEventListener('click', async () => {
                                        const qty = parseInt(qtyInput.value) || 1;
                                        if (window.CartAPI) {
                                            const originalText = btnCommander.innerHTML;
                                            btnCommander.innerHTML = '<span class="material-symbols-outlined animate-spin">autorenew</span>';
                                            try {
                                                await window.CartAPI.add(product.id, qty);
                                                window.location.href = './panier.html';
                                            } catch (e) {
                                                console.error(e);
                                                btnCommander.innerHTML = originalText;
                                            }
                                        }
                                    });
                                }

                                const btnDevis = document.getElementById('btn-devis');
                                if (btnDevis) {
                                    btnDevis.addEventListener('click', () => {
                                        window.location.href = './devis.html?product=' + product.id;
                                    });
                                }`;
                                
            content = content.replace(insertionPoint, newLogic);
        }
        
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Fixed ${path.join(dir, 'produit.html')}`);
            modifiedCount++;
        }
    }
}

console.log(`Modified ${modifiedCount} files.`);
