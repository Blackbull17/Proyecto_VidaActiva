/*
 * VidaActiva — capa de datos local
 *
 * Esta capa concentra el acceso a localStorage, normaliza los registros con
 * la misma forma que las tablas de Supabase y sincroniza con PostgreSQL
 * cuando hay una sesión activa. La app conserva el modo local como respaldo.
 */
(function () {
    'use strict';

    const CLAVES = {
        perfil: 'vidaActivaPerfil',
        plan: 'vidaActivaPlan',
        comidas: 'vidaActivaComidas',
        entrenamientos: 'vidaActivaEntrenamientos',
        habitos: 'vidaActivaHabitos',
        recordatorio: 'vidaActivaRecordatorio',
        sustituciones: 'vidaActivaSustituciones',
        version: 'vidaActivaVersionDatos',
        propietario: 'vidaActivaPropietario'
    };

    const VERSION_DATOS = 2;
    const COMIDAS_DIA = ['desayuno', 'almuerzo', 'cena'];
    const FACTORES_ACTIVIDAD = {
        sedentario: 1.2,
        ligero: 1.375,
        moderado: 1.55,
        activo: 1.725
    };

    function uuid() {
        if (window.crypto && typeof window.crypto.randomUUID === 'function') {
            return window.crypto.randomUUID();
        }

        // Respaldo para navegadores antiguos o contextos sin crypto.randomUUID.
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (caracter) {
            const aleatorio = Math.random() * 16 | 0;
            const valor = caracter === 'x' ? aleatorio : (aleatorio & 0x3 | 0x8);
            return valor.toString(16);
        });
    }

    function fechaLocalISO(fecha) {
        const valor = fecha instanceof Date ? fecha : new Date();
        return valor.getFullYear() + '-' +
            String(valor.getMonth() + 1).padStart(2, '0') + '-' +
            String(valor.getDate()).padStart(2, '0');
    }

    function ahoraISO() {
        return new Date().toISOString();
    }

    // Hábitos iniciales: los que trae la vista previa / propuesta.
    // Se usan solo la primera vez (clave ausente), no si el usuario
    // borró todos a propósito (clave presente con []).
    function habitosPorDefecto() {
        const ahora = ahoraISO();
        const base = [
            { nombre: 'Beber 2L de agua', categoria: 'Salud' },
            { nombre: 'Caminar 20 minutos', categoria: 'Movimiento' },
            { nombre: 'Estirar 5 minutos', categoria: 'Movilidad' },
            { nombre: 'Dormir antes de las 23:00', categoria: 'Descanso' }
        ];
        return base.map(function (item) {
            return {
                id: uuid(),
                nombre: item.nombre,
                tipo: 'construir',
                categoria: item.categoria,
                activo: true,
                dias: [],
                created_at: ahora,
                updated_at: ahora
            };
        });
    }

    function haySupabase() {
        return Boolean(window.VA && VA.auth && typeof VA.auth.configurado === 'function' && VA.auth.configurado());
    }

    function esFechaISO(valor) {
        return typeof valor === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(valor);
    }

    function texto(valor) {
        return String(valor == null ? '' : valor).trim();
    }

    function numero(valor) {
        const n = Number(valor);
        return Number.isFinite(n) ? n : 0;
    }

    function avisarError(mensaje) {
        if (typeof window.alert === 'function') {
            // Se usa un aviso nativo solo como último recurso para no perder
            // información cuando el navegador bloquea el almacenamiento.
            console.error('VidaActiva:', mensaje);
        }

        let aviso = document.getElementById('vaAvisoError');
        if (!aviso) {
            aviso = document.createElement('div');
            aviso.id = 'vaAvisoError';
            aviso.setAttribute('role', 'alert');
            aviso.style.cssText = [
                'position:fixed', 'left:16px', 'right:16px', 'bottom:86px',
                'z-index:9999', 'max-width:500px', 'margin:0 auto',
                'padding:12px 16px', 'border-radius:10px',
                'background:#c53030', 'color:#fff', 'font-size:0.9rem',
                'line-height:1.35', 'box-shadow:0 8px 24px rgba(0,0,0,.22)',
                'transition:opacity .2s ease'
            ].join(';');
            document.body.appendChild(aviso);
        }

        aviso.textContent = mensaje;
        aviso.style.opacity = '1';
        clearTimeout(avisarError.temporizador);
        avisarError.temporizador = setTimeout(function () {
            aviso.style.opacity = '0';
        }, 4500);
    }

    function leerJSON(clave, respaldo) {
        try {
            const crudo = localStorage.getItem(clave);
            if (crudo == null) return respaldo;
            return JSON.parse(crudo);
        } catch (error) {
            console.warn('VidaActiva: no se pudo leer ' + clave, error);
            return respaldo;
        }
    }

    function guardarJSON(clave, valor) {
        try {
            localStorage.setItem(clave, JSON.stringify(valor));
            return true;
        } catch (error) {
            console.warn('VidaActiva: no se pudo guardar ' + clave, error);
            avisarError('No se pudieron guardar los datos en este dispositivo. Revisa el espacio disponible o el modo privado del navegador.');
            return false;
        }
    }

    function borrarClave(clave) {
        try {
            localStorage.removeItem(clave);
            return true;
        } catch (error) {
            console.warn('VidaActiva: no se pudo borrar ' + clave, error);
            return false;
        }
    }

    function normalizarPerfil(perfil) {
        const datos = perfil && typeof perfil === 'object' ? perfil : {};
        const peso = numero(datos.peso_kg || datos.peso);
        const estatura = numero(datos.estatura_cm || datos.estatura);
        const pesoMeta = numero(datos.peso_meta_kg || datos.pesoMeta);
        const sexo = ['femenino', 'masculino', 'prefiero_no_decir'].indexOf(datos.sexo) >= 0
            ? datos.sexo
            : 'prefiero_no_decir';
        const actividad = FACTORES_ACTIVIDAD[datos.actividad] ? datos.actividad : 'moderado';
        const objetivo = ['bajar', 'mantener', 'subir'].indexOf(datos.objetivo) >= 0
            ? datos.objetivo
            : 'mantener';

        const normalizado = {
            id: texto(datos.id) || 'local',
            nombre: texto(datos.nombre),
            edad: numero(datos.edad),
            sexo: sexo,
            peso_kg: peso,
            estatura_cm: estatura,
            peso_meta_kg: pesoMeta,
            actividad: actividad,
            objetivo: objetivo,
            calorias_objetivo: numero(datos.calorias_objetivo) || 1800,
            onboarding_completado: datos.onboarding_completado === true,
            created_at: texto(datos.created_at || datos.creado_en) || ahoraISO(),
            updated_at: texto(datos.updated_at || datos.actualizado_en) || ahoraISO()
        };

        normalizado.calorias_objetivo = calcularCaloriasObjetivo(normalizado);
        return normalizado;
    }

    function mismoPerfil(a, b) {
        if (!a || !b) return false;
        const campos = [
            'id', 'nombre', 'edad', 'sexo', 'peso_kg', 'estatura_cm',
            'peso_meta_kg', 'actividad', 'objetivo', 'calorias_objetivo',
            'onboarding_completado'
        ];

        return campos.every(function (campo) {
            return a[campo] === b[campo] || (
                typeof a[campo] === 'number' &&
                typeof b[campo] === 'number' &&
                Number(a[campo]) === Number(b[campo])
            );
        });
    }

    async function contextoRemoto() {
        if (!window.VA || !VA.auth || typeof VA.auth.configurado !== 'function' || !VA.auth.configurado()) {
            return null;
        }

        const id = typeof VA.auth.usuarioId === 'function' ? VA.auth.usuarioId() : '';
        if (!id) return null;

        const cliente = await VA.auth.cliente();
        return { cliente: cliente, id: id, email: VA.auth.usuarioEmail() };
    }

    function filaPerfilRemoto(perfil, id, email) {
        return {
            id: id,
            email: email || null,
            nombre: texto(perfil.nombre),
            edad: numero(perfil.edad) > 0 ? numero(perfil.edad) : null,
            sexo: perfil.sexo || 'prefiero_no_decir',
            peso_kg: numero(perfil.peso_kg) > 0 ? numero(perfil.peso_kg) : null,
            estatura_cm: numero(perfil.estatura_cm) > 0 ? numero(perfil.estatura_cm) : null,
            peso_meta_kg: numero(perfil.peso_meta_kg) > 0 ? numero(perfil.peso_meta_kg) : null,
            actividad: perfil.actividad || 'moderado',
            objetivo: perfil.objetivo || 'mantener',
            calorias_objetivo: numero(perfil.calorias_objetivo) || 1800,
            onboarding_completado: perfil.onboarding_completado === true
        };
    }

    async function obtenerPerfilRemoto() {
        const contexto = await contextoRemoto();
        if (!contexto) return null;

        const resultado = await contexto.cliente
            .from('profiles')
            .select('*')
            .eq('id', contexto.id)
            .maybeSingle();

        if (resultado.error) throw resultado.error;
        if (!resultado.data) return null;

        return normalizarPerfil(Object.assign({}, resultado.data, { id: contexto.id }));
    }

    async function guardarPerfilRemoto(perfil) {
        if (!window.VA || !VA.auth || typeof VA.auth.configurado !== 'function' || !VA.auth.configurado()) {
            return null;
        }

        const contexto = await contextoRemoto();
        if (!contexto) {
            throw new Error('No hay una sesión activa para sincronizar el perfil.');
        }

        if (!perfil || !texto(perfil.nombre)) {
            throw new Error('El perfil necesita un nombre para sincronizarse.');
        }

        const fila = filaPerfilRemoto(perfil, contexto.id, contexto.email);
        const resultado = await contexto.cliente
            .from('profiles')
            .upsert(fila, { onConflict: 'id' })
            .select()
            .single();

        if (resultado.error) throw resultado.error;

        const normalizado = normalizarPerfil(Object.assign({}, resultado.data, { id: contexto.id }));
        guardarJSON(CLAVES.perfil, normalizado);
        marcarPropietario(contexto.id);
        return normalizado;
    }

    async function sincronizarPerfil() {
        const contexto = await contextoRemoto();
        if (!contexto) return { cambioLocal: false, remoto: false };

        const resultado = await contexto.cliente
            .from('profiles')
            .select('*')
            .eq('id', contexto.id)
            .maybeSingle();

        if (resultado.error) throw resultado.error;

        const guardadoLocal = leerJSON(CLAVES.perfil, null);
        let local = guardadoLocal && typeof guardadoLocal === 'object'
            ? normalizarPerfil(guardadoLocal)
            : null;

        // No mezclar el perfil de otra cuenta que haya usado este navegador.
        // La marca de propietario se crea al sincronizar por primera vez;
        // los datos anteriores al login se adoptan para no perderlos.
        const propietario = propietarioLocal();
        if (propietario && propietario !== contexto.id) {
            borrarClave(CLAVES.perfil);
            local = null;
        }

        const remoto = resultado.data
            ? normalizarPerfil(Object.assign({}, resultado.data, { id: contexto.id }))
            : null;

        const remotoCompleto = Boolean(remoto && (remoto.nombre || remoto.onboarding_completado));
        const localCompleto = Boolean(local && local.nombre);
        const localMasNuevo = localCompleto && remoto
            ? (Date.parse(local.updated_at) || 0) > (Date.parse(remoto.updated_at) || 0)
            : false;

        // Si el perfil local ya tiene datos y el remoto está vacío, se sube
        // una sola vez para no perder lo que ya existía en este dispositivo.
        if (localCompleto && (!remotoCompleto || localMasNuevo)) {
            await guardarPerfilRemoto(local);
            return { cambioLocal: false, remoto: Boolean(remoto), subido: true };
        }

        if (remoto) {
            const cambioLocal = !local || !mismoPerfil(local, remoto);
            if (cambioLocal) guardarJSON(CLAVES.perfil, remoto);
            marcarPropietario(contexto.id);
            return { cambioLocal: cambioLocal, remoto: true };
        }

        if (localCompleto) {
            await guardarPerfilRemoto(local);
            return { cambioLocal: false, remoto: false, subido: true };
        }

        return { cambioLocal: false, remoto: false };
    }

    function calcularCaloriasObjetivo(perfil) {
        const p = perfil && typeof perfil === 'object' ? perfil : {};
        const peso = numero(p.peso_kg || p.peso);
        const estatura = numero(p.estatura_cm || p.estatura);
        const edad = numero(p.edad);

        if (!(peso > 0) || !(estatura > 0) || !(edad > 0)) return 1800;

        // Mifflin-St Jeor con un valor neutro cuando no se indica sexo.
        let metabolismo = (10 * peso) + (6.25 * estatura) - (5 * edad) - 78;
        if (p.sexo === 'masculino') metabolismo += 83;
        if (p.sexo === 'femenino') metabolismo -= 83;

        const factor = FACTORES_ACTIVIDAD[p.actividad] || FACTORES_ACTIVIDAD.moderado;
        let calorias = metabolismo * factor;

        if (p.objetivo === 'bajar') calorias *= 0.85;
        if (p.objetivo === 'subir') calorias *= 1.10;

        // Límites prudentes para una estimación general, no una prescripción.
        calorias = Math.max(1200, Math.min(4000, calorias));
        return Math.round(calorias / 50) * 50;
    }

    function normalizarItemComida(item) {
        const datos = item && typeof item === 'object' ? item : {};
        return {
            id: texto(datos.id) || uuid(),
            nombre: texto(datos.nombre) || 'Alimento',
            kcal: Math.max(0, Math.round(numero(datos.kcal))),
            precio: Math.max(0, numero(datos.precio)),
            created_at: texto(datos.created_at || datos.creado_en) || ahoraISO()
        };
    }

    function normalizarRegistroComidas(registro) {
        const datos = registro && typeof registro === 'object' ? registro : {};
        const normalizado = {};
        COMIDAS_DIA.forEach(function (comida) {
            const lista = Array.isArray(datos[comida]) ? datos[comida] : [];
            normalizado[comida] = lista.map(normalizarItemComida);
        });
        return normalizado;
    }

    function normalizarTodoComidas(todo) {
        const datos = todo && typeof todo === 'object' && !Array.isArray(todo) ? todo : {};
        const normalizado = {};
        Object.keys(datos).forEach(function (fecha) {
            if (!esFechaISO(fecha)) return;
            normalizado[fecha] = normalizarRegistroComidas(datos[fecha]);
        });
        return normalizado;
    }

    function normalizarEntrenamiento(registro) {
        const datos = registro && typeof registro === 'object' ? registro : {};
        const rutina = texto(datos.rutina);
        const partes = rutina.split('·').map(function (parte) { return parte.trim(); });
        const rutinaNombre = texto(datos.rutina_nombre) || partes[0] || 'Entrenamiento';
        const nivel = texto(datos.nivel) || partes[1] || '';

        return {
            id: texto(datos.id) || uuid(),
            rutina_id: texto(datos.rutina_id),
            rutina_nombre: rutinaNombre,
            nivel: nivel,
            rutina: rutina || (rutinaNombre + (nivel ? ' · ' + nivel : '')),
            fecha: esFechaISO(datos.fecha) ? datos.fecha : fechaLocalISO(new Date()),
            minutos: Math.max(0, Math.round(numero(datos.minutos))),
            rondas: Math.max(0, Math.round(numero(datos.rondas))),
            completado_en: texto(datos.completado_en) || (
                datos.completado ? new Date(numero(datos.completado)).toISOString() : ahoraISO()
            ),
            created_at: texto(datos.created_at || datos.creado_en) || ahoraISO()
        };
    }

    function claveSustitucion(rutinaId, ejercicioOriginalId) {
        return texto(rutinaId) + '::' + texto(ejercicioOriginalId);
    }

    function normalizarSustitucion(registro) {
        const datos = registro && typeof registro === 'object' ? registro : {};
        const rutinaId = texto(datos.rutina_id || datos.rutinaId);
        const originalId = texto(datos.ejercicio_original_id || datos.ejercicioOriginalId);
        const sustitutoId = texto(datos.ejercicio_sustituto_id || datos.ejercicioSustitutoId);
        if (!rutinaId || !originalId || !sustitutoId) return null;

        const motivo = ['facil', 'comodo', 'equipo', 'gusto'].indexOf(datos.motivo) >= 0
            ? datos.motivo
            : '';

        return {
            rutina_id: rutinaId,
            ejercicio_original_id: originalId,
            ejercicio_sustituto_id: sustitutoId,
            motivo: motivo,
            created_at: texto(datos.created_at || datos.creado_en) || ahoraISO(),
            updated_at: texto(datos.updated_at || datos.actualizado_en) || ahoraISO(),
            deleted_at: texto(datos.deleted_at || datos.eliminado_en) || null
        };
    }

    function normalizarListaSustituciones(lista) {
        const mapa = {};
        (Array.isArray(lista) ? lista : []).forEach(function (item) {
            const normalizado = normalizarSustitucion(item);
            if (!normalizado) return;
            const clave = claveSustitucion(normalizado.rutina_id, normalizado.ejercicio_original_id);
            const anterior = mapa[clave];
            if (!anterior || (Date.parse(normalizado.updated_at) || 0) >= (Date.parse(anterior.updated_at) || 0)) {
                mapa[clave] = normalizado;
            }
        });
        return Object.keys(mapa).map(function (clave) { return mapa[clave]; });
    }

    function normalizarHabito(habito) {
        const datos = habito && typeof habito === 'object' ? habito : {};
        const dias = Array.isArray(datos.dias)
            ? datos.dias.filter(esFechaISO).map(function (dia) { return dia; })
            : [];
        const diasUnicos = Array.from(new Set(dias)).sort();

        return {
            id: texto(datos.id) || uuid(),
            nombre: texto(datos.nombre) || 'Hábito',
            tipo: datos.tipo === 'reducir' ? 'reducir' : 'construir',
            categoria: texto(datos.categoria),
            activo: datos.activo !== false,
            dias: diasUnicos,
            created_at: texto(datos.created_at || datos.creado_en) || ahoraISO(),
            updated_at: texto(datos.updated_at || datos.actualizado_en) || ahoraISO()
        };
    }

    function normalizarRecordatorio(recordatorio) {
        const datos = recordatorio && typeof recordatorio === 'object' ? recordatorio : {};
        const hora = typeof datos.hora === 'string' && /^\d{2}:\d{2}(:\d{2})?$/.test(datos.hora)
            ? datos.hora.slice(0, 5)
            : '20:00';
        return {
            activo: datos.activo === true,
            hora: hora,
            created_at: texto(datos.created_at || datos.creado_en) || ahoraISO(),
            updated_at: texto(datos.updated_at || datos.actualizado_en) || ahoraISO()
        };
    }

    function normalizarPlan(plan) {
        const datos = plan && typeof plan === 'object' ? plan : null;
        if (!datos) return {};

        const horarios = datos.horarios && typeof datos.horarios === 'object'
            ? datos.horarios
            : {};

        return {
            presupuesto: texto(datos.presupuesto) || 'medio',
            colaciones: ['no', 'una', 'dos'].indexOf(datos.colaciones) >= 0 ? datos.colaciones : 'no',
            horarios: {
                desayuno: texto(horarios.desayuno) || '07:30',
                comida: texto(horarios.comida) || '14:00',
                cena: texto(horarios.cena) || '20:00',
                colacion1: texto(horarios.colacion1) || '10:30',
                colacion2: texto(horarios.colacion2) || '17:00'
            },
            updated_at: texto(datos.updated_at || datos.actualizado_en) || ahoraISO()
        };
    }

    function tieneClave(clave) {
        try {
            return localStorage.getItem(clave) != null;
        } catch (error) {
            return false;
        }
    }

    function propietarioLocal() {
        try {
            return texto(localStorage.getItem(CLAVES.propietario));
        } catch (error) {
            return '';
        }
    }

    function marcarPropietario(id) {
        const valor = texto(id);
        if (!valor) return;
        try {
            localStorage.setItem(CLAVES.propietario, valor);
        } catch (error) {
            // Si el almacenamiento está bloqueado, la sincronización sigue
            // funcionando; solo no se recuerda el propietario local.
        }
    }

    function ejecutarRemoto(tarea) {
        if (!window.VA || !VA.auth || typeof VA.auth.configurado !== 'function' || !VA.auth.configurado()) {
            return;
        }

        const id = typeof VA.auth.usuarioId === 'function' ? VA.auth.usuarioId() : '';
        if (!id) return;

        Promise.resolve().then(tarea).catch(function (error) {
            console.error('VidaActiva: no se pudo sincronizar con Supabase.', error);
            avisarError('Se guardó en este dispositivo, pero no se pudo sincronizar con la nube. Revisa tu conexión.');
        });
    }

    function planFirma(plan) {
        const normalizado = normalizarPlan(plan);
        return [normalizado.presupuesto, normalizado.colaciones, JSON.stringify(normalizado.horarios)].join('|');
    }

    function recordatorioFirma(recordatorio) {
        const normalizado = normalizarRecordatorio(recordatorio);
        return [normalizado.activo, normalizado.hora].join('|');
    }

    function comidasTieneDatos(todo) {
        const normalizado = normalizarTodoComidas(todo);
        return Object.keys(normalizado).some(function (fecha) {
            return COMIDAS_DIA.some(function (comida) {
                return normalizado[fecha][comida].length > 0;
            });
        });
    }

    function comidasFirma(todo) {
        const normalizado = normalizarTodoComidas(todo);
        return Object.keys(normalizado).sort().map(function (fecha) {
            return fecha + '|' + COMIDAS_DIA.map(function (comida) {
                return comida + ':' + normalizado[fecha][comida].map(function (item) {
                    return [item.id, item.nombre, item.kcal, item.precio, item.created_at].join('~');
                }).sort().join(';');
            }).join('/');
        }).join('||');
    }

    function entrenamientosFirma(lista) {
        const normalizados = (Array.isArray(lista) ? lista : []).map(normalizarEntrenamiento);
        normalizados.sort(function (a, b) { return String(a.id).localeCompare(String(b.id)); });

        return normalizados.map(function (item) {
            return [
                item.id, item.rutina_id, item.rutina_nombre, item.nivel, item.fecha,
                item.minutos, item.rondas, item.completado_en, item.created_at
            ].join('~');
        }).join('||');
    }

    function habitosFirma(lista) {
        const normalizados = (Array.isArray(lista) ? lista : []).map(normalizarHabito);
        normalizados.sort(function (a, b) { return String(a.id).localeCompare(String(b.id)); });

        return normalizados.map(function (habito) {
            return [
                habito.id, habito.nombre, habito.tipo, habito.categoria,
                habito.activo, habito.dias.join(',')
            ].join('~');
        }).join('||');
    }

    function sustitucionesFirma(lista) {
        const normalizados = normalizarListaSustituciones(lista);
        normalizados.sort(function (a, b) {
            return claveSustitucion(a.rutina_id, a.ejercicio_original_id)
                .localeCompare(claveSustitucion(b.rutina_id, b.ejercicio_original_id));
        });

        return normalizados.map(function (item) {
            return [
                item.rutina_id, item.ejercicio_original_id, item.ejercicio_sustituto_id,
                item.motivo, item.deleted_at || ''
            ].join('~');
        }).join('||');
    }

    // ------------------------------------------------------------
    // Plan de alimentación remoto
    // ------------------------------------------------------------
    async function guardarPlanRemoto(plan) {
        if (!window.VA || !VA.auth || typeof VA.auth.configurado !== 'function' || !VA.auth.configurado()) {
            return null;
        }

        const contexto = await contextoRemoto();
        if (!contexto) throw new Error('No hay una sesión activa para sincronizar el plan.');

        const normalizado = normalizarPlan(plan);
        const fila = {
            user_id: contexto.id,
            presupuesto: normalizado.presupuesto,
            colaciones: normalizado.colaciones,
            horarios: normalizado.horarios,
            activo: true
        };

        const resultado = await contexto.cliente
            .from('diet_plans')
            .upsert(fila, { onConflict: 'user_id' });

        if (resultado.error) throw resultado.error;
        return normalizado;
    }

    async function sincronizarPlanRemoto(remoto) {
        const localTiene = tieneClave(CLAVES.plan);
        const local = normalizarPlan(leerJSON(CLAVES.plan, null));

        if (!remoto) {
            if (localTiene) {
                await guardarPlanRemoto(local);
                return { cambioLocal: false, subido: true };
            }
            return { cambioLocal: false, subido: false };
        }

        const remotoNormalizado = normalizarPlan(remoto);
        const localMasNuevo = localTiene &&
            (Date.parse(local.updated_at) || 0) > (Date.parse(remotoNormalizado.updated_at) || 0);

        if (localMasNuevo) {
            await guardarPlanRemoto(local);
            return { cambioLocal: false, subido: true };
        }

        const cambioLocal = !localTiene || planFirma(local) !== planFirma(remotoNormalizado);
        if (cambioLocal) guardarJSON(CLAVES.plan, remotoNormalizado);
        return { cambioLocal: cambioLocal, subido: false };
    }

    // ------------------------------------------------------------
    // Comidas remotas
    // ------------------------------------------------------------
    function filaComidaRemota(fecha, comida, item, idUsuario) {
        return {
            id: item.id,
            user_id: idUsuario,
            fecha: fecha,
            comida: comida,
            nombre: item.nombre,
            kcal: item.kcal,
            precio: item.precio,
            created_at: item.created_at
        };
    }

    function filasComidasRegistro(fecha, registro, idUsuario) {
        const normalizado = normalizarRegistroComidas(registro);
        const filas = [];

        COMIDAS_DIA.forEach(function (comida) {
            normalizado[comida].forEach(function (item) {
                filas.push(filaComidaRemota(fecha, comida, item, idUsuario));
            });
        });

        return filas;
    }

    function filasComidasRemotas(todo, idUsuario) {
        const normalizado = normalizarTodoComidas(todo);
        const filas = [];

        Object.keys(normalizado).forEach(function (fecha) {
            filas.push.apply(filas, filasComidasRegistro(fecha, normalizado[fecha], idUsuario));
        });

        return filas;
    }

    async function guardarFilasComidasRemotas(filas) {
        if (!filas || !filas.length) return true;

        const contexto = await contextoRemoto();
        if (!contexto) throw new Error('No hay una sesión activa para sincronizar las comidas.');

        const resultado = await contexto.cliente
            .from('meal_logs')
            .upsert(filas, { onConflict: 'id' });

        if (resultado.error) throw resultado.error;
        return true;
    }

    async function guardarComidaHoyRemoto(hoy, anterior, nuevo) {
        const contexto = await contextoRemoto();
        if (!contexto) throw new Error('No hay una sesión activa para sincronizar las comidas.');

        const filas = filasComidasRegistro(hoy, nuevo, contexto.id);
        const idsAnteriores = filasComidasRegistro(hoy, anterior, contexto.id)
            .map(function (fila) { return fila.id; });
        const idsNuevos = filas.map(function (fila) { return fila.id; });
        const borrar = idsAnteriores.filter(function (id) { return idsNuevos.indexOf(id) < 0; });

        if (borrar.length) {
            const eliminacion = await contexto.cliente
                .from('meal_logs')
                .delete()
                .eq('user_id', contexto.id)
                .in('id', borrar);
            if (eliminacion.error) throw eliminacion.error;
        }

        if (filas.length) {
            const resultado = await contexto.cliente
                .from('meal_logs')
                .upsert(filas, { onConflict: 'id' });
            if (resultado.error) throw resultado.error;
        }

        return true;
    }

    async function guardarTodoComidasRemoto(todo) {
        const contexto = await contextoRemoto();
        if (!contexto) throw new Error('No hay una sesión activa para sincronizar las comidas.');

        const filas = filasComidasRemotas(todo, contexto.id);

        if (filas.length) {
            const resultado = await contexto.cliente
                .from('meal_logs')
                .upsert(filas, { onConflict: 'id' });
            if (resultado.error) throw resultado.error;
        }

        const consulta = await contexto.cliente
            .from('meal_logs')
            .select('id')
            .eq('user_id', contexto.id);
        if (consulta.error) throw consulta.error;

        const idsLocal = filas.map(function (fila) { return fila.id; });
        const borrar = (consulta.data || [])
            .filter(function (fila) { return idsLocal.indexOf(fila.id) < 0; })
            .map(function (fila) { return fila.id; });

        if (borrar.length) {
            const eliminacion = await contexto.cliente
                .from('meal_logs')
                .delete()
                .eq('user_id', contexto.id)
                .in('id', borrar);
            if (eliminacion.error) throw eliminacion.error;
        }

        return true;
    }

    async function sincronizarComidasRemoto(filasRemotas) {
        const local = normalizarTodoComidas(leerJSON(CLAVES.comidas, {}));
        const remoto = {};
        const idsRemotos = new Set();

        (filasRemotas || []).forEach(function (fila) {
            if (!esFechaISO(fila.fecha) || COMIDAS_DIA.indexOf(fila.comida) < 0) return;

            if (!remoto[fila.fecha]) remoto[fila.fecha] = normalizarRegistroComidas({});
            remoto[fila.fecha][fila.comida].push(normalizarItemComida(fila));
            idsRemotos.add(fila.id);
        });

        const unido = {};
        Object.keys(remoto).forEach(function (fecha) {
            unido[fecha] = normalizarRegistroComidas(remoto[fecha]);
        });

        const soloLocal = [];
        Object.keys(local).forEach(function (fecha) {
            COMIDAS_DIA.forEach(function (comida) {
                local[fecha][comida].forEach(function (item) {
                    if (idsRemotos.has(item.id)) return;
                    if (!unido[fecha]) unido[fecha] = normalizarRegistroComidas({});
                    unido[fecha][comida].push(item);
                    soloLocal.push({ fecha: fecha, comida: comida, item: item });
                });
            });
        });

        const cambioLocal = comidasFirma(local) !== comidasFirma(unido);
        if (cambioLocal) guardarJSON(CLAVES.comidas, unido);

        if (soloLocal.length) {
            const contexto = await contextoRemoto();
            if (!contexto) throw new Error('No hay una sesión activa para sincronizar las comidas.');
            await guardarFilasComidasRemotas(soloLocal.map(function (registro) {
                return filaComidaRemota(registro.fecha, registro.comida, registro.item, contexto.id);
            }));
        }

        return { cambioLocal: cambioLocal, subido: soloLocal.length > 0 };
    }

    // ------------------------------------------------------------
    // Entrenamientos remotos
    // ------------------------------------------------------------
    function filaEntrenamientoRemota(entrenamiento, idUsuario) {
        const normalizado = normalizarEntrenamiento(entrenamiento);
        return {
            id: normalizado.id,
            user_id: idUsuario,
            rutina_id: normalizado.rutina_id || null,
            rutina_nombre: normalizado.rutina_nombre,
            nivel: normalizado.nivel || null,
            fecha: normalizado.fecha,
            minutos: normalizado.minutos,
            rondas: normalizado.rondas,
            completado_en: normalizado.completado_en,
            created_at: normalizado.created_at
        };
    }

    async function guardarEntrenamientoRemoto(entrenamiento) {
        const contexto = await contextoRemoto();
        if (!contexto) throw new Error('No hay una sesión activa para sincronizar el entrenamiento.');

        const resultado = await contexto.cliente
            .from('workouts')
            .upsert(filaEntrenamientoRemota(entrenamiento, contexto.id), { onConflict: 'id' });

        if (resultado.error) throw resultado.error;
        return true;
    }

    async function reemplazarEntrenamientosRemoto(lista) {
        const contexto = await contextoRemoto();
        if (!contexto) throw new Error('No hay una sesión activa para sincronizar los entrenamientos.');

        const filas = (Array.isArray(lista) ? lista : []).map(function (item) {
            return filaEntrenamientoRemota(item, contexto.id);
        });

        if (filas.length) {
            const resultado = await contexto.cliente
                .from('workouts')
                .upsert(filas, { onConflict: 'id' });
            if (resultado.error) throw resultado.error;
        }

        const consulta = await contexto.cliente
            .from('workouts')
            .select('id')
            .eq('user_id', contexto.id);
        if (consulta.error) throw consulta.error;

        const idsLocal = filas.map(function (fila) { return fila.id; });
        const borrar = (consulta.data || [])
            .filter(function (fila) { return idsLocal.indexOf(fila.id) < 0; })
            .map(function (fila) { return fila.id; });

        if (borrar.length) {
            const eliminacion = await contexto.cliente
                .from('workouts')
                .delete()
                .eq('user_id', contexto.id)
                .in('id', borrar);
            if (eliminacion.error) throw eliminacion.error;
        }

        return true;
    }

    async function sincronizarEntrenamientosRemoto(filasRemotas) {
        const local = (Array.isArray(leerJSON(CLAVES.entrenamientos, [])) ? leerJSON(CLAVES.entrenamientos, []) : [])
            .map(normalizarEntrenamiento);
        const remotos = (filasRemotas || []).map(normalizarEntrenamiento);
        const idsRemotos = new Set(remotos.map(function (item) { return item.id; }));
        const soloLocal = local.filter(function (item) { return !idsRemotos.has(item.id); });
        const unido = remotos.concat(soloLocal);

        unido.sort(function (a, b) {
            if (a.fecha !== b.fecha) return a.fecha < b.fecha ? 1 : -1;
            return String(b.completado_en).localeCompare(String(a.completado_en));
        });

        const cambioLocal = entrenamientosFirma(local) !== entrenamientosFirma(unido);
        if (cambioLocal) guardarJSON(CLAVES.entrenamientos, unido.slice(0, 200));

        if (soloLocal.length) {
            await reemplazarEntrenamientosRemoto(unido.slice(0, 200));
        }

        return { cambioLocal: cambioLocal, subido: soloLocal.length > 0 };
    }

    // ------------------------------------------------------------
    // Sustituciones de ejercicios remotas
    // ------------------------------------------------------------
    function filaSustitucionRemota(sustitucion, idUsuario) {
        const normalizado = normalizarSustitucion(sustitucion);
        if (!normalizado) return null;

        return {
            user_id: idUsuario,
            rutina_id: normalizado.rutina_id,
            ejercicio_original_id: normalizado.ejercicio_original_id,
            ejercicio_sustituto_id: normalizado.ejercicio_sustituto_id,
            motivo: normalizado.motivo || null,
            created_at: normalizado.created_at,
            updated_at: normalizado.updated_at,
            deleted_at: normalizado.deleted_at
        };
    }

    async function guardarSustitucionesRemoto(lista) {
        const contexto = await contextoRemoto();
        if (!contexto) throw new Error('No hay una sesión activa para sincronizar las sustituciones.');

        const filas = normalizarListaSustituciones(lista)
            .map(function (item) { return filaSustitucionRemota(item, contexto.id); })
            .filter(Boolean);

        if (!filas.length) return true;

        const resultado = await contexto.cliente
            .from('exercise_substitutions')
            .upsert(filas, { onConflict: 'user_id,rutina_id,ejercicio_original_id' });

        if (resultado.error) throw resultado.error;
        return true;
    }

    async function sincronizarSustitucionesRemoto(filasRemotas) {
        const local = normalizarListaSustituciones(leerJSON(CLAVES.sustituciones, []));
        const remotos = normalizarListaSustituciones(filasRemotas);
        const mapa = {};

        local.forEach(function (item) {
            mapa[claveSustitucion(item.rutina_id, item.ejercicio_original_id)] = { local: item };
        });

        remotos.forEach(function (item) {
            const clave = claveSustitucion(item.rutina_id, item.ejercicio_original_id);
            if (!mapa[clave]) mapa[clave] = {};
            mapa[clave].remoto = item;
        });

        const unido = [];
        const subir = [];

        Object.keys(mapa).forEach(function (clave) {
            const itemLocal = mapa[clave].local;
            const itemRemoto = mapa[clave].remoto;

            if (itemLocal && (!itemRemoto ||
                (Date.parse(itemLocal.updated_at) || 0) > (Date.parse(itemRemoto.updated_at) || 0))) {
                unido.push(itemLocal);
                subir.push(itemLocal);
                return;
            }

            if (itemRemoto) unido.push(itemRemoto);
        });

        const cambioLocal = sustitucionesFirma(local) !== sustitucionesFirma(unido);
        if (cambioLocal) guardarJSON(CLAVES.sustituciones, unido);

        if (subir.length) await guardarSustitucionesRemoto(subir);

        return { cambioLocal: cambioLocal, subido: subir.length > 0 };
    }

    // ------------------------------------------------------------
    // Hábitos remotos
    // ------------------------------------------------------------
    function filaHabitoRemota(habito, idUsuario) {
        const normalizado = normalizarHabito(habito);
        return {
            id: normalizado.id,
            user_id: idUsuario,
            nombre: normalizado.nombre,
            tipo: normalizado.tipo,
            categoria: normalizado.categoria || null,
            activo: normalizado.activo
        };
    }

    async function guardarHabitosRemoto(habitos) {
        const contexto = await contextoRemoto();
        if (!contexto) throw new Error('No hay una sesión activa para sincronizar los hábitos.');

        const normalizados = (Array.isArray(habitos) ? habitos : []).map(normalizarHabito);
        const filas = normalizados.map(function (habito) {
            return filaHabitoRemota(habito, contexto.id);
        });

        if (filas.length) {
            const resultado = await contexto.cliente
                .from('habits')
                .upsert(filas, { onConflict: 'id' });
            if (resultado.error) throw resultado.error;
        }

        const consulta = await contexto.cliente
            .from('habits')
            .select('id')
            .eq('user_id', contexto.id);
        if (consulta.error) throw consulta.error;

        const idsLocal = filas.map(function (fila) { return fila.id; });
        const borrar = (consulta.data || [])
            .filter(function (fila) { return idsLocal.indexOf(fila.id) < 0; })
            .map(function (fila) { return fila.id; });

        if (borrar.length) {
            const eliminacion = await contexto.cliente
                .from('habits')
                .delete()
                .eq('user_id', contexto.id)
                .in('id', borrar);
            if (eliminacion.error) throw eliminacion.error;
        }

        const dias = [];
        normalizados.forEach(function (habito) {
            habito.dias.forEach(function (fecha) {
                dias.push({ habit_id: habito.id, user_id: contexto.id, fecha: fecha });
            });
        });

        if (dias.length) {
            const resultado = await contexto.cliente
                .from('habit_days')
                .upsert(dias, { onConflict: 'habit_id,fecha' });
            if (resultado.error) throw resultado.error;
        }

        const consultaDias = await contexto.cliente
            .from('habit_days')
            .select('habit_id,fecha')
            .eq('user_id', contexto.id);
        if (consultaDias.error) throw consultaDias.error;

        const clavesLocal = new Set(dias.map(function (dia) {
            return dia.habit_id + '|' + dia.fecha;
        }));

        const porHabito = {};
        (consultaDias.data || []).forEach(function (dia) {
            if (clavesLocal.has(dia.habit_id + '|' + dia.fecha)) return;
            if (!porHabito[dia.habit_id]) porHabito[dia.habit_id] = [];
            porHabito[dia.habit_id].push(dia.fecha);
        });

        for (const habitId of Object.keys(porHabito)) {
            const eliminacion = await contexto.cliente
                .from('habit_days')
                .delete()
                .eq('user_id', contexto.id)
                .eq('habit_id', habitId)
                .in('fecha', porHabito[habitId]);
            if (eliminacion.error) throw eliminacion.error;
        }

        return true;
    }

    async function sincronizarHabitosRemoto(filasRemotas, filasDias) {
        const diasPorHabito = {};
        (filasDias || []).forEach(function (dia) {
            if (!diasPorHabito[dia.habit_id]) diasPorHabito[dia.habit_id] = [];
            diasPorHabito[dia.habit_id].push(dia.fecha);
        });

        const remotos = (filasRemotas || []).map(function (fila) {
            return normalizarHabito(Object.assign({}, fila, {
                dias: diasPorHabito[fila.id] || []
            }));
        });

        const local = datos.habitos.listar();

        // Usuario nuevo en Supabase: restaura los hábitos por defecto
        // en local y los sube, con el diseño actual.
        if (local.length === 0 && remotos.length === 0 && !tieneClave(CLAVES.habitos)) {
            const iniciales = habitosPorDefecto().map(normalizarHabito);
            guardarJSON(CLAVES.habitos, iniciales);
            await guardarHabitosRemoto(iniciales);
            return { cambioLocal: true, subido: true, iniciales: true };
        }

        const remotosPorId = new Map(remotos.map(function (habito) { return [habito.id, habito]; }));
        const localesPorId = new Map(local.map(function (habito) { return [habito.id, habito]; }));
        const ids = new Set(Array.from(remotosPorId.keys()).concat(Array.from(localesPorId.keys())));
        const unido = [];
        let localGana = false;

        ids.forEach(function (id) {
            const remoto = remotosPorId.get(id);
            const localHabito = localesPorId.get(id);

            if (remoto && localHabito) {
                const localMasNuevo = (Date.parse(localHabito.updated_at) || 0) >
                    (Date.parse(remoto.updated_at) || 0);

                if (localMasNuevo) {
                    unido.push(localHabito);
                    localGana = true;
                } else {
                    unido.push(remoto);
                }
                return;
            }

            if (remoto) {
                unido.push(remoto);
                return;
            }

            if (localHabito) {
                unido.push(localHabito);
                localGana = true;
            }
        });

        unido.sort(function (a, b) { return String(a.id).localeCompare(String(b.id)); });

        const cambioLocal = habitosFirma(local) !== habitosFirma(unido);
        if (cambioLocal) guardarJSON(CLAVES.habitos, unido);

        if (localGana) await guardarHabitosRemoto(unido);

        return { cambioLocal: cambioLocal, subido: localGana };
    }

    // ------------------------------------------------------------
    // Recordatorio remoto
    // ------------------------------------------------------------
    async function guardarRecordatorioRemoto(recordatorio) {
        const contexto = await contextoRemoto();
        if (!contexto) throw new Error('No hay una sesión activa para sincronizar el recordatorio.');

        const normalizado = normalizarRecordatorio(recordatorio);
        const resultado = await contexto.cliente
            .from('reminders')
            .upsert({
                user_id: contexto.id,
                activo: normalizado.activo,
                hora: normalizado.hora
            }, { onConflict: 'user_id' });

        if (resultado.error) throw resultado.error;
        return normalizado;
    }

    async function sincronizarRecordatorioRemoto(remoto) {
        const localTiene = tieneClave(CLAVES.recordatorio);
        const local = normalizarRecordatorio(leerJSON(CLAVES.recordatorio, null));

        if (!remoto) {
            if (localTiene) {
                await guardarRecordatorioRemoto(local);
                return { cambioLocal: false, subido: true };
            }
            return { cambioLocal: false, subido: false };
        }

        const remotoNormalizado = normalizarRecordatorio(remoto);
        const localMasNuevo = localTiene &&
            (Date.parse(local.updated_at) || 0) > (Date.parse(remotoNormalizado.updated_at) || 0);

        if (localMasNuevo) {
            await guardarRecordatorioRemoto(local);
            return { cambioLocal: false, subido: true };
        }

        const cambioLocal = !localTiene || recordatorioFirma(local) !== recordatorioFirma(remotoNormalizado);
        if (cambioLocal) guardarJSON(CLAVES.recordatorio, remotoNormalizado);
        return { cambioLocal: cambioLocal, subido: false };
    }

    // ------------------------------------------------------------
    // Sincronización completa
    // ------------------------------------------------------------
    async function subirTodoLocalARemoto() {
        const contexto = await contextoRemoto();
        if (!contexto) return false;

        const perfil = datos.perfil.obtener();
        if (perfil && perfil.nombre) await guardarPerfilRemoto(perfil);

        if (tieneClave(CLAVES.plan)) {
            const plan = datos.plan.obtener();
            if (plan.presupuesto) await guardarPlanRemoto(plan);
        }

        if (tieneClave(CLAVES.comidas)) {
            await guardarTodoComidasRemoto(datos.comidas.obtenerTodo());
        }

        if (tieneClave(CLAVES.entrenamientos)) {
            await reemplazarEntrenamientosRemoto(datos.entrenamientos.listar());
        }

        if (tieneClave(CLAVES.sustituciones)) {
            try {
                await guardarSustitucionesRemoto(datos.sustituciones.listarTodas());
            } catch (error) {
                // Si la migración aún no está aplicada, el resto de datos
                // debe seguir subiendo. La preferencia queda en local.
                console.warn('VidaActiva: no se pudieron subir las sustituciones de ejercicios.', error);
            }
        }

        if (tieneClave(CLAVES.habitos)) {
            await guardarHabitosRemoto(datos.habitos.listar());
        }

        if (tieneClave(CLAVES.recordatorio)) {
            await guardarRecordatorioRemoto(datos.recordatorio.obtener());
        }

        marcarPropietario(contexto.id);
        return true;
    }

    async function sincronizarTodo() {
        const contexto = await contextoRemoto();
        if (!contexto) return { cambioLocal: false, subido: false };

        const propietario = propietarioLocal();

        // Si este navegador ya fue vinculado a otra cuenta, no se mezclan.
        // Si no hay propietario guardado, se conservan los datos locales
        // anteriores al inicio de sesión y se adoptan para esta cuenta.
        if (propietario && propietario !== contexto.id) {
            datos.borrarTodo();
        }

        const resultado = {
            cambioLocal: false,
            subido: false
        };

        const perfil = await sincronizarPerfil();
        resultado.cambioLocal = resultado.cambioLocal || Boolean(perfil && perfil.cambioLocal);
        resultado.subido = resultado.subido || Boolean(perfil && perfil.subido);

        const [plan, comidas, entrenamientos, habitos, dias, recordatorio, sustituciones] = await Promise.all([
            contexto.cliente.from('diet_plans').select('*').eq('user_id', contexto.id).maybeSingle(),
            contexto.cliente.from('meal_logs').select('*').eq('user_id', contexto.id).order('fecha', { ascending: true }),
            contexto.cliente.from('workouts').select('*').eq('user_id', contexto.id).order('fecha', { ascending: false }),
            contexto.cliente.from('habits').select('*').eq('user_id', contexto.id),
            contexto.cliente.from('habit_days').select('*').eq('user_id', contexto.id),
            contexto.cliente.from('reminders').select('*').eq('user_id', contexto.id).maybeSingle(),
            contexto.cliente.from('exercise_substitutions').select('*').eq('user_id', contexto.id)
        ]);

        if (plan.error) throw plan.error;
        if (comidas.error) throw comidas.error;
        if (entrenamientos.error) throw entrenamientos.error;
        if (habitos.error) throw habitos.error;
        if (dias.error) throw dias.error;
        if (recordatorio.error) throw recordatorio.error;

        const resultados = [
            await sincronizarPlanRemoto(plan.data),
            await sincronizarComidasRemoto(comidas.data || []),
            await sincronizarEntrenamientosRemoto(entrenamientos.data || []),
            await sincronizarHabitosRemoto(habitos.data || [], dias.data || []),
            await sincronizarRecordatorioRemoto(recordatorio.data)
        ];

        if (sustituciones.error) {
            // La migración de exercise_substitutions puede no estar aplicada
            // todavía. No bloquea el resto de la sincronización.
            console.warn('VidaActiva: no se pudieron leer las sustituciones de ejercicios.', sustituciones.error);
        } else {
            resultados.push(await sincronizarSustitucionesRemoto(sustituciones.data || []));
        }

        resultados.forEach(function (item) {
            resultado.cambioLocal = resultado.cambioLocal || Boolean(item && item.cambioLocal);
            resultado.subido = resultado.subido || Boolean(item && item.subido);
        });

        marcarPropietario(contexto.id);
        return resultado;
    }

    function migrarSiHaceFalta() {
        const version = numero(leerJSON(CLAVES.version, 0));
        if (version >= VERSION_DATOS) return;
        guardarJSON(CLAVES.version, VERSION_DATOS);
    }

    const datos = {
        claves: CLAVES,
        version: VERSION_DATOS,
        uuid: uuid,
        fechaLocalISO: fechaLocalISO,
        ahoraISO: ahoraISO,
        calcularCaloriasObjetivo: calcularCaloriasObjetivo,
        avisarError: avisarError,
        sincronizar: sincronizarTodo,
        subirTodo: subirTodoLocalARemoto,

        perfil: {
            obtener: function () {
                const guardado = leerJSON(CLAVES.perfil, null);
                if (!guardado || typeof guardado !== 'object') return null;
                return normalizarPerfil(guardado);
            },
            guardar: function (perfil) {
                const existente = leerJSON(CLAVES.perfil, null);
                const normalizado = normalizarPerfil(perfil);
                if (!normalizado.nombre) {
                    avisarError('El perfil necesita un nombre.');
                    return null;
                }

                // Conserva la fecha de creación y el id del perfil anterior.
                if (existente && typeof existente === 'object') {
                    normalizado.created_at = texto(existente.created_at || existente.creado_en) || normalizado.created_at;
                    normalizado.id = texto(existente.id) || normalizado.id;
                }

                normalizado.updated_at = ahoraISO();

                if (window.VA && VA.auth && typeof VA.auth.usuarioId === 'function') {
                    const id = VA.auth.usuarioId();
                    if (id) {
                        normalizado.id = id;
                        marcarPropietario(id);
                    }
                }

                if (!guardarJSON(CLAVES.perfil, normalizado)) return null;
                return normalizado;
            },
            obtenerRemoto: obtenerPerfilRemoto,
            guardarRemoto: guardarPerfilRemoto,
            sincronizar: sincronizarPerfil
        },

        plan: {
            obtener: function () {
                return normalizarPlan(leerJSON(CLAVES.plan, null));
            },
            guardar: function (plan) {
                const normalizado = normalizarPlan(plan);
                normalizado.updated_at = ahoraISO();
                if (!guardarJSON(CLAVES.plan, normalizado)) return null;

                ejecutarRemoto(function () {
                    return guardarPlanRemoto(normalizado);
                });

                return normalizado;
            },
            guardarRemoto: guardarPlanRemoto,
            sincronizar: sincronizarPlanRemoto
        },

        comidas: {
            obtenerTodo: function () {
                const normalizado = normalizarTodoComidas(leerJSON(CLAVES.comidas, {}));
                guardarJSON(CLAVES.comidas, normalizado);
                return normalizado;
            },
            guardarTodo: function (todo) {
                const normalizado = normalizarTodoComidas(todo);
                if (!guardarJSON(CLAVES.comidas, normalizado)) return null;

                ejecutarRemoto(function () {
                    return guardarTodoComidasRemoto(normalizado);
                });

                return normalizado;
            },
            obtenerHoy: function () {
                const todo = this.obtenerTodo();
                return normalizarRegistroComidas(todo[fechaLocalISO(new Date())] || {});
            },
            guardarHoy: function (registro) {
                const todo = this.obtenerTodo();
                const hoy = fechaLocalISO(new Date());
                const anterior = normalizarRegistroComidas(todo[hoy] || {});
                const nuevo = normalizarRegistroComidas(registro);

                todo[hoy] = nuevo;
                if (!guardarJSON(CLAVES.comidas, normalizarTodoComidas(todo))) return null;

                ejecutarRemoto(function () {
                    return guardarComidaHoyRemoto(hoy, anterior, nuevo);
                });

                return normalizarTodoComidas(todo);
            },
            agregar: function (comida, item) {
                if (COMIDAS_DIA.indexOf(comida) < 0) return null;
                const todo = this.obtenerTodo();
                const hoy = fechaLocalISO(new Date());
                const anterior = normalizarRegistroComidas(todo[hoy] || {});
                const registro = normalizarRegistroComidas(todo[hoy] || {});
                const normalizado = normalizarItemComida(item);
                registro[comida].push(normalizado);
                todo[hoy] = registro;
                if (!guardarJSON(CLAVES.comidas, normalizarTodoComidas(todo))) return null;

                ejecutarRemoto(function () {
                    return guardarComidaHoyRemoto(hoy, anterior, registro);
                });

                return normalizado;
            },
            eliminar: function (comida, id) {
                if (COMIDAS_DIA.indexOf(comida) < 0) return false;
                const todo = this.obtenerTodo();
                const hoy = fechaLocalISO(new Date());
                const anterior = normalizarRegistroComidas(todo[hoy] || {});
                const registro = normalizarRegistroComidas(todo[hoy] || {});
                registro[comida] = registro[comida].filter(function (item) {
                    return item.id !== id;
                });
                todo[hoy] = registro;
                if (!guardarJSON(CLAVES.comidas, normalizarTodoComidas(todo))) return false;

                ejecutarRemoto(function () {
                    return guardarComidaHoyRemoto(hoy, anterior, registro);
                });

                return true;
            },
            guardarRemoto: guardarTodoComidasRemoto,
            sincronizar: sincronizarComidasRemoto
        },

        entrenamientos: {
            listar: function () {
                const crudos = leerJSON(CLAVES.entrenamientos, []);
                if (!Array.isArray(crudos)) return [];
                const normalizados = crudos.map(normalizarEntrenamiento);
                guardarJSON(CLAVES.entrenamientos, normalizados);
                return normalizados;
            },
            agregar: function (registro) {
                const normalizado = normalizarEntrenamiento(registro);
                const historial = this.listar();
                historial.unshift(normalizado);
                if (!guardarJSON(CLAVES.entrenamientos, historial.slice(0, 200))) return null;

                ejecutarRemoto(function () {
                    return guardarEntrenamientoRemoto(normalizado);
                });

                return normalizado;
            },
            guardarRemoto: reemplazarEntrenamientosRemoto,
            sincronizar: sincronizarEntrenamientosRemoto
        },

        sustituciones: {
            listar: function (rutinaId) {
                const rutina = texto(rutinaId);
                return normalizarListaSustituciones(leerJSON(CLAVES.sustituciones, []))
                    .filter(function (item) {
                        return !item.deleted_at && (!rutina || item.rutina_id === rutina);
                    });
            },
            listarTodas: function () {
                return normalizarListaSustituciones(leerJSON(CLAVES.sustituciones, []));
            },
            obtener: function (rutinaId, ejercicioOriginalId) {
                const clave = claveSustitucion(rutinaId, ejercicioOriginalId);
                return this.listar().filter(function (item) {
                    return claveSustitucion(item.rutina_id, item.ejercicio_original_id) === clave;
                })[0] || null;
            },
            guardar: function (registro) {
                const normalizado = normalizarSustitucion(registro);
                if (!normalizado) {
                    avisarError('No se pudo guardar la sustitución del ejercicio.');
                    return null;
                }

                const lista = this.listarTodas();
                const clave = claveSustitucion(normalizado.rutina_id, normalizado.ejercicio_original_id);
                const anterior = lista.filter(function (item) {
                    return claveSustitucion(item.rutina_id, item.ejercicio_original_id) === clave;
                })[0];

                if (anterior && anterior.created_at) normalizado.created_at = anterior.created_at;
                normalizado.updated_at = ahoraISO();
                normalizado.deleted_at = null;

                const actualizada = lista.filter(function (item) {
                    return claveSustitucion(item.rutina_id, item.ejercicio_original_id) !== clave;
                }).concat(normalizado);

                if (!guardarJSON(CLAVES.sustituciones, actualizada)) return null;

                ejecutarRemoto(function () {
                    return guardarSustitucionesRemoto([normalizado]);
                });

                return normalizado;
            },
            eliminar: function (rutinaId, ejercicioOriginalId) {
                const clave = claveSustitucion(rutinaId, ejercicioOriginalId);
                const lista = this.listarTodas();
                const anterior = lista.filter(function (item) {
                    return claveSustitucion(item.rutina_id, item.ejercicio_original_id) === clave;
                })[0];

                if (!anterior) return true;

                const ahora = ahoraISO();
                const eliminada = Object.assign({}, anterior, {
                    updated_at: ahora,
                    deleted_at: ahora
                });

                const actualizada = lista.filter(function (item) {
                    return claveSustitucion(item.rutina_id, item.ejercicio_original_id) !== clave;
                }).concat(eliminada);

                if (!guardarJSON(CLAVES.sustituciones, actualizada)) return false;

                ejecutarRemoto(function () {
                    return guardarSustitucionesRemoto([eliminada]);
                });

                return true;
            },
            guardarRemoto: guardarSustitucionesRemoto,
            sincronizar: sincronizarSustitucionesRemoto
        },

        habitos: {
            listar: function () {
                const crudos = leerJSON(CLAVES.habitos, []);
                if (!Array.isArray(crudos)) return [];

                // Primera vez en modo local: restaura los hábitos de la
                // vista previa con el diseño actual. En modo Supabase la
                // primera siembra la hace la sincronización (ver abajo),
                // para no duplicar hábitos que ya viven en la nube.
                if (crudos.length === 0 && !tieneClave(CLAVES.habitos) && !haySupabase()) {
                    const iniciales = habitosPorDefecto().map(normalizarHabito);
                    guardarJSON(CLAVES.habitos, iniciales);
                    return iniciales;
                }

                const usados = {};
                let cambio = false;
                const normalizados = crudos.map(function (habito) {
                    const normalizado = normalizarHabito(habito);

                    // Convierte IDs antiguos (Date.now()) a UUID y evita
                    // duplicados si dos dispositivos crearon el mismo hábito.
                    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(texto(habito && habito.id))) {
                        normalizado.id = uuid();
                        cambio = true;
                    }

                    if (usados[normalizado.id]) {
                        normalizado.id = uuid();
                        cambio = true;
                    }
                    usados[normalizado.id] = true;

                    if (!Array.isArray(habito && habito.dias)) cambio = true;
                    if (!habito || !habito.created_at || !habito.updated_at ||
                        habito.creado_en || habito.actualizado_en) {
                        cambio = true;
                    }
                    return normalizado;
                });

                if (cambio || normalizados.length !== crudos.length) {
                    guardarJSON(CLAVES.habitos, normalizados);
                }
                return normalizados;
            },
            guardar: function (habitos) {
                if (!Array.isArray(habitos)) return false;
                const normalizados = habitos.map(normalizarHabito);
                if (!guardarJSON(CLAVES.habitos, normalizados)) return false;

                ejecutarRemoto(function () {
                    return guardarHabitosRemoto(normalizados);
                });

                return true;
            },
            actualizar: function (id, cambios) {
                const lista = this.listar();
                const actualizado = lista.map(function (habito) {
                    if (String(habito.id) !== String(id)) return habito;
                    const normalizado = normalizarHabito(Object.assign({}, habito, cambios));
                    normalizado.updated_at = ahoraISO();
                    return normalizado;
                });
                return this.guardar(actualizado) ? actualizado : null;
            },
            eliminar: function (id) {
                const lista = this.listar().filter(function (habito) {
                    return String(habito.id) !== String(id);
                });
                return this.guardar(lista);
            }
        },

        recordatorio: {
            obtener: function () {
                return normalizarRecordatorio(leerJSON(CLAVES.recordatorio, null));
            },
            guardar: function (recordatorio) {
                const normalizado = normalizarRecordatorio(recordatorio);
                normalizado.updated_at = ahoraISO();
                if (!guardarJSON(CLAVES.recordatorio, normalizado)) return null;

                ejecutarRemoto(function () {
                    return guardarRecordatorioRemoto(normalizado);
                });

                return normalizado;
            },
            guardarRemoto: guardarRecordatorioRemoto,
            sincronizar: sincronizarRecordatorioRemoto
        },

        exportar: function () {
            return {
                aplicacion: 'VidaActiva',
                version: VERSION_DATOS,
                exportado_en: ahoraISO(),
                perfil: this.perfil.obtener(),
                plan: this.plan.obtener(),
                comidas: this.comidas.obtenerTodo(),
                entrenamientos: this.entrenamientos.listar(),
                sustituciones: this.sustituciones.listarTodas(),
                habitos: this.habitos.listar(),
                recordatorio: this.recordatorio.obtener()
            };
        },

        importar: function (paquete) {
            if (!paquete || typeof paquete !== 'object') return false;
            const tieneDatos = Boolean(paquete.perfil || paquete.plan || paquete.comidas ||
                Array.isArray(paquete.entrenamientos) || Array.isArray(paquete.sustituciones) ||
                Array.isArray(paquete.habitos) || paquete.recordatorio);
            if (!tieneDatos) return false;

            if (paquete.perfil) {
                const perfil = normalizarPerfil(paquete.perfil);
                if (window.VA && VA.auth && typeof VA.auth.usuarioId === 'function') {
                    const id = VA.auth.usuarioId();
                    if (id) {
                        perfil.id = id;
                        marcarPropietario(id);
                    }
                }
                guardarJSON(CLAVES.perfil, perfil);
            }
            if (paquete.plan) guardarJSON(CLAVES.plan, normalizarPlan(paquete.plan));
            if (paquete.comidas) guardarJSON(CLAVES.comidas, normalizarTodoComidas(paquete.comidas));
            if (Array.isArray(paquete.entrenamientos)) {
                guardarJSON(CLAVES.entrenamientos, paquete.entrenamientos.map(normalizarEntrenamiento).slice(0, 200));
            }
            if (Array.isArray(paquete.sustituciones)) {
                const importadas = normalizarListaSustituciones(paquete.sustituciones);
                const clavesImportadas = {};
                importadas.forEach(function (item) {
                    clavesImportadas[claveSustitucion(item.rutina_id, item.ejercicio_original_id)] = true;
                });

                const ahora = ahoraISO();
                const anteriores = normalizarListaSustituciones(leerJSON(CLAVES.sustituciones, []))
                    .filter(function (item) {
                        return !clavesImportadas[claveSustitucion(item.rutina_id, item.ejercicio_original_id)];
                    })
                    .map(function (item) {
                        return Object.assign({}, item, { updated_at: ahora, deleted_at: ahora });
                    });

                guardarJSON(CLAVES.sustituciones, normalizarListaSustituciones(importadas.concat(anteriores)));
            }
            if (Array.isArray(paquete.habitos)) {
                guardarJSON(CLAVES.habitos, paquete.habitos.map(normalizarHabito));
            }
            if (paquete.recordatorio) {
                guardarJSON(CLAVES.recordatorio, normalizarRecordatorio(paquete.recordatorio));
            }

            ejecutarRemoto(subirTodoLocalARemoto);
            return true;
        },

        borrarTodo: function () {
            Object.keys(CLAVES).forEach(function (nombre) {
                if (nombre !== 'version') borrarClave(CLAVES[nombre]);
            });
            borrarClave(CLAVES.version);
        }
    };

    migrarSiHaceFalta();

    window.VA = window.VA || {};
    window.VA.datos = datos;
})();
