-- ============================================================
-- VidaActiva — fórmula elegida para estimar la meta calórica
-- ============================================================
-- Guarda si el plan se calculó con Mifflin-St Jeor o con
-- Harris-Benedict revisada. No añade datos de salud ni texto libre.
-- ============================================================

alter table public.diet_plans
    add column if not exists formula text not null default 'mifflin';

alter table public.diet_plans
    drop constraint if exists diet_plans_formula_check;
alter table public.diet_plans
    add constraint diet_plans_formula_check check (formula in ('mifflin', 'harris'));

comment on column public.diet_plans.formula is
    'Fórmula usada para la TMB al generar el plan: mifflin o harris.';
comment on column public.diet_plans.version is
    '2 = plan anterior sin menú; 3 = plan con menú generado; 4 = plan con fórmula elegida.';

-- Las políticas RLS existentes ya cubren la columna nueva.
