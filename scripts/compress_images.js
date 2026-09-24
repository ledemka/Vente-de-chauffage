const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const imagesDir = path.join(__dirname, '../assets/images');
const backupDir = path.join(__dirname, '../assets/images_backup');

if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
}

async function processDirectory(dir, relativePath = '') {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const relFilePath = path.join(relativePath, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            await processDirectory(fullPath, relFilePath);
        } else if (file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg')) {
            const backupPath = path.join(backupDir, relFilePath);
            const backupDirPath = path.dirname(backupPath);
            if (!fs.existsSync(backupDirPath)) {
                fs.mkdirSync(backupDirPath, { recursive: true });
            }
            // Copy to backup if not already there
            if (!fs.existsSync(backupPath)) {
                fs.copyFileSync(fullPath, backupPath);
            }
            
            // Recompress
            const tempPath = fullPath + '.tmp';
            try {
                await sharp(backupPath)
                    .resize({ width: 1600, withoutEnlargement: true })
                    .jpeg({ quality: 78, progressive: true })
                    .toFile(tempPath);
                
                fs.renameSync(tempPath, fullPath);
                console.log(`Compressed: ${relFilePath}`);
            } catch (err) {
                console.error(`Error processing ${relFilePath}:`, err);
                if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
            }
        }
    }
}

async function run() {
    console.log('Starting image compression...');
    await processDirectory(imagesDir);
    console.log('Finished image compression.');
}

run();
