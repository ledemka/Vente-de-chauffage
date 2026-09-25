const fs = require('fs');
const path = require('path');

const i18nFrPath = path.join(__dirname, '../data/i18n/fr.json');
const frData = JSON.parse(fs.readFileSync(i18nFrPath, 'utf8'));

function flatten(obj, prefix = '') {
    let res = {};
    for (let k in obj) {
        if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
            Object.assign(res, flatten(obj[k], prefix + k + '.'));
        } else {
            res[prefix + k] = obj[k];
        }
    }
    return res;
}

const flatFr = flatten(frData);
const keysInFr = new Set(Object.keys(flatFr));
const foundKeys = new Set();

const rootDir = path.join(__dirname, '..');
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

const jsDir = path.join(rootDir, 'assets/js');
let jsFiles = [];
if (fs.existsSync(jsDir)) {
    jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js')).map(f => path.join('assets/js', f));
}

function processFile(file) {
    const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
    
    // HTML data-i18n
    const htmlMatches = content.matchAll(/data-i18n(?:-[a-z]+)?="([^"]+)"/g);
    for (const match of htmlMatches) {
        foundKeys.add(match[1]);
    }
    
    // JS window.i18n.t
    const jsMatches = content.matchAll(/(?:window\.)?i18n\.t\(['"]([^'"]+)['"]/g);
    for (const match of jsMatches) {
        foundKeys.add(match[1]);
    }
}

htmlFiles.forEach(processFile);
jsFiles.forEach(processFile);

const missing = [];
for (const key of foundKeys) {
    if (!keysInFr.has(key)) {
        missing.push(key);
    }
}

console.log('Missing keys:', missing);
