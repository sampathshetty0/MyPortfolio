const http = require('http');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 3000;
const root = process.cwd();
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const server = http.createServer((req, res) => {
  const requestPath = req.url.split('?')[0].replace(/\/\/+/g, '/');
  let filePath = path.join(root, requestPath === '/' ? 'index.html' : requestPath);

  if (!path.extname(filePath)) {
    filePath = path.join(filePath, 'index.html');
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

function startServer(portToTry) {
  server.listen(portToTry, () => {
    console.log(`Server running at http://localhost:${portToTry}`);
  });
}

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const fallbackPort = Number(process.env.PORT || 3000) + 1;
    console.warn(`Port ${process.env.PORT || 3000} is in use. Trying ${fallbackPort}...`);
    startServer(fallbackPort);
  } else {
    console.error(err);
    process.exit(1);
  }
});

startServer(Number(process.env.PORT || 3000));
