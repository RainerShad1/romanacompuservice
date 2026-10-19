/* Conexión con Supabase: cuentas de clientes y pedidos.
   La clave "anon" es pública por diseño; los datos los protegen las reglas
   de seguridad (RLS) de la base de datos: cada cliente solo ve lo suyo. */
const SUPABASE_URL = "https://mglygdqqtppvfqrjjuuv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nbHlnZHFxdHBwdmZxcmpqdXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIzODA5ODEsImV4cCI6MjEwNzk1Njk4MX0.Pk0NTwJz3mEr5m2RdsDhKvC7R6kfoZ5bFkj3k8xCJmk";
const REGISTRO_URL = SUPABASE_URL + "/functions/v1/registro";

/* "Recordarme": con la casilla marcada la sesión queda en el dispositivo;
   sin marcar, se cierra al cerrar el navegador. */
const Recordar = {
  get() { try { return localStorage.getItem("tc_remember") !== "0"; } catch { return true; } },
  set(v) { try { localStorage.setItem("tc_remember", v ? "1" : "0"); } catch {} },
  ultimaCedula() { try { return localStorage.getItem("tc_last_cedula") || ""; } catch { return ""; } },
  guardarCedula(c) { try { c ? localStorage.setItem("tc_last_cedula", c) : localStorage.removeItem("tc_last_cedula"); } catch {} },
};
const authStorage = {
  getItem(k) { try { return localStorage.getItem(k) ?? sessionStorage.getItem(k); } catch { return null; } },
  setItem(k, v) {
    try {
      const [keep, drop] = Recordar.get() ? [localStorage, sessionStorage] : [sessionStorage, localStorage];
      keep.setItem(k, v); drop.removeItem(k);
    } catch {}
  },
  removeItem(k) { try { localStorage.removeItem(k); sessionStorage.removeItem(k); } catch {} },
};

const sb = window.supabase
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { storage: authStorage, storageKey: "tc_auth", persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
    })
  : null;

/* Cédula dominicana: 11 dígitos + dígito verificador (Luhn con pesos 1,2,1,2…). */
const Cedula = {
  limpiar: (v) => String(v || "").replace(/\D/g, "").slice(0, 11),
  valida(v) {
    const c = Cedula.limpiar(v);
    if (c.length !== 11) return false;
    let s = 0;
    for (let i = 0; i < 10; i++) { let p = Number(c[i]) * (i % 2 === 0 ? 1 : 2); if (p > 9) p -= 9; s += p; }
    return (10 - (s % 10)) % 10 === Number(c[10]);
  },
  formato(v) {
    const c = Cedula.limpiar(v);
    return [c.slice(0, 3), c.slice(3, 10), c.slice(10, 11)].filter(Boolean).join("-");
  },
  oculta(v) { const c = Cedula.limpiar(v); return c.length === 11 ? `${c.slice(0, 3)}-•••••••-${c[10]}` : ""; },
  /* La cuenta usa un correo interno derivado de la cédula; nunca se envían correos. */
  correo: (v) => `${Cedula.limpiar(v)}@clientes.romanacompuservice.invalid`,
};

/* Estados de un pedido (los mismos en la tienda y en el panel) */
const ESTADOS = {
  pendiente:  { t: "Recibido",           d: "Recibimos tu pedido y lo estamos revisando.", i: "inbox",        c: "warn" },
  confirmado: { t: "Confirmado",         d: "Confirmamos la disponibilidad.",              i: "circle-check", c: "info" },
  preparando: { t: "Preparando",         d: "Estamos preparando tu pedido.",               i: "package",      c: "info" },
  en_camino:  { t: "En camino",          d: "El mensajero va hacia tu dirección.",         i: "truck",        c: "info" },
  listo:      { t: "Listo para recoger", d: "Ya puedes pasar a buscarlo a la tienda.",     i: "store",        c: "info" },
  entregado:  { t: "Entregado",          d: "¡Gracias por tu compra!",                     i: "party-popper", c: "ok" },
  cancelado:  { t: "Cancelado",          d: "Este pedido fue cancelado.",                  i: "circle-x",     c: "bad" },
};
const pasosPedido = (entrega) => entrega === "delivery"
  ? ["pendiente", "confirmado", "preparando", "en_camino", "entregado"]
  : ["pendiente", "confirmado", "preparando", "listo", "entregado"];
const pedidoActivo = (o) => o.estado !== "entregado" && o.estado !== "cancelado";

async function registrarCliente(datos) {
  const r = await fetch(REGISTRO_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY },
    body: JSON.stringify(datos),
  });
  let body = {};
  try { body = await r.json(); } catch {}
  if (!r.ok) throw Object.assign(new Error(body.error || "No pudimos crear la cuenta."), { field: body.field });
  return body;
}
