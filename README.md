# Romana CompuService — Tienda en línea

Tienda web de computadoras, repuestos y servicio técnico en La Romana, República Dominicana.

- Tienda: https://romanacompuservice-tienda.vercel.app/
- Panel: https://romanacompuservice-tienda.vercel.app/admin.html

Publicada en Vercel desde este repositorio (Root Directory: `tienda`): cada push a `main` se publica solo.

## Qué incluye

- **Tienda** (`tienda/index.html`): catálogo, ofertas, carrito, cuentas de clientes con cédula y pedidos con seguimiento en vivo.
- **Panel de administración** (`tienda/admin.html`): pedidos en tiempo real, productos con fotos, categorías, configuración y clientes. Solo entran cuentas administradoras.
- **Aviso de privacidad** (`tienda/privacidad.html`).

## Cómo funciona

- Sitio estático (HTML, CSS y JavaScript, sin paso de compilación) en la carpeta `tienda/`.
- Los datos viven en **Supabase** (proyecto `romana-compuservice`):
  - `settings`, `categories`, `products`: catálogo y configuración, editables desde el panel.
  - `profiles`: clientes (cédula validada, contacto y ubicación).
  - `orders`: pedidos con estado e historial.
  - `admins`: cuentas con acceso al panel.
  - Bucket `productos`: fotos de productos.
- Toda la seguridad está en las reglas RLS y en las funciones `crear_pedido`, `cambiar_estado_pedido` y `cancelar_mi_pedido`, que calculan precios y existencia en el servidor.
- `supabase/migrations/`: historial del esquema de la base de datos.
- `supabase/functions/registro/`: función que valida la cédula y crea la cuenta del cliente.

La clave de Supabase en `tienda/cuentas.js` es la clave pública (`anon`): es segura en el navegador porque los datos están protegidos por RLS. Nunca subas la clave `service_role`.

## Probar en tu computadora

Sirve la carpeta `tienda/` con cualquier servidor estático, por ejemplo:

```bash
python -m http.server 5173 --directory tienda
```

y abre http://localhost:5173.

## Hacer administrador a un cliente

Desde el editor SQL de Supabase:

```sql
insert into public.admins (user_id)
select id from public.profiles where cedula = '00000000000';
```
