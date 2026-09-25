const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesToCompress = [
    'hero/hero-carousel-5.jpg',
    'blog/blog-rupture-approvisionnement.jpg',
    'blog/blog-stockage-palettes.jpg',
    'guide/guide-stockage-bois.jpg',
    'guide/guide-protection.jpg',
    'guide/guide-choisir-bois.jpg'
];

async function compressImages() {
    let totalBefore = 0;
    let totalAfter = 0;

    for (const relPath of imagesToCompress) {
        const fullPath = path.join(__dirname, '../assets/images', relPath);
        if (!fs.existsSync(fullPath)) {
            console.log('File not found:', fullPath);
            continue;
        }

        const statsBefore = fs.statSync(fullPath);
        totalBefore += statsBefore.size;

        const tempPath = fullPath + '.tmp.jpg';

        await sharp(fullPath)
            .resize({ width: 1600, withoutEnlargement: true })
            .jpeg({ quality: 78, progressive: true })
            .toFile(tempPath);

        const statsAfter = fs.statSync(tempPath);
        totalAfter += statsAfter.size;

        fs.renameSync(tempPath, fullPath);
        
        console.log(`Compressed ${relPath}: ${(statsBefore.size / 1024).toFixed(1)} KB -> ${(statsAfter.size / 1024).toFixed(1)} KB`);
    }

    console.log(`Total saved on these 6 images: ${((totalBefore - totalAfter) / 1024).toFixed(1)} KB`);
}

compressImages().catch(console.error);
