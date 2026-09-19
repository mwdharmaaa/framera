import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.json': 'application/json'
};

const DRAFTS_DIR = path.join(process.cwd(), '.data', 'drafts');
if (!fs.existsSync(DRAFTS_DIR)) {
  fs.mkdirSync(DRAFTS_DIR, { recursive: true });
}

function setSecurityHeaders(res, contentType = 'application/octet-stream') {
  res.writeHead(res.statusCode || 200, {
    'Content-Type': contentType,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'SAMEORIGIN',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    setSecurityHeaders(res, 'text/plain');
    res.end();
    return;
  }

  const cleanUrl = req.url ? req.url.split('?')[0] : '/';

  // API Endpoint: POST /api/drafts
  if (req.method === 'POST' && cleanUrl === '/api/drafts') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 5 * 1024 * 1024) {
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const draftId = crypto.randomBytes(6).toString('hex');
        const draftFile = path.join(DRAFTS_DIR, `${draftId}.json`);
        fs.writeFileSync(draftFile, JSON.stringify({ ...payload, createdAt: Date.now() }));
        res.statusCode = 201;
        setSecurityHeaders(res, 'application/json');
        res.end(JSON.stringify({ id: draftId, url: `/?draft=${draftId}` }));
      } catch {
        res.statusCode = 400;
        setSecurityHeaders(res, 'application/json');
        res.end(JSON.stringify({ error: 'Invalid JSON payload' }));
      }
    });
    return;
  }

  // API Endpoint: GET /api/drafts/:id
  if (req.method === 'GET' && cleanUrl.startsWith('/api/drafts/')) {
    const draftId = cleanUrl.replace('/api/drafts/', '').replace(/[^a-zA-Z0-9_-]/g, '');
    const draftFile = path.join(DRAFTS_DIR, `${draftId}.json`);
    if (draftId && fs.existsSync(draftFile)) {
      const data = fs.readFileSync(draftFile, 'utf-8');
      setSecurityHeaders(res, 'application/json');
      res.end(data);
    } else {
      res.statusCode = 404;
      setSecurityHeaders(res, 'application/json');
      res.end(JSON.stringify({ error: 'Draft not found' }));
    }
    return;
  }

  // Static File Serving
  const relativePath = cleanUrl === '/' ? 'index.html' : cleanUrl.replace(/^\/+/, '');
  const filePath = path.join(process.cwd(), relativePath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      setSecurityHeaders(res, 'text/plain');
      res.end('Not Found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    setSecurityHeaders(res, contentType);
    res.end(data);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Framera server listening on http://localhost:${PORT}`);
});
