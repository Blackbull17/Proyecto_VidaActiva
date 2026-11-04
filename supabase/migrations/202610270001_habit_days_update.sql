-- ============================================================
-- VidaActiva — política faltante para actualizar días de hábitos
-- ============================================================
-- La app usa upsert sobre habit_days(habit_id, fecha). Cuando la fila
-- ya existe, PostgreSQL necesita una política UPDATE además de INSERT.
-- Ejecutar una sola vez en Supabase → SQL Editor.

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
