(function () {
    'use strict';

    function mensaje(texto, tipo) {
        const estado = document.getElementById('estadoCuenta');
        if (!estado) return;
        estado.textContent = texto;
        estado.className = 'auth-status ' + (tipo || '');
    }

    function fechaParaArchivo() {
        return new Date().toISOString().slice(0, 10);
    }

    function mostrarResumen() {
        const perfil = VA.datos.perfil.obtener();
        const resumen = document.getElementById('resumenCuenta');
        const modo = document.getElementById('modoCuenta');
        const configurado = VA.auth.configurado();

        if (resumen) {
            if (perfil && perfil.nombre) {
                resumen.innerHTML = '<strong>' + escapar(perfil.nombre) + '</strong><br>' +
                    (perfil.calorias_objetivo ? perfil.calorias_objetivo.toLocaleString('es-MX') + ' kcal/día estimadas<br>' : '') +
                    (perfil.objetivo ? 'Objetivo: ' + etiquetaObjetivo(perfil.objetivo) : '');
            } else {
                resumen.textContent = 'Todavía no completaste tu perfil.';
            }
        }

        if (modo) {
            if (configurado) {
                const email = VA.auth.usuarioEmail();
                modo.textContent = (email
                    ? 'Sesión de Supabase: ' + email + '. '
                    : 'Sesión de Supabase activa. ') +
                    'Tus datos se sincronizan con Supabase.';
            } else {
                modo.textContent = 'Modo local: los datos están solo en este dispositivo. Configura Supabase en js/config.js para activar el inicio de sesión y la sincronización.';
            }
        }
    }

    function escapar(texto) {
        return String(texto == null ? '' : texto).replace(/[&<>"']/g, function (caracter) {
            return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[caracter];
        });
    }

    function etiquetaObjetivo(objetivo) {
        if (objetivo === 'bajar') return 'bajar de peso';
        if (objetivo === 'subir') return 'ganar masa muscular';
        return 'mantener peso';
    }

    document.addEventListener('DOMContentLoaded', async function () {
        mostrarResumen();

        if (VA.auth.configurado()) {
            try {
                await VA.auth.obtenerSesion();
                mostrarResumen();
            } catch (error) {
                // La protección de auth.js ya muestra el error de conexión.
            }
        }

        const btnExportar = document.getElementById('btnExportar');
        if (btnExportar) {
            btnExportar.addEventListener('click', function () {
                const paquete = VA.datos.exportar();
                const blob = new Blob([JSON.stringify(paquete, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const enlace = document.createElement('a');
                enlace.href = url;
                enlace.download = 'vidaactiva-respaldo-' + fechaParaArchivo() + '.json';
                document.body.appendChild(enlace);
                enlace.click();
                enlace.remove();
                URL.revokeObjectURL(url);
                mensaje('Respaldo descargado.', 'exito');
            });
        }

        const archivo = document.getElementById('archivoImportar');
        if (archivo) {
            archivo.addEventListener('change', function () {
                const file = archivo.files && archivo.files[0];
                if (!file) return;

                const lector = new FileReader();
                lector.onload = function () {
                    try {
                        const paquete = JSON.parse(String(lector.result || ''));
                        if (!confirm('Esto reemplazará los datos locales y también los de tu cuenta en Supabase. ¿Continuar?')) return;
                        if (!VA.datos.importar(paquete)) throw new Error('Formato no válido');
                        mensaje('Respaldo importado. Recarga la página para ver los cambios.', 'exito');
                        mostrarResumen();
                    } catch (error) {
                        mensaje('El archivo no es un respaldo válido de VidaActiva.', 'error');
                    } finally {
                        archivo.value = '';
                    }
                };
                lector.onerror = function () {
                    mensaje('No se pudo leer el archivo.', 'error');
                    archivo.value = '';
                };
                lector.readAsText(file);
            });
        }

        const btnBorrar = document.getElementById('btnBorrar');
        if (btnBorrar) {
            btnBorrar.addEventListener('click', function () {
                if (!confirm('Se borrarán los datos de VidaActiva guardados en este dispositivo. Los datos de tu cuenta seguirán en Supabase y se volverán a descargar al iniciar sesión. ¿Continuar?')) return;
                VA.datos.borrarTodo();
                mensaje('Datos locales borrados. Los datos de tu cuenta siguen en Supabase.', 'exito');
                setTimeout(function () {
                    window.location.replace('index.html');
                }, 700);
            });
        }

        const btnCerrar = document.getElementById('btnCerrarSesion');
        if (btnCerrar) {
            btnCerrar.addEventListener('click', async function () {
                try {
                    await VA.auth.cerrarSesion();
                } catch (error) {
                    mensaje(error.message || 'No se pudo cerrar la sesión.', 'error');
                }
            });
        }
    });
})();
