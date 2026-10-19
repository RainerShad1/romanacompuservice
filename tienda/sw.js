/* Service worker mínimo para que la tienda se pueda instalar como app.
   No guarda copias de la tienda: siempre carga la versión más nueva del servidor,
   y solo muestra un aviso si el teléfono no tiene conexión. */
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

const OFFLINE = `<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Sin conexión</title><body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#0a0a0a;color:#fff;font-family:system-ui,sans-serif;text-align:center;padding:24px">
<div><div style="font-size:44px">📶</div><h1 style="color:#fffc3a;margin:12px 0 6px">Sin conexión</h1>
<p style="color:#bdbdb6;margin:0 0 18px">Revisa tu internet para ver la tienda de Romana CompuService.</p>
<button onclick="location.reload()" style="font:inherit;font-weight:700;background:#fffc3a;color:#0a0a0a;border:0;border-radius:12px;padding:12px 18px">Reintentar</button></div></body></html>`;

self.addEventListener("fetch", (e) => {
  if (e.request.mode !== "navigate") return;
  e.respondWith(fetch(e.request).catch(() => new Response(OFFLINE, { headers: { "Content-Type": "text/html; charset=utf-8" } })));
});
