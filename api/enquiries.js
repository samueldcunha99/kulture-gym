import crypto from 'node:crypto';

export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
  const challenge = data.challenge;
  const answer = String(data.answer || '').trim();

  if (challenge) {
    try {
      const decoded = Buffer.from(challenge, 'base64').toString('utf8');
      const [expectedAnswer] = decoded.split(':');
      if (expectedAnswer && answer !== expectedAnswer) {
        return res.status(400).json({ error: 'The quick check is incorrect. Please try again.' });
      }
    } catch {
      // Continue if format differs
    }
  }

  const id = data.id || crypto.randomUUID();
  return res.status(201).json({ id, status: 'New' });
}
