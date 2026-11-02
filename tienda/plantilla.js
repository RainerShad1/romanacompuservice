/* ======================================================
   Imagen para redes de un producto (solo se usa en el panel).
   Repite la forma del logo: un cuadro grande (la foto) con un corte
   abajo a la izquierda, y dentro del corte un cuadro pequeño (el precio).
   Formatos: post 1080×1080 e historia 1080×1920.
   ====================================================== */
const Plantilla = (() => {
  const AMARILLO = "#fffc3a", NEGRO = "#000000", BLANCO = "#ffffff";
  const FUENTE = '"Plus Jakarta Sans", system-ui, sans-serif';
  const M = 56; // margen lateral

  // Medidas de cada formato. En la historia, arriba y abajo quedan libres para los botones de Instagram.
  const FORMATOS = {
    post: { w: 1080, h: 1080, cab: 44, marco: 156, titulo: { size: 54, min: 40, lineas: 2 }, chipFilas: 1, banda: 960 },
    historia: { w: 1080, h: 1920, cab: 210, marco: 334, titulo: { size: 66, min: 48, lineas: 3 }, chipFilas: 2, banda: 1560 },
  };

  const fotos = new Map();
  function cargar(src) {
    return new Promise((ok, mal) => { const i = new Image(); i.onload = () => ok(i); i.onerror = mal; i.src = src; });
  }
  // Se baja como archivo para que el navegador deje exportar la imagen final
  async function foto(url) {
    if (!url) return null;
    if (fotos.has(url)) return fotos.get(url);
    try {
      const r = await fetch(url, { mode: "cors" });
      if (!r.ok) throw new Error(r.status);
      const img = await cargar(URL.createObjectURL(await r.blob()));
      fotos.set(url, img);
      return img;
    } catch {
      return null;
    }
  }

  const fuente = (peso, size) => `${peso} ${size}px ${FUENTE}`;

  function partir(ctx, texto, ancho) {
    const lineas = []; let l = "";
    for (const w of texto.split(/\s+/)) {
      const prueba = l ? `${l} ${w}` : w;
      if (l && ctx.measureText(prueba).width > ancho) { lineas.push(l); l = w; } else l = prueba;
    }
    if (l) lineas.push(l);
    return lineas;
  }

  // Título: baja de tamaño hasta caber; si aun así no cabe, termina en "…"
  function medirTitulo(ctx, texto, ancho, { size, min, lineas: max }) {
    let s = size, lineas;
    for (; s >= min; s -= 2) {
      ctx.font = fuente(800, s);
      lineas = partir(ctx, texto, ancho);
      if (lineas.length <= max) return { s, lineas };
    }
    s = min; ctx.font = fuente(800, s);
    lineas = partir(ctx, texto, ancho).slice(0, max);
    let u = lineas[max - 1];
    while (u.length > 1 && ctx.measureText(`${u}…`).width > ancho) u = u.slice(0, -1);
    lineas[max - 1] = `${u.trim()}…`;
    return { s, lineas };
  }

  // Reparte las especificaciones en filas; lo que no cabe se queda fuera
  function acomodarChips(ctx, chips, ancho, maxFilas) {
    ctx.font = fuente(700, 30);
    const filas = []; let fila = [], x = 0;
    for (const t of chips) {
      const w = ctx.measureText(t).width + 40;
      if (w > ancho) continue;
      if (x + w > ancho && fila.length) {
        filas.push(fila); fila = []; x = 0;
        if (filas.length >= maxFilas) return filas;
      }
      fila.push({ t, x, w }); x += w + 12;
    }
    if (fila.length) filas.push(fila);
    return filas;
  }

  // Foto entera sobre la misma foto desenfocada. Se desenfoca achicándola: funciona también en Safari.
  // El precio nunca tapa la foto: si es angosta va a su derecha; si es ancha, va encima de él.
  function dibujarFoto(ctx, img, x, y, w, h, bw, bh) {
    const k = Math.max(w / img.width, h / img.height);
    const peq = document.createElement("canvas");
    peq.width = 18; peq.height = Math.max(1, Math.round((18 * h) / w));
    const pc = peq.getContext("2d");
    const sw = w / k, sh = h / k;
    pc.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, 0, 0, peq.width, peq.height);
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    ctx.drawImage(peq, x, y, w, h);
    ctx.fillStyle = "rgba(0,0,0,.28)"; ctx.fillRect(x, y, w, h);
    const c = Math.min(w / img.width, h / img.height);
    const dw = img.width * c, dh = img.height * c, libre = w - bw - 24;
    if (dw <= libre) {
      ctx.drawImage(img, x + bw + 24 + (libre - dw) / 2, y + (h - dh) / 2, dw, dh);
    } else {
      const h2 = h - bh - 12, c2 = Math.min(w / img.width, h2 / img.height);
      ctx.drawImage(img, x + (w - img.width * c2) / 2, y + (h2 - img.height * c2) / 2, img.width * c2, img.height * c2);
    }
  }

  // La flecha del logo
  function flecha(ctx, x, y, t, color) {
    ctx.strokeStyle = color; ctx.lineWidth = t * .2; ctx.lineCap = "butt"; ctx.lineJoin = "miter";
    ctx.beginPath(); ctx.moveTo(x, y + t); ctx.lineTo(x + t * .9, y + t * .1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + t * .25, y + t * .1); ctx.lineTo(x + t * .9, y + t * .1); ctx.lineTo(x + t * .9, y + t * .75); ctx.stroke();
  }

  /* datos: { titulo, precio, precioAntes, descuento, chips[], etiqueta, foto, marca, frase, telefono, instagram, enlace }
     Devuelve { canvas, sinFoto } */
  async function crear(datos, formato = "post") {
    const F = FORMATOS[formato];
    const [logo, img] = await Promise.all([cargar("icon-512.png"), foto(datos.foto)]);
    await Promise.all([600, 700, 800].map((p) => document.fonts.load(fuente(p, 40), "RD$ñ"))).catch(() => {});

    const cv = document.createElement("canvas");
    cv.width = F.w; cv.height = F.h;
    const ctx = cv.getContext("2d");
    const ancho = F.w - M * 2;
    ctx.textBaseline = "alphabetic";

    ctx.fillStyle = AMARILLO; ctx.fillRect(0, 0, F.w, F.h);

    // Cabecera: logo y nombre del negocio
    ctx.drawImage(logo, M, F.cab, 92, 92);
    ctx.fillStyle = NEGRO; ctx.font = fuente(800, 40);
    ctx.fillText(datos.marca, M + 110, F.cab + 44);
    ctx.font = fuente(600, 24);
    ctx.fillText(datos.frase, M + 110, F.cab + 80, ancho - 110);

    // El texto manda: la foto crece hasta donde deje libre el título y las especificaciones
    const sobra = 40, lh = (s) => Math.round(s * 1.14);
    const { s, lineas } = medirTitulo(ctx, datos.titulo, ancho, F.titulo);
    const filas = acomodarChips(ctx, datos.chips, ancho, F.chipFilas);
    const altoChips = filas.length ? 26 + 56 + (filas.length - 1) * 66 : 0;
    const y1 = F.marco;
    const y2 = Math.max(y1 + 300, F.banda - 20 - altoChips - s - (lineas.length - 1) * lh(s) - 26 - sobra);
    const alto = y2 - y1;

    // Medidas del cuadro del precio
    const hb = datos.precioAntes ? 158 : 132, corte = 14;
    let sp = 76; ctx.font = fuente(800, sp);
    while (ctx.measureText(datos.precio).width > 560 && sp > 44) { sp -= 2; ctx.font = fuente(800, sp); }
    const wb = ctx.measureText(datos.precio).width + 148;
    const by = y2 - hb + sobra;

    // Cuadro grande: la foto
    ctx.fillStyle = NEGRO; ctx.fillRect(M, y1, ancho, alto);
    if (img) dibujarFoto(ctx, img, M, y1, ancho, alto, wb + corte, hb - sobra + corte);
    else { const s = Math.min(alto, ancho) * .5; ctx.drawImage(logo, (F.w - s) / 2, y1 + (alto - s) / 2, s, s); }

    // Etiqueta sobre la foto (Como nueva, -3%)
    let ex = M + ancho;
    for (const [txt, fondo, tinta] of [[datos.descuento, AMARILLO, NEGRO], [datos.etiqueta, NEGRO, AMARILLO]]) {
      if (!txt) continue;
      ctx.font = fuente(800, 30);
      const tw = ctx.measureText(txt).width + 40;
      ex -= tw;
      ctx.fillStyle = fondo; ctx.fillRect(ex, y1, tw, 58);
      ctx.fillStyle = tinta; ctx.fillText(txt, ex + 20, y1 + 40);
    }

    // Cuadro pequeño en el corte: el precio
    ctx.fillStyle = AMARILLO; ctx.fillRect(M - corte, by - corte, wb + corte * 2, hb + corte);
    ctx.fillStyle = NEGRO; ctx.fillRect(M, by, wb, hb);
    flecha(ctx, M + 28, by + hb - 96, 62, AMARILLO);
    if (datos.precioAntes) {
      ctx.font = fuente(600, 30); ctx.fillStyle = "#cfcfc6";
      const ax = M + 116, ay = by + 44;
      ctx.fillText(datos.precioAntes, ax, ay);
      const aw = ctx.measureText(datos.precioAntes).width;
      ctx.fillRect(ax - 2, ay - 11, aw + 4, 3);
    }
    ctx.font = fuente(800, sp); ctx.fillStyle = AMARILLO;
    ctx.fillText(datos.precio, M + 116, by + hb - 34);

    // Título
    ctx.font = fuente(800, s); ctx.fillStyle = NEGRO;
    let y = y2 + sobra + 26 + s;
    for (const l of lineas) { ctx.fillText(l, M, y); y += lh(s); }

    // Especificaciones principales
    ctx.font = fuente(700, 30);
    let cy = y - lh(s) + 26;
    for (const fila of filas) {
      for (const c of fila) {
        ctx.fillStyle = NEGRO; ctx.fillRect(M + c.x, cy, c.w, 56);
        ctx.fillStyle = AMARILLO; ctx.fillText(c.t, M + c.x + 20, cy + 39);
      }
      cy += 66;
    }

    // Banda de contacto
    ctx.fillStyle = NEGRO; ctx.fillRect(0, F.banda, F.w, F.h - F.banda);
    ctx.font = fuente(800, 36); ctx.fillStyle = AMARILLO;
    ctx.fillText(datos.enlace, M, F.banda + 50, ancho);
    const by2 = F.banda + 96;
    ctx.font = fuente(600, 28); ctx.fillStyle = BLANCO;
    ctx.fillText(`WhatsApp ${datos.telefono}`, M, by2);
    if (datos.instagram) {
      const t = `@${datos.instagram}`;
      ctx.fillText(t, F.w - M - ctx.measureText(t).width, by2);
    }

    return { canvas: cv, sinFoto: !!datos.foto && !img };
  }

  return { crear };
})();
