const fs = require('fs');

let content = fs.readFileSync('devis.html', 'utf8');

// Find where `urlQty` is used
const lines = content.split('\n');
const qtyIndex = lines.findIndex(l => l.includes('const urlQty = urlParams.get(\'qty\');'));

if (qtyIndex !== -1) {
    let endIndex = qtyIndex;
    for(let i = qtyIndex; i < qtyIndex + 5; i++) {
        if(lines[i].includes('qtyInput.value = urlQty;')) {
            endIndex = i;
            break;
        }
    }
    
    const replacement = `            const urlQtyRaw = urlParams.get('qty');
            if (urlQtyRaw) {
                let urlQty = parseInt(urlQtyRaw, 10);
                if (isNaN(urlQty)) urlQty = 1;
                qtyInput.value = Math.max(1, Math.min(999, urlQty));
            }`;
            
    lines.splice(qtyIndex, endIndex - qtyIndex + 1, replacement);
    fs.writeFileSync('devis.html', lines.join('\n'));
    console.log('Patched devis.html');
} else {
    console.log('urlQty not found in devis.html');
}
