import { createServer } from "node:http";
import handler from "../api/sync-progress.mjs";

const port = Number(process.env.API_PORT || 3001);
createServer(async (req, res) => {
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (value) => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(value)); return res; };
  if (req.url !== "/api/sync-progress") return res.status(404).json({ ok: false });
  try {
    let size = 0;
    const chunks = [];
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 1024 * 1024) return res.status(413).json({ ok: false, error: "Payload too large" });
      chunks.push(chunk);
    }
    req.body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString("utf8")) : {};
    await handler(req, res);
  } catch {
    if (!res.writableEnded) res.status(400).json({ ok: false, error: "Invalid JSON request" });
  }
}).listen(port, "0.0.0.0", () => console.log(`CodeShark API listening on port ${port}`));
