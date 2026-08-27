const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist-production');

// List of expected 9 pages per language
const PAGES = [
    'index.html',
    'catalogue.html',
    'livraison.html',
    'avis-clients.html',
    'guide-choix.html',
    'devis.html',
    'politique-retour.html',
    'blog.html',
    'contact.html'
];

const LANGS = ['fr', 'en', 'de', 'nl'];

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();

    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach(childItemName => {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else if (exists) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(src, dest);
    }
}

console.log('=== BUILD START: Packaging to dist-production ===');

// Clear / recreate dist-production
if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DIST_DIR, { recursive: true });

// Copy Assets, Data, API
['assets', 'data', 'api'].forEach(dir => {
    const srcPath = path.join(ROOT_DIR, dir);
    if (fs.existsSync(srcPath)) {
        copyRecursiveSync(srcPath, path.join(DIST_DIR, dir));
        console.log(`[Copied Directory]: ${dir} -> dist-production/${dir}`);
    }
});

// Copy 36 HTML Pages (9 Pages x 4 Languages)
let totalCopied = 0;

LANGS.forEach(lang => {
    PAGES.forEach(page => {
        const srcPath = lang === 'fr' ? path.join(ROOT_DIR, page) : path.join(ROOT_DIR, lang, page);
        const distPath = lang === 'fr' ? path.join(DIST_DIR, page) : path.join(DIST_DIR, lang, page);

        if (fs.existsSync(srcPath)) {
            fs.mkdirSync(path.dirname(distPath), { recursive: true });
            fs.copyFileSync(srcPath, distPath);
            totalCopied++;
        } else {
            console.warn(`[WARNING]: Missing page source: ${srcPath}`);
        }
    });
});

console.log(`\n=== BUILD COMPLETE: ${totalCopied} HTML files deployed to dist-production/ ===`);
