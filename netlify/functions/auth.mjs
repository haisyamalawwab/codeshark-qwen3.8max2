import { handleBetterAuthWebRequest } from "../../server/better-auth.mjs";
import { isLocalMode, cloudDisabledResponse } from "../../server/local-mode.mjs";

// Netlify catch-all: /api/auth/* → /.netlify/functions/auth/*.
// Fungsi legacy Netlify bukan Node req/res sungguhan, jadi event diubah ke
// Web Request dan Web Response dari auth.handler diubah kembali ke format
// lambda (termasuk banyak header Set-Cookie lewat multiValueHeaders).

function requestUrl(event) {
  if (event.rawUrl) {
    const url = new URL(event.rawUrl);
    url.pathname = url.pathname.replace(/^\/.netlify\/functions\/auth/, "/api/auth");
    return url;
  }
  const headers = event.headers || {};
  const proto = headers["x-forwarded-proto"] || headers["X-Forwarded-Proto"] || "https";
  const host = headers.host || headers.Host || "localhost";
  const rawPath = event.path || "/.netlify/functions/auth";
  const path = rawPath
    .replace(/^\/.netlify\/functions\/auth/, "/api/auth")
    .replace(/^\/?/, "/");
  const query = event.rawQuery ? `?${event.rawQuery}` : "";
  return new URL(`${proto}://${host}${path}${query}`);
}

function requestHeaders(event) {
  const headers = new Headers();
  for (const [name, value] of Object.entries(event.headers || {})) {
    if (value !== undefined) headers.set(name, value);
  }
  for (const [name, values] of Object.entries(event.multiValueHeaders || {})) {
    if (!Array.isArray(values)) continue;
    headers.delete(name);
    for (const value of values) headers.append(name, value);
  }
  headers.delete("content-length");
  return headers;
}

async function lambdaResponse(response) {
  const headers = {};
  const multiValueHeaders = {};
  const cookies = typeof response.headers.getSetCookie === "function" ? response.headers.getSetCookie() : [];
  if (cookies.length) multiValueHeaders["Set-Cookie"] = cookies;

  for (const [name, value] of response.headers.entries()) {
    if (name.toLowerCase() === "set-cookie") {
      if (!cookies.length && value) multiValueHeaders["Set-Cookie"] = [value];
      continue;
    }
    headers[name] = value;
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get("content-type") || "";
  const textual = !bytes.length || /^(text\/|application\/(json|javascript|xml|x-www-form-urlencoded)|image\/svg\+xml)/i.test(contentType);
  return {
    statusCode: response.status,
    headers,
    ...(Object.keys(multiValueHeaders).length ? { multiValueHeaders } : {}),
    body: textual ? bytes.toString("utf8") : bytes.toString("base64"),
    isBase64Encoded: !textual,
  };
}

export function createNetlifyBetterAuthHandler(dependencies = {}) {
  const { env = process.env, handle = handleBetterAuthWebRequest } = dependencies;
  return async (event) => {
    if (isLocalMode(env)) return cloudDisabledResponse();

    const method = String(event.httpMethod || "GET").toUpperCase();
    const rawBody = event.isBase64Encoded
      ? Buffer.from(event.body || "", "base64")
      : Buffer.from(event.body || "", "utf8");
    const request = new Request(requestUrl(event), {
      method,
      headers: requestHeaders(event),
      ...(method === "GET" || method === "HEAD" || rawBody.length === 0 ? {} : { body: rawBody }),
    });

    const response = await handle(request, env, dependencies.authDeps ?? {});
    return lambdaResponse(response);
  };
}

export const handler = createNetlifyBetterAuthHandler();
