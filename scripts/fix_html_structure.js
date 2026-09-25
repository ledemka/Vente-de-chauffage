const fs = require('fs');
const path = require('path');

const files = fs.readdirSync(__dirname + '/..').filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    let html = fs.readFileSync(filePath, 'utf8');

    // 1. Remove BOM and literal \n artifacts
    html = html.replace(/\uFEFF/g, '');
    html = html.replace(/\\n\s*</g, '\n<');

    // 2. Check tags in <body>
    const headMatch = html.match(/<head>([\s\S]*?)<\/head>/i);
    const bodyStartMatch = html.match(/<body[^>]*>/i);
    if (headMatch && bodyStartMatch) {
        const bodyStartIdx = bodyStartMatch.index + bodyStartMatch[0].length;
        
        // Find the first visible element
        const firstVisibleMatch = html.substring(bodyStartIdx).match(/<(header|main|nav|div|footer|svg|h1|h2|h3|p|ul|li|section)\b/i);
        
        if (firstVisibleMatch) {
            const firstVisibleIdx = bodyStartIdx + firstVisibleMatch.index;
            const bodyPrefix = html.substring(bodyStartIdx, firstVisibleIdx);
            
            // If bodyPrefix contains meta, style, link, or script we should move everything inside it to head
            if (bodyPrefix.includes('<meta') || bodyPrefix.includes('<style') || bodyPrefix.includes('<link') || bodyPrefix.includes('<script')) {
                html = html.substring(0, headMatch.index) + 
                       '<head>\n' + headMatch[1] + '\n' + bodyPrefix.trim() + '\n</head>' +
                       html.substring(headMatch.index + headMatch[0].length, bodyStartIdx) +
                       html.substring(firstVisibleIdx);
            }
        }
    }

    // 3. Ensure DOCTYPE
    if (!html.trimStart().toLowerCase().startsWith('<!doctype html>')) {
        html = '<!DOCTYPE html>\n' + html.trimStart();
    }

    fs.writeFileSync(filePath, html, 'utf8');
});

console.log('HTML structure fixed properly including partially filled heads and literal \\n.');
