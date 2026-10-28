-- El nombre del producto lleva la ficha técnica (la tienda la ordena sola): más espacio
alter table public.products drop constraint products_nombre_check;
alter table public.products add constraint products_nombre_check check (char_length(nombre) between 1 and 600);
