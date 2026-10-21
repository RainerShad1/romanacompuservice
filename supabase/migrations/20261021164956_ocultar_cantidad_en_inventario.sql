-- El cliente no ve cuántas unidades hay en inventario: mensaje sin cantidad.
create or replace function public.crear_pedido(p_items jsonb, p_entrega text, p_direccion text default null, p_lat double precision default null, p_lng double precision default null, p_pago text default null, p_nota text default null)
 returns public.orders
 language plpgsql
 security definer
 set search_path to ''
as $function$
declare
  v_uid uuid := auth.uid();
  v_cfg jsonb;
  v_desc numeric;
  v_items jsonb := '[]'::jsonb;
  v_sub numeric := 0;
  v_envio numeric := 0;
  v_it jsonb;
  v_p public.products;
  v_qty int;
  v_precio numeric;
  v_order public.orders;
begin
  if v_uid is null then raise exception 'Debes iniciar sesión' using errcode = '42501'; end if;
  if not exists (select 1 from public.profiles where id = v_uid) then raise exception 'Perfil no encontrado'; end if;
  if p_entrega not in ('delivery', 'retiro') then raise exception 'Entrega inválida'; end if;
  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 or jsonb_array_length(p_items) > 50 then
    raise exception 'El carrito está vacío';
  end if;

  select data into v_cfg from public.settings where id = 1;
  if p_entrega = 'delivery' and coalesce((v_cfg->>'deliveryActivo')::boolean, true) = false then
    raise exception 'El delivery no está disponible por el momento. Elige retiro en la tienda.';
  end if;
  if p_entrega = 'delivery' and coalesce(btrim(p_direccion), '') = '' then raise exception 'Falta la dirección de entrega'; end if;
  if jsonb_typeof(v_cfg->'pagos') = 'array' and not ((v_cfg->'pagos') ? coalesce(p_pago, '')) then
    raise exception 'Ese método de pago no está disponible por el momento';
  end if;
  v_desc := coalesce((v_cfg->>'descuento')::numeric, 0);

  for v_it in select * from jsonb_array_elements(p_items) loop
    v_qty := (v_it->>'qty')::int;
    if v_qty is null or v_qty < 1 or v_qty > 100 then raise exception 'Cantidad inválida'; end if;
    select * into v_p from public.products where id = (v_it->>'id')::bigint and not oculto for update;
    if not found then raise exception 'Un producto ya no está disponible'; end if;
    if v_p.stock < v_qty then
      raise exception 'No hay suficientes unidades disponibles de "%"', v_p.nombre using errcode = 'P0001';
    end if;
    v_precio := case when v_p.oferta then round(v_p.precio * (1 - v_desc / 100) / 5) * 5 else v_p.precio end;
    update public.products set stock = stock - v_qty, vendidos = vendidos + v_qty, updated_at = now() where id = v_p.id;
    v_items := v_items || jsonb_build_object('id', v_p.id, 'nombre', v_p.nombre, 'qty', v_qty, 'precio', v_precio);
    v_sub := v_sub + v_precio * v_qty;
  end loop;

  if p_entrega = 'delivery' then v_envio := coalesce((v_cfg->>'costoDelivery')::numeric, 0); end if;

  insert into public.orders (user_id, items, subtotal, envio, total, entrega, direccion, lat, lng, pago, nota, estado, historial)
  values (v_uid, v_items, v_sub, v_envio, v_sub + v_envio, p_entrega,
          case when p_entrega = 'delivery' then left(p_direccion, 600) end,
          case when p_entrega = 'delivery' then p_lat end, case when p_entrega = 'delivery' then p_lng end,
          left(p_pago, 60), nullif(left(btrim(coalesce(p_nota, '')), 500), ''), 'pendiente',
          jsonb_build_array(jsonb_build_object('estado', 'pendiente', 'at', now())))
  returning * into v_order;
  return v_order;
end $function$;
