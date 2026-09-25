const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

for (let file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('<nav class="hidden lg:flex items-center gap-8">')) {
    content = content.replace('<nav class="hidden lg:flex items-center gap-8">', '<nav class="hidden lg:flex items-center gap-8 uppercase">');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file} desktop nav`);
  }
  
  if (content.includes('<nav class="flex flex-col gap-6 mt-8 pb-12 px-6">')) {
     content = content.replace('<nav class="flex flex-col gap-6 mt-8 pb-12 px-6">', '<nav class="flex flex-col gap-6 mt-8 pb-12 px-6 uppercase">');
     fs.writeFileSync(file, content, 'utf8');
     console.log(`Updated ${file} mobile nav`);
  }
}
console.log('Done modifying nav uppercase.');
