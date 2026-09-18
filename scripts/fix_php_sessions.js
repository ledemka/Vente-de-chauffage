const fs = require('fs');
const files = fs.readdirSync('api').filter(f => f.endsWith('.php'));

files.forEach(f => {
    let path = 'api/' + f;
    let content = fs.readFileSync(path, 'utf8');
    if (content.includes('session_set_cookie_params')) {
        content = content.replace(/session_set_cookie_params\([^)]+\);/g, '// session_set_cookie_params commented out for localhost compatibility');
        fs.writeFileSync(path, content);
        console.log('Fixed ' + path);
    }
});
