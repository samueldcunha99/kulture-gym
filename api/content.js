import { initialContent } from '../default-content.mjs';

export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json(initialContent);
}
