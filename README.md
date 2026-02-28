# RuffoApp 

Veterinaria Ruffo - Aplicación web para gestión de clientes y sus mascotas.


## 📦 Instalación Local

### 1. Clonar el repositorio

```
bash
git clone "https://github.com/Ingrith-R2/Ruffo_pets"
cd ruffo-app
```

### 2. Instalar dependencias

```
bash
npm install
```

### 3. Configurar variables de entorno

Crear el archivo `.env` y completa los valores como muestra en `.env.example`


Edita `.env` con tus credenciales de Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### 4. Ejecutar el servidor de desarrollo

```
bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🗄️ Configuración de Supabase

### SQL para crear las tablas

Ejecutar lo siguiente para crear tablas de clientes y mascotas

-- Tabla de clientes

create table public.clients(
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone numeric not null,
  email text ,
  notes text,
  created_at timestamp with time zone default now()
);

-- Tabla de mascotas


create table public.pets(
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete cascade,
  name text not null,
  species text not null,
  breed text,
  behavior_notes text,
  created_at timestamp with time zone default now()
);


-- Habilitar RLS (Row Level Security)

alter table clients enable row level security;
alter table pets enable row level security;

-- Política RLS para usuarios autenticados para permitir realizar las operaciones

create policy "Allow all for authenticated"
on clients
for all
to authenticated
using (true)
with check (true);*/

create policy "Allow all for authenticated"
on pets
for all
to authenticated
using (true)
with check (true);
```

### 👤 Credenciales de Usuario de Prueba. Nota: se debe crear el usuario en Supabase 

**Email**: `ruffo@pets.com`
**Password**: `RuffO369`


## 📝 Decisiones Técnicas

### 1. Arquitectura de Supabase Client

 Implementé dos clientes de Supabase separados (`client.ts` y `server.ts`).

**Razón**: 
- El cliente de servidor (`server.ts`) se usa en Server Components para obtener datos iniciales
- El cliente de navegador (`client.ts`) se usa en Client Components para operaciones interactivas

### 2. Middleware para Autenticación

 Usé Next.js Middleware para proteger rutas.

**Razón**: 
- El middleware se ejecuta antes del renderizado, proporcionando protección temprana
- Maneja redirecciones de forma centralizada
- Funciona con el App Router de Next.js

### 3. Client Components vs Server Components

- Páginas de listado y detalle
- Formularios y componentes interactivos

**Razón**: 
- Los Server Components reducen el JavaScript enviado al cliente
- Los Client Components son necesarios para interactividad como formularios y botones

### 4. shadcn/ui

 Usé componentes de shadcn/ui en lugar de componentes genéricos.

**Razón**:
- Componentes accesibles y personalizables
- Integración nativa con Tailwind CSS
- Código abierto y mantenible

## 🔧 Mejoras con Más Tiempo

1. Optimización de búsquedas

2. Manejo de estados

3. Tests Unitarios

4. Validación de formularios

5. Mejoras de UI
   - Loading states con skeletons
   - Toast notifications para feedback
   - Modal de confirmación para eliminaciones

6. Edge Cases
   - Manejo de sesiones expiradas
   - Retry automático en fallos de red
   - Paginación para listas grandes

7. Seguridad adicional
   - Rate limiting en autenticación
   - Validación de datos en servidor
   - Logs de auditoría

## 📄 Licencia

