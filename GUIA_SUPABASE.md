# Guía rápida: conectar VidaActiva a Supabase

## Estado actual

La app ya tiene **sincronización remota activa** con Supabase:

- El perfil, el plan, las comidas, los entrenamientos, los hábitos y el recordatorio se guardan en `localStorage` y se envían a Supabase.
- Al abrir una página protegida, `js/auth.js` ejecuta `VA.datos.sincronizar()` antes de mostrar los datos.
- Si la nube está vacía, los datos locales existentes se suben una sola vez.
- Si la nube ya tiene datos, se usan los remotos; los elementos que solo existan en el dispositivo se conservan y se suben.
- El perfil y el recordatorio usan `updated_at` para decidir cuál es más reciente.
- Los hábitos usan `updated_at` por hábito; los días completados se sincronizan con `habit_id + fecha`.
- Las sustituciones de ejercicios se guardan por rutina en `exercise_substitutions` y respetan RLS. Solo se ofrecen alternativas de la misma zona, filtradas por dosis de repeticiones o tiempo.
- Al cerrar sesión se borran los datos locales y la marca de propietario del dispositivo.

La app sigue funcionando en local si falla la red. En ese caso muestra un aviso y conserva los datos en el dispositivo.

> Importante: no invites todavía a las 5–7 personas hasta verificar la sincronización real y configurar la URL de producción.

## 1. Crear el proyecto

1. Entra a <https://supabase.com> y crea un proyecto.
2. Copia la **Project URL** y la **publishable/anon public key** desde **Project Settings → API**.
3. No uses la `service_role` key en el navegador.

## 2. Ejecutar las migraciones

En **SQL Editor**:

1. Ejecuta `supabase/migrations/202610230001_init.sql` si la base es nueva.
2. Ejecuta `supabase/migrations/202610270001_habit_days_update.sql`.
3. Ejecuta `supabase/migrations/202610280001_exercise_substitutions.sql`.

La segunda migración agrega la política `UPDATE` que falta en `habit_days`. Sin ella, marcar o desmarcar un hábito que ya existe puede fallar con un error de RLS.

La tercera crea `exercise_substitutions`, la tabla que recuerda qué ejercicio cambió cada usuario en cada rutina. Si no está aplicada, la app sigue funcionando en local, pero no sincroniza esos cambios entre dispositivos.

La guía detallada está en `supabase/README.md`.

## 3. Configurar Auth

- Desactiva **Allow new users to sign up** para que sea solo por invitación.
- Configura SMTP para invitaciones y recuperación de contraseña.
- En **URL Configuration**, usa como Site URL la página de acceso, por ejemplo:
  `https://tu-dominio/acceso.html`.
- Agrega esa misma URL a **Redirect URLs**.

Mientras pruebas en local puedes usar `http://127.0.0.1:8765/acceso.html`, pero no invites a nadie con esa URL.

## 4. Conectar el frontend

`js/config.js` ya debe tener:

```js
window.VA_CONFIG = {
    supabaseUrl: 'https://TU-PROYECTO.supabase.co',
    supabaseAnonKey: 'TU-PUBLISHABLE-KEY'
};
```

Recarga la app servida por HTTP/HTTPS. No uses `file://`.

## 5. Probar la sincronización real

Antes de probar, exporta un respaldo desde `cuenta.html` si tienes datos locales importantes.

1. Inicia sesión en `acceso.html`.
2. Entra a `perfil.html`, cambia un dato y guarda.
3. En Supabase → **Table Editor → profiles**, confirma que cambió la fila de tu usuario.
4. En `alimentacion.html`, cambia el plan y agrega/elimina una comida.
5. Confirma los cambios en `diet_plans` y `meal_logs`.
6. Completa un entrenamiento y confirma la fila en `workouts`.
7. Crea o marca un hábito y confirma `habits` y `habit_days`.
8. En una rutina, cambia un ejercicio por una alternativa y confirma la fila en `exercise_substitutions`.
9. Recarga la rutina; el cambio debe seguir aplicado. Prueba también “Volver al original”.
10. Activa o desactiva el recordatorio y confirma `reminders`.
11. Recarga la página con `Ctrl + F5`; los datos deben seguir ahí.
12. Prueba en otro dispositivo con la misma cuenta: debe bajar lo mismo.

Si algo falla, revisa la consola del navegador y el nombre de la tabla antes de cambiar el esquema.

## 6. Invitar a las personas

Solo después de que la sincronización real funcione:

1. **Authentication → Users → Invite user**.
2. La persona abre el enlace del correo y establece su contraseña.
3. Entra a `onboarding.html` y completa su perfil.

Cada persona debe tener su propia cuenta. No compartas una cuenta entre varias personas: RLS separa los datos por `auth.uid()`.

## 7. Probar RLS con dos cuentas

1. Cuenta A: registra una comida, un hábito, un entrenamiento y una sustitución de ejercicio.
2. Cierra sesión. La app borra los datos locales de A.
3. Cuenta B: no debe ver nada de A, incluida la fila de `exercise_substitutions`.
4. En `cuenta.html`, B no debe poder importar ni ver datos de A.
5. En el SQL Editor, una consulta con RLS no debe devolver filas ajenas.

## 8. Antes de publicar

- [ ] Ejecutar la migración inicial, la de `habit_days` y la de `exercise_substitutions`.
- [ ] Verificar perfil, plan, comidas, entrenamientos, sustituciones, hábitos y recordatorio en Supabase.
- [ ] Probar dos cuentas y dos dispositivos.
- [ ] Configurar Site URL y Redirect URLs de producción.
- [ ] Desactivar registro público.
- [ ] Exportar un respaldo desde `cuenta.html`.
- [ ] Configurar backups del proyecto.
- [ ] Revisar privacidad y consentimiento para datos de salud.

Las condiciones de salud y alergias se usan solo para generar menús y **no se guardan** en Supabase.
