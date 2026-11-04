-- ============================================================
-- VidaActiva — esquema inicial para Supabase / PostgreSQL
-- ============================================================
-- Una sola base de datos para todos los usuarios.
-- Cada tabla con datos personales tiene user_id y RLS.
-- Ejecutar en Supabase → SQL Editor (o con `supabase db push`).
-- ============================================================

create extension if not exists pgcrypto;

-- ------------------------------------------------------------
-- Utilidades
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

-- Crea el perfil cuando se invita/crea un usuario en Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (id, email, nombre)
    values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data ->> 'nombre', '')
    )
    on conflict (id) do update
        set email = excluded.email;

    return new;
end;
$$;

-- ------------------------------------------------------------
-- Perfil
-- ------------------------------------------------------------
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    email text,
    nombre text not null default '',
    edad integer check (edad between 12 and 100),
    sexo text not null default 'prefiero_no_decir'
        check (sexo in ('femenino', 'masculino', 'prefiero_no_decir')),
    peso_kg numeric(6,2) check (peso_kg between 30 and 300),
    estatura_cm numeric(6,2) check (estatura_cm between 100 and 250),
    peso_meta_kg numeric(6,2) check (peso_meta_kg between 30 and 300),
    actividad text not null default 'moderado'
        check (actividad in ('sedentario', 'ligero', 'moderado', 'activo')),
    objetivo text not null default 'mantener'
        check (objetivo in ('bajar', 'mantener', 'subir')),
    calorias_objetivo integer not null default 1800
        check (calorias_objetivo between 1200 and 4000),
    onboarding_completado boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- Plan de alimentación
-- ------------------------------------------------------------
create table if not exists public.diet_plans (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null default auth.uid()
        references auth.users(id) on delete cascade,
    presupuesto text not null default 'medio'
        check (presupuesto in ('economico', 'medio', 'amplio', 'generoso')),
    colaciones text not null default 'no'
        check (colaciones in ('no', 'una', 'dos')),
    horarios jsonb not null default '{}'::jsonb,
    activo boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Un plan activo por usuario. La app puede actualizar la misma fila.
create unique index if not exists idx_diet_plans_user_unique
    on public.diet_plans(user_id);

drop trigger if exists set_diet_plans_updated_at on public.diet_plans;
create trigger set_diet_plans_updated_at
before update on public.diet_plans
for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Comidas registradas
-- ------------------------------------------------------------
create table if not exists public.meal_logs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null default auth.uid()
        references auth.users(id) on delete cascade,
    fecha date not null default current_date,
    comida text not null
        check (comida in ('desayuno', 'almuerzo', 'cena')),
    nombre text not null,
    kcal integer not null default 0 check (kcal >= 0),
    precio numeric(10,2) not null default 0 check (precio >= 0),
    created_at timestamptz not null default now()
);

create index if not exists idx_meal_logs_user_fecha
    on public.meal_logs(user_id, fecha desc);

-- ------------------------------------------------------------
-- Entrenamientos
-- ------------------------------------------------------------
create table if not exists public.workouts (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null default auth.uid()
        references auth.users(id) on delete cascade,
    rutina_id text,
    rutina_nombre text not null,
    nivel text,
    fecha date not null default current_date,
    minutos integer not null default 0 check (minutos >= 0),
    rondas integer not null default 1 check (rondas >= 0),
    completado_en timestamptz not null default now(),
    created_at timestamptz not null default now()
);

create index if not exists idx_workouts_user_fecha
    on public.workouts(user_id, fecha desc);

-- ------------------------------------------------------------
-- Sustituciones de ejercicios por rutina
-- ------------------------------------------------------------
create table if not exists public.exercise_substitutions (
    user_id uuid not null default auth.uid()
        references auth.users(id) on delete cascade,
    rutina_id text not null,
    ejercicio_original_id text not null,
    ejercicio_sustituto_id text not null,
    motivo text check (motivo is null or motivo in ('facil', 'comodo', 'equipo', 'gusto')),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    deleted_at timestamptz,
    primary key (user_id, rutina_id, ejercicio_original_id)
);

create index if not exists idx_exercise_substitutions_user
    on public.exercise_substitutions(user_id);

