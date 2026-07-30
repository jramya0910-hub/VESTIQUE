const http = require('http');
const fs   = require('fs');
const path = require('path');

const base = path.join(process.cwd(), 'vestique');
const mime = {
  html: 'text/html',
  css:  'text/css',
  js:   'application/javascript',
  png:  'image/png',
  jpg:  'image/jpeg',
  svg:  'image/svg+xml',
};

const server = http.createServer((req, res) => {
  let p  = req.url === '/' ? '/index.html' : req.url;
  const fp = path.join(base, p);
  try {
    const data = fs.readFileSync(fp);
    const ext  = fp.split('.').pop();
    res.writeHead(200, { 'Content-Type': mime[ext] || 'text/plain' });
    res.end(data);
  } catch (e) {
    res.writeHead(404);
    res.end('Not found: ' + p);
  }
});

server.listen(5500, () => {
  console.log('Vestique dev server running at http://localhost:5500');
});
