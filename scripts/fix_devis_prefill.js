const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const dirs = ['.', 'en', 'de', 'nl'];

let modifiedCount = 0;

for (const dir of dirs) {
    const fullPath = path.join(rootDir, dir);
    if (!fs.existsSync(fullPath)) continue;
    
    const filePath = path.join(fullPath, 'devis.html');
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Prevent duplicate insertion
        if (content.includes('urlParams.get(\'product\')')) {
            continue;
        }

        const scriptToInject = `
        <script>
            document.addEventListener('DOMContentLoaded', () => {
                const urlParams = new URLSearchParams(window.location.search);
                const productId = urlParams.get('product');
                if (productId) {
                    const dataPath = window.location.pathname.includes('/en/') || window.location.pathname.includes('/de/') || window.location.pathname.includes('/nl/') 
                        ? '../data/products.json' 
                        : './data/products.json';
                        
                    fetch(dataPath).then(r => r.json()).then(products => {
                        const p = products.find(x => x.id === productId);
                        if (p) {
                            const selectProd = document.getElementById('product_type');
                            if (selectProd) {
                                let opt = selectProd.querySelector(\`option[value="\${p.id}"]\`);
                                if (!opt) {
                                    opt = document.createElement('option');
                                    opt.value = p.id;
                                    opt.textContent = p.name;
                                    selectProd.appendChild(opt);
                                }
                                selectProd.value = p.id;
                            }

                            const selectFmt = document.getElementById('format');
                            if (selectFmt) {
                                let fmtOpt = selectFmt.querySelector(\`option[value="\${p.format}"]\`);
                                if (!fmtOpt) {
                                    fmtOpt = document.createElement('option');
                                    fmtOpt.value = p.format;
                                    fmtOpt.textContent = p.format;
                                    selectFmt.appendChild(fmtOpt);
                                }
                                selectFmt.value = p.format;
                            }
                        }
                    }).catch(e => console.error('Erreur pré-remplissage devis:', e));
                }
            });
        </script>
</body>`;

        // Inject right before </body>
        content = content.replace(/<\/body>/, scriptToInject);
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${path.join(dir, 'devis.html')}`);
        modifiedCount++;
    }
}

console.log(`Modified ${modifiedCount} files.`);
