/* ======================================================
   Ficha del producto: convierte el nombre largo que escribe
   la tienda ("Laptop Dell como nueva 🔥 E7450 ✅Procesador: …")
   en un título corto y una lista ordenada de especificaciones.
   No cambia lo guardado: solo cómo se muestra.
   ====================================================== */
const Ficha = (() => {
  const MARCAS = [
    ["hp", "HP"], ["dell", "Dell"], ["lenovo", "Lenovo"], ["acer", "Acer"], ["asus", "Asus"], ["apple", "Apple"],
    ["macbook", "Apple"], ["iphone", "Apple"], ["ipad", "Apple"], ["surface", "Microsoft"], ["microsoft", "Microsoft"],
    ["toshiba", "Toshiba"], ["samsung", "Samsung"], ["msi", "MSI"], ["huawei", "Huawei"], ["xiaomi", "Xiaomi"],
    ["motorola", "Motorola"], ["kingston", "Kingston"], ["crucial", "Crucial"], ["logitech", "Logitech"],
    ["tp-link", "TP-Link"], ["tplink", "TP-Link"], ["sandisk", "SanDisk"], ["seagate", "Seagate"],
    ["western digital", "Western Digital"], ["gigabyte", "Gigabyte"], ["lg", "LG"], ["sony", "Sony"],
    ["adata", "ADATA"], ["hikvision", "Hikvision"], ["epson", "Epson"], ["canon", "Canon"], ["brother", "Brother"],
  ];
  // Etiquetas que escribe la tienda → nombre ordenado
  const ETIQUETAS = {
    "procesador": "Procesador", "cpu": "Procesador",
    "memoria ram": "Memoria RAM", "ram": "Memoria RAM", "memoria": "Memoria RAM",
    "almacenamiento": "Almacenamiento", "disco": "Almacenamiento", "disco duro": "Almacenamiento", "ssd": "Almacenamiento", "hdd": "Almacenamiento",
    "pantalla": "Pantalla", "graficos": "Gráficos", "grafica": "Gráficos", "video": "Gráficos", "gpu": "Gráficos", "tarjeta de video": "Gráficos",
    "conectividad": "Conectividad", "sistema": "Sistema", "sistema operativo": "Sistema",
    "bateria": "Batería", "color": "Color", "puertos": "Puertos", "camara": "Cámara", "teclado": "Teclado",
    "capacidad": "Capacidad", "compatible": "Compatible con", "compatibilidad": "Compatible con",
    "modelo": "Modelo", "marca": "Marca", "garantia": "Garantía", "condicion": "Condición", "estado": "Condición",
    "velocidad": "Velocidad", "voltaje": "Voltaje", "potencia": "Potencia", "tamano": "Tamaño", "conexion": "Conexión",
  };
  const ORDEN = ["Marca", "Modelo", "Condición", "Procesador", "Memoria RAM", "Almacenamiento", "Pantalla", "Gráficos",
    "Sistema", "Conectividad", "Puertos", "Batería", "Capacidad", "Velocidad", "Compatible con", "Color", "Incluye", "Detalles"];
  const PALABRAS_ETIQUETA = "procesador|memoria ram|ram|almacenamiento|pantalla|gr[aá]ficos|conectividad|sistema operativo|sistema|bater[ií]a|color|puertos|c[aá]mara|capacidad|compatible|modelo|marca|garant[ií]a|condici[oó]n";

  const sinTildes = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
  const sinEmojis = (s) => s.replace(/[\p{Extended_Pictographic}️‍]/gu, " ");
  const limpiar = (s) => sinEmojis(s).replace(/\s+/g, " ").replace(/^[\s,;.\-–:]+|[\s,;.\-–]+$/g, "").trim();
  const capital = (s) => s ? s[0].toUpperCase() + s.slice(1) : s;

  // Texto en MAYÚSCULAS → "Laptop Victus 15-FA2013"; deja siglas y modelos como están
  const SIGLAS = /^(HP|MSI|LG|RTX|GTX|SSD|HDD|FHD|HD|UHD|OLED|IPS|USB|HDMI|LAN|DDR\d?|AMD|RAM|TB|GB|PC|TV|WIFI|BT|SD|NVME|M\.2|II|III|IV)$/;
  function casoNatural(s) {
    const letras = s.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ]/g, "");
    if (!letras || letras.replace(/[^A-ZÁÉÍÓÚÑ]/g, "").length / letras.length < 0.7) return s;
    return s.split(" ").map((w) => (/\d/.test(w) || SIGLAS.test(w) ? w : capital(w.toLowerCase()))).join(" ");
  }

  function marcaDe(texto) {
    const t = " " + sinTildes(texto.toLowerCase()).replace(/[^a-z0-9.\- ]/g, " ") + " ";
    for (const [k, v] of MARCAS) if (new RegExp(`[\\s-]${k.replace(/[.-]/g, "\\$&")}[\\s-]`).test(t)) return v;
    return "";
  }

  // Adivina a qué especificación pertenece un trozo sin etiqueta
  function adivinar(t) {
    if (/\b(windows|win)\b|mac ?os|chrome ?os/i.test(t)) return "Sistema";
    if (/\b(rtx|gtx|radeon|geforce|nvidia|uhd graphics|iris|vega)\b/i.test(t)) return "Gráficos";
    if (/\b(core ?i[3579]|i[3579][- ]?\d{3,5}[a-z]*|ryzen|celeron|pentium|athlon|snapdragon|m[1-4]( pro| max)?)\b|\bintel\b|\bamd\b/i.test(t)) return "Procesador";
    if (/\d+\s?(gb|tb)\b.*\b(ssd|hdd|emmc|nvme|m\.2)\b|\b(ssd|hdd|nvme)\b.*\d+\s?(gb|tb)/i.test(t)) return "Almacenamiento";
    if (/\d+\s?gb\b.*\b(ram|ddr\d?)\b|\bram\b/i.test(t)) return "Memoria RAM";
    if (/\d{2}(\.\d)?\s?("|”|''|pulg)|\b(fhd|full hd|touch|t[aá]ctil|\d{2,3}\s?hz)\b|pantalla/i.test(t)) return "Pantalla";
    if (/wi-?fi|bluetooth|\bbt\s?\d/i.test(t)) return "Conectividad";
    if (/\b(usb|hdmi|lan|ethernet|thunderbolt|type-?c)\b|lector|puerto/i.test(t)) return "Puertos";
    if (/gratis|regalo|incluye|obsequio/i.test(t)) return "Incluye";
    if (/bater[ií]a|mah\b/i.test(t)) return "Batería";
    return "Detalles";
  }

  const INICIO = { "Procesador": /^procesador\s*/i, "Memoria RAM": /^(memoria ram|memoria|ram)\s*/i, "Almacenamiento": /^(almacenamiento|disco duro|disco)\s*/i,
    "Puertos": /^puertos\s*/i, "Gráficos": /^gr[aá]ficos\s*/i, "Conectividad": /^conectividad\s*/i, "Sistema": /^sistema( operativo)?\s*/i, "Batería": /^bater[ií]a\s*/i };
  function arreglarValor(clave, v) {
    v = limpiar(v).replace(/\(\s+/g, "(").replace(/\s+\)/g, ")").replace(/\(\)/g, "").trim();
    if (INICIO[clave]) v = v.replace(INICIO[clave], "");
    if (clave === "Procesador") v = v.replace(/\bI([3579])(?=[- ]|$)/g, "i$1")
      .replace(/\b(intel|celeron|pentium|ryzen|athlon|core)\b/gi, (w) => capital(w.toLowerCase())).replace(/\bamd\b/gi, "AMD");
    if (clave === "Almacenamiento") v = v.replace(/(\d\s?(?:gb|tb))\s+de\s+/i, "$1 ");
    if (clave === "Pantalla" && /^\d{2}(\.\d)?$/.test(v)) v += '"';
    if (clave === "Pantalla") v = v.replace(/\bpantalla\b\s*/gi, "").trim();
    if (clave === "Sistema") v = v.replace(/^win$/i, "Windows");
    if (clave === "Memoria RAM") v = v.replace(/\s*\bde ram\b/i, " RAM").replace(/\s+/g, " ");
    return casoNatural(v);
  }

  const cache = new Map();
  function de(nombre, cat = "") {
    const llave = nombre + "|" + cat;
    if (cache.has(llave)) return cache.get(llave);
    const raw = String(nombre || "");

    // 1. Trozos: separados por ✅ / • / saltos; si no hay, por comas o espacios dobles
    let partes = raw.split(/[✅✔☑•|\n]+/u).map((s) => s.trim()).filter((s) => limpiar(s));
    if (partes.length <= 1) partes = raw.split(/,|\s{2,}/).map((s) => s.trim()).filter((s) => limpiar(s));
    else partes = partes.flatMap((p, i) => (i === 0 ? [p] : p.split(/\s{3,}|💯/u)));
    const separaEtiquetas = new RegExp(`(?<!memoria\\s*|sistema\\s*)(?=\\b(?:${PALABRAS_ETIQUETA})\\s*:)`, "i");
    partes = partes.flatMap((p) => p.split(separaEtiquetas)).map((s) => s.trim()).filter((s) => limpiar(s));

    // 2. Condición ("como nueva", "usada", …)
    let condicion = "";
    const mc = raw.match(/\b(como nuev[oa]|reacondicionad[oa]|usad[oa](?: a\+)?|open box)\b/i);
    if (mc) condicion = capital(mc[1].toLowerCase());

    // 3. Título: el primer trozo, salvo que ya sea una especificación
    let titulo = partes[0] || "";
    const esEspec = new RegExp(`^\\s*(?:${PALABRAS_ETIQUETA})\\b`, "i").test(limpiar(titulo)) || titulo.includes(":");
    if (esEspec) titulo = ""; else partes = partes.slice(1);

    const specs = {};
    const poner = (k, v) => { v = arreglarValor(k, v); if (!v) return; specs[k] = specs[k] ? `${specs[k]}, ${v}` : v; };

    if (titulo) {
      titulo = titulo.replace(/\b(como nuev[oa]|reacondicionad[oa]|usad[oa](?: a\+)?|open box)\b/gi, " ");
      const pant = titulo.match(/\d{2}(?:\.\d)?\s?(?:"|”|''|pulgadas?)(?:\s*(?:FHD|Full HD|HD|IPS|OLED|\d{2,3}\s?HZ))*/i);
      if (pant) { poner("Pantalla", pant[0]); titulo = titulo.replace(pant[0], " "); }
      titulo = casoNatural(limpiar(titulo.replace(/\s+-\s+/g, " ")));
    }

    // 4. Especificaciones
    for (let i = 0; i < partes.length; i++) {
      const p = partes[i];
      const m = limpiar(p).match(/^([^:]{2,28}):\s*(.*)$/);
      if (m) {
        const et = sinTildes(m[1].toLowerCase()).trim();
        const clave = ETIQUETAS[et] || capital(limpiar(m[1]));
        let valor = m[2];
        if (!limpiar(valor) && partes[i + 1] && !partes[i + 1].includes(":")) valor = partes[++i];
        poner(clave, valor);
      } else {
        poner(adivinar(p), p);
      }
    }

    // Una "RAM" de 64 GB o más en realidad es el disco
    const gb = (s) => { const x = /(\d+)\s?(gb|tb)/i.exec(s || ""); return x ? Number(x[1]) * (/tb/i.test(x[2]) ? 1024 : 1) : 0; };
    if (specs["Memoria RAM"]) {
      const trozos = specs["Memoria RAM"].split(", ");
      const grandes = trozos.filter((t) => gb(t) >= 64);
      if (grandes.length) {
        const resto = trozos.filter((t) => gb(t) < 64);
        if (resto.length) specs["Memoria RAM"] = resto.join(", "); else delete specs["Memoria RAM"];
        specs["Almacenamiento"] = [specs["Almacenamiento"], ...grandes].filter(Boolean).join(", ");
      }
    }

    const marca = specs.Marca || marcaDe(raw);
    if (marca) specs.Marca = marca;
    if (condicion && !specs["Condición"]) specs["Condición"] = condicion;

    // 5. Sin título: "Laptop" + marca + procesador
    if (!titulo) {
      const [w, ...rest] = String(cat).toLowerCase().split(" ");
      const singular = w ? capital(w.length > 5 && /es$/.test(w) ? w.slice(0, -2) : w.replace(/s$/, "")) + (rest.length ? " " + rest.join(" ") : "") : "Producto";
      titulo = [singular, marca, specs.Procesador && specs.Procesador.split(" ").slice(0, 3).map(capital).join(" ")].filter(Boolean).join(" ");
    } else if (marca && new RegExp(`\\b${marca.split(" ")[0]}\\b`, "i").test(titulo)) {
      titulo = titulo.replace(new RegExp(`\\b${marca.split(" ")[0]}\\b`, "i"), marca.split(" ")[0]);
    } else if (marca) {
      titulo = titulo.replace(/^(\S+)/, `$1 ${marca}`);
    }

    const lista = Object.entries(specs).sort((a, b) => (ORDEN.indexOf(a[0]) + 1 || 50) - (ORDEN.indexOf(b[0]) + 1 || 50));

    // 6. Resumen corto para la tarjeta: procesador · RAM · disco
    const resumen = [];
    const pr = specs.Procesador || "";
    const mp = pr.match(/\bi[3579][- ]?\d{4,5}[a-z]*\b/i) || pr.match(/\b(core )?i[3579]\b/i) || pr.match(/ryzen\s?\d(\s?pro)?|celeron|pentium|athlon|snapdragon|\bm[1-4]\b/i);
    if (mp) resumen.push(capital(mp[0].replace(/^core /i, "Core ")).replace(/^I([3579])/, "i$1").replace(/^(i[3579])$/, "Core $1"));
    const r = (specs["Memoria RAM"] || "").match(/\d+\s?gb/i); if (r) resumen.push(r[0].replace(/\s/, "").toUpperCase() + " RAM");
    const d = (specs.Almacenamiento || "").match(/(\d+\s?(?:gb|tb))\s*(?:de\s+)?(ssd|hdd|emmc|nvme)?|(ssd|hdd)\s*(\d+\s?(?:gb|tb))/i);
    if (d) resumen.push(((d[1] || d[4]) + " " + (d[2] || d[3] || "")).replace(/\s+/g, " ").trim().toUpperCase().replace(/(\d)\s(GB|TB)/, "$1$2"));

    const out = { titulo: titulo || limpiar(raw), specs: lista, resumen, condicion };
    cache.set(llave, out);
    return out;
  }

  return { de };
})();
