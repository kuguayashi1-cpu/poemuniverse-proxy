export default async function handler(req, res) {
  // CORS
  const allowedOrigins = new Set([
    'https://sparkly-begonia-5965ed.netlify.app',
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ]);
  const origin = req.headers.origin || '';
  if (allowedOrigins.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-warmup');
  res.setHeader('Access-Control-Max-Age', '600');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Warmup
  const isWarmup = (req.method === 'GET') && (req.query.warmup || req.headers['x-warmup']);
  if (isWarmup) {
    return res.status(200).json({ ok: true, warm: true, ts: Date.now() });
  }

  const baseUrl = (process.env.MOONSHOT_BASE_URL || 'https://api.moonshot.cn/v1').replace(/\/$/, '');
  // 为了安全，不在前端暴露 token。建议将 token 配置在 Vercel 环境变量 MOONSHOT_API_KEY。
  const apiKey = process.env.MOONSHOT_API_KEY || '';

  try {
    if (req.method === 'GET') {
      // Lightweight health check to avoid cold starts
      const resp = await fetch(baseUrl + '/models', {
        method: 'GET',
        headers: apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}
      });
      const contentType = resp.headers.get('content-type') || '';
      if (resp.ok && contentType.includes('application/json')) {
        const data = await resp.json();
        return res.status(200).json({ ok: true, modelsCount: Array.isArray(data.data) ? data.data.length : undefined });
      }
      const text = await resp.text();
      return res.status(resp.status || 502).json({ ok: false, note: 'models check failed', snippet: text.slice(0, 300) });
    }

    if (req.method === 'POST') {
      const target = baseUrl + '/chat/completions';
      const headers = { 'Content-Type': 'application/json' };
      if (apiKey) headers['Authorization'] = `Bearer ${apiKey}`;
      const upstream = await fetch(target, {
        method: 'POST',
        headers,
        body: JSON.stringify(req.body || {})
      });
      const ct = upstream.headers.get('content-type') || '';
      const body = ct.includes('application/json') ? await upstream.json() : await upstream.text();
      return res.status(upstream.status).send(body);
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Proxy error', message: String(err && err.message || err) });
  }
}
