(function () {
    'use strict';

    function valor(id) {
        const campo = document.getElementById(id);
        return campo ? campo.value : '';
    }

    function leerFormulario() {
        return {
            nombre: valor('nombre').trim(),
            edad: Number(valor('edad')) || 0,
            sexo: valor('sexo') || 'prefiero_no_decir',
            peso_kg: Number(valor('peso')) || 0,
            estatura_cm: Number(valor('estatura')) || 0,
            actividad: valor('actividad') || 'moderado',
            objetivo: valor('objetivo') || 'mantener',
            peso_meta_kg: Number(valor('pesoMeta')) || 0
        };
    }

    function validar(perfil) {
        if (!perfil.nombre) return 'Escribe tu nombre.';
        if (!(perfil.edad >= 12 && perfil.edad <= 100)) return 'La edad debe estar entre 12 y 100 años.';
        if (!(perfil.peso_kg >= 30 && perfil.peso_kg <= 300)) return 'El peso debe estar entre 30 y 300 kg.';
        if (!(perfil.estatura_cm >= 100 && perfil.estatura_cm <= 250)) return 'La estatura debe estar entre 100 y 250 cm.';
        if (perfil.peso_meta_kg && !(perfil.peso_meta_kg >= 30 && perfil.peso_meta_kg <= 300)) {
            return 'El peso objetivo debe estar entre 30 y 300 kg.';
        }
        return '';
    }

    function mensaje(texto, tipo) {
        const estado = document.getElementById('estadoOnboarding');
        if (!estado) return;
        estado.textContent = texto;
        estado.className = 'auth-status ' + (tipo || '');
    }

    function actualizarCalorias() {
        const perfil = leerFormulario();
        const calorias = VA.datos.calcularCaloriasObjetivo(perfil);
        const destino = document.getElementById('caloriasObjetivo');
        if (destino) destino.textContent = calorias.toLocaleString('es-MX') + ' kcal/día';
    }

    document.addEventListener('DOMContentLoaded', function () {
        const form = document.getElementById('formOnboarding');
        if (!form) return;

        const existente = VA.datos.perfil.obtener();
        const params = new URLSearchParams(window.location.search);
        if (existente && existente.onboarding_completado && params.get('editar') !== '1') {
            window.location.replace('principal.html');
            return;
        }

        if (existente) {
            const campos = {
                nombre: existente.nombre,
                edad: existente.edad || '',
                sexo: existente.sexo || 'prefiero_no_decir',
                peso: existente.peso_kg || '',
                estatura: existente.estatura_cm || '',
                actividad: existente.actividad || 'moderado',
                objetivo: existente.objetivo || 'mantener',
                pesoMeta: existente.peso_meta_kg || ''
            };

            Object.keys(campos).forEach(function (id) {
                const campo = document.getElementById(id);
                if (campo) campo.value = campos[id];
            });
        }

        actualizarCalorias();
        ['nombre', 'edad', 'sexo', 'peso', 'estatura', 'actividad', 'objetivo', 'pesoMeta'].forEach(function (id) {
            const campo = document.getElementById(id);
            if (!campo) return;
            campo.addEventListener('input', actualizarCalorias);
            campo.addEventListener('change', actualizarCalorias);
        });

        form.addEventListener('submit', async function (evento) {
            evento.preventDefault();
            const perfil = leerFormulario();
            const error = validar(perfil);
            if (error) {
                mensaje(error, 'error');
                return;
            }

            if (VA.auth.configurado()) {
                try {
                    const sesion = await VA.auth.obtenerSesion();
                    if (!sesion) {
                        window.location.replace('acceso.html?next=onboarding.html');
                        return;
                    }
                } catch (err) {
                    mensaje('No se pudo comprobar la sesión. Revisa tu conexión.', 'error');
                    return;
                }
            }

            const guardado = VA.datos.perfil.guardar(Object.assign({}, perfil, {
                onboarding_completado: true
            }));

            if (!guardado) {
                mensaje('No se pudo guardar el perfil. Revisa el almacenamiento del navegador.', 'error');
                return;
            }

            if (VA.auth.configurado()) {
                mensaje('Guardando en Supabase…', '');

                try {
                    await VA.datos.perfil.guardarRemoto(guardado);
                } catch (errorRemoto) {
                    console.error('VidaActiva: no se pudo sincronizar el perfil.', errorRemoto);
                    mensaje(
                        'Perfil guardado en este dispositivo, pero no se pudo sincronizar con Supabase. Revisa tu conexión e inténtalo de nuevo.',
                        'error'
                    );
                    return;
                }
            }

            mensaje('Perfil guardado. Entrando…', 'exito');
            setTimeout(function () {
                window.location.replace('principal.html');
            }, 500);
        });
    });
})();
