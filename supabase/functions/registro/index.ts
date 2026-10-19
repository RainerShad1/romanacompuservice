// Registro de clientes de Romana CompuService.
// Valida la cédula dominicana, crea la cuenta (sin correo) y guarda el perfil con su ubicación.
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

/** 11 dígitos + dígito verificador (Luhn con pesos 1,2,1,2…). */
function cedulaValida(c: string): boolean {
  if (!/^\d{11}$/.test(c)) return false;
  let s = 0;
  for (let i = 0; i < 10; i++) {
    let p = Number(c[i]) * (i % 2 === 0 ? 1 : 2);
    if (p > 9) p -= 9;
    s += p;
  }
  return (10 - (s % 10)) % 10 === Number(c[10]);
}
export const emailDeCedula = (c: string) => `${c}@clientes.romanacompuservice.invalid`;

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const num = (v: unknown, min: number, max: number) =>
  typeof v === "number" && Number.isFinite(v) && v >= min && v <= max ? v : null;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405);

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return json({ error: "Solicitud inválida" }, 400); }

  const cedula = str(body.cedula, 20).replace(/\D/g, "");
  const nombre = str(body.nombre, 120);
  const telefono = str(body.telefono, 30).replace(/\D/g, "");
  const password = typeof body.password === "string" ? body.password : "";
  const direccion = str(body.direccion, 300);
  const sector = str(body.sector, 120);
  const referencia = str(body.referencia, 300);
  const lat = num(body.lat, -90, 90);
  const lng = num(body.lng, -180, 180);

  if (!cedulaValida(cedula)) return json({ error: "La cédula no es válida. Revísala e inténtalo de nuevo.", field: "cedula" }, 400);
  if (nombre.length < 3) return json({ error: "Escribe tu nombre completo.", field: "nombre" }, 400);
  if (telefono.length < 10 || telefono.length > 15) return json({ error: "Escribe un teléfono válido de 10 dígitos.", field: "telefono" }, 400);
  if (password.length < 6 || password.length > 72) return json({ error: "La contraseña debe tener al menos 6 caracteres.", field: "password" }, 400);
  if (!direccion || !sector) return json({ error: "Escribe tu dirección y sector para el delivery.", field: "direccion" }, 400);

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: existing, error: findErr } = await admin.from("profiles").select("id").eq("cedula", cedula).maybeSingle();
  if (findErr) return json({ error: "No pudimos crear la cuenta. Inténtalo más tarde." }, 500);
  if (existing) return json({ error: "Ya existe una cuenta con esa cédula. Inicia sesión.", field: "cedula" }, 409);

  const { data: created, error: userErr } = await admin.auth.admin.createUser({
    email: emailDeCedula(cedula),
    password,
    email_confirm: true,
    user_metadata: { nombre },
  });
  if (userErr || !created.user) {
    const dup = /already|registered|exists/i.test(userErr?.message ?? "");
    return json({ error: dup ? "Ya existe una cuenta con esa cédula. Inicia sesión." : "No pudimos crear la cuenta. Inténtalo más tarde." }, dup ? 409 : 500);
  }

  const { error: profErr } = await admin.from("profiles").insert({
    id: created.user.id, cedula, nombre, telefono, direccion, sector, referencia: referencia || null, lat, lng,
  });
  if (profErr) {
    await admin.auth.admin.deleteUser(created.user.id);
    return json({ error: "No pudimos crear la cuenta. Inténtalo más tarde." }, 500);
  }

  return json({ ok: true });
});
