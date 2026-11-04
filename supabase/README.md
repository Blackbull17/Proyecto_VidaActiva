# VidaActiva + Supabase

Esta carpeta contiene las migraciones de la base de datos y las políticas RLS.

## Estado

La sincronización remota ya está conectada:

- `js/datos.js` lee y escribe en Supabase cuando hay sesión.
- `js/auth.js` sincroniza todos los datos antes de mostrar una página protegida.
- Si la nube está vacía, sube los datos locales una sola vez.
- Si la nube tiene datos, los usa; conserva y sube los elementos que solo existan en el dispositivo.
- Las sustituciones de ejercicios se guardan por rutina sin modificar el catálogo ni el historial; las alternativas son curadas por zona y tipo de dosis.
- Al cerrar sesión se borra la caché local y la marca de propietario del dispositivo.

## 1. Crear el proyecto

1. Entra a <https://supabase.com> y crea un proyecto.
2. Guarda la contraseña de la base de datos en un lugar seguro.
3. En **Project Settings → API** copia:
   - Project URL
   - `anon` / publishable public key

No copies la `service_role` key al frontend.

## 2. Ejecutar las migraciones

En **SQL Editor**, en este orden:

1. `migrations/202610230001_init.sql` (solo si la base es nueva).
2. `migrations/202610270001_habit_days_update.sql`.
3. `migrations/202610280001_exercise_substitutions.sql`.

La segunda migración es necesaria porque la app hace `upsert` sobre `habit_days(habit_id, fecha)`. Si la fila ya existe, PostgreSQL requiere una política `UPDATE` además de `INSERT`.

La tercera crea `exercise_substitutions` para recordar qué ejercicio cambió cada usuario en cada rutina. Usa una clave por `(user_id, rutina_id, ejercicio_original_id)` y un `deleted_at` para que un cambio borrado no reaparezca al sincronizar otro dispositivo.

Opción con CLI:

```bash
supabase link --project-ref TU_PROJECT_REF
supabase db push
```

## 3. Configurar el acceso

En **Authentication → Providers → Email**:

- Deja el correo/contraseña activo.
- Desactiva **Allow new users to sign up** si quieres invitación manual.
- Configura SMTP si quieres enviar invitaciones y recuperación de contraseña.

En **Authentication → URL Configuration**:

- Site URL: la página de acceso, por ejemplo `https://vidaactiva.netlify.app/acceso.html`.
- Redirect URLs: agrega `https://tu-dominio/acceso.html` y, si usas el dominio raíz, `https://tu-dominio/`.

No invites a las personas hasta que la URL de producción esté configurada.

## 4. Conectar el frontend

Edita `js/config.js`:

```js
window.VA_CONFIG = {
    supabaseUrl: 'https://TU-PROYECTO.supabase.co',
    supabaseAnonKey: 'TU-PUBLISHABLE-KEY'
};
```

Al recargar, `auth.js` activa el login real y `datos.js` sincroniza con las tablas.

> Importante: la app debe servirse por HTTP/HTTPS. Abrirla con `file://` rompe las redirecciones de Supabase Auth.

## 5. Crear usuarios

Para 5–7 personas, lo más sencillo es:

1. Invitar desde **Authentication → Users → Invite user**.
2. La persona recibe el correo, abre el enlace y establece su contraseña.
3. Al entrar por primera vez, la app la lleva a `onboarding.html`.

No compartas la misma cuenta entre varias personas: cada una debe tener su usuario para que RLS separe sus datos.

## 6. Probar RLS

Con dos cuentas distintas:

1. Inicia sesión con la cuenta A y registra una comida, un hábito y un entrenamiento.
2. Cambia un ejercicio de una rutina y confirma la fila en `exercise_substitutions`.
3. Recarga la página; el cambio debe seguir aplicado a esa rutina.
4. Cierra sesión; la app borra los datos locales de A.
5. Inicia sesión con la cuenta B.
6. La cuenta B no debe ver nada de la cuenta A.
7. Desde el cliente, intenta leer una fila ajena: debe devolver 0 filas.

## 7. Orden recomendado antes de publicar

- [ ] Ejecutar la migración inicial, la de `habit_days` y la de `exercise_substitutions`.
- [ ] Configurar Site URL y Redirect URLs.
- [ ] Desactivar registro público.
- [ ] Probar la sincronización real con una cuenta.
- [ ] Probar dos cuentas y dos dispositivos.
- [ ] Invitar a las 5–7 personas.
- [ ] Exportar un respaldo desde `cuenta.html`.
- [ ] Revisar la política de privacidad y el consentimiento para datos de salud.
- [ ] Configurar backups del proyecto.

## Tablas usadas por la app

| Tabla | Uso |
| --- | --- |
| `profiles` | Perfil del usuario. `id = auth.users.id`. |
| `diet_plans` | Un plan activo por usuario. |
| `meal_logs` | Un alimento registrado por fila. |
| `workouts` | Un entrenamiento completado por fila. |
| `exercise_substitutions` | Ejercicio elegido por el usuario para una rutina concreta. |
| `habits` | Hábitos del usuario. |
| `habit_days` | Días completados por hábito. |
| `reminders` | Recordatorio diario. |

`health_profiles` y `weight_logs` existen como opcionales, pero la app todavía no las usa. Las condiciones de salud y alergias no se guardan.
