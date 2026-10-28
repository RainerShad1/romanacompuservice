/* Enlace de un producto (/p/35-laptop-dell…): devuelve la misma tienda, pero con la
   vista previa (WhatsApp, Facebook…) de ese producto: su foto, su título y su precio.
   La tienda abre el producto sola al cargar. Si algo falla, sirve la tienda normal. */

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

module.exports = async (req, res) => {
  const base = `https://${req.headers["x-forwarded-host"] || req.headers.host}`;
  const id = parseInt(String(req.query.slug || ""), 10);
  let html = await (await fetch(`${base}/`)).text();

  try {
    if (!id) throw new Error("sin producto");
    // Mismas llaves públicas y mismo organizador de títulos que usa la tienda
    const [cuentas, fichaJs] = await Promise.all([fetch(`${base}/cuentas.js`).then((r) => r.text()), fetch(`${base}/ficha.js`).then((r) => r.text())]);
    const url = cuentas.match(/SUPABASE_URL = "([^"]+)"/)[1];
    const key = cuentas.match(/SUPABASE_KEY = "([^"]+)"/)[1];
    const Ficha = new Function(`${fichaJs}; return Ficha;`)();
    const head = { apikey: key, Authorization: `Bearer ${key}` };
    const [[p], [cfg]] = await Promise.all([
      fetch(`${url}/rest/v1/products?id=eq.${id}&oculto=eq.false&select=id,nombre,cat,precio,oferta,img,stock`, { headers: head }).then((r) => r.json()),
      fetch(`${url}/rest/v1/settings?id=eq.1&select=data`, { headers: head }).then((r) => r.json()),
    ]);
    if (!p) throw new Error("no existe");

    const c = (cfg && cfg.data) || {};
    const f = Ficha.de(p.nombre, p.cat);
    const precio = p.oferta ? Math.round((p.precio * (1 - (c.descuento || 0) / 100)) / 5) * 5 : Number(p.precio);
    const money = `${c.moneda || "RD$"}${precio.toLocaleString("en-US")}`;
    const titulo = `${f.titulo} · ${money}`;
    const desc = [f.resumen.join(" · "), f.condicion, p.stock > 0 ? "Disponible" : "Agotado por ahora", c.marca || "Romana CompuService"].filter(Boolean).join(" · ");
    const pagina = `${base}/p/${encodeURIComponent(String(req.query.slug))}`;

    const set = (re, val) => { html = html.replace(re, val); };
    set(/<title>[^<]*<\/title>/, `<title>${esc(f.titulo)} · ${esc(c.marca || "Romana CompuService")}</title>`);
    set(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(desc)}">`);
    set(/<meta property="og:type" content="[^"]*">/, `<meta property="og:type" content="product">`);
    set(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(titulo)}">`);
    set(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(desc)}">`);
    set(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${esc(pagina)}">`);
    if (p.img) {
      set(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${esc(p.img)}">`);
      set(/<meta name="twitter:image" content="[^"]*">/, `<meta name="twitter:image" content="${esc(p.img)}">`);
      set(/<meta property="og:image:width"[^>]*>\s*<meta property="og:image:height"[^>]*>\s*/, "");
      set(/<meta property="og:image:alt" content="[^"]*">/, `<meta property="og:image:alt" content="${esc(f.titulo)}">`);
    }
    res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=86400");
  } catch {
    res.setHeader("Cache-Control", "public, s-maxage=60");
  }
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.status(200).send(html);
};
