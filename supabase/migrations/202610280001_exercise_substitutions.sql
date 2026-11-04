-- ============================================================
-- VidaActiva — sustituciones de ejercicios por rutina
-- ============================================================
-- Cada fila guarda la preferencia de un usuario para una rutina:
-- "en esta rutina, cambio este ejercicio por este otro".
-- El catálogo y las rutinas siguen viviendo en js/ejercicios.js;
-- aquí solo se guardan los IDs y el motivo de la sustitución.
-- ============================================================

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

alter table public.exercise_substitutions enable row level security;

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

grant select, insert, update, delete on public.exercise_substitutions to authenticated;
revoke all on public.exercise_substitutions from anon;

comment on table public.exercise_substitutions is
    'Preferencias de sustitución de ejercicios por rutina. El catálogo vive en el frontend.';
comment on column public.exercise_substitutions.rutina_id is
    'ID de la rutina en js/ejercicios.js.';
comment on column public.exercise_substitutions.ejercicio_original_id is
    'ID del ejercicio original dentro de la rutina.';
comment on column public.exercise_substitutions.ejercicio_sustituto_id is
    'ID del ejercicio que el usuario prefiere en su lugar.';
comment on column public.exercise_substitutions.deleted_at is
    'Marca de borrado para que la preferencia no reaparezca al sincronizar otro dispositivo.';
