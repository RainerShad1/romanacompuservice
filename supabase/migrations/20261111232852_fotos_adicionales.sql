-- Fotos adicionales de cada producto. "img" sigue siendo la foto principal (catálogo, redes, vista previa).
alter table public.products add column if not exists imgs text[] not null default '{}'
  check (cardinality(imgs) <= 11);
