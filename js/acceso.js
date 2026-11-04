(function () {
    'use strict';

    function mensaje(elemento, texto, tipo) {
        if (!elemento) return;
        elemento.textContent = texto;
        elemento.className = 'auth-status ' + (tipo || '');
    }

    function mensajeError(error, respaldo) {
        const texto = String((error && error.message) || '');
        if (/invalid login credentials/i.test(texto)) return 'Correo o contraseña incorrectos.';
        if (/email not confirmed/i.test(texto)) return 'Confirma tu correo antes de entrar.';
        if (/password should be at least/i.test(texto)) return 'La contraseña debe tener al menos 8 caracteres.';
        if (/rate limit/i.test(texto)) return 'Demasiados intentos. Espera un momento y vuelve a probar.';
        if (/failed to fetch|network/i.test(texto)) return 'No se pudo conectar. Revisa tu conexión.';
        return respaldo;
    }

    function destinoSeguro() {
        const params = new URLSearchParams(window.location.search);
        const siguiente = params.get('next');
        if (siguiente && /^[a-z0-9_-]+\.html(\?.*)?$/i.test(siguiente)) {
            return siguiente;
        }
        return 'principal.html';
    }

    document.addEventListener('DOMContentLoaded', async function () {
        const local = document.getElementById('accesoLocal');
        const form = document.getElementById('formAcceso');
        const formPassword = document.getElementById('formPassword');
        const mensajeAcceso = document.getElementById('mensajeAcceso');
        const mensajePassword = document.getElementById('mensajePassword');
        const configurado = window.VA && VA.auth && VA.auth.configurado();

        if (!configurado) {
            if (local) local.hidden = false;
            if (form) form.hidden = true;
            return;
        }

        if (local) local.hidden = true;
        if (form) form.hidden = false;

        const params = new URLSearchParams(window.location.search);
        const hash = window.location.hash || '';
        const vieneDeInvitacion = hash.indexOf('type=invite') >= 0 || hash.indexOf('type=recovery') >= 0;
        const requiereNuevaContrasena = vieneDeInvitacion || params.get('modo') === 'recuperar';

        if (params.get('error') === 'conexion') {
            mensaje(mensajeAcceso, 'No se pudo comprobar la sesión. Revisa tu conexión e inténtalo de nuevo.', 'error');
        }

        // En una invitación/recuperación Supabase crea una sesión temporal.
        // No debemos redirigir al panel: primero hay que establecer contraseña.
        if (requiereNuevaContrasena) {
            if (form) form.hidden = true;
            if (formPassword) formPassword.hidden = false;

            // Deja que el SDK procese los tokens del enlace antes de guardar
            // la contraseña. Si falla, el usuario verá el error al enviar.
            try {
                const sesionInvitacion = await VA.auth.obtenerSesion();
                if (!sesionInvitacion) {
                    mensaje(mensajePassword, 'Abre el enlace completo del correo de invitación o recuperación para continuar.', 'error');
                }
            } catch (error) {
                console.warn('VidaActiva: no se pudo preparar la sesión de invitación.', error);
                mensaje(mensajePassword, 'No se pudo validar el enlace. Revisa tu conexión o pide uno nuevo.', 'error');
            }
        } else {
            try {
                const sesion = await VA.auth.obtenerSesion();
                if (sesion) {
                    window.location.replace(destinoSeguro());
                    return;
                }
            } catch (error) {
                mensaje(mensajeAcceso, 'No se pudo comprobar la sesión. Revisa tu conexión.', 'error');
            }
        }

        if (form) {
            form.addEventListener('submit', async function (evento) {
                evento.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const boton = document.getElementById('btnEntrar');

                boton.disabled = true;
                mensaje(mensajeAcceso, 'Entrando…', '');
                try {
                    await VA.auth.iniciarSesion(email, password);
                    window.location.replace(destinoSeguro());
                } catch (error) {
                    mensaje(mensajeAcceso, mensajeError(error, 'No se pudo iniciar sesión. Revisa tus datos.'), 'error');
                    boton.disabled = false;
                }
            });
        }

        const btnRecuperar = document.getElementById('btnRecuperar');
        if (btnRecuperar) {
            btnRecuperar.addEventListener('click', async function () {
                const email = document.getElementById('email').value.trim();
                if (!email) {
                    mensaje(mensajeAcceso, 'Escribe tu correo primero.', 'error');
                    return;
                }

                btnRecuperar.disabled = true;
                try {
                    await VA.auth.recuperarContrasena(email);
                    mensaje(mensajeAcceso, 'Te enviamos un correo para restablecer la contraseña.', 'exito');
                } catch (error) {
                    mensaje(mensajeAcceso, mensajeError(error, 'No se pudo enviar el correo.'), 'error');
                } finally {
                    btnRecuperar.disabled = false;
                }
            });
        }

        if (formPassword) {
            formPassword.addEventListener('submit', async function (evento) {
                evento.preventDefault();
                const nueva = document.getElementById('passwordNueva').value;
                const confirmar = document.getElementById('passwordConfirmar').value;

                if (nueva.length < 8) {
                    mensaje(mensajePassword, 'La contraseña debe tener al menos 8 caracteres.', 'error');
                    return;
                }
                if (nueva !== confirmar) {
                    mensaje(mensajePassword, 'Las contraseñas no coinciden.', 'error');
                    return;
                }

                const boton = formPassword.querySelector('button[type="submit"]');
                boton.disabled = true;
                mensaje(mensajePassword, 'Guardando…', '');
                try {
                    await VA.auth.actualizarContrasena(nueva);
                    mensaje(mensajePassword, 'Contraseña guardada. Entrando…', 'exito');
                    setTimeout(function () {
                        window.location.replace('onboarding.html');
                    }, 900);
                } catch (error) {
                    mensaje(mensajePassword, mensajeError(error, 'No se pudo guardar la contraseña.'), 'error');
                    boton.disabled = false;
                }
            });
        }
    });
})();