drop trigger if exists set_exercise_substitutions_updated_at on public.exercise_substitutions;
create trigger set_exercise_substitutions_updated_at
before update on public.exercise_substitutions
for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Hábitos y días completados
-- ------------------------------------------------------------
create table if not exists public.habits (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null default auth.uid()
        references auth.users(id) on delete cascade,
    nombre text not null,
    tipo text not null default 'construir'
        check (tipo in ('construir', 'reducir')),
    categoria text,
    activo boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_habits_user_activo
    on public.habits(user_id, activo);

drop trigger if exists set_habits_updated_at on public.habits;
create trigger set_habits_updated_at
before update on public.habits
for each row execute function public.set_updated_at();

create table if not exists public.habit_days (
    habit_id uuid not null references public.habits(id) on delete cascade,
    user_id uuid not null default auth.uid()
        references auth.users(id) on delete cascade,
    fecha date not null default current_date,
    created_at timestamptz not null default now(),
    primary key (habit_id, fecha)
);

create index if not exists idx_habit_days_user_fecha
    on public.habit_days(user_id, fecha desc);

-- ------------------------------------------------------------
-- Recordatorio de hábitos
-- ------------------------------------------------------------
create table if not exists public.reminders (
    user_id uuid primary key default auth.uid()
        references auth.users(id) on delete cascade,
    activo boolean not null default false,
    hora time not null default '20:00',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

drop trigger if exists set_reminders_updated_at on public.reminders;
create trigger set_reminders_updated_at
before update on public.reminders
for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Datos opcionales de salud (la app no los guarda todavía)
-- ------------------------------------------------------------
create table if not exists public.health_profiles (
    user_id uuid primary key default auth.uid()
        references auth.users(id) on delete cascade,
    condiciones text[] not null default '{}',
    alergias text[] not null default '{}',
    consentimiento boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

drop trigger if exists set_health_profiles_updated_at on public.health_profiles;
create trigger set_health_profiles_updated_at
before update on public.health_profiles
for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Peso corporal opcional
-- ------------------------------------------------------------
create table if not exists public.weight_logs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null default auth.uid()
        references auth.users(id) on delete cascade,
    fecha date not null default current_date,
    peso_kg numeric(6,2) not null check (peso_kg between 30 and 300),
    created_at timestamptz not null default now(),
    unique (user_id, fecha)
);

create index if not exists idx_weight_logs_user_fecha
    on public.weight_logs(user_id, fecha desc);

-- ------------------------------------------------------------
-- RLS
-- ------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.diet_plans enable row level security;
alter table public.meal_logs enable row level security;
alter table public.workouts enable row level security;
alter table public.exercise_substitutions enable row level security;
alter table public.habits enable row level security;
alter table public.habit_days enable row level security;
alter table public.reminders enable row level security;
alter table public.health_profiles enable row level security;
alter table public.weight_logs enable row level security;

-- Perfil: el id es el mismo id de auth.users.
drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
for select using (id = auth.uid());

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles
for insert with check (id = auth.uid());

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
for update using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists profiles_delete_own on public.profiles;
create policy profiles_delete_own on public.profiles
for delete using (id = auth.uid());

-- Plan
drop policy if exists diet_plans_select_own on public.diet_plans;
create policy diet_plans_select_own on public.diet_plans
for select using (user_id = auth.uid());

drop policy if exists diet_plans_insert_own on public.diet_plans;
create policy diet_plans_insert_own on public.diet_plans
for insert with check (user_id = auth.uid());

drop policy if exists diet_plans_update_own on public.diet_plans;
create policy diet_plans_update_own on public.diet_plans
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists diet_plans_delete_own on public.diet_plans;
create policy diet_plans_delete_own on public.diet_plans
for delete using (user_id = auth.uid());

-- Comidas
drop policy if exists meal_logs_select_own on public.meal_logs;
create policy meal_logs_select_own on public.meal_logs
for select using (user_id = auth.uid());

drop policy if exists meal_logs_insert_own on public.meal_logs;
create policy meal_logs_insert_own on public.meal_logs
for insert with check (user_id = auth.uid());

drop policy if exists meal_logs_update_own on public.meal_logs;
create policy meal_logs_update_own on public.meal_logs
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists meal_logs_delete_own on public.meal_logs;
create policy meal_logs_delete_own on public.meal_logs
for delete using (user_id = auth.uid());

-- Entrenamientos
drop policy if exists workouts_select_own on public.workouts;
create policy workouts_select_own on public.workouts
for select using (user_id = auth.uid());

drop policy if exists workouts_insert_own on public.workouts;
create policy workouts_insert_own on public.workouts
for insert with check (user_id = auth.uid());

drop policy if exists workouts_update_own on public.workouts;
create policy workouts_update_own on public.workouts
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists workouts_delete_own on public.workouts;
create policy workouts_delete_own on public.workouts
for delete using (user_id = auth.uid());

-- Sustituciones de ejercicios
drop policy if exists exercise_substitutions_select_own on public.exercise_substitutions;
create policy exercise_substitutions_select_own on public.exercise_substitutions
for select using (user_id = auth.uid());

drop policy if exists exercise_substitutions_insert_own on public.exercise_substitutions;
create policy exercise_substitutions_insert_own on public.exercise_substitutions
for insert with check (user_id = auth.uid());

drop policy if exists exercise_substitutions_update_own on public.exercise_substitutions;
create policy exercise_substitutions_update_own on public.exercise_substitutions
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists exercise_substitutions_delete_own on public.exercise_substitutions;
create policy exercise_substitutions_delete_own on public.exercise_substitutions
for delete using (user_id = auth.uid());

-- Hábitos
drop policy if exists habits_select_own on public.habits;
create policy habits_select_own on public.habits
for select using (user_id = auth.uid());

drop policy if exists habits_insert_own on public.habits;
create policy habits_insert_own on public.habits
for insert with check (user_id = auth.uid());

drop policy if exists habits_update_own on public.habits;
create policy habits_update_own on public.habits
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists habits_delete_own on public.habits;
create policy habits_delete_own on public.habits
for delete using (user_id = auth.uid());

-- Días de hábitos: además de ser del usuario, el hábito debe ser suyo.
drop policy if exists habit_days_select_own on public.habit_days;
create policy habit_days_select_own on public.habit_days
for select using (
    user_id = auth.uid()
    and exists (
        select 1 from public.habits h
        where h.id = habit_days.habit_id and h.user_id = auth.uid()
    )
);

drop policy if exists habit_days_insert_own on public.habit_days;
create policy habit_days_insert_own on public.habit_days
for insert with check (
    user_id = auth.uid()
    and exists (
        select 1 from public.habits h
        where h.id = habit_days.habit_id and h.user_id = auth.uid()
    )
);

drop policy if exists habit_days_update_own on public.habit_days;
create policy habit_days_update_own on public.habit_days
for update using (
    user_id = auth.uid()
    and exists (
        select 1 from public.habits h
        where h.id = habit_days.habit_id and h.user_id = auth.uid()
    )
)
with check (
    user_id = auth.uid()
    and exists (
        select 1 from public.habits h
        where h.id = habit_days.habit_id and h.user_id = auth.uid()
    )
);

drop policy if exists habit_days_delete_own on public.habit_days;
create policy habit_days_delete_own on public.habit_days
for delete using (
    user_id = auth.uid()
    and exists (
        select 1 from public.habits h
        where h.id = habit_days.habit_id and h.user_id = auth.uid()
    )
);

-- Recordatorio
drop policy if exists reminders_select_own on public.reminders;
create policy reminders_select_own on public.reminders
for select using (user_id = auth.uid());

drop policy if exists reminders_insert_own on public.reminders;
create policy reminders_insert_own on public.reminders
for insert with check (user_id = auth.uid());

drop policy if exists reminders_update_own on public.reminders;
create policy reminders_update_own on public.reminders
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists reminders_delete_own on public.reminders;
create policy reminders_delete_own on public.reminders
for delete using (user_id = auth.uid());

-- Salud opcional
drop policy if exists health_profiles_select_own on public.health_profiles;
create policy health_profiles_select_own on public.health_profiles
for select using (user_id = auth.uid());

drop policy if exists health_profiles_insert_own on public.health_profiles;
create policy health_profiles_insert_own on public.health_profiles
for insert with check (user_id = auth.uid());

drop policy if exists health_profiles_update_own on public.health_profiles;
create policy health_profiles_update_own on public.health_profiles
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists health_profiles_delete_own on public.health_profiles;
create policy health_profiles_delete_own on public.health_profiles
for delete using (user_id = auth.uid());

-- Peso opcional
drop policy if exists weight_logs_select_own on public.weight_logs;
create policy weight_logs_select_own on public.weight_logs
for select using (user_id = auth.uid());

drop policy if exists weight_logs_insert_own on public.weight_logs;
create policy weight_logs_insert_own on public.weight_logs
for insert with check (user_id = auth.uid());

drop policy if exists weight_logs_update_own on public.weight_logs;
create policy weight_logs_update_own on public.weight_logs
for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists weight_logs_delete_own on public.weight_logs;
create policy weight_logs_delete_own on public.weight_logs
for delete using (user_id = auth.uid());

-- ------------------------------------------------------------
-- Permisos
-- ------------------------------------------------------------
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
revoke all on all tables in schema public from anon;

-- ------------------------------------------------------------
-- Comentarios para documentar el contrato
-- ------------------------------------------------------------
comment on table public.profiles is 'Perfil editable de cada usuario. id = auth.users.id.';
comment on table public.diet_plans is 'Plan de alimentación activo: presupuesto, colaciones y horarios.';
comment on table public.meal_logs is 'Una fila por alimento registrado. El id puede generarlo el cliente.';
comment on table public.workouts is 'Una fila por entrenamiento completado.';
comment on table public.exercise_substitutions is 'Preferencias de sustitución de ejercicios por rutina.';
comment on table public.habits is 'Hábitos del usuario.';
comment on table public.habit_days is 'Días completados por hábito; la clave evita duplicados.';
comment on table public.reminders is 'Recordatorio diario de hábitos.';
comment on table public.health_profiles is 'Opcional. La app no guarda condiciones de salud todavía.';
comment on table public.weight_logs is 'Opcional. Registro de peso por día.';
