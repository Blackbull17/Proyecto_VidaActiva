/*
 * VidaActiva — sesión y protección de páginas.
 *
 * Modo local: no hay cuentas reales. La app sigue funcionando en este
 * dispositivo y se exige un perfil antes de entrar a las páginas privadas.
 *
 * Modo Supabase: cuando js/config.js tiene URL y publishable key, se carga
 * el SDK, se comprueba la sesión, se sincronizan los datos y se redirige a
 * acceso.html si no hay usuario.
 */
(function () {
    'use strict';

    const config = window.VA_CONFIG || {};
    const configurado = Boolean(config.supabaseUrl && config.supabaseAnonKey);

    let cliente = null;
    let cargandoSDK = null;
    let sesionActual = null;
    let escuchandoAuth = false;

    function modo() {
        return configurado ? 'supabase' : 'local';
    }

    function cargarSDK() {
        if (window.supabase && typeof window.supabase.createClient === 'function') {
            return Promise.resolve();
        }

        if (cargandoSDK) return cargandoSDK;

        cargandoSDK = new Promise(function (resolve, reject) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
            script.async = true;
            script.onload = function () {
                if (window.supabase && typeof window.supabase.createClient === 'function') {
                    resolve();
                } else {
                    reject(new Error('El SDK de Supabase no se cargó correctamente.'));
                }
            };
            script.onerror = function () {
                reject(new Error('No se pudo cargar el SDK de Supabase. Revisa la conexión.'));
            };
            document.head.appendChild(script);
        });

        return cargandoSDK;
    }

    async function preparar() {
        if (!configurado) return null;
        if (cliente) return cliente;

        await cargarSDK();
        cliente = window.supabase.createClient(
            config.supabaseUrl,
            config.supabaseAnonKey,
            {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true
                }
            }
        );

        if (!escuchandoAuth) {
            escuchandoAuth = true;
            cliente.auth.onAuthStateChange(function (_evento, sesion) {
                sesionActual = sesion || null;
            });
        }

        return cliente;
    }

    async function obtenerSesion() {
        if (!configurado) {
            return {
                local: true,
                user: { id: 'local', email: '' }
            };
        }

        const sb = await preparar();
        const resultado = await sb.auth.getSession();
        if (resultado.error) throw resultado.error;
        sesionActual = resultado.data.session || null;
        return sesionActual;
    }

    async function iniciarSesion(email, password) {
        const sb = await preparar();
        const resultado = await sb.auth.signInWithPassword({
            email: String(email || '').trim(),
            password: String(password || '')
        });
        if (resultado.error) throw resultado.error;
        sesionActual = resultado.data.session || null;
        return sesionActual;
    }

    async function recuperarContrasena(email) {
        const sb = await preparar();
        const destino = new URL('acceso.html?modo=recuperar', window.location.href).href;
        const resultado = await sb.auth.resetPasswordForEmail(String(email || '').trim(), {
            redirectTo: destino
        });
        if (resultado.error) throw resultado.error;
        return true;
    }

    async function actualizarContrasena(password) {
        const sb = await preparar();
        const resultado = await sb.auth.updateUser({ password: String(password || '') });
        if (resultado.error) throw resultado.error;
        return true;
    }

    async function cerrarSesion() {
        if (configurado) {
            const sb = await preparar();
            const resultado = await sb.auth.signOut();
            if (resultado.error) throw resultado.error;

            // Al cerrar sesión no dejamos datos de esta cuenta en un equipo
            // compartido. Los datos remotos siguen en Supabase.
            if (window.VA && VA.datos && typeof VA.datos.borrarTodo === 'function') {
                VA.datos.borrarTodo();
            }
        }
        sesionActual = null;
        window.location.replace('index.html');
    }

    function usuarioId() {
        if (!configurado) return 'local';
        return sesionActual && sesionActual.user ? sesionActual.user.id : '';
    }

    function usuarioEmail() {
        if (!configurado) return '';
        return sesionActual && sesionActual.user ? (sesionActual.user.email || '') : '';
    }

    function redirigirAcceso() {
        const actual = window.location.pathname.split('/').pop() + window.location.search;
        const destino = actual && actual !== 'acceso.html' ? actual : 'principal.html';
        window.location.replace('acceso.html?next=' + encodeURIComponent(destino));
    }

    async function proteger() {
        // index.html y acceso.html son públicas.
        if (document.body.dataset.public === 'true') return;

        if (!configurado) {
            if (document.body.dataset.onboarding !== 'true') {
                const perfil = window.VA && VA.datos ? VA.datos.perfil.obtener() : null;
                if (!perfil || !perfil.nombre) {
                    window.location.replace('onboarding.html');
                }
            }
            return;
        }

        let sesion = null;
        try {
            sesion = await obtenerSesion();
        } catch (error) {
            console.error('VidaActiva: no se pudo comprobar la sesión.', error);
            window.location.replace('acceso.html?error=conexion');
            return;
        }

        if (!sesion) {
            redirigirAcceso();
            return;
        }

        let errorSincronizacion = false;

        if (window.VA && VA.datos && typeof VA.datos.sincronizar === 'function') {
            try {
                const sincronizacion = await VA.datos.sincronizar();

                if (sincronizacion && sincronizacion.cambioLocal) {
                    let yaRecargo = false;
                    try {
                        yaRecargo = sessionStorage.getItem('vidaActivaRecargaPerfil') === '1';
                    } catch (error) {
                        // sessionStorage puede estar bloqueado en modo privado.
                    }

                    if (!yaRecargo) {
                        try {
                            sessionStorage.setItem('vidaActivaRecargaPerfil', '1');
                        } catch (error) {
                            // Si no se puede recordar, se evita el bucle igualmente.
                        }
                        window.location.reload();
                        return;
                    }

                    try {
                        sessionStorage.removeItem('vidaActivaRecargaPerfil');
                    } catch (error) {
                        // Sin sesión de almacenamiento; continuar con el render.
                    }
                } else {
                    try {
                        sessionStorage.removeItem('vidaActivaRecargaPerfil');
                    } catch (error) {
                        // Sin sesión de almacenamiento; continuar.
                    }
                }
            } catch (error) {
                errorSincronizacion = true;
                console.warn('VidaActiva: no se pudieron sincronizar los datos con Supabase.', error);
                if (window.VA && VA.datos && typeof VA.datos.avisarError === 'function') {
                    VA.datos.avisarError('No se pudieron sincronizar todos los datos. Se muestran los datos guardados en este dispositivo.');
                }
            }
        }

        if (document.body.dataset.onboarding !== 'true') {
            const perfil = window.VA && VA.datos ? VA.datos.perfil.obtener() : null;
            if (!perfil || !perfil.nombre) {
                if (errorSincronizacion) {
                    window.location.replace('acceso.html?error=conexion');
                    return;
                }
                window.location.replace('onboarding.html');
            }
        }
    }

    document.addEventListener('DOMContentLoaded', proteger);

    window.VA = window.VA || {};
    window.VA.auth = {
        configurado: function () { return configurado; },
        modo: modo,
        preparar: preparar,
        cliente: preparar,
        obtenerSesion: obtenerSesion,
        iniciarSesion: iniciarSesion,
        recuperarContrasena: recuperarContrasena,
        actualizarContrasena: actualizarContrasena,
        cerrarSesion: cerrarSesion,
        usuarioId: usuarioId,
        usuarioEmail: usuarioEmail,
        redirigirAcceso: redirigirAcceso,
        proteger: proteger
    };
})();
