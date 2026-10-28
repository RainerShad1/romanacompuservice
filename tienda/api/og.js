/* Foto de la vista previa al compartir un producto (/api/og?id=35).
   WhatsApp no muestra fotos WebP, así que se convierte a JPG de 1200×630:
   la foto completa al centro sobre la misma foto desenfocada, como en la tienda. */
const sharp = require("sharp");

const W = 1200, H = 630;

module.exports = async (req, res) => {
  const base = `https://${req.headers["x-forwarded-host"] || req.headers.host}`;
  const id = parseInt(String(req.query.id || ""), 10);
  try {
    if (!id) throw new Error("sin producto");
    const cuentas = await fetch(`${base}/cuentas.js`).then((r) => r.text());
    const url = cuentas.match(/SUPABASE_URL = "([^"]+)"/)[1];
    const key = cuentas.match(/SUPABASE_KEY = "([^"]+)"/)[1];
    const [p] = await fetch(`${url}/rest/v1/products?id=eq.${id}&oculto=eq.false&select=img`, { headers: { apikey: key, Authorization: `Bearer ${key}` } }).then((r) => r.json());
    if (!p || !p.img) throw new Error("sin foto");

    const foto = Buffer.from(await (await fetch(p.img)).arrayBuffer());
    const fondo = await sharp(foto).resize(W, H, { fit: "cover" }).blur(28).modulate({ brightness: 0.85 }).toBuffer();
    const frente = await sharp(foto).resize(W - 80, H - 40, { fit: "inside" }).toBuffer();
    const jpg = await sharp(fondo).composite([{ input: frente, gravity: "center" }]).jpeg({ quality: 82, mozjpeg: true }).toBuffer();

    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800");
    res.status(200).send(jpg);
  } catch {
    // Sin foto: el banner general de la tienda
    res.setHeader("Cache-Control", "public, s-maxage=300");
    res.redirect(302, `${base}/og-image.jpg`);
  }
};
