const cheerio = require('cheerio');
const html = `<!DOCTYPE html><html><head><meta name="robots"><script>var a=1;</script><meta charset="utf-8"><style>body{}</style></head><body><h1>Hello</h1></body></html>`;
const $ = cheerio.load(html, { decodeEntities: false });
console.log($.html());
