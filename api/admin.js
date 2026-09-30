import { initialContent } from '../default-content.mjs';

export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  res.status(200).json({
    auth: { user: 'owner', owner: true, email: 'Owner' },
    leads: [],
    metrics: [
      { key: 'trial_requests', count: 0 },
      { key: 'whatsapp', count: 0 },
      { key: 'call', count: 0 }
    ],
    staff: [],
    content: initialContent
  });
}
