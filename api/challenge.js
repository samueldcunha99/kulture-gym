export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const a = Math.floor(Math.random() * 8) + 2;
  const b = Math.floor(Math.random() * 8) + 1;
  const sum = a + b;
  const token = Buffer.from(`${sum}:${Date.now()}`).toString('base64');

  res.status(200).json({
    id: token,
    question: `What is ${a} + ${b}?`
  });
}
