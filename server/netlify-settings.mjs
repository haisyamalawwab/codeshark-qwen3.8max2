import { createSettingsHandler } from './site-settings.mjs';
export function createNetlifySettingsHandler(options = {}) {
  const handle = createSettingsHandler(options);
  return async event => {
    const response = { statusCode: 200, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: '' };
    const res = {
      setHeader(key, value) { response.headers[key] = value; },
      status(code) { response.statusCode = code; return this; },
      json(value) { response.body = JSON.stringify(value); return response; },
    };
    let body;
    try {
      const raw = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : event.body || '';
      if (Buffer.byteLength(raw) > 16384) return res.status(413).json({ ok: false, error: 'Payload too large' });
      body = raw ? JSON.parse(raw) : undefined;
    } catch { return res.status(400).json({ ok: false, error: 'Invalid JSON' }); }
    await handle({ method: event.httpMethod, headers: Object.fromEntries(Object.entries(event.headers || {}).map(([k, v]) => [k.toLowerCase(), v])), body }, res);
    return response;
  };
}
