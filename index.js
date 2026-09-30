import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDir = path.join(__dirname, 'dist', 'client');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json'
};

export default async function handler(req, res) {
  try {
    const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
    let pathname = decodeURIComponent(url.pathname);

    // If root or directory, append index.html
    if (pathname === '/' || pathname.endsWith('/')) {
      pathname = path.join(pathname, 'index.html');
    } else if (!path.extname(pathname)) {
      pathname = path.join(pathname, 'index.html');
    }

    let filePath = path.join(clientDir, pathname);
    if (!filePath.startsWith(clientDir)) {
      res.statusCode = 403;
      return res.end('Forbidden');
    }

    let data;
    try {
      data = await readFile(filePath);
    } catch {
      // Fallback: try adding index.html if not already tried
      filePath = path.join(clientDir, 'index.html');
      data = await readFile(filePath);
    }

    const ext = path.extname(filePath);
    res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.statusCode = 200;
    return res.end(data);
  } catch (err) {
    res.statusCode = 500;
    return res.end('Internal Server Error');
  }
}
