/* VidaActiva — generador de menús semanales.
 * Devuelve solo datos. La interfaz decide qué mostrar al usuario.
 */
(function () {
    'use strict';

    var D = window.VA_DIETAS;
    if (!D) return;

    var ALIMENTOS = D.ALIMENTOS;
    var MENUS = D.MENUS;
    var MAPA = {};
    var MENUS_POR_ID = {};
    ALIMENTOS.forEach(function (a) { MAPA[a.id] = a; });
    MENUS.forEach(function (m) { MENUS_POR_ID[m.id] = m; });

    var DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    var ORDEN = ['desayuno', 'colacion1', 'comida', 'colacion2', 'cena'];
    var COMIDA_INFO = {
        desayuno: { nombre: 'Desayuno', icono: 'i-sun' },
        colacion1: { nombre: 'Colación de la mañana', icono: 'i-apple' },
        comida: { nombre: 'Comida', icono: 'i-food' },
        colacion2: { nombre: 'Colación de la tarde', icono: 'i-apple' },
        cena: { nombre: 'Cena', icono: 'i-moon' }
    };
    var UNIDADES = {
        pieza: ['pieza', 'piezas'], piezas: ['pieza', 'piezas'],
        rebanada: ['rebanada', 'rebanadas'], rebanadas: ['rebanada', 'rebanadas'],
        cucharada: ['cucharada', 'cucharadas'], cucharadas: ['cucharada', 'cucharadas'],
        taza: ['taza', 'tazas'], tazas: ['taza', 'tazas'],
        porcion: ['porción', 'porciones'], porciones: ['porción', 'porciones']
    };

    var FAMILIA = {
        verdura: 'verdura', fruta: 'fruta', cereal: 'cereal', cereal_grasa: 'cereal',
        leguminosa: 'leguminosa', carne_muy_baja: 'carne', carne_baja: 'carne',
        carne_moderada: 'carne', carne_alta: 'carne', leche_descremada: 'leche',
        leche_semidescremada: 'leche', leche_entera: 'leche',
        grasa_sin_proteina: 'grasa', grasa_con_proteina: 'grasa'
    };
    var FAMILIAS = ['verdura', 'fruta', 'cereal', 'leguminosa', 'carne', 'leche', 'grasa'];
    var FAMILIA_INFO = {
        verdura: { nombre: 'Verduras', referencia: '1 taza cruda o ½ taza cocida' },
        fruta: { nombre: 'Frutas', referencia: '1 pieza pequeña o 1 taza' },
        cereal: { nombre: 'Cereales', referencia: '1 tortilla, ½ taza cocida o 30 g de pan' },
        leguminosa: { nombre: 'Leguminosas', referencia: '½ taza cocida' },
        carne: { nombre: 'Carnes', referencia: '30 g según contenido de grasa' },
        leche: { nombre: 'Lácteos', referencia: '1 taza' },
        grasa: { nombre: 'Grasas', referencia: '1 cucharadita de aceite' }
    };
    var LIMITES = {
        verdura: [0.6, 2.0], fruta: [0.6, 2.2], cereal: [0.5, 2.5],
        leguminosa: [0.6, 2.2], carne: [0.6, 2.0], leche: [0.6, 2.0], grasa: [0.5, 2.5]
    };

    function clonar(valor) { return JSON.parse(JSON.stringify(valor)); }

    function limite(valor, min, max, defecto) {
        var n = Number(valor);
        if (!Number.isFinite(n)) return defecto;
        return Math.min(max, Math.max(min, n));
    }

    function texto(valor) {
        return typeof valor === 'string' ? valor.trim() : '';
    }

    function decimal(numero) {
        var n = Math.round(numero * 10) / 10;
        return n % 1 === 0 ? String(n) : n.toFixed(1).replace('.', ',');
    }

    function escalarPorcion(valor, factor) {
        var textoPorcion = String(valor || '');
        var partes = textoPorcion.match(/^([\d.,]+)\s*(.*)$/);
        if (!partes) return textoPorcion;

        var base = parseFloat(partes[1].replace(',', '.'));
        if (!Number.isFinite(base) || base <= 0) return textoPorcion;

        var unidad = partes[2].trim();
        var cantidad = base * factor;
        if (/^(g|ml)$/i.test(unidad)) cantidad = Math.max(5, Math.round(cantidad / 5) * 5);
        else cantidad = Math.max(0.5, Math.round(cantidad * 2) / 2);

        var salida = decimal(cantidad);
        if (unidad) {
            var forma = UNIDADES[unidad.toLowerCase()];
            salida += ' ' + (forma ? (cantidad === 1 ? forma[0] : forma[1]) : unidad);
        }
        return salida;
    }

    function comidasVisibles(colaciones) {
        if (colaciones === 'no') return ['desayuno', 'comida', 'cena'];
        if (colaciones === 'una') return ['desayuno', 'colacion1', 'comida', 'cena'];
        return ORDEN.slice();
    }

    function idsDeMenu(menu) {
        var ids = [];
        ORDEN.forEach(function (clave) {
            if (Array.isArray(menu.comidas[clave])) ids = ids.concat(menu.comidas[clave]);
        });
        return ids;
    }

    function subgrupo(alimento) {
        if (!alimento) return null;
        var grasa = alimento.grasa || 0;
        if (alimento.grupo === 'verdura') return 'verdura';
        if (alimento.grupo === 'fruta') return 'fruta';
        if (alimento.grupo === 'leguminosa') return 'leguminosa';
        if (alimento.grupo === 'cereal') return grasa <= 1.5 ? 'cereal' : 'cereal_grasa';
        if (alimento.grupo === 'lacteo') {
            return grasa <= 2.5 ? 'leche_descremada' : (grasa <= 6 ? 'leche_semidescremada' : 'leche_entera');
        }
        if (alimento.grupo === 'proteina') {
            return grasa <= 2 ? 'carne_muy_baja' : (grasa <= 4 ? 'carne_baja' : (grasa <= 7 ? 'carne_moderada' : 'carne_alta'));
        }
        if (alimento.grupo === 'grasa') return (alimento.prot || 0) <= 1 ? 'grasa_sin_proteina' : 'grasa_con_proteina';
        if (alimento.grupo === 'extra') return 'azucar';
        if (alimento.grupo === 'bebida') return 'bebida_sin_calorias';
        return null;
    }

    function cantidadEquivalente(alimento, grupo) {
        if (!alimento || !grupo) return 0;
        if (grupo.indexOf('carne') === 0) return (alimento.prot || 0) / 7;
        if (grupo.indexOf('leche') === 0) return (alimento.carb || 0) / 12;
        if (grupo.indexOf('grasa') === 0) return (alimento.grasa || 0) / 5;
        if (grupo === 'azucar') return (alimento.carb || 0) / 10;
        var referencia = D.EQUIVALENTES[grupo];
        return referencia && referencia.carb > 0 ? (alimento.carb || 0) / referencia.carb : 0;
    }

    function smaeDe(alimento) {
        var grupo = subgrupo(alimento);
        var referencia = grupo ? D.EQUIVALENTES[grupo] : null;
        if (!referencia) return null;
        return {
            id: grupo,
            nombre: referencia.nombre,
            porcion: referencia.porcion,
            kcal: referencia.kcal,
            prot: referencia.prot,
            lip: referencia.lip,
            carb: referencia.carb,
            cantidad: cantidadEquivalente(alimento, grupo),
            libre: referencia.libre === true
        };
    }

    function equivalentesDelDia(dia, colaciones) {
        var porFamilia = {};
        FAMILIAS.forEach(function (k) { porFamilia[k] = 0; });
        if (!dia) return porFamilia;

        comidasVisibles(colaciones).forEach(function (clave) {
            (dia.comidas[clave] || []).forEach(function (id) {
                var alimento = MAPA[id];
                if (!alimento) return;
                var grupo = subgrupo(alimento);
                var familia = grupo ? FAMILIA[grupo] : null;
                if (familia) porFamilia[familia] += cantidadEquivalente(alimento, grupo);
            });
        });
        return porFamilia;
    }

    function equivalentesDia(plan, indice, colaciones) {
        var dia = Array.isArray(plan) ? plan[indice] : null;
        return equivalentesDelDia(dia, colaciones || 'no');
    }

    function infoFamilias() {
        var copia = {};
        FAMILIAS.forEach(function (clave) {
            copia[clave] = {
                nombre: FAMILIA_INFO[clave].nombre,
                referencia: FAMILIA_INFO[clave].referencia
            };
        });
        return copia;
    }

    function resolverFactores(dia, meta, colaciones) {
        var factores = {};
        FAMILIAS.forEach(function (k) { factores[k] = 1; });
        if (!dia || !meta || !meta.equivalentes) return factores;

        var actual = equivalentesDelDia(dia, colaciones);
        var base = {};
        FAMILIAS.forEach(function (k) {
            var objetivo = meta.equivalentes[k] || 0;
            var tiene = actual[k] || 0;
            var x = tiene > 0.2 ? objetivo / tiene : 1;
            var lim = LIMITES[k];
            base[k] = Math.min(lim[1], Math.max(lim[0], x));
            factores[k] = base[k];
        });

        var acumulado = {};
        FAMILIAS.forEach(function (k) { acumulado[k] = { kcal: 0, prot: 0, grasa: 0, carb: 0 }; });
        comidasVisibles(colaciones).forEach(function (clave) {
            (dia.comidas[clave] || []).forEach(function (id) {
                var alimento = MAPA[id];
                if (!alimento) return;
                var grupo = subgrupo(alimento);
                var familia = grupo ? FAMILIA[grupo] : null;
                if (!familia) return;
                acumulado[familia].kcal += alimento.kcal;
                acumulado[familia].prot += alimento.prot;
                acumulado[familia].grasa += alimento.grasa || 0;
                acumulado[familia].carb += alimento.carb || 0;
            });
        });

        var objetivos = [
            { clave: 'prot', valor: meta.macros.prot, peso: 1.2 },
            { clave: 'grasa', valor: meta.macros.grasa, peso: 1.0 },
            { clave: 'carb', valor: meta.macros.carb, peso: 0.8 },
            { clave: 'kcal', valor: meta.kcal, peso: 0.8 }
        ];

        for (var vuelta = 0; vuelta < 60; vuelta++) {
            var cambio = 0;
            FAMILIAS.forEach(function (k) {
                var grupo = acumulado[k];
                if (!grupo || grupo.kcal <= 0) return;

                var otros = { kcal: 0, prot: 0, grasa: 0, carb: 0 };
                FAMILIAS.forEach(function (j) {
                    if (j === k) return;
                    otros.kcal += acumulado[j].kcal * factores[j];
                    otros.prot += acumulado[j].prot * factores[j];
                    otros.grasa += acumulado[j].grasa * factores[j];
                    otros.carb += acumulado[j].carb * factores[j];
                });

                var numerador = 0;
                var denominador = 0;
                objetivos.forEach(function (objetivo) {
                    var metaValor = objetivo.valor;
                    if (!Number.isFinite(metaValor) || metaValor <= 0) return;
                    numerador += objetivo.peso * grupo[objetivo.clave] * (metaValor - otros[objetivo.clave]) / (metaValor * metaValor);
                    denominador += objetivo.peso * Math.pow(grupo[objetivo.clave] / metaValor, 2);
                });
                if (denominador <= 1e-9) return;

                var lim = LIMITES[k];
                var x = Math.min(lim[1], Math.max(lim[0], numerador / denominador));
                x = x * 0.75 + base[k] * 0.25;
                cambio = Math.max(cambio, Math.abs(x - factores[k]));
                factores[k] = x;
            });
            if (cambio < 0.002) break;
        }
        return factores;
    }

    function factorDe(alimento, factores) {
        var grupo = subgrupo(alimento);
        var familia = grupo ? FAMILIA[grupo] : null;
        return familia ? (factores[familia] || 1) : 1;
    }

    function totalesDelDia(dia, factores, colaciones) {
        var total = { kcal: 0, prot: 0, grasa: 0, carb: 0 };
        comidasVisibles(colaciones).forEach(function (clave) {
            (dia.comidas[clave] || []).forEach(function (id) {
                var alimento = MAPA[id];
                if (!alimento) return;
                var factor = factorDe(alimento, factores);
                total.kcal += alimento.kcal * factor;
                total.prot += alimento.prot * factor;
                total.grasa += (alimento.grasa || 0) * factor;
                total.carb += (alimento.carb || 0) * factor;
            });
        });
        return {
            kcal: Math.round(total.kcal),
            prot: Math.round(total.prot),
            grasa: Math.round(total.grasa),
            carb: Math.round(total.carb)
        };
    }

    function ajusteMenu(menu, meta, perfil) {
        var dia = { menuId: menu.id, comidas: menu.comidas, cambios: {} };
        var factores = resolverFactores(dia, meta, perfil.colaciones);
        var total = totalesDelDia(dia, factores, perfil.colaciones);
        var rel = function (valor, objetivo, peso) {
            if (!objetivo) return 0;
            return peso * Math.pow((valor - objetivo) / objetivo, 2);
        };

        var error = rel(total.prot, meta.macros.prot, 1.4) +
            rel(total.grasa, meta.macros.grasa, 0.7) +
            rel(total.carb, meta.macros.carb, 0.7) +
            rel(total.kcal, meta.kcal, 1.0);

        var equivalentes = equivalentesDelDia(dia, perfil.colaciones);
        FAMILIAS.forEach(function (k) {
            if ((meta.equivalentes[k] || 0) > 0.5 && (equivalentes[k] || 0) < 0.5) error += 0.15;
            if (factores[k] < 0.7 || factores[k] > 2.1) error += 0.05;
        });
        return error;
    }

    function bonificacion(menu, perfil) {
        var gustos = perfil.gustos || [];
        var despensa = perfil.despensa || [];
        var puntos = 0;
        idsDeMenu(menu).forEach(function (id) {
            if (gustos.indexOf(id) >= 0) puntos += 6;
            if (despensa.indexOf(id) >= 0) puntos += 3;
        });
        return puntos;
    }

    function normalizarPerfil(perfilReal, opciones) {
        var real = perfilReal && typeof perfilReal === 'object' ? perfilReal : {};
        var extra = opciones && typeof opciones === 'object' ? opciones : {};
        var sexos = ['femenino', 'masculino', 'prefiero_no_decir'];
        var actividades = ['sedentario', 'ligero', 'moderado', 'activo'];
        var objetivos = ['bajar', 'mantener', 'subir'];
        var etapas = Object.keys(D.ETAPAS);
        var presupuestos = Object.keys(D.PRESUPUESTOS);
        var medicamentos = Object.keys(D.MEDICAMENTOS);
        var regiones = Object.keys(D.REGIONES);
        var distribuciones = Object.keys(D.DISTRIBUCION);

        var sugerida = sugerirDistribucion({
            condiciones: Array.isArray(extra.condiciones) ? extra.condiciones : [],
            etapa: extra.etapa || 'ninguna'
        });
        var distribucion = distribuciones.indexOf(extra.distribucion) >= 0 ? extra.distribucion : sugerida;
        var peso = Number(real.peso_kg || real.peso);
        var estatura = Number(real.estatura_cm || real.estatura);
        var alergias = Array.isArray(extra.alergias) ? extra.alergias.filter(function (id) { return !!D.ALERGIAS[id]; }) : [];
        var condiciones = Array.isArray(extra.condiciones) ? extra.condiciones.filter(function (id) { return !!D.CONDICIONES[id]; }) : [];
        var gustos = Array.isArray(extra.gustos) ? extra.gustos.filter(function (id) { return !!MAPA[id]; }) : [];
        var despensa = Array.isArray(extra.despensa) ? extra.despensa.filter(function (id) { return !!MAPA[id]; }) : [];
        var etapa = etapas.indexOf(extra.etapa) >= 0 ? extra.etapa : 'ninguna';
        var objetivo = objetivos.indexOf(real.objetivo) >= 0 ? real.objetivo : 'mantener';
        var deseaBajar = objetivo === 'bajar';
        if (deseaBajar && (etapa === 'embarazo' || etapa === 'lactancia')) objetivo = 'mantener';

        return {
            nombre: texto(real.nombre),
            sexo: sexos.indexOf(real.sexo) >= 0 ? real.sexo : 'prefiero_no_decir',
            edad: Math.round(limite(real.edad, 0, 100, 0)),
            peso: Math.round(limite(peso, 30, 300, 70) * 10) / 10,
            estatura: Math.round(limite(estatura, 100, 250, 165)),
            actividad: actividades.indexOf(real.actividad) >= 0 ? real.actividad : 'moderado',
            objetivo: objetivo,
            etapa: etapa,
            presupuesto: presupuestos.indexOf(extra.presupuesto) >= 0 ? extra.presupuesto : 'medio',
            colaciones: ['no', 'una', 'dos'].indexOf(extra.colaciones) >= 0 ? extra.colaciones : 'no',
            alergias: alergias,
            alergiaOtra: texto(extra.alergiaOtra).slice(0, 60),
            medicamento: medicamentos.indexOf(extra.medicamento) >= 0 ? extra.medicamento : 'ninguno',
            condiciones: condiciones,
            distribucion: distribucion,
            region: regiones.indexOf(extra.region) >= 0 ? extra.region : 'todas',
            gustos: gustos,
            despensa: despensa,
            horarios: extra.horarios && typeof extra.horarios === 'object' ? extra.horarios : {}
        };
    }

    function sugerirDistribucion(perfil) {
        var condiciones = (perfil && perfil.condiciones) || [];
        var orden = ['diabetes', 'hipertension', 'colesterol'];
        for (var i = 0; i < orden.length; i++) {
            if (condiciones.indexOf(orden[i]) >= 0) return D.DISTRIBUCION_SUGERIDA[orden[i]];
        }
        if (perfil && perfil.etapa === 'somp') return D.DISTRIBUCION_SUGERIDA.somp;
        return D.DISTRIBUCION_POR_DEFECTO;
    }

    function validar(perfil) {
        if (!perfil || !Number.isFinite(perfil.edad) || perfil.edad < 18) {
            return 'El plan de alimentación está disponible a partir de los 18 años.';
        }
        if (!(perfil.peso >= 30 && perfil.peso <= 300)) return 'Revisa tu peso en el perfil.';
        if (!(perfil.estatura >= 100 && perfil.estatura <= 250)) return 'Revisa tu estatura en el perfil.';
        return '';
    }

    function calcularMeta(perfil) {
        var base = {
            nombre: perfil.nombre,
            edad: perfil.edad,
            sexo: perfil.sexo,
            peso_kg: perfil.peso,
            estatura_cm: perfil.estatura,
            actividad: perfil.actividad,
            objetivo: perfil.objetivo
        };
        var kcal = window.VA && VA.datos && typeof VA.datos.calcularCaloriasObjetivo === 'function'
            ? VA.datos.calcularCaloriasObjetivo(base)
            : 2000;

        if (perfil.etapa === 'embarazo') kcal += 340;
        if (perfil.etapa === 'lactancia') kcal += 500;
        kcal = Math.max(1200, Math.min(4000, Math.round(kcal / 10) * 10));

        var distribucion = D.DISTRIBUCION[perfil.distribucion] || D.DISTRIBUCION[D.DISTRIBUCION_POR_DEFECTO];
        var prot = Math.round(kcal * distribucion.prot / 100 / 4 / 5) * 5;
        var grasa = Math.round(kcal * distribucion.lip / 100 / 9 / 5) * 5;
        var carb = Math.round(kcal * distribucion.carb / 100 / 4 / 5) * 5;
        var escala = kcal / 2000;
        var fijoProt = 4 * escala * 2 + 1 * escala * 8 + 1 * escala * 9;
        var fijoCarb = 4 * escala * 4 + 4 * escala * 15 + 1 * escala * 20 + 1 * escala * 12;
        var fijoGrasa = 1 * escala * 1 + 1 * escala * 2;
        var P = prot - fijoProt;
        var C = carb - fijoCarb;
        var F = grasa - fijoGrasa;
        var tope = function (n) { return Math.max(0, Math.round(n * 10) / 10); };

        return {
            kcal: kcal,
            macros: { prot: prot, grasa: grasa, carb: carb },
            equivalentes: {
                verdura: tope(4 * escala),
                fruta: tope(4 * escala),
                leguminosa: tope(1 * escala),
                leche: tope(1 * escala),
                cereal: tope((3 * P + 32 * C - 21 * F) / 486),
                carne: tope((75 * P - 10 * C - 39 * F) / 486),
                grasa: tope((105 * F + 2 * C - 15 * P) / 486)
            },
            distribucion: perfil.distribucion
        };
    }

    function alimentoSeguro(alimento, perfil) {
        if (!alimento) return false;
        var alergias = perfil.alergias || [];
        var condiciones = perfil.condiciones || [];
        var alergenos = alimento.alergenos || [];
        var flags = alimento.flags || [];
        var i;

        for (i = 0; i < alergias.length; i++) {
            if (alergias[i] === 'otros') continue;
            if (alergenos.indexOf(alergias[i]) >= 0) return false;
        }
        if (perfil.alergiaOtra && alimento.nombre.toLowerCase().indexOf(perfil.alergiaOtra.toLowerCase()) >= 0) return false;
        if (condiciones.indexOf('celiaquia') >= 0 && alergenos.indexOf('gluten') >= 0) return false;
        if (condiciones.indexOf('intolerancia_lactosa') >= 0 && alergenos.indexOf('lactosa') >= 0) return false;
        if (condiciones.indexOf('diabetes') >= 0 && flags.indexOf('alto_azucar') >= 0) return false;
        if (condiciones.indexOf('hipertension') >= 0 && flags.indexOf('alto_sodio') >= 0) return false;
        if (condiciones.indexOf('gastritis') >= 0 && flags.indexOf('irritante') >= 0) return false;
        if (condiciones.indexOf('colesterol') >= 0 && flags.indexOf('grasa_saturada') >= 0) return false;
        if (condiciones.indexOf('somp') >= 0 && flags.indexOf('alto_ig') >= 0) return false;
        if ((perfil.etapa === 'embarazo' || perfil.etapa === 'lactancia') && flags.indexOf('embarazo_no') >= 0) return false;

        var interacciones = alimento.interacciones || [];
        if (perfil.medicamento && perfil.medicamento !== 'ninguno' && interacciones.indexOf(perfil.medicamento) >= 0) return false;
        return true;
    }

    function menuSeguro(menu, perfil) {
        if (!menu) return false;
        var etiquetas = (perfil.condiciones || []).filter(function (c) {
            return c !== 'celiaquia' && c !== 'intolerancia_lactosa';
        });
        if (perfil.etapa && perfil.etapa !== 'ninguna') etiquetas.push(perfil.etapa);

        for (var i = 0; i < etiquetas.length; i++) {
            if ((menu.condiciones || []).indexOf(etiquetas[i]) < 0) return false;
        }
        return idsDeMenu(menu).every(function (id) { return alimentoSeguro(MAPA[id], perfil); });
    }

    function menusDisponibles(perfil) {
        var base = MENUS.filter(function (menu) {
            return menu.presupuesto === perfil.presupuesto && menuSeguro(menu, perfil);
        });
        if (!perfil.region || perfil.region === 'todas') return base;
        var regionales = base.filter(function (menu) { return menu.region === perfil.region; });
        return regionales.length ? regionales : base;
    }

    function barajar(lista) {
        for (var i = lista.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temporal = lista[i];
            lista[i] = lista[j];
            lista[j] = temporal;
        }
        return lista;
    }

    function firma(perfil) {
        var datos = [
            (perfil.alergias || []).slice().sort(),
            perfil.alergiaOtra || '',
            (perfil.condiciones || []).slice().sort(),
            perfil.etapa || 'ninguna',
            perfil.presupuesto || 'medio',
            perfil.medicamento || 'ninguno',
            perfil.distribucion || D.DISTRIBUCION_POR_DEFECTO,
            perfil.region || 'todas',
            (perfil.gustos || []).slice().sort(),
            (perfil.despensa || []).slice().sort(),
            perfil.objetivo || 'mantener'
        ];
        if (window.VA && VA.datos && typeof VA.datos.huella === 'function') return VA.datos.huella(JSON.stringify(datos));
        return '0';
    }

    function generarPlan(perfil) {
        var error = validar(perfil);
        if (error) return { plan: [], mensaje: error, ajustado: false };

        var pool = menusDisponibles(perfil);
        var ajustado = false;
        if (!pool.length) {
            var alternos = MENUS.filter(function (menu) { return menuSeguro(menu, perfil); });
            if (alternos.length) {
                var ordenPresupuesto = D.PRESUPUESTOS[perfil.presupuesto] ? D.PRESUPUESTOS[perfil.presupuesto].orden : 2;
                alternos.sort(function (a, b) {
                    var da = Math.abs((D.PRESUPUESTOS[a.presupuesto] || { orden: 2 }).orden - ordenPresupuesto);
                    var db = Math.abs((D.PRESUPUESTOS[b.presupuesto] || { orden: 2 }).orden - ordenPresupuesto);
                    return da - db;
                });
                pool = alternos.filter(function (menu) { return menu.presupuesto === alternos[0].presupuesto; });
                ajustado = true;
            }
        }
        if (!pool.length) {
            return { plan: [], mensaje: 'No hay menús compatibles con tus filtros. Prueba con otra preferencia o quita alguno.', ajustado: false };
        }

        var meta = calcularMeta(perfil);
        var orden = barajar(pool.slice());
        var uso = {};
        var prioridad = {};
        orden.forEach(function (menu) {
            uso[menu.id] = 0;
            prioridad[menu.id] = ajusteMenu(menu, meta, perfil) - bonificacion(menu, perfil);
        });

        var plan = [];
        var anterior = null;
        for (var dia = 0; dia < 7; dia++) {
            var minimo = Infinity;
            orden.forEach(function (menu) { minimo = Math.min(minimo, uso[menu.id]); });
            var candidatos = orden.filter(function (menu) { return uso[menu.id] === minimo && menu.id !== anterior; });
            if (!candidatos.length) candidatos = orden.filter(function (menu) { return menu.id !== anterior; });
            if (!candidatos.length) candidatos = orden;
            candidatos.sort(function (a, b) { return prioridad[a.id] - prioridad[b.id]; });
            var finalistas = candidatos.slice(0, Math.min(3, candidatos.length));
            var elegido = finalistas[Math.floor(Math.random() * finalistas.length)];
            uso[elegido.id]++;
            anterior = elegido.id;
            plan.push({
                menuId: elegido.id,
                comidas: clonar(elegido.comidas),
                cambios: {}
            });
        }

        return {
            plan: plan,
            mensaje: ajustado ? 'Ajustamos el presupuesto para encontrar opciones compatibles.' : '',
            ajustado: ajustado
        };
    }

    function planValido(plan, perfil) {
        if (!Array.isArray(plan) || plan.length !== 7 || !perfil) return false;
        return plan.every(function (dia) {
            if (!dia || !MENUS_POR_ID[dia.menuId] || !dia.comidas) return false;
            return ORDEN.every(function (clave) {
                var lista = dia.comidas[clave];
                if (!Array.isArray(lista)) return false;
                return lista.every(function (id) { return alimentoSeguro(MAPA[id], perfil); });
            });
        });
    }

    function candidatosCambio(plan, indiceDia, comida, posicion, perfil, motivo) {
        var dia = plan && plan[indiceDia];
        var actualId = dia && dia.comidas && dia.comidas[comida] ? dia.comidas[comida][posicion] : null;
        var actual = MAPA[actualId];
        if (!actual || !perfil) return [];

        var enElDia = {};
        ORDEN.forEach(function (clave) {
            (dia.comidas[clave] || []).forEach(function (id) { enElDia[id] = true; });
        });

        var puntuados = ALIMENTOS.filter(function (alimento) {
            return alimento.id !== actualId && alimento.grupo === actual.grupo && alimentoSeguro(alimento, perfil);
        }).map(function (alimento) {
            var puntos = Math.abs(alimento.kcal - actual.kcal) + Math.abs(alimento.prot - actual.prot) * 2;
            if (enElDia[alimento.id]) puntos += 45;
            if (motivo === 'presupuesto' && alimento.tags.indexOf('economico') >= 0) puntos -= 30;
            if (motivo === 'tiempo' && alimento.tags.indexOf('rapido') >= 0) puntos -= 25;
            if (motivo === 'alergia') puntos -= (alimento.alergenos || []).length * 8;
            if ((perfil.gustos || []).indexOf(alimento.id) >= 0) puntos -= 20;
            if ((perfil.despensa || []).indexOf(alimento.id) >= 0) puntos -= 10;
            return { alimento: alimento, puntos: puntos };
        }).sort(function (a, b) {
            return a.puntos === b.puntos ? a.alimento.kcal - b.alimento.kcal : a.puntos - b.puntos;
        }).map(function (item) { return item.alimento; });

        var sinRepetir = puntuados.filter(function (alimento) { return !enElDia[alimento.id]; });
        return (sinRepetir.length ? sinRepetir : puntuados).slice(0, 7).map(function (alimento) {
            return {
                id: alimento.id,
                nombre: alimento.nombre,
                funcion: alimento.funcion,
                porcion: alimento.porcion,
                kcal: alimento.kcal
            };
        });
    }

    function aplicarCambio(plan, indiceDia, comida, posicion, idNuevo, motivo, perfil) {
        var dia = plan && plan[indiceDia];
        var anterior = dia && dia.comidas && dia.comidas[comida] ? dia.comidas[comida][posicion] : null;
        if (!anterior || !MAPA[idNuevo] || !alimentoSeguro(MAPA[idNuevo], perfil)) return null;
        if (anterior === idNuevo) return null;

        dia.comidas[comida][posicion] = idNuevo;
        dia.cambios = dia.cambios || {};
        dia.cambios[comida + ':' + posicion] = {
            original: anterior,
            motivo: ['gusto', 'alergia', 'presupuesto', 'tiempo'].indexOf(motivo) >= 0 ? motivo : 'gusto'
        };
        return plan;
    }

    function restaurarAlimento(plan, indiceDia, comida, posicion) {
        var dia = plan && plan[indiceDia];
        if (!dia || !dia.cambios) return null;
        var clave = comida + ':' + posicion;
        var cambio = dia.cambios[clave];
        if (!cambio || !dia.comidas[comida]) return null;
        dia.comidas[comida][posicion] = cambio.original;
        delete dia.cambios[clave];
        return plan;
    }

    function restaurarDia(plan, indiceDia) {
        var dia = plan && plan[indiceDia];
        var menu = dia ? MENUS_POR_ID[dia.menuId] : null;
        if (!dia || !menu) return null;
        dia.comidas = clonar(menu.comidas);
        dia.cambios = {};
        return plan;
    }

    function otroMenu(plan, indiceDia, perfil) {
        var dia = plan && plan[indiceDia];
        if (!dia || !perfil) return null;
        var actual = MENUS_POR_ID[dia.menuId];
        var presupuesto = actual ? actual.presupuesto : perfil.presupuesto;
        var base = MENUS.filter(function (menu) {
            return menu.id !== dia.menuId && menu.presupuesto === presupuesto && menuSeguro(menu, perfil);
        });
        var regionales = base.filter(function (menu) { return menu.region === perfil.region; });
        var pool = perfil.region !== 'todas' && regionales.length ? regionales : base;
        if (!pool.length) return null;

        var uso = {};
        plan.forEach(function (item) { uso[item.menuId] = (uso[item.menuId] || 0) + 1; });
        pool.sort(function (a, b) { return (uso[a.id] || 0) - (uso[b.id] || 0); });
        var minimo = uso[pool[0].id] || 0;
        var candidatos = pool.filter(function (menu) { return (uso[menu.id] || 0) === minimo; });
        var meta = calcularMeta(perfil);
        candidatos.sort(function (a, b) {
            return (ajusteMenu(a, meta, perfil) - bonificacion(a, perfil)) -
                (ajusteMenu(b, meta, perfil) - bonificacion(b, perfil));
        });
        var elegido = candidatos[Math.floor(Math.random() * Math.min(2, candidatos.length))];
        if (!elegido) return null;

        dia.menuId = elegido.id;
        dia.comidas = clonar(elegido.comidas);
        dia.cambios = {};
        return plan;
    }

    function resumenDia(plan, indice, colaciones) {
        var dia = plan && Array.isArray(plan) ? plan[indice] : null;
        var menu = dia ? MENUS_POR_ID[dia.menuId] : null;
        if (!dia || !menu) return null;

        var claves = comidasVisibles(colaciones || 'no');
        var comidas = claves.map(function (clave) {
            var ids = dia.comidas[clave] || [];
            return {
                clave: clave,
                nombre: COMIDA_INFO[clave].nombre,
                icono: COMIDA_INFO[clave].icono,
                alimentos: ids.map(function (id) {
                    var alimento = MAPA[id];
                    return alimento ? { id: id, nombre: alimento.nombre, porcion: alimento.porcion } : null;
                }).filter(Boolean)
            };
        });

        return {
            indice: indice,
            dia: DIAS[indice],
            menuId: menu.id,
            nombreMenu: menu.nombre,
            comidas: comidas,
            cambios: Object.keys(dia.cambios || {}).length
        };
    }

    function alimento(id) {
        var item = MAPA[id];
        if (!item) return null;
        return {
            id: item.id,
            nombre: item.nombre,
            grupo: item.grupo,
            funcion: item.funcion,
            porcion: item.porcion,
            kcal: item.kcal,
            gusto: false
        };
    }

    function menu(id) {
        var item = MENUS_POR_ID[id];
        return item ? { id: item.id, nombre: item.nombre, region: item.region, presupuesto: item.presupuesto } : null;
    }

    function nombre(id) {
        var item = MAPA[id];
        return item ? item.nombre : '';
    }

    window.VA = window.VA || {};
    window.VA.dietas = {
        catalogo: D,
        dias: DIAS,
        comidasVisibles: comidasVisibles,
        normalizarPerfil: normalizarPerfil,
        sugerirDistribucion: sugerirDistribucion,
        validar: validar,
        calcularMeta: calcularMeta,
        firma: firma,
        generarPlan: generarPlan,
        planValido: planValido,
        candidatosCambio: candidatosCambio,
        aplicarCambio: aplicarCambio,
        restaurarAlimento: restaurarAlimento,
        restaurarDia: restaurarDia,
        otroMenu: otroMenu,
        resumenDia: resumenDia,
        equivalentesDia: equivalentesDia,
        infoFamilias: infoFamilias,
        smae: smaeDe,
        escalarPorcion: escalarPorcion,
        alimento: alimento,
        menu: menu,
        nombre: nombre
    };
})();
