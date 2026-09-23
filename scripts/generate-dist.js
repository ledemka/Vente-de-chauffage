const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.join(ROOT_DIR, 'dist-production');

const PAGES = fs.readdirSync(ROOT_DIR).filter(f => f.endsWith('.html'));

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

if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DIST_DIR, { recursive: true });

['assets', 'data', 'api'].forEach(dir => {
    const srcPath = path.join(ROOT_DIR, dir);
    if (fs.existsSync(srcPath)) {
        copyRecursiveSync(srcPath, path.join(DIST_DIR, dir));
        console.log(`[Copied Directory]: ${dir} -> dist-production/${dir}`);
    }
});

// Also copy root favicon if present
const rootFavicon = path.join(ROOT_DIR, 'favicon.ico');
if (fs.existsSync(rootFavicon)) {
    fs.copyFileSync(rootFavicon, path.join(DIST_DIR, 'favicon.ico'));
    console.log(`[Copied File]: favicon.ico -> dist-production/favicon.ico`);
}

// Copy sitemap.xml and robots.txt if present
['sitemap.xml', 'robots.txt'].forEach(file => {
    const src = path.join(ROOT_DIR, file);
    if (fs.existsSync(src)) {
        fs.copyFileSync(src, path.join(DIST_DIR, file));
        console.log(`[Copied File]: ${file} -> dist-production/${file}`);
    }
});


let totalCopied = 0;

LANGS.forEach(lang => {
    PAGES.forEach(page => {
        // ALWAYS read from the FR root source file!
        const srcPath = path.join(ROOT_DIR, page);
        const distPath = lang === 'fr' ? path.join(DIST_DIR, page) : path.join(DIST_DIR, lang, page);

        if (fs.existsSync(srcPath)) {
            fs.mkdirSync(path.dirname(distPath), { recursive: true });
            
            if (lang === 'fr') {
                fs.copyFileSync(srcPath, distPath);
            } else {
                let content = fs.readFileSync(srcPath, 'utf8');
                
                // 1. Replace <html lang="fr"
                content = content.replace(/<html[^>]*lang="[^"]*"[^>]*>/i, (match) => {
                    return match.replace(/lang="[^"]*"/i, `lang="${lang}"`);
                });
                
                // 3. Fix relative paths to assets, data, api
                // Root files use href="./assets/css..." or fetch('./data/...') -> Subdirs use ../
                // We match any string starting with ./assets/, ./data/, or ./api/ 
                // and replace the ./ with ../
                content = content.replace(/(['"]).\/(assets|data|api)\//g, `$1../$2/`);
                
                // 4. Fix language switcher links
                // Language links do not use ./, they are written as href="page.html" or href="en/page.html"
                // To work from within a language subdir, they must point back to root.
                content = content.replace(new RegExp(`href="${page}"`, 'g'), `href="../${page}"`);
                content = content.replace(new RegExp(`href="en/${page}"`, 'g'), `href="../en/${page}"`);
                content = content.replace(new RegExp(`href="de/${page}"`, 'g'), `href="../de/${page}"`);
                content = content.replace(new RegExp(`href="nl/${page}"`, 'g'), `href="../nl/${page}"`);
                
                fs.writeFileSync(distPath, content);
                
                // ALSO write to the root for local development convenience (e.g. localhost/en/index.html)
                // These root folders (en, de, nl) are gitignored.
                const localDevPath = path.join(ROOT_DIR, lang, page);
                fs.mkdirSync(path.dirname(localDevPath), { recursive: true });
                fs.writeFileSync(localDevPath, content);
            }
            totalCopied++;
        } else {
            console.warn(`[WARNING]: Missing page source: ${srcPath}`);
        }
    });
});

console.log(`\n=== BUILD COMPLETE: ${totalCopied} HTML files deployed to dist-production/ ===`);
