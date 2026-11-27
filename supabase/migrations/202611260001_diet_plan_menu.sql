-- ============================================================
-- VidaActiva — menú generado dentro del plan de alimentación
-- ============================================================
-- Guarda el menú semanal que produce el generador de dietas para
-- que el recordatorio del inicio y la pantalla de dieta puedan
-- reconstruirlo tras recargar o cambiar de dispositivo.
--
-- No guarda condiciones de salud, alergias, medicamentos ni la
-- firma de filtros en texto plano: solo una huella corta.
-- ============================================================

alter table public.diet_plans
    add column if not exists menu_semana jsonb not null default '{}'::jsonb,
    add column if not exists huella_filtros text not null default '',
    add column if not exists distribucion text not null default 'equilibrada',
    add column if not exists kcal_objetivo integer,
    add column if not exists version smallint not null default 2;

-- {} = plan anterior sin menú generado.
-- Un array de 1 a 7 días = plan generado por la versión 3 del motor.
-- CASE evita evaluar jsonb_array_length sobre un objeto.
alter table public.diet_plans
    drop constraint if exists diet_plans_menu_semana_formato_check;
alter table public.diet_plans
    add constraint diet_plans_menu_semana_formato_check check (
        case
            when jsonb_typeof(menu_semana) = 'object' then true
            when jsonb_typeof(menu_semana) = 'array' then jsonb_array_length(menu_semana) between 1 and 7
            else false
        end
    );

alter table public.diet_plans
    drop constraint if exists diet_plans_distribucion_check;
alter table public.diet_plans
    add constraint diet_plans_distribucion_check check (
        distribucion in (
            'equilibrada', 'proteica', 'baja_grasa',
            'diabetes', 'hipertension', 'colesterol', 'somp'
        )
    );

alter table public.diet_plans
    drop constraint if exists diet_plans_version_check;
alter table public.diet_plans
    add constraint diet_plans_version_check check (version between 1 and 10);

alter table public.diet_plans
    drop constraint if exists diet_plans_kcal_objetivo_check;
alter table public.diet_plans
    add constraint diet_plans_kcal_objetivo_check check (
        kcal_objetivo is null or kcal_objetivo between 1200 and 4000
    );

alter table public.diet_plans
    drop constraint if exists diet_plans_huella_filtros_check;
alter table public.diet_plans
    add constraint diet_plans_huella_filtros_check check (
        char_length(huella_filtros) <= 32 and huella_filtros ~ '^[0-9a-f]*$'
    );

comment on table public.diet_plans is
    'Plan activo por usuario: presupuesto, colaciones, horarios y menú semanal generado.';
comment on column public.diet_plans.menu_semana is
    'Array de hasta 7 días {menuId, comidas, cambios}. Solo ids del catálogo; nunca texto libre ni HTML.';
comment on column public.diet_plans.huella_filtros is
    'Huella hexadecimal de los filtros usados al generar. No contiene condiciones, alergias ni medicamentos en texto plano.';
comment on column public.diet_plans.distribucion is
    'Distribución energética elegida al generar el plan.';
comment on column public.diet_plans.kcal_objetivo is
    'Energía diaria calculada al generar el plan.';
comment on column public.diet_plans.version is
    '2 = plan anterior sin menú; 3 = plan con menú generado.';

-- Las políticas RLS existentes de diet_plans ya cubren las columnas nuevas.
-- No se crea ninguna tabla ni política adicional.
