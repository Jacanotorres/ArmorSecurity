-- ============================================================
-- Armor Security — instalación completa de la base de datos
--
-- Cómo usarlo (UNA sola vez):
--   1. Entra a supabase.com y abre el proyecto de ARMOR SECURITY
--      (revisa que la dirección del navegador tenga el código de
--      ESE proyecto y no el de otro cliente).
--   2. Menú de la izquierda -> "SQL Editor" -> "New query".
--   3. Copia TODO este archivo, pégalo y presiona "Run".
--   4. Debe decir "Success. No rows returned".
--
-- Crea: los usuarios con rol (Admin / Asesor), el catálogo de
-- vehículos con sus fotos, las solicitudes de cotización del sitio
-- y los permisos de seguridad.
-- Después falta crear el usuario administrador
-- (ver supabase-crear-admin.sql).
-- ============================================================

-- 1. Perfiles: extiende auth.users con el rol de cada usuario.
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('admin','asesor')),
  nombre text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Cada usuario ve su propio perfil"
  on public.profiles for select
  to authenticated
  using (id = auth.uid());

-- Rol del usuario con sesión iniciada (o null si no tiene perfil).
-- "security definer" para poder leer profiles sin quedar atrapada en su propia RLS.
create or replace function public.get_my_role()
returns text
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- 2. Vehículos blindados. Cada uno puede estar en venta, en alquiler o en ambos.
--    "numero" da la referencia visible (AS-001, AS-002...).
--    Un precio o tarifa vacío se muestra como "Consultar".
create table public.vehicles (
  id text primary key,
  numero int generated always as identity,
  marca text not null,
  linea text not null,
  anio int not null,
  tipo text not null,                 -- SUV, Camioneta, Sedán, Van
  nivel text not null,                -- III-A, III, IV
  en_venta boolean not null default false,
  en_alquiler boolean not null default false,
  precio_venta bigint,
  tarifa_dia bigint,
  tarifa_semana bigint,
  tarifa_mes bigint,
  color text,
  transmision text,
  combustible text,
  cilindraje text,
  pasajeros int,
  descripcion text,
  destacado boolean not null default false,
  estado text not null default 'disponible'
    check (estado in ('disponible','reservado','vendido','alquilado','oculto')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint vehicles_modalidad check (en_venta or en_alquiler)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger vehicles_updated_at
  before update on public.vehicles
  for each row execute function public.set_updated_at();

alter table public.vehicles enable row level security;

-- El público ve todo menos los vehículos "ocultos".
create policy "El publico ve el catalogo"
  on public.vehicles for select
  to anon, authenticated
  using (estado <> 'oculto');

create policy "Admin y asesor administran el catalogo"
  on public.vehicles for all
  to authenticated
  using (get_my_role() in ('admin','asesor'))
  with check (get_my_role() in ('admin','asesor'));

-- 3. Fotos de vehículos (una fila por foto, con su orden; la primera es la portada).
create table public.vehicle_photos (
  id uuid primary key default gen_random_uuid(),
  vehicle_id text not null references public.vehicles(id) on delete cascade,
  url text not null,
  posicion int not null default 0
);

alter table public.vehicle_photos enable row level security;

create policy "Cualquiera puede ver las fotos de vehiculos"
  on public.vehicle_photos for select
  to anon, authenticated
  using (true);

create policy "Admin y asesor administran fotos de vehiculos"
  on public.vehicle_photos for all
  to authenticated
  using (get_my_role() in ('admin','asesor'))
  with check (get_my_role() in ('admin','asesor'));

-- 4. Solicitudes de cotización (formulario de Contacto del sitio).
--    Cualquiera puede ENVIAR una; solo admin y asesor las ven en el panel.
create table public.solicitudes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nombre text not null check (char_length(nombre) between 1 and 200),
  celular text not null check (char_length(celular) between 1 and 40),
  interes text,
  periodo text,
  vehiculo_ref text,
  mensaje text check (mensaje is null or char_length(mensaje) <= 2000),
  atendida boolean not null default false
);

alter table public.solicitudes enable row level security;

create policy "Cualquiera puede enviar una solicitud"
  on public.solicitudes for insert
  to anon, authenticated
  with check (atendida = false);

create policy "Admin y asesor ven las solicitudes"
  on public.solicitudes for select
  to authenticated
  using (get_my_role() in ('admin','asesor'));

create policy "Admin y asesor marcan solicitudes atendidas"
  on public.solicitudes for update
  to authenticated
  using (get_my_role() in ('admin','asesor'))
  with check (get_my_role() in ('admin','asesor'));

create policy "Solo admin borra solicitudes"
  on public.solicitudes for delete
  to authenticated
  using (get_my_role() = 'admin');

-- 5. Almacenamiento de fotos: lectura pública, solo imágenes de hasta 10 MB.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('vehiculos', 'vehiculos', true, 10485760, array['image/*'])
on conflict (id) do nothing;

create policy "Lectura publica fotos vehiculos"
  on storage.objects for select
  to public
  using (bucket_id = 'vehiculos');

create policy "Admin y asesor suben fotos de vehiculos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'vehiculos' and get_my_role() in ('admin','asesor'));

create policy "Admin y asesor actualizan fotos de vehiculos"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'vehiculos' and get_my_role() in ('admin','asesor'));

create policy "Admin y asesor borran fotos de vehiculos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'vehiculos' and get_my_role() in ('admin','asesor'));
