const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();

const DIRS = ['.', 'en', 'de', 'nl'];
const TAWK_SCRIPT = `
<!--Start of Tawk.to Script-->
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/6aa9c1a47279f83441fe808e/1k2jhoqlg';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
</script>
<!--End of Tawk.to Script-->
`;

function processDir(dir) {
    const p = path.join(ROOT, dir);
    if (!fs.existsSync(p)) return;
    const files = fs.readdirSync(p);
    for (const f of files) {
        if (f.endsWith('.html')) {
            const fp = path.join(p, f);
            let html = fs.readFileSync(fp, 'utf8');
            if (!html.includes('Tawk_API')) {
                html = html.replace('</body>', TAWK_SCRIPT + '\n</body>');
                fs.writeFileSync(fp, html);
                console.log(`Injected Tawk.to in ${fp}`);
            }
        }
    }
}

for (const d of DIRS) {
    processDir(d);
}
console.log("Injection complete.");
