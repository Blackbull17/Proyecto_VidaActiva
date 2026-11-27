// ===== PLAN DE ALIMENTACIÓN =====
const CLAVE_OCULTA_DIETA = 'vidaactiva.inicio.recordatorio-dieta-oculto';
const VERSION_PLAN_DIETA = 3;

let planDietaActual = null;
let perfilDietaActual = null;
let diaDietaActual = 0;
let cambioDietaActual = null;
let detalleTecnicoAbierto = false;

function valorCampo(id) {
    const campo = document.getElementById(id);
    return campo ? campo.value : '';
}

function seleccionCampo(id) {
    const campo = document.getElementById(id);
    if (!campo || !campo.selectedOptions) return [];
    return Array.prototype.map.call(campo.selectedOptions, function (opcion) { return opcion.value; });
}

function marcarSeleccionCampo(id, seleccionados) {
    const campo = document.getElementById(id);
    if (!campo || !campo.options || !Array.isArray(seleccionados)) return;
    Array.prototype.forEach.call(campo.options, function (opcion) {
        opcion.selected = seleccionados.indexOf(opcion.value) >= 0;
    });
    actualizarMultiDieta(id);
}

const MULTIS_DIETA = ['condicionesDieta', 'alergiasDieta', 'gustosDieta', 'despensaDieta'];

function prefijoMultiDieta(id) {
    return id.replace(/Dieta$/, '');
}

function textoVacioMultiDieta(id) {
    return id === 'gustosDieta' || id === 'despensaDieta' ? 'Ninguno' : 'Ninguna';
}

function cerrarTodosLosMultisDieta() {
    Array.prototype.forEach.call(document.querySelectorAll('.multi-dieta.abierto'), function (contenedor) {
        const id = contenedor.getAttribute('data-multi-dieta');
        const prefijo = prefijoMultiDieta(id);
        const panel = document.getElementById(prefijo + 'Panel');
        const control = document.getElementById(prefijo + 'Control');
        contenedor.classList.remove('abierto');
        if (panel) panel.hidden = true;
        if (control) control.setAttribute('aria-expanded', 'false');
    });
}

function alternarMultiDieta(id) {
    const contenedor = document.querySelector('.multi-dieta[data-multi-dieta="' + id + '"]');
    if (!contenedor) return;

    const yaAbierto = contenedor.classList.contains('abierto');
    cerrarTodosLosMultisDieta();
    if (yaAbierto) return;

    const prefijo = prefijoMultiDieta(id);
    const panel = document.getElementById(prefijo + 'Panel');
    const control = document.getElementById(prefijo + 'Control');
    contenedor.classList.add('abierto');
    if (panel) panel.hidden = false;
    if (control) control.setAttribute('aria-expanded', 'true');
}

function alternarChipMultiDieta(id, valor) {
    const campo = document.getElementById(id);
    if (!campo || !campo.options) return;

    Array.prototype.forEach.call(campo.options, function (opcion) {
        if (opcion.value === valor) opcion.selected = !opcion.selected;
    });
    actualizarMultiDieta(id);
    if (id === 'alergiasDieta') mostrarOtrasAlergias();
}

function actualizarMultiDieta(id) {
    const campo = document.getElementById(id);
    if (!campo || !campo.options) return;

    const prefijo = prefijoMultiDieta(id);
    const seleccionados = seleccionCampo(id);
    const nombres = Array.prototype.map.call(campo.selectedOptions, function (opcion) {
        return (opcion.textContent || opcion.value || '').trim();
    });
    const valor = document.getElementById(prefijo + 'Valor');
    const conteo = document.getElementById(prefijo + 'Conteo');
    const chips = document.getElementById(prefijo + 'Chips');

    if (valor) {
        valor.textContent = nombres.length
            ? nombres.slice(0, 2).join(', ') + (nombres.length > 2 ? ' +' + (nombres.length - 2) : '')
            : textoVacioMultiDieta(id);
    }
    if (conteo) conteo.textContent = seleccionados.length ? String(seleccionados.length) : '';
    if (chips) {
        chips.innerHTML = Array.prototype.map.call(campo.options, function (opcion) {
            const activo = seleccionados.indexOf(opcion.value) >= 0;
            return '<button type="button" class="multi-dieta-chip' + (activo ? ' activo' : '') + '"' +
                ' aria-pressed="' + (activo ? 'true' : 'false') + '"' +
                ' onclick="alternarChipMultiDieta(\'' + id + '\',\'' + opcion.value + '\')">' +
                escaparHTML(opcion.textContent || opcion.value) + '</button>';
        }).join('');
    }
}

function actualizarMultisDieta() {
    MULTIS_DIETA.forEach(actualizarMultiDieta);
}

function cerrarMultisDietaAlClicFuera(evento) {
    if (evento.target && evento.target.closest && evento.target.closest('.multi-dieta')) return;
    cerrarTodosLosMultisDieta();
}

function perfilActualRegistrado() {
    return window.VA && VA.datos && VA.datos.perfil ? VA.datos.perfil.obtener() : null;
}

function sexoPerfilActual() {
    const perfil = perfilActualRegistrado();
    return perfil && perfil.sexo ? String(perfil.sexo).toLowerCase() : '';
}

function actualizarCamposPorSexo() {
    const grupo = document.getElementById('etapaDietaGrupo');
    const campo = document.getElementById('etapaDieta');
    if (!grupo || !campo) return;

    const esHombre = sexoPerfilActual() === 'masculino';
    grupo.hidden = esHombre;
    campo.disabled = esHombre;
    if (esHombre) campo.value = 'ninguna';
}

function mostrarOtrasAlergias() {
    const div = document.getElementById('otraAlergiaDiv');
    if (!div) return;
    div.hidden = seleccionCampo('alergiasDieta').indexOf('otros') < 0;
}

function mostrarColaciones() {
    const div = document.getElementById('colacionesDiv');
    const etiqueta2 = document.getElementById('etiquetaColacion2');
    const horario2 = document.getElementById('horarioColacion2');
    const colaciones = valorCampo('colaciones');

    if (div) div.hidden = colaciones === 'no';
    if (etiqueta2) etiqueta2.hidden = colaciones !== 'dos';
    if (horario2) horario2.hidden = colaciones !== 'dos';
}

function horariosDelFormulario() {
    const campos = {
        horarioDesayuno: 'desayuno',
        horarioComida: 'comida',
        horarioCena: 'cena',
        horarioColacion1: 'colacion1',
        horarioColacion2: 'colacion2'
    };
    const horarios = {};

    Object.keys(campos).forEach(function (id) {
        const valor = valorCampo(id);
        if (valor) horarios[campos[id]] = valor;
    });
    return horarios;
}

function leerOpcionesDieta() {
    return {
        condiciones: seleccionCampo('condicionesDieta'),
        alergias: seleccionCampo('alergiasDieta'),
        alergiaOtra: valorCampo('otraAlergia').trim(),
        etapa: sexoPerfilActual() === 'masculino' ? 'ninguna' : (valorCampo('etapaDieta') || 'ninguna'),
        medicamento: valorCampo('medicamentoDieta') || 'ninguno',
        region: valorCampo('regionDieta') || 'todas',
        gustos: seleccionCampo('gustosDieta'),
        despensa: seleccionCampo('despensaDieta'),
        presupuesto: valorCampo('presupuesto') || 'medio',
        colaciones: valorCampo('colaciones') || 'no',
        horarios: horariosDelFormulario()
    };
}

function icoPlan(id) {
    return window.VA && VA.icono ? VA.icono(id) : '';
}

function mensajePlanDieta(texto, esError) {
    const resultado = document.getElementById('resultadoDieta');
    if (!resultado) return;
    resultado.hidden = false;
    resultado.innerHTML = '<div class="card plan-aviso' + (esError ? ' error' : '') + '">' +
        icoPlan(esError ? 'i-alert' : 'i-check') + '<span>' + escaparHTML(texto) + '</span></div>';
}

function guardarPlanDieta(perfil, menu, meta) {
    return VA.datos.plan.guardar({
        presupuesto: perfil.presupuesto,
        colaciones: perfil.colaciones,
        horarios: perfil.horarios,
        menu_semana: menu,
        huella_filtros: VA.dietas.firma(perfil),
        distribucion: perfil.distribucion,
        kcal_objetivo: meta.kcal,
        version: VERSION_PLAN_DIETA,
        updated_at: VA.datos.ahoraISO()
    });
}

function generarDieta() {
    if (!window.VA || !VA.dietas || !VA.datos) {
        mensajePlanDieta('No se pudo preparar tu menú. Recarga la página e inténtalo de nuevo.', true);
        return;
    }

    const perfilReal = VA.datos.perfil.obtener();
    if (!perfilReal) {
        mensajePlanDieta('Completa tu perfil en la sección Mi perfil para poder generar tu menú.', true);
        return;
    }

    const opciones = leerOpcionesDieta();
    const perfil = VA.dietas.normalizarPerfil(perfilReal, opciones);
    const error = VA.dietas.validar(perfil);
    if (error) {
        mensajePlanDieta(error, true);
        return;
    }

    const generado = VA.dietas.generarPlan(perfil);
    if (!generado.plan.length) {
        mensajePlanDieta(generado.mensaje || 'No se pudo preparar tu menú. Revisa tus preferencias.', true);
        return;
    }

    guardarPlanDieta(perfil, generado.plan, VA.dietas.calcularMeta(perfil));
    planDietaActual = generado.plan;
    perfilDietaActual = perfil;
    diaDietaActual = 0;
    renderizarPlanDieta(generado.mensaje);

    const resultado = document.getElementById('resultadoDieta');
    if (resultado && typeof resultado.scrollIntoView === 'function') {
        resultado.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function numeroDecimalDieta(valor) {
    const numero = Math.round((Number(valor) || 0) * 10) / 10;
    return numero % 1 === 0 ? String(numero) : numero.toFixed(1).replace('.', ',');
}

function numeroEnteroDieta(valor) {
    return Math.round(Number(valor) || 0).toLocaleString('es-MX');
}

function alimentoDelCatalogo(id) {
    if (!window.VA_DIETAS || !Array.isArray(VA_DIETAS.ALIMENTOS)) return null;
    for (let i = 0; i < VA_DIETAS.ALIMENTOS.length; i += 1) {
        if (VA_DIETAS.ALIMENTOS[i].id === id) return VA_DIETAS.ALIMENTOS[i];
    }
    return null;
}

function totalesComidaDieta(ids) {
    const total = { kcal: 0, prot: 0, grasa: 0, carb: 0 };
    (ids || []).forEach(function (id) {
        const alimento = alimentoDelCatalogo(id);
        if (!alimento) return;
        total.kcal += Number(alimento.kcal) || 0;
        total.prot += Number(alimento.prot) || 0;
        total.grasa += Number(alimento.grasa) || 0;
        total.carb += Number(alimento.carb) || 0;
    });
    return total;
}

function totalesDietaDelDia(colaciones) {
    const dia = planDietaActual && planDietaActual[diaDietaActual];
    const total = { kcal: 0, prot: 0, grasa: 0, carb: 0 };
    if (!dia || !window.VA || !VA.dietas || typeof VA.dietas.comidasVisibles !== 'function') return total;

    VA.dietas.comidasVisibles(colaciones || 'no').forEach(function (clave) {
        const parcial = totalesComidaDieta(dia.comidas[clave]);
        total.kcal += parcial.kcal;
        total.prot += parcial.prot;
        total.grasa += parcial.grasa;
        total.carb += parcial.carb;
    });
    return total;
}

const ACTIVIDADES_DIETA = {
    sedentario: 'sedentaria',
    ligero: 'ligera',
    moderado: 'moderada',
    activo: 'activa'
};

const ETIQUETAS_EQ_DIETA = {
    verdura: 'Verdura',
    fruta: 'Fruta',
    cereal: 'Cereal',
    leguminosa: 'Leguminosa',
    carne: 'Carne',
    leche: 'Leche',
    grasa: 'Grasa'
};

const REF_EQ_DIETA = {
    verdura: 'verdura',
    fruta: 'fruta',
    cereal: 'cereal',
    leguminosa: 'leguminosa',
    carne: 'carne_muy_baja',
    leche: 'leche_descremada',
    grasa: 'grasa_con_proteina'
};

const NOTAS_MEDICAMENTO_DIETA = {
    anticoagulante: 'Anticoagulante: mantén constante el consumo de alimentos ricos en vitamina K y consulta antes de cambiarlo.',
    levotiroxina: 'Levotiroxina: se toma en ayunas; separa el calcio, el hierro y la soya del horario de la medicina.',
    antibiotico: 'Antibiótico: sigue las indicaciones médicas sobre lácteos, horarios y alimentos durante el tratamiento.',
    antidiabetico: 'Antidiabético: vigila la glucosa y consulta si aparecen mareos, sudor frío o hambre intensa.',
    diuretico: 'Diurético o antihipertensivo: revisa con tu médico el sodio y el potasio de la dieta.',
    estatina: 'Estatina: evita el pomelo y consulta cualquier cambio en el tratamiento.',
    antidepresivo: 'Antidepresivo: evita el alcohol y revisa con tu médico los alimentos ricos en tiramina.',
    otro: 'Medicamento declarado: revisa interacciones alimentarias con tu médico o farmacéutico.'
};

function clasificarIMCDieta(imc) {
    if (imc < 16.5) return { clave: 'muy_bajo', texto: 'Muy por debajo del peso', corto: 'Muy bajo' };
    if (imc < 18.5) return { clave: 'bajo', texto: 'Por debajo del peso', corto: 'Bajo' };
    if (imc < 25) return { clave: 'normal', texto: 'Peso normal', corto: 'Normal' };
    if (imc < 27) return { clave: 'ligero', texto: 'Ligero sobrepeso', corto: 'Ligero' };
    if (imc < 30) return { clave: 'sobrepeso', texto: 'Sobrepeso', corto: 'Sobrepeso' };
    if (imc < 35) return { clave: 'obesidad1', texto: 'Obesidad grado I', corto: 'Obesidad I' };
    if (imc < 40) return { clave: 'obesidad2', texto: 'Obesidad grado II', corto: 'Obesidad II' };
    return { clave: 'obesidad3', texto: 'Obesidad grado III', corto: 'Obesidad III' };
}

function distribucionDetalleDieta(meta) {
    const catalogo = window.VA_DIETAS || {};
    return (catalogo.DISTRIBUCION && catalogo.DISTRIBUCION[meta.distribucion]) ||
        (catalogo.DISTRIBUCION && catalogo.DISTRIBUCION[catalogo.DISTRIBUCION_POR_DEFECTO]) ||
        { nombre: 'Equilibrada', carb: 50, prot: 25, lip: 25 };
}

function metaDietaActual() {
    const perfil = perfilParaDetalle();
    if (!perfil || !window.VA || !VA.dietas) {
        return {
            kcal: 0,
            macros: { prot: 0, grasa: 0, carb: 0 },
            equivalentes: {},
            distribucion: 'equilibrada',
            imc: 0,
            imcClase: clasificarIMCDieta(0),
            pesoSaludable: { min: 0, max: 0 },
            protPorKg: 0,
            tmb: 0,
            tdee: 0,
            avisos: []
        };
    }

    const base = VA.dietas.calcularMeta(perfil);
    const alturaM = (Number(perfil.estatura) || 0) / 100;
    const peso = Number(perfil.peso) || 0;
    const estatura = Number(perfil.estatura) || 0;
    const edad = Number(perfil.edad) || 0;
    const imc = alturaM > 0 ? peso / (alturaM * alturaM) : 0;
    const tmb = Math.round((10 * peso) + (6.25 * estatura) - (5 * edad) +
        (perfil.sexo === 'masculino' ? 5 : (perfil.sexo === 'femenino' ? -161 : -78)));
    const factores = { sedentario: 1.2, ligero: 1.375, moderado: 1.55, activo: 1.725 };
    const tdee = Math.round(tmb * (factores[perfil.actividad] || 1.55));
    const avisos = [];

    if (perfil.etapa === 'embarazo') avisos.push('Embarazo: se suman kcal adicionales y no se aplica déficit. Confirma el trimestre con tu especialista.');
    if (perfil.etapa === 'lactancia') avisos.push('Lactancia: se suman kcal adicionales. Prioriza hidratación, calcio y proteína.');
    if (perfil.sexo === 'prefiero_no_decir') avisos.push('Sin dato de sexo se usa una estimación neutra; la meta calórica es menos precisa.');
    if (Array.isArray(perfil.condiciones) &&
        (perfil.condiciones.indexOf('celiaquia') >= 0 || perfil.condiciones.indexOf('intolerancia_lactosa') >= 0)) {
        avisos.push('Celíaquía e intolerancia a la lactosa se filtran de forma estricta; revisa siempre etiquetas y contaminación cruzada.');
    }

    const notaMedicamento = NOTAS_MEDICAMENTO_DIETA[perfil.medicamento];
    if (notaMedicamento && perfil.medicamento !== 'ninguno') avisos.push(notaMedicamento);
    if (perfil.alergiaOtra) avisos.push('Alergia declarada: «' + perfil.alergiaOtra + '». Revisa etiquetas; lo que no aparezca en el catálogo no puede garantizarse.');
    if (imc >= 25) avisos.push('Con IMC de ' + numeroDecimalDieta(imc) + ' conviene comparar la meta con un especialista; la estimación puede sobreestimar el gasto energético.');

    return Object.assign({}, base, {
        tmb: tmb,
        tdee: tdee,
        imc: imc,
        imcClase: clasificarIMCDieta(imc),
        pesoSaludable: {
            min: alturaM > 0 ? 18.5 * alturaM * alturaM : 0,
            max: alturaM > 0 ? 24.9 * alturaM * alturaM : 0
        },
        protPorKg: peso ? (base.macros.prot / peso) : 0,
        objetivo: perfil.objetivo,
        avisos: avisos
    });
}

function menuCompletoDieta(id) {
    const catalogo = window.VA_DIETAS || {};
    if (!Array.isArray(catalogo.MENUS)) return null;
    for (let i = 0; i < catalogo.MENUS.length; i += 1) {
        if (catalogo.MENUS[i].id === id) return catalogo.MENUS[i];
    }
    return null;
}

function renderizarMetaDieta(meta) {
    if (!meta || !meta.kcal) return '';

    const perfil = perfilParaDetalle();
    const catalogo = window.VA_DIETAS || {};
    const dist = distribucionDetalleDieta(meta);
    const objetivoChip = meta.objetivo === 'bajar'
        ? 'Déficit moderado'
        : (meta.objetivo === 'subir' ? 'Superávit' : 'Mantenimiento');
    const objetivoTexto = meta.objetivo === 'bajar'
        ? 'bajar de peso (déficit del 15 %)'
        : (meta.objetivo === 'subir' ? 'ganar masa muscular (superávit del 10 %)' : 'mantener peso');
    const actividad = perfil ? (ACTIVIDADES_DIETA[perfil.actividad] || perfil.actividad || 'moderada') : 'moderada';
    const imcPct = Math.min(100, Math.max(0, (meta.imc - 15) / (40 - 15) * 100));

    const referencias = catalogo.EQUIVALENTES || {};
    const eqKcal = {};
    let eqTotal = 0;
    Object.keys(ETIQUETAS_EQ_DIETA).forEach(function (clave) {
        const ref = referencias[REF_EQ_DIETA[clave]];
        eqKcal[clave] = (Number(meta.equivalentes[clave]) || 0) * (ref && Number(ref.kcal) ? Number(ref.kcal) : 0);
        eqTotal += eqKcal[clave];
    });
    const eqGrid = Object.keys(ETIQUETAS_EQ_DIETA).map(function (clave) {
        const pct = eqTotal > 0 ? Math.round(eqKcal[clave] / eqTotal * 100) : 0;
        return '<div class="dieta-eq-item"><span>' + ETIQUETAS_EQ_DIETA[clave] + '</span>' +
            '<strong>' + numeroDecimalDieta(meta.equivalentes[clave]) + '</strong>' +
            '<small>' + pct + ' %</small></div>';
    }).join('');

    const badges = [];
    if (meta.imc) badges.push(meta.imcClase.corto);
    if (dist) badges.push(dist.nombre);
    if (perfil && perfil.etapa && perfil.etapa !== 'ninguna' && catalogo.ETAPAS && catalogo.ETAPAS[perfil.etapa]) {
        badges.push(catalogo.ETAPAS[perfil.etapa].nombre);
    }
    if (perfil && perfil.region && perfil.region !== 'todas' && catalogo.REGIONES && catalogo.REGIONES[perfil.region]) {
        badges.push('Cocina ' + catalogo.REGIONES[perfil.region].nombre);
    }
    if (perfil && Array.isArray(perfil.gustos) && perfil.gustos.length) badges.push(perfil.gustos.length + ' gustos');
    if (perfil && Array.isArray(perfil.despensa) && perfil.despensa.length) badges.push(perfil.despensa.length + ' en despensa');
    if (perfil) {
        const filtros = (perfil.alergias || []).length + (perfil.condiciones || []).length;
        if (filtros) badges.push(filtros + (filtros === 1 ? ' filtro activo' : ' filtros activos'));
        if (perfil.medicamento && perfil.medicamento !== 'ninguno') badges.push('Medicamento');
    }

    const avisos = (meta.avisos || []).slice(0, 5).map(function (texto) {
        return '<p class="dieta-meta-aviso">' + icoPlan('i-alert') + '<span>' + escaparHTML(texto) + '</span></p>';
    }).join('');

    return '<section class="card dieta-meta" aria-label="Meta diaria estimada">' +
        '<div class="dieta-meta-cabeza">' +
            '<span class="dieta-meta-eyebrow">' + icoPlan('i-flame') + ' Meta diaria estimada</span>' +
            '<span class="dieta-meta-chip">' + escaparHTML(objetivoChip) + '</span>' +
        '</div>' +
        '<p class="dieta-meta-numero"><strong>' + numeroEnteroDieta(meta.kcal) + '</strong><span>kcal/día</span></p>' +
        '<p class="dieta-meta-detalle">Mantenimiento estimado ' + numeroEnteroDieta(meta.tdee) + ' kcal · actividad ' +
            escaparHTML(actividad) + ' · ' + escaparHTML(objetivoTexto) + '.</p>' +
        '<p class="dieta-meta-formula">TMB ' + numeroEnteroDieta(meta.tmb) + ' kcal con <strong>Mifflin-St Jeor</strong> × factor de actividad.</p>' +
        '<div class="dieta-meta-macros">' +
            '<div class="dieta-meta-macro prot"><span>Proteína</span><strong>' + numeroEnteroDieta(meta.macros.prot) + ' g</strong>' +
                '<small><b class="dieta-meta-pct">' + dist.prot + ' %</b> · ' + numeroDecimalDieta(meta.protPorKg) + ' g/kg</small></div>' +
            '<div class="dieta-meta-macro"><span>Lípidos</span><strong>' + numeroEnteroDieta(meta.macros.grasa) + ' g</strong>' +
                '<small><b class="dieta-meta-pct">' + dist.lip + ' %</b> de la energía</small></div>' +
            '<div class="dieta-meta-macro"><span>Carbohidratos</span><strong>' + numeroEnteroDieta(meta.macros.carb) + ' g</strong>' +
                '<small><b class="dieta-meta-pct">' + dist.carb + ' %</b> de la energía</small></div>' +
        '</div>' +
        '<div class="dieta-meta-bloque">' +
            '<div class="dieta-meta-bloque-cabeza"><span>' + icoPlan('i-scale') + ' Rango de peso (IMC)</span>' +
                '<strong>IMC ' + numeroDecimalDieta(meta.imc) + '</strong></div>' +
            '<div class="dieta-meta-barra" role="img" aria-label="Rango de índice de masa corporal">' +
                '<span class="dieta-meta-marcador" style="left:' + imcPct.toFixed(1) + '%"></span></div>' +
            '<div class="dieta-meta-escala"><span style="left:14%">18,5</span><span style="left:40%">25</span>' +
                '<span style="left:60%">30</span><span class="fin" style="left:100%">40</span></div>' +
            '<p class="dieta-meta-texto"><strong>' + escaparHTML(meta.imcClase.texto) + '</strong> · Rango saludable para tu estatura: ' +
                numeroDecimalDieta(meta.pesoSaludable.min) + '–' + numeroDecimalDieta(meta.pesoSaludable.max) + ' kg.</p>' +
        '</div>' +
        '<div class="dieta-meta-bloque">' +
            '<div class="dieta-meta-bloque-cabeza"><span>' + icoPlan('i-target') + ' Distribución de energía</span>' +
                '<strong>' + dist.carb + ' / ' + dist.prot + ' / ' + dist.lip + '</strong></div>' +
            '<div class="dieta-dist-barra" role="img" aria-label="Reparto de energía entre carbohidratos, proteína y lípidos">' +
                '<span class="dieta-dist-carb" style="width:' + dist.carb + '%"></span>' +
                '<span class="dieta-dist-prot" style="width:' + dist.prot + '%"></span>' +
                '<span class="dieta-dist-grasa" style="width:' + dist.lip + '%"></span>' +
            '</div>' +
            '<div class="dieta-dist-leyenda">' +
                '<span><i class="dieta-punto-carb"></i> Carbohidratos <strong>' + dist.carb + ' %</strong></span>' +
                '<span><i class="dieta-punto-prot"></i> Proteína <strong>' + dist.prot + ' %</strong></span>' +
                '<span><i class="dieta-punto-grasa"></i> Lípidos <strong>' + dist.lip + ' %</strong></span>' +
            '</div>' +
        '</div>' +
        '<div class="dieta-meta-bloque">' +
            '<div class="dieta-meta-bloque-cabeza"><span>' + icoPlan('i-info') + ' Equivalentes al día</span>' +
                '<small>' + numeroEnteroDieta(meta.kcal) + ' kcal · % de la energía</small></div>' +
            '<div class="dieta-eq-grid">' + eqGrid + '</div>' +
        '</div>' +
        (badges.length
            ? '<div class="dieta-badges">' + badges.map(function (b) {
                return '<span class="dieta-badge">' + escaparHTML(b) + '</span>';
            }).join('') + '</div>'
            : '') +
        (avisos ? '<div class="dieta-meta-avisos">' + avisos + '</div>' : '') +
    '</section>';
}

function perfilParaDetalle() {
    if (perfilDietaActual) return perfilDietaActual;
    const perfilReal = VA.datos.perfil.obtener();
    if (!perfilReal) return null;
    const plan = VA.datos.plan.obtener();
    return VA.dietas.normalizarPerfil(perfilReal, {
        distribucion: plan.distribucion,
        colaciones: plan.colaciones
    });
}

function renderizarDetalleTecnico(colaciones) {
    if (!detalleTecnicoAbierto) return '';

    const perfil = perfilParaDetalle();
    const detalleMeta = metaDietaActual();
    const meta = perfil ? VA.dietas.calcularMeta(perfil) : detalleMeta;
    const objetivo = meta.equivalentes || {};
    const real = VA.dietas.equivalentesDia(planDietaActual, diaDietaActual, colaciones) || {};
    const info = VA.dietas.infoFamilias();
    const catalogo = window.VA_DIETAS || {};
    const dist = distribucionDetalleDieta(meta);

    const filas = Object.keys(info).map(function (clave) {
        return '<tr>' +
            '<td>' + escaparHTML(info[clave].nombre) + '</td>' +
            '<td>' + numeroDecimalDieta(objetivo[clave]) + '</td>' +
            '<td>' + numeroDecimalDieta(real[clave]) + '</td>' +
            '<td>' + escaparHTML(info[clave].referencia) + '</td>' +
        '</tr>';
    }).join('');

    const filtros = [];
    if (perfil) {
        (perfil.alergias || []).forEach(function (id) {
            const nombre = catalogo.ALERGIAS && catalogo.ALERGIAS[id] ? catalogo.ALERGIAS[id].nombre : id;
            filtros.push('Alergia: ' + nombre + (id === 'otros' && perfil.alergiaOtra ? ' (' + perfil.alergiaOtra + ')' : ''));
        });
        (perfil.condiciones || []).forEach(function (id) {
            filtros.push((catalogo.CONDICIONES && catalogo.CONDICIONES[id] ? catalogo.CONDICIONES[id].nombre : id));
        });
        if (perfil.etapa && perfil.etapa !== 'ninguna' && catalogo.ETAPAS && catalogo.ETAPAS[perfil.etapa]) {
            filtros.push(catalogo.ETAPAS[perfil.etapa].nombre);
        }
        if (perfil.medicamento && perfil.medicamento !== 'ninguno') {
            const nombreMed = catalogo.MEDICAMENTOS && catalogo.MEDICAMENTOS[perfil.medicamento]
                ? catalogo.MEDICAMENTOS[perfil.medicamento].nombre : perfil.medicamento;
            filtros.push('Medicamento: ' + nombreMed);
        }
        if (Array.isArray(perfil.gustos) && perfil.gustos.length) filtros.push(perfil.gustos.length + ' gustos');
        if (Array.isArray(perfil.despensa) && perfil.despensa.length) filtros.push(perfil.despensa.length + ' en despensa');
    }
    const filtrosHTML = filtros.length
        ? '<div class="seguridad-resumen">' + filtros.map(function (texto) {
            return '<span class="plan-chip">' + escaparHTML(texto) + '</span>';
        }).join('') + '</div>'
        : '<p class="perfil-ayuda">Sin filtros activos en esta sesión. No se guardan condiciones, alergias ni medicamentos en la cuenta.</p>';

    const notas = [];
    notas.push('<strong>Fórmula:</strong> Mifflin-St Jeor (1990) para la TMB (' + numeroEnteroDieta(detalleMeta.tmb) +
        ' kcal) × factor de actividad. Es la fórmula interna de la app; no hay selector de Harris-Benedict.');
    notas.push('<strong>Macros:</strong> ' + numeroEnteroDieta(meta.macros.prot) + ' g de proteína, ' +
        numeroEnteroDieta(meta.macros.grasa) + ' g de lípidos y ' + numeroEnteroDieta(meta.macros.carb) +
        ' g de carbohidratos al día (' + dist.carb + ' % / ' + dist.prot + ' % / ' + dist.lip + ' % de la energía).');
    notas.push('<strong>Equivalentes:</strong> la meta se convierte en ' + numeroDecimalDieta(objetivo.cereal) +
        ' de cereal, ' + numeroDecimalDieta(objetivo.carne) + ' de carne, ' + numeroDecimalDieta(objetivo.grasa) +
        ' de grasa, ' + numeroDecimalDieta(objetivo.verdura) + ' de verdura, ' + numeroDecimalDieta(objetivo.fruta) +
        ' de fruta, ' + numeroDecimalDieta(objetivo.leguminosa) + ' de leguminosa y ' + numeroDecimalDieta(objetivo.leche) +
        ' de leche al día. Método del formato de cálculo del especialista; pendiente de validación clínica.');
    notas.push('<strong>SMAE:</strong> cada alimento del plan puede desplegar «Especificación SMAE» con su subgrupo del ' +
        'Sistema Mexicano de Alimentos Equivalentes (4ª ed., Pérez Lizaur; tablas difundidas por UNAM, IMSS y BUAP), ' +
        'kcal y macronutrientes por equivalente y porción de referencia. El número de equivalentes se estima desde el catálogo.');
    notas.push('<strong>Distribución:</strong> ' + dist.nombre + ' (' + dist.carb + ' / ' + dist.prot + ' / ' + dist.lip +
        '). Prioridad: diabetes > hipertensión > colesterol > SOMP > equilibrada. El sexo, la edad, el peso y la estatura ' +
        'modifican las calorías y, por tanto, los gramos de cada macro.');
    notas.push('<strong>IMC:</strong> ' + numeroDecimalDieta(detalleMeta.imc) + ' (' +
        detalleMeta.imcClase.texto.toLowerCase() + '). Peso saludable estimado: ' +
        numeroDecimalDieta(detalleMeta.pesoSaludable.min) + '–' +
        numeroDecimalDieta(detalleMeta.pesoSaludable.max) + ' kg.');
    notas.push('<strong>Composición:</strong> valores de ejemplo; deben sustituirse por tablas del INCMNSZ (2015) o BAM (2019), citando la fuente.');
    notas.push('<strong>Edad:</strong> solo adultos de 18 años o más; en menores se requieren percentiles y valoración pediátrica.');
    if (perfil && perfil.medicamento && perfil.medicamento !== 'ninguno') {
        const notaMed = NOTAS_MEDICAMENTO_DIETA[perfil.medicamento] || 'Consulta interacciones con tu médico.';
        notas.push('<strong>Medicamento:</strong> ' + notaMed);
    }
    if (perfil && perfil.alergiaOtra) {
        notas.push('<strong>Alergia específica:</strong> «' + perfil.alergiaOtra +
            '». Se busca por nombre en el catálogo; revisa etiquetas y contaminación cruzada.');
    }
    notas.push('<strong>Pendiente:</strong> porciones, equivalencias y notas clínicas deben validarse con un nutricionista.');

    const pasos = [
        { titulo: 'Formulario real', texto: 'cambio_fisico.html envía las preferencias a js/app.js; los desplegables son multiselect con chips, igual que el prototipo.', codigo: 'leerOpcionesDieta()' },
        { titulo: 'Motor', texto: 'js/dietas-motor.js normaliza el perfil, filtra alimentos y calcula meta, equivalentes y SMAE por alimento.', codigo: 'VA.dietas.generarPlan()' },
        { titulo: 'Persistencia', texto: 'El menú de 7 días se guarda en diet_plans.menu_semana; huella_filtros guarda solo un hash corto.', codigo: 'guardarPlanDieta()' },
        { titulo: 'Sincronización', texto: 'RLS por user_id: el plan se recupera al cerrar y volver a abrir la sesión con la misma cuenta.', codigo: 'sincronizarPlanRemoto()' },
        { titulo: 'Vista', texto: 'La tarjeta de meta, la barra de IMC, la distribución y los porcentajes se muestran antes del menú semanal.', codigo: 'renderizarMetaDieta()' },
        { titulo: 'Este panel', texto: 'Las notas técnicas y los filtros activos viven aquí, plegados y ocultos por defecto para el especialista.', codigo: 'renderizarDetalleTecnico()' }
    ];

    return '<section class="plan-tecnico" id="planTecnico">' +
        '<h4>Detalle técnico del plan</h4>' +
        '<h5>Filtros activos</h5>' + filtrosHTML +
        '<h4>Equivalentes por día</h4>' +
        '<div class="plan-tecnico-tabla">' +
            '<table>' +
                '<thead><tr><th>Grupo</th><th>Objetivo</th><th>Este día</th><th>Referencia</th></tr></thead>' +
                '<tbody>' + filas + '</tbody>' +
            '</table>' +
        '</div>' +
        '<p class="perfil-ayuda">Referencias del Sistema Mexicano de Alimentos Equivalentes.</p>' +
        '<h4>Notas del prototipo</h4>' +
        '<ul class="plan-tecnico-notas">' + notas.map(function (texto) {
            return '<li>' + texto + '</li>';
        }).join('') + '</ul>' +
        '<h4>Cómo se integró en la app real</h4>' +
        '<div class="plan-tecnico-pasos">' + pasos.map(function (paso) {
            return '<article><h5>' + escaparHTML(paso.titulo) + '</h5><p>' + escaparHTML(paso.texto) +
                '</p><code>' + escaparHTML(paso.codigo) + '</code></article>';
        }).join('') + '</div>' +
    '</section>';
}

function alternarDetalleTecnico() {
    detalleTecnicoAbierto = !detalleTecnicoAbierto;
    renderizarPlanDieta();
}

function alternarAcordeonDieta(id, boton) {
    const panel = document.getElementById(id);
    if (!panel) return;
    const abrir = panel.hidden;
    panel.hidden = !abrir;
    if (boton) boton.setAttribute('aria-expanded', abrir ? 'true' : 'false');
}

function renderizarEspecificacionSMAE(alimento, clave, posicion) {
    if (!window.VA || !VA.dietas || typeof VA.dietas.smae !== 'function') return '';
    const smae = VA.dietas.smae(alimento);
    if (!smae) return '';

    const id = 'spec-' + clave + '-' + posicion;
    const texto = smae.libre
        ? 'SMAE: porción libre · ' + smae.nombre + ' (' + smae.porcion + ')'
        : 'SMAE: ' + numeroDecimalDieta(smae.cantidad) + ' eq · ' + smae.nombre +
            ' (' + numeroEnteroDieta(smae.kcal) + ' kcal, ' + numeroDecimalDieta(smae.prot) + ' P / ' +
            numeroDecimalDieta(smae.lip) + ' L / ' + numeroDecimalDieta(smae.carb) + ' C por eq)';

    return '<button type="button" class="dieta-spec-toggle" aria-expanded="false" aria-controls="' + id +
        '" onclick="alternarAcordeonDieta(\'' + id + '\',this)">' +
        icoPlan('i-info') + ' Especificación SMAE</button>' +
        '<span class="dieta-spec-panel" id="' + id + '" hidden>' + escaparHTML(texto) + '</span>';
}

function renderizarAvisosPlanDieta(meta, totales) {
    const avisos = [];
    if (meta.kcal) {
        const desvio = Math.round((totales.kcal - meta.kcal) / meta.kcal * 100);
        if (Math.abs(desvio) > 5) {
            avisos.push('El día queda en ' + numeroEnteroDieta(totales.kcal) + ' kcal (' +
                (desvio > 0 ? '+' : '') + desvio + ' % frente a la meta).');
        }
    }

    const desvioMacro = function (real, objetivo) {
        return objetivo > 0 ? Math.round((real - objetivo) / objetivo * 100) : 0;
    };
    const dProt = desvioMacro(totales.prot, meta.macros.prot);
    const dGrasa = desvioMacro(totales.grasa, meta.macros.grasa);
    const dCarb = desvioMacro(totales.carb, meta.macros.carb);
    const partes = [];
    if (Math.abs(dProt) > 15) partes.push('proteína ' + (dProt > 0 ? '+' : '') + dProt + ' %');
    if (Math.abs(dGrasa) > 20) partes.push('lípidos ' + (dGrasa > 0 ? '+' : '') + dGrasa + ' %');
    if (Math.abs(dCarb) > 25) partes.push('carbohidratos ' + (dCarb > 0 ? '+' : '') + dCarb + ' %');
    if (partes.length) {
        avisos.push('El menú se desvía de la meta en ' + partes.join(', ') +
            '. Puedes probar otra opción o revisarlo con tu especialista.');
    }

    if (!avisos.length) return '';
    return '<div class="plan-avisos">' + avisos.map(function (texto) {
        return '<p class="plan-aviso alerta">' + icoPlan('i-alert') + '<span>' + escaparHTML(texto) + '</span></p>';
    }).join('') + '</div>';
}

function renderizarEquivalentesAcordeon(meta, colaciones) {
    if (!planDietaActual || !window.VA || !VA.dietas) return '';

    const objetivo = meta.equivalentes || {};
    const real = VA.dietas.equivalentesDia(planDietaActual, diaDietaActual, colaciones) || {};
    const info = VA.dietas.infoFamilias();
    const id = 'dietaEqPanel';

    const items = Object.keys(info).map(function (clave) {
        const objetivoFamilia = Number(objetivo[clave]) || 0;
        const realFamilia = Number(real[clave]) || 0;
        const adec = objetivoFamilia ? Math.round(realFamilia / objetivoFamilia * 100) : 0;
        const clase = (adec >= 90 && adec <= 110) ? 'ok' : ((adec < 70 || adec > 130) ? 'mal' : 'medio');
        return '<div class="dieta-eq-plan-item ' + clase + '">' +
            '<span>' + escaparHTML(info[clave].nombre) + '</span>' +
            '<strong>' + numeroDecimalDieta(realFamilia) + '</strong>' +
            '<small>meta ' + numeroDecimalDieta(objetivoFamilia) + ' · ' + adec + ' %</small>' +
        '</div>';
    }).join('');

    return '<div class="dieta-acordeon">' +
        '<button type="button" class="dieta-acordeon-boton" aria-expanded="false" aria-controls="' + id +
            '" onclick="alternarAcordeonDieta(\'' + id + '\',this)">' +
            '<span>' + icoPlan('i-info') + ' Equivalentes del día</span>' +
            '<span><small>porciones del menú vs. meta</small><span class="dieta-acordeon-flecha">' +
                icoPlan('i-chevron') + '</span></span>' +
        '</button>' +
        '<div class="dieta-acordeon-contenido" id="' + id + '" hidden>' +
            '<p class="dieta-acordeon-ayuda">Los números son porciones tipo SMAE que suma este menú. La meta es lo que te corresponde; 100 % significa que cuadra.</p>' +
            '<div class="dieta-eq-plan-grid">' + items + '</div>' +
        '</div>' +
    '</div>';
}

function renderizarPlanDieta(aviso) {
    const resultado = document.getElementById('resultadoDieta');
    if (!resultado || !planDietaActual || !window.VA || !VA.dietas) return;

    const planGuardado = VA.datos.plan.obtener();
    const colaciones = perfilDietaActual ? perfilDietaActual.colaciones : planGuardado.colaciones;
    const indice = Math.max(0, Math.min(6, diaDietaActual));
    const dia = planDietaActual[indice];
    const resumen = VA.dietas.resumenDia(planDietaActual, indice, colaciones);
    if (!dia || !resumen) return;

    const catalogo = window.VA_DIETAS || {};
    const infoMenu = typeof VA.dietas.menu === 'function' ? VA.dietas.menu(resumen.menuId) : null;
    const meta = metaDietaActual();
    const totales = totalesDietaDelDia(colaciones);
    const metaHTML = renderizarMetaDieta(meta);
    const avisosPlan = renderizarAvisosPlanDieta(meta, totales);
    const adecuacion = meta.kcal ? Math.round(totales.kcal / meta.kcal * 100) : 0;
    const puedeCambiar = !!perfilDietaActual;
    const desactivado = puedeCambiar ? '' : ' disabled title="Genera tu plan para cambiar alimentos"';

    const chips = [];
    if (infoMenu && catalogo.PRESUPUESTOS && catalogo.PRESUPUESTOS[infoMenu.presupuesto]) {
        chips.push(catalogo.PRESUPUESTOS[infoMenu.presupuesto].nombre);
    }
    if (infoMenu && infoMenu.region && infoMenu.region !== 'todas' && catalogo.REGIONES && catalogo.REGIONES[infoMenu.region]) {
        chips.push('Cocina ' + catalogo.REGIONES[infoMenu.region].nombre);
    }
    if (perfilDietaActual && perfilDietaActual.etapa && perfilDietaActual.etapa !== 'ninguna' &&
        catalogo.ETAPAS && catalogo.ETAPAS[perfilDietaActual.etapa]) {
        chips.push(catalogo.ETAPAS[perfilDietaActual.etapa].nombre);
    }

    const kpis = '<div class="plan-kpis">' +
        '<div class="plan-kpi"><span>Energía</span><strong>' + numeroEnteroDieta(totales.kcal) + ' kcal</strong><small>meta ' + numeroEnteroDieta(meta.kcal) + '</small></div>' +
        '<div class="plan-kpi"><span>Proteína</span><strong>' + numeroEnteroDieta(totales.prot) + ' g</strong><small>meta ' + numeroEnteroDieta(meta.macros.prot) + ' g</small></div>' +
        '<div class="plan-kpi"><span>Lípidos</span><strong>' + numeroEnteroDieta(totales.grasa) + ' g</strong><small>meta ' + numeroEnteroDieta(meta.macros.grasa) + ' g</small></div>' +
        '<div class="plan-kpi"><span>Carbohidratos</span><strong>' + numeroEnteroDieta(totales.carb) + ' g</strong><small>meta ' + numeroEnteroDieta(meta.macros.carb) + ' g</small></div>' +
        '<div class="plan-kpi"><span>Adecuación</span><strong>' + numeroEnteroDieta(adecuacion) + ' %</strong><small>energía vs. meta</small></div>' +
    '</div>';

    const pestanas = VA.dietas.dias.map(function (nombre, i) {
        const infoDia = typeof VA.dietas.menu === 'function' && planDietaActual[i]
            ? VA.dietas.menu(planDietaActual[i].menuId)
            : null;
        const corto = infoDia ? infoDia.nombre : 'Sin menú';
        const cortoVisible = corto.length > 13 ? corto.slice(0, 12) + '…' : corto;
        return '<button type="button" class="plan-dia' + (i === indice ? ' activo' : '') + '"' +
            ' aria-pressed="' + (i === indice ? 'true' : 'false') + '"' +
            ' aria-label="' + escaparHTML(nombre) + ': ' + escaparHTML(corto) + '"' +
            ' onclick="seleccionarDiaDieta(' + i + ')">' +
            '<span>' + escaparHTML(nombre) + '</span>' +
            '<small>' + escaparHTML(cortoVisible) + '</small>' +
            '</button>';
    }).join('');

    const comidas = resumen.comidas.map(function (comida) {
        const ids = dia.comidas[comida.clave] || [];
        const hora = (planGuardado.horarios || {})[comida.clave];
        const kcalComida = totalesComidaDieta(ids).kcal;
        const alimentos = ids.map(function (id, posicion) {
            const alimento = VA.dietas.alimento(id);
            if (!alimento) return '';
            const detalle = alimentoDelCatalogo(id) || alimento;
            const clave = comida.clave + ':' + posicion;
            const tieneCambio = !!(dia.cambios && dia.cambios[clave]);
            return '<li class="plan-alimento">' +
                '<span class="plan-alimento-info">' +
                    '<span class="plan-alimento-nombre">' + escaparHTML(alimento.nombre) +
                        '<small>' + escaparHTML(alimento.porcion) + '</small></span>' +
                    renderizarEspecificacionSMAE(detalle, clave, posicion) +
                '</span>' +
                '<span class="plan-alimento-kcal">' + numeroEnteroDieta(detalle.kcal) + ' kcal</span>' +
                '<span class="plan-alimento-acciones">' +
                    (tieneCambio
                        ? '<button type="button" class="plan-mini" onclick="restaurarAlimentoDieta(' + indice + ',\'' + comida.clave + '\',' + posicion + ')"' + desactivado + '>Restaurar</button>'
                        : '') +
                    '<button type="button" class="plan-mini" onclick="abrirDialogoCambio(' + indice + ',\'' + comida.clave + '\',' + posicion + ')"' + desactivado +
                        ' aria-label="Cambiar ' + escaparHTML(alimento.nombre) + '">' +
                        icoPlan('i-swap') + ' Cambiar</button>' +
                '</span></li>';
        }).join('');

        return '<div class="plan-comida">' +
            '<div class="plan-comida-head">' +
                '<span class="plan-comida-icono">' + icoPlan(comida.icono) + '</span>' +
                '<div><strong>' + escaparHTML(comida.nombre) + '</strong>' +
                    '<span>' + (hora ? escaparHTML(hora) + ' · ' : '') + numeroEnteroDieta(kcalComida) + ' kcal</span>' +
                '</div>' +
            '</div>' +
            '<ul class="plan-lista">' + alimentos + '</ul>' +
        '</div>';
    }).join('');

    const cambios = Object.keys(dia.cambios || {}).length;
    resultado.hidden = false;
    resultado.innerHTML = metaHTML +
        '<section class="card plan-semana" aria-label="Menú semanal">' +
            '<div class="plan-cabecera">' +
                '<div><span class="eyebrow">Tu semana</span><h2>' + icoPlan('i-apple') + ' Menú semanal</h2></div>' +
                '<div class="plan-cabecera-acciones">' +
                    '<button type="button" class="plan-tecnico-boton" onclick="alternarDetalleTecnico()" aria-expanded="' +
                        (detalleTecnicoAbierto ? 'true' : 'false') + '">' +
                        icoPlan('i-chart') + (detalleTecnicoAbierto ? ' Ocultar detalle' : ' Detalle técnico') +
                    '</button>' +
                    '<span class="pill verde">7 días</span>' +
                '</div>' +
            '</div>' +
            (aviso ? '<p class="plan-aviso">' + icoPlan('i-check') + '<span>' + escaparHTML(aviso) + '</span></p>' : '') +
            avisosPlan +
            '<div class="plan-dias" role="tablist" aria-label="Días de la semana">' + pestanas + '</div>' +
            '<div class="plan-menu-cabecera">' +
                '<div class="plan-menu-titulo">' +
                    '<h3>' + escaparHTML(resumen.nombreMenu) + '</h3>' +
                    (chips.length ? '<div class="plan-menu-chips">' + chips.map(function (chip) {
                        return '<span class="plan-chip">' + escaparHTML(chip) + '</span>';
                    }).join('') + '</div>' : '') +
                '</div>' +
                kpis +
            '</div>' +
            '<p class="plan-menu-nota">Los porcentajes de la tarjeta superior se calculan sobre tu meta diaria; ' +
                'los valores de aquí son los totales del día que estás viendo.</p>' +
            '<h3 class="plan-dia-titulo">' + escaparHTML(resumen.dia) + '</h3>' +
            '<div class="plan-comidas">' + comidas + '</div>' +
            renderizarEquivalentesAcordeon(meta, colaciones) +
            '<div class="plan-acciones">' +
                '<button type="button" class="btn btn-secundario" onclick="otroMenuDieta()"' + desactivado + '>' +
                    icoPlan('i-refresh') + ' Otra opción</button>' +
                '<button type="button" class="btn btn-secundario" onclick="restaurarDiaDieta()"' +
                    (puedeCambiar && cambios ? '' : ' disabled') + '>' +
                    icoPlan('i-undo') + ' Restaurar día</button>' +
            '</div>' +
            '<p class="plan-nota">Esta estimación es orientativa y no sustituye la valoración de un especialista. ' +
                'En cada alimento puedes abrir su especificación SMAE y ajustar porciones con criterio profesional.</p>' +
            '<div class="plan-footer"><span>VidaActiva · plan personalizado</span>' +
                '<span>Detalle técnico disponible para el especialista</span></div>' +
            renderizarDetalleTecnico(colaciones) +
        '</section>';
}

function seleccionarDiaDieta(indice) {
    diaDietaActual = Math.max(0, Math.min(6, Number(indice) || 0));
    renderizarPlanDieta();
}

function abrirDialogoCambio(indiceDia, comida, posicion) {
    if (!perfilDietaActual || !planDietaActual) return;
    const dia = planDietaActual[indiceDia];
    const id = dia && dia.comidas[comida] ? dia.comidas[comida][posicion] : null;
    const alimento = VA.dietas.alimento(id);
    if (!alimento) return;

    cambioDietaActual = { dia: indiceDia, comida: comida, posicion: posicion, motivo: 'gusto' };
    const titulo = document.getElementById('cambioTitulo');
    const texto = document.getElementById('cambioTexto');
    if (titulo) titulo.textContent = 'Cambiar ' + alimento.nombre;
    if (texto) texto.textContent = 'Elige otra opción parecida.';
    actualizarOpcionesCambio();

    const dialogo = document.getElementById('dialogoCambio');
    if (!dialogo) return;
    if (typeof dialogo.showModal === 'function') dialogo.showModal();
    else dialogo.setAttribute('open', '');
}

function cerrarDialogoCambio() {
    const dialogo = document.getElementById('dialogoCambio');
    if (!dialogo) return;
    if (typeof dialogo.close === 'function' && dialogo.open) dialogo.close();
    else dialogo.removeAttribute('open');
}

function actualizarOpcionesCambio() {
    if (!cambioDietaActual || !perfilDietaActual || !planDietaActual) return;
    const lista = document.getElementById('cambioLista');
    const vacio = document.getElementById('cambioVacio');
    const botones = document.querySelectorAll('#cambioMotivos .motivo');

    Array.prototype.forEach.call(botones, function (boton) {
        const activo = boton.getAttribute('data-motivo') === cambioDietaActual.motivo;
        boton.classList.toggle('activo', activo);
        boton.setAttribute('aria-pressed', activo ? 'true' : 'false');
    });

    const opciones = VA.dietas.candidatosCambio(
        planDietaActual,
        cambioDietaActual.dia,
        cambioDietaActual.comida,
        cambioDietaActual.posicion,
        perfilDietaActual,
        cambioDietaActual.motivo
    );

    if (lista) {
        lista.innerHTML = opciones.map(function (opcion) {
            return '<button type="button" class="opcion-cambio" onclick="elegirCambioDieta(\'' + opcion.id + '\')">' +
                '<strong>' + escaparHTML(opcion.nombre) + '</strong>' +
                '<span>' + escaparHTML(opcion.porcion) + '</span></button>';
        }).join('');
    }
    if (vacio) vacio.hidden = opciones.length > 0;
}

function cambiarMotivoDieta(motivo) {
    if (!cambioDietaActual) return;
    cambioDietaActual.motivo = motivo;
    actualizarOpcionesCambio();
}

function elegirCambioDieta(id) {
    if (!cambioDietaActual || !perfilDietaActual || !planDietaActual) return;
    const aplicado = VA.dietas.aplicarCambio(
        planDietaActual,
        cambioDietaActual.dia,
        cambioDietaActual.comida,
        cambioDietaActual.posicion,
        id,
        cambioDietaActual.motivo,
        perfilDietaActual
    );
    cerrarDialogoCambio();
    if (!aplicado) return;
    diaDietaActual = cambioDietaActual.dia;
    guardarPlanDieta(perfilDietaActual, planDietaActual, VA.dietas.calcularMeta(perfilDietaActual));
    renderizarPlanDieta();
}

function restaurarAlimentoDieta(indiceDia, comida, posicion) {
    if (!perfilDietaActual || !planDietaActual) return;
    if (!VA.dietas.restaurarAlimento(planDietaActual, indiceDia, comida, posicion)) return;
    diaDietaActual = indiceDia;
    guardarPlanDieta(perfilDietaActual, planDietaActual, VA.dietas.calcularMeta(perfilDietaActual));
    renderizarPlanDieta();
}

function restaurarDiaDieta() {
    if (!perfilDietaActual || !planDietaActual) return;
    if (!VA.dietas.restaurarDia(planDietaActual, diaDietaActual)) return;
    guardarPlanDieta(perfilDietaActual, planDietaActual, VA.dietas.calcularMeta(perfilDietaActual));
    renderizarPlanDieta();
}

function otroMenuDieta() {
    if (!perfilDietaActual || !planDietaActual) return;
    if (!VA.dietas.otroMenu(planDietaActual, diaDietaActual, perfilDietaActual)) {
        const semana = document.querySelector('.plan-semana');
        const dias = semana && semana.querySelector('.plan-dias');
        let aviso = semana && semana.querySelector('.plan-aviso');
        if (dias && !aviso) {
            aviso = document.createElement('p');
            aviso.className = 'plan-aviso';
            dias.parentNode.insertBefore(aviso, dias);
        }
        if (aviso) aviso.textContent = 'No hay otra opción compatible con tus preferencias.';
        return;
    }
    guardarPlanDieta(perfilDietaActual, planDietaActual, VA.dietas.calcularMeta(perfilDietaActual));
    renderizarPlanDieta();
}

function banderaRecordatorioDieta(valor) {
    try {
        if (valor === undefined) return localStorage.getItem(CLAVE_OCULTA_DIETA) === '1';
        if (valor) localStorage.setItem(CLAVE_OCULTA_DIETA, '1');
        else localStorage.removeItem(CLAVE_OCULTA_DIETA);
    } catch (error) {
        return false;
    }
    return false;
}

function actualizarRecordatorioDieta() {
    const head = document.getElementById('dietaCardHead');
    const tarjeta = document.getElementById('dietaRecordatorio');
    const oculta = document.getElementById('dietaOculta');
    if (!head || !tarjeta || !oculta || !window.VA || !VA.dietas) return;

    const ocultar = document.getElementById('ocultarRecordatorio');
    const mostrar = document.getElementById('mostrarRecordatorio');
    if (ocultar && !ocultar.getAttribute('data-va-dieta')) {
        ocultar.setAttribute('data-va-dieta', '1');
        ocultar.addEventListener('click', function () {
            banderaRecordatorioDieta(true);
            actualizarRecordatorioDieta();
        });
    }
    if (mostrar && !mostrar.getAttribute('data-va-dieta')) {
        mostrar.setAttribute('data-va-dieta', '1');
        mostrar.addEventListener('click', function () {
            banderaRecordatorioDieta(false);
            actualizarRecordatorioDieta();
        });
    }

    const plan = VA.datos.plan.obtener();
    const indice = (new Date().getDay() + 6) % 7;
    const resumen = VA.datos.plan.tieneMenu()
        ? VA.dietas.resumenDia(plan.menu_semana, indice, plan.colaciones)
        : null;

    if (!resumen) {
        head.hidden = true;
        tarjeta.hidden = true;
        oculta.hidden = true;
        return;
    }

    const escondido = banderaRecordatorioDieta();
    head.hidden = escondido;
    tarjeta.hidden = escondido;
    oculta.hidden = !escondido;

    if (escondido) return;

    const principales = resumen.comidas.filter(function (comida) {
        return comida.clave === 'desayuno' || comida.clave === 'comida' || comida.clave === 'cena';
    });
    const texto = principales.map(function (comida) {
        const nombres = comida.alimentos.slice(0, 2).map(function (alimento) { return alimento.nombre; });
        return comida.nombre + ': ' + (nombres.join(', ') || 'Sin alimentos');
    }).join(' · ');

    const titulo = document.getElementById('dietaTitulo');
    const detalle = document.getElementById('dietaResumen');
    const chips = document.getElementById('dietaChips');
    const horarios = plan.horarios || {};

    if (titulo) titulo.textContent = resumen.nombreMenu;
    if (detalle) detalle.textContent = texto;
    if (chips) {
        chips.innerHTML = ['desayuno', 'comida', 'cena'].filter(function (clave) {
            return !!horarios[clave];
        }).map(function (clave) {
            return '<span>' + escaparHTML(horarios[clave]) + '</span>';
        }).join('');
    }
}

function inicializarDialogoCambio() {
    const motivos = document.getElementById('cambioMotivos');
    if (!motivos || motivos.getAttribute('data-va-dieta')) return;
    motivos.setAttribute('data-va-dieta', '1');
    motivos.addEventListener('click', function (evento) {
        const boton = evento.target.closest ? evento.target.closest('.motivo') : null;
        if (boton) cambiarMotivoDieta(boton.getAttribute('data-motivo'));
    });
}

function cargarListasDieta() {
    if (!window.VA_DIETAS) return;
    const gustos = document.getElementById('gustosDieta');
    const despensa = document.getElementById('despensaDieta');
    const opciones = VA_DIETAS.COMUNES.map(function (id) {
        const alimento = VA.dietas && typeof VA.dietas.alimento === 'function'
            ? VA.dietas.alimento(id)
            : null;
        const nombre = alimento ? alimento.nombre : id;
        return '<option value="' + escaparHTML(id) + '">' + escaparHTML(nombre) + '</option>';
    }).join('');

    if (gustos && !gustos.options.length) gustos.innerHTML = opciones;
    if (despensa && !despensa.options.length) despensa.innerHTML = opciones;
    actualizarMultisDieta();
}

function leerPlanDieta() {
    return VA.datos.plan.obtener();
}

// ===== ALIMENTACIÓN: CALCULADORA Y REGISTRO DE COMIDAS =====
const CALORIAS_META = 1800;
const COMIDAS_DIA = ['desayuno', 'almuerzo', 'cena'];

// Rangos semanales de presupuesto (MXN)
const PRESUPUESTOS = {
    economico: { texto: 'Menos de $500 MXN', minimo: 300, maximo: 500, abierto: false },
    medio: { texto: '$500 - $1,000 MXN', minimo: 500, maximo: 1000, abierto: false },
    amplio: { texto: '$1,000 - $2,000 MXN', minimo: 1000, maximo: 2000, abierto: false },
    generoso: { texto: 'Más de $2,000 MXN', minimo: 2000, maximo: 3000, abierto: true }
};

function formatearPesos(cantidad) {
    return '$' + Math.round(Number(cantidad) || 0).toLocaleString('es-MX');
}

function calcularGasto(registro) {
    return COMIDAS_DIA.reduce(function (total, comida) {
        return total + (registro[comida] || []).reduce(function (suma, item) {
            return suma + (Number(item.precio) || 0);
        }, 0);
    }, 0);
}

function calcularGastoSemana() {
    const todo = VA.datos.comidas.obtenerTodo();
    const inicio = obtenerLunes();
    const fin = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + 7);

    return Object.keys(todo).reduce(function (total, fecha) {
        const partes = fecha.split('-').map(Number);
        const dia = new Date(partes[0], partes[1] - 1, partes[2]);
        if (dia < inicio || dia >= fin) return total;

        const registro = todo[fecha] || {};
        return total + calcularGasto({
            desayuno: registro.desayuno || [],
            almuerzo: registro.almuerzo || [],
            cena: registro.cena || []
        });
    }, 0);
}


// Indica si el alimento elegido se mide por piezas (unidad, rebanada, vaso...)
let calculoPorUnidad = false;

function fechaISO(fecha) {
    return fecha.getFullYear() + '-' +
        String(fecha.getMonth() + 1).padStart(2, '0') + '-' +
        String(fecha.getDate()).padStart(2, '0');
}

function obtenerFechaHoy() {
    return fechaISO(new Date());
}

function obtenerLunes() {
    const hoy = new Date();
    const diaSemana = hoy.getDay();
    return new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - (diaSemana === 0 ? 6 : diaSemana - 1));
}

function registroVacio() {
    return { desayuno: [], almuerzo: [], cena: [] };
}

function leerRegistroComidas() {
    return VA.datos.comidas.obtenerHoy();
}

function guardarRegistroComidas(registro) {
    return VA.datos.comidas.guardarHoy(registro);
}

function escaparHTML(texto) {
    return String(texto).replace(/[&<>"']/g, caracter => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[caracter]);
}

function calcularTotal() {
    const cantidad = parseFloat(document.getElementById('cantidadGramos').value);
    const caloriasPorcion = parseFloat(document.getElementById('caloriasPorPorcion').value);
    const resultado = document.getElementById('resultadoCalculo');
    const total = document.getElementById('totalCalorias');

    if (!(cantidad > 0) || !(caloriasPorcion > 0)) {
        alert('Escribe una cantidad mayor a 0 y las calorías por porción.');
        return;
    }

    const totalKcal = calculoPorUnidad
        ? cantidad * caloriasPorcion
        : (cantidad / 100) * caloriasPorcion;

    total.textContent = Math.round(totalKcal).toLocaleString('es-MX');
    resultado.style.display = 'block';
}

function autocompletarCalorias() {
    const selector = document.getElementById('selectorAlimento');
    const opcion = selector.options[selector.selectedIndex];
    const nombre = document.getElementById('nombreAlimento');
    const cantidad = document.getElementById('cantidadGramos');
    const calorias = document.getElementById('caloriasPorPorcion');

    if (!selector.value) {
        nombre.value = '';
        calorias.value = '';
        return;
    }

    calculoPorUnidad = /(unidad|rebanada|vaso|cucharada|taza)/i.test(opcion.text);
    nombre.value = opcion.text;
    calorias.value = selector.value;
    cantidad.value = calculoPorUnidad ? 1 : 100;
    cantidad.placeholder = calculoPorUnidad ? 'Ej: 2' : 'Ej: 100';

    document.getElementById('resultadoCalculo').style.display = 'none';
}

function agregarALista() {
    const nombre = document.getElementById('nombreAlimento').value.trim();
    const total = parseInt(document.getElementById('totalCalorias').textContent.replace(/[^0-9]/g, ''), 10) || 0;
    const destino = document.getElementById('comidaDestino').value;

    if (!nombre) {
        alert('Elige un alimento de la lista o escribe uno.');
        return;
    }
    if (total <= 0) {
        alert('Primero calcula las calorías.');
        return;
    }

    agregarAlimento(destino, nombre, total, parseFloat(document.getElementById('precioAlimento').value) || 0);
    document.getElementById('resultadoCalculo').style.display = 'none';
    document.getElementById('precioAlimento').value = '';
}

function agregarComida() {
    const nombreInput = document.getElementById('nombreComida');
    const caloriasInput = document.getElementById('cantidadCalorias');
    const precioInput = document.getElementById('precioComida');
    const destino = document.getElementById('comidaManual').value;
    const nombre = nombreInput.value.trim();
    const calorias = parseInt(caloriasInput.value, 10);
    const precio = parseFloat(precioInput.value) || 0;

    if (!nombre) {
        alert('Escribe el nombre del alimento.');
        nombreInput.focus();
        return;
    }
    if (!(calorias > 0)) {
        alert('Escribe las calorías del alimento.');
        caloriasInput.focus();
        return;
    }

    agregarAlimento(destino, nombre, calorias, precio);
    nombreInput.value = '';
    caloriasInput.value = '';
    precioInput.value = '';
    nombreInput.focus();
}

function agregarAlimento(destino, nombre, calorias, precio) {
    if (COMIDAS_DIA.indexOf(destino) < 0) return;

    const registro = leerRegistroComidas();
    registro[destino].push({
        id: VA.datos.uuid(),
        nombre: nombre,
        kcal: calorias,
        precio: Number(precio) || 0,
        created_at: VA.datos.ahoraISO()
    });
    guardarRegistroComidas(registro);
    renderizarComidas();
    actualizarResumenCalorias();
}

function eliminarComida(destino, indice) {
    const registro = leerRegistroComidas();
    registro[destino].splice(indice, 1);
    guardarRegistroComidas(registro);
    renderizarComidas();
    actualizarResumenCalorias();
}

function renderizarComidas() {
    const registro = leerRegistroComidas();

    COMIDAS_DIA.forEach(function (comida) {
        const lista = document.getElementById('lista' + comida.charAt(0).toUpperCase() + comida.slice(1));
        if (!lista) return;

        if (registro[comida].length === 0) {
            lista.innerHTML = '<p class="lista-vacia">Todavía no registras nada aquí.</p>';
            return;
        }

        lista.innerHTML = registro[comida].map(function (item, indice) {
            const precio = Number(item.precio) || 0;
            return `
                <div class="item-comida">
                    <span class="nombre">${escaparHTML(item.nombre)}</span>
                    <span class="kcal">${Number(item.kcal).toLocaleString('es-MX')} kcal</span>
                    <span class="precio">${precio > 0 ? formatearPesos(precio) : ''}</span>
                    <button class="btn-eliminar" title="Eliminar" onclick="eliminarComida('${comida}', ${indice})">✕</button>
                </div>
            `;
        }).join('');
    });
}

function actualizarResumenCalorias() {
    const consumidasEl = document.getElementById('caloriasConsumidas');
    if (!consumidasEl) return;

    const registro = leerRegistroComidas();
    const consumidas = COMIDAS_DIA.reduce(function (total, comida) {
        return total + registro[comida].reduce(function (suma, item) {
            return suma + (Number(item.kcal) || 0);
        }, 0);
    }, 0);

    const fechaEl = document.getElementById('fechaComida');
    if (fechaEl) {
        fechaEl.textContent = new Date().toLocaleDateString('es-MX', {
            weekday: 'long', day: 'numeric', month: 'long'
        });
    }

    const perfil = VA.datos.perfil.obtener();
    const metaEl = document.getElementById('caloriasMeta');
    const meta = (perfil && perfil.calorias_objetivo) || CALORIAS_META;

    if (metaEl) {
        metaEl.textContent = meta.toLocaleString('es-MX');
    }

    consumidasEl.textContent = consumidas.toLocaleString('es-MX');

    const gastoHoy = calcularGasto(registro);
    const gastoSemana = calcularGastoSemana();

    const gastoHoyEl = document.getElementById('gastoHoy');
    if (gastoHoyEl) gastoHoyEl.textContent = formatearPesos(gastoHoy);

    const gastoSemanaEl = document.getElementById('gastoSemana');
    if (gastoSemanaEl) gastoSemanaEl.textContent = formatearPesos(gastoSemana);

    const plan = leerPlanDieta();
    const datos = PRESUPUESTOS[plan.presupuesto];
    const planEl = document.getElementById('presupuestoPlan');
    const barraPresupuesto = document.getElementById('barraPresupuesto');
    const contenedorPresupuesto = document.getElementById('barraPresupuestoContenedor');

    if (datos) {
        if (planEl) {
            planEl.style.display = 'block';
            planEl.textContent = 'Presupuesto semanal: ' + datos.texto +
                ' · has gastado ' + formatearPesos(gastoSemana);
            planEl.classList.toggle('excedido', gastoSemana > datos.maximo);
        }

        if (barraPresupuesto && contenedorPresupuesto) {
            contenedorPresupuesto.style.display = 'block';
            const porcentaje = Math.min(100, Math.round((gastoSemana / datos.maximo) * 100));
            barraPresupuesto.style.width = porcentaje + '%';
            barraPresupuesto.style.background = gastoSemana > datos.maximo ? '#dc2626' : '';
        }
    } else {
        if (planEl) planEl.style.display = 'none';
        if (contenedorPresupuesto) contenedorPresupuesto.style.display = 'none';
    }

    const barra = document.getElementById('barraCalorias');
    if (barra) {
        const porcentaje = Math.min(100, Math.round((consumidas / meta) * 100));
        barra.style.width = porcentaje + '%';
        barra.style.background = consumidas > meta ? '#dc2626' : '';
        const pill = document.getElementById('porcentajeCalorias');
        if (pill) {
            pill.textContent = Math.round((consumidas / (meta || 1)) * 100) + '%';
            pill.className = 'pill ' + (consumidas > meta ? 'rojo' : 'naranja');
        }
    }

    const texto = document.getElementById('textoRecomendacion');
    if (texto) {
        if (consumidas === 0) {
            texto.textContent = 'Aún no registras comidas. ¡Empieza con un buen desayuno!';
        } else if (consumidas < meta * 0.5) {
            texto.textContent = 'Llevas ' + consumidas.toLocaleString('es-MX') + ' kcal. Te faltan ' + (meta - consumidas).toLocaleString('es-MX') + ' para tu meta. ¡Sigue así!';
        } else if (consumidas < meta) {
            texto.textContent = '¡Muy bien! Llevas ' + consumidas.toLocaleString('es-MX') + ' de ' + meta.toLocaleString('es-MX') + ' kcal. Ya casi llegas a tu meta.';
        } else {
            texto.textContent = 'Alcanzaste tu meta de calorías del día. Mantén el equilibrio en tu próxima comida.';
        }
    }
}

function iniciarAlimentacion() {
    if (!document.getElementById('listaDesayuno')) return;

    const nombre = document.getElementById('nombreAlimento');
    if (nombre) {
        nombre.addEventListener('input', function () {
            calculoPorUnidad = false;
            document.getElementById('cantidadGramos').placeholder = 'Ej: 100';
        });
    }

    // Preselecciona la comida según la hora del día
    const hora = new Date().getHours();
    const sugerida = hora < 11 ? 'desayuno' : (hora < 16 ? 'almuerzo' : 'cena');
    ['comidaDestino', 'comidaManual'].forEach(function (id) {
        const select = document.getElementById(id);
        if (select) select.value = sugerida;
    });

    const enlacePlan = document.getElementById('enlacePlan');
    if (enlacePlan && VA.datos.plan.tieneMenu()) {
        enlacePlan.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-apple"/></svg> Ver mi plan';
    }

    renderizarComidas();
    actualizarResumenCalorias();
}

document.addEventListener('DOMContentLoaded', iniciarAlimentacion);

// ===== ENTRENAMIENTOS: SELECCIÓN, CRONÓMETRO Y REGISTRO =====


const RUTINAS = {
    cuerpo_completo: {
        nombre: 'Cuerpo Completo',
        minutos: 25,
        nivel: 'Principiante',
        ejercicios: [
            { nombre: 'Sentadillas', tiempo: 30, descanso: 10 },
            { nombre: 'Flexiones', tiempo: 30, descanso: 10 },
            { nombre: 'Plancha abdominal', tiempo: 20, descanso: 10 },
            { nombre: 'Zancadas', tiempo: 30, descanso: 10, nota: 'cada pierna' },
            { nombre: 'Saltos de tijera', tiempo: 30, descanso: 10 }
        ]
    }
};

const entrenamiento = {
    rutinaId: null,
    indice: 0,
    fase: 'inactivo', // inactivo | ejercicio | descanso | completado
    restante: 0,
    intervalo: null,
    pausado: false,
    inicio: null,
    guardado: false
};

function formatearTiempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const resto = segundos % 60;
    return String(minutos).padStart(2, '0') + ':' + String(resto).padStart(2, '0');
}

// --- Página de ejercicios: elegir tipo y arrancar ---
function mostrarBotonIniciar() {
    const select = document.getElementById('tipoEjercicio');
    const boton = document.getElementById('btnComenzar');
    if (!select || !boton) return;
    boton.style.display = RUTINAS[select.value] ? 'block' : 'none';
}

function irAlEntrenamiento() {
    const select = document.getElementById('tipoEjercicio');
    if (!select || !RUTINAS[select.value]) return;
    window.location.href = 'rutina_cuerpo_completo.html?iniciar=1';
}

// --- Reproductor de la rutina ---
function iniciarEntrenamiento(rutinaId) {
    const id = rutinaId || entrenamiento.rutinaId || 'cuerpo_completo';
    const rutina = RUTINAS[id];
    if (!rutina || !document.getElementById('cronometro')) return;

    entrenamiento.rutinaId = id;
    entrenamiento.indice = 0;
    entrenamiento.fase = 'ejercicio';
    entrenamiento.restante = rutina.ejercicios[0].tiempo;
    entrenamiento.pausado = false;
    entrenamiento.guardado = false;
    entrenamiento.inicio = Date.now();

    iniciarIntervalo();
    actualizarJugador();
    mostrarEstadoEntrenamiento('¡Empezamos! ' + rutina.ejercicios[0].nombre, 'info');
}

function iniciarIntervalo() {
    detenerIntervalo();
    entrenamiento.intervalo = setInterval(ticEntrenamiento, 1000);
}

function detenerIntervalo() {
    if (entrenamiento.intervalo) {
        clearInterval(entrenamiento.intervalo);
        entrenamiento.intervalo = null;
    }
}

function ticEntrenamiento() {
    entrenamiento.restante -= 1;

    if (entrenamiento.restante > 0) {
        actualizarJugador();
        return;
    }

    avanzarFase();
}

function avanzarFase() {
    const rutina = RUTINAS[entrenamiento.rutinaId];
    if (!rutina) return;

    const ejercicio = rutina.ejercicios[entrenamiento.indice];

    if (entrenamiento.fase === 'descanso') {
        entrenamiento.fase = 'ejercicio';
        entrenamiento.indice += 1;
        entrenamiento.restante = rutina.ejercicios[entrenamiento.indice].tiempo;
    } else {
        const esUltimo = entrenamiento.indice === rutina.ejercicios.length - 1;
        if (esUltimo) {
            finalizarEntrenamiento();
            return;
        }
        entrenamiento.fase = 'descanso';
        entrenamiento.restante = ejercicio.descanso;
    }

    actualizarJugador();
}

function alternarEntrenamiento() {
    if (entrenamiento.fase === 'inactivo' || entrenamiento.fase === 'completado') {
        iniciarEntrenamiento();
        return;
    }

    if (entrenamiento.pausado) {
        entrenamiento.pausado = false;
        iniciarIntervalo();
        mostrarEstadoEntrenamiento('Entrenamiento reanudado.', 'info');
    } else {
        entrenamiento.pausado = true;
        detenerIntervalo();
        mostrarEstadoEntrenamiento('Entrenamiento en pausa.', 'info');
    }

    actualizarJugador();
}

function saltarPaso() {
    if (entrenamiento.fase === 'inactivo' || entrenamiento.fase === 'completado') return;
    avanzarFase();
}

function detenerEntrenamiento() {
    detenerIntervalo();
    entrenamiento.fase = 'inactivo';
    entrenamiento.indice = 0;
    entrenamiento.restante = 0;
    entrenamiento.pausado = false;
    entrenamiento.inicio = null;
    entrenamiento.guardado = false;
    actualizarJugador();
    mostrarEstadoEntrenamiento('Entrenamiento detenido. Puedes empezar de nuevo cuando quieras.', 'info');
}

function finalizarEntrenamiento() {
    detenerIntervalo();

    const rutina = RUTINAS[entrenamiento.rutinaId];
    entrenamiento.fase = 'completado';
    entrenamiento.restante = 0;
    entrenamiento.pausado = false;

    if (!entrenamiento.guardado) {
        registrarEntrenamiento(rutina);
        entrenamiento.guardado = true;
    }

    actualizarJugador();
    mostrarEstadoEntrenamiento('Entrenamiento completado. Se guardó en tu progreso.', 'exito');

    if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
}

function registrarEntrenamiento(rutina) {
    const minutos = entrenamiento.inicio
        ? Math.max(1, Math.round((Date.now() - entrenamiento.inicio) / 60000))
        : rutina.minutos;

    return VA.datos.entrenamientos.agregar({
        id: VA.datos.uuid(),
        rutina_id: rutina.id || 'cuerpo_completo',
        rutina_nombre: rutina.nombre || 'Cuerpo completo',
        nivel: rutina.nivel || '',
        rutina: rutina.nombre || 'Cuerpo completo',
        fecha: obtenerFechaHoy(),
        minutos: minutos,
        rondas: rutina.rondas || 1,
        completado_en: VA.datos.ahoraISO()
    });
}

// Botón "Marcar como completado" de la rutina
function completarEntrenamiento() {
    if (entrenamiento.fase === 'completado' && entrenamiento.guardado) {
        mostrarEstadoEntrenamiento('Ya registraste este entrenamiento.', 'info');
        return;
    }

    if (entrenamiento.fase !== 'completado') {
        finalizarEntrenamiento();
        return;
    }

    mostrarEstadoEntrenamiento('Ya registraste este entrenamiento.', 'info');
}

function mostrarEstadoEntrenamiento(texto, tipo) {
    const estado = document.getElementById('estadoEntrenamiento');
    if (!estado) return;
    estado.textContent = texto;
    estado.className = 'estado-entrenamiento ' + (tipo || '');
}

function marcarLista(activo, completados) {
    document.querySelectorAll('.lista-ejercicios .item-ejercicio').forEach(function (item, indice) {
        item.classList.toggle('activo', indice === activo);
        item.classList.toggle('completado', indice < completados);
    });
}

function actualizarJugador() {
    const rutina = RUTINAS[entrenamiento.rutinaId];
    if (!rutina) return;

    const panel = document.getElementById('entrenador');
    const progreso = document.getElementById('entrenadorProgreso');
    const faseEl = document.getElementById('entrenadorFase');
    const detalle = document.getElementById('entrenadorDetalle');
    const cronometro = document.getElementById('cronometro');
    const boton = document.getElementById('btnEntrenamiento');

    if (!panel || !progreso || !faseEl || !cronometro || !boton) return;

    panel.classList.remove('en-marcha', 'en-descanso', 'pausado');

    if (entrenamiento.fase === 'inactivo') {
        progreso.textContent = rutina.ejercicios.length + ' ejercicios · ' + rutina.minutos + ' min';
        faseEl.textContent = 'Listo para empezar';
        detalle.textContent = 'El cronómetro bajará automáticamente en cada ejercicio.';
        cronometro.textContent = formatearTiempo(rutina.ejercicios[0].tiempo);
        boton.innerHTML = (window.VA && VA.icono ? VA.icono('i-play') : '') + ' Iniciar';
        marcarLista(-1, 0);
        return;
    }

    if (entrenamiento.fase === 'completado') {
        progreso.textContent = 'Rutina terminada';
        faseEl.textContent = '¡Buen trabajo!';
        detalle.textContent = 'Registrado en tu progreso de hoy.';
        cronometro.textContent = '✓';
        boton.innerHTML = (window.VA && VA.icono ? VA.icono('i-refresh') : '') + ' Repetir';
        marcarLista(-1, rutina.ejercicios.length);
        return;
    }

    const ejercicio = rutina.ejercicios[entrenamiento.indice];
    const esDescanso = entrenamiento.fase === 'descanso';

    progreso.textContent = 'Ejercicio ' + (entrenamiento.indice + 1) + ' de ' + rutina.ejercicios.length;

    if (esDescanso) {
        const siguiente = rutina.ejercicios[entrenamiento.indice + 1];
        faseEl.textContent = 'Descanso';
        detalle.textContent = siguiente ? 'Siguiente: ' + siguiente.nombre : '';
        marcarLista(-1, entrenamiento.indice + 1);
    } else {
        faseEl.textContent = ejercicio.nombre + (ejercicio.nota ? ' (' + ejercicio.nota + ')' : '');
        detalle.textContent = '¡A trabajar! ' + ejercicio.tiempo + ' segundos';
        marcarLista(entrenamiento.indice, entrenamiento.indice);
    }

    cronometro.textContent = formatearTiempo(Math.max(0, entrenamiento.restante));
    boton.innerHTML = (window.VA && VA.icono ? VA.icono(entrenamiento.pausado ? 'i-play' : 'i-pause') : '') + (entrenamiento.pausado ? ' Reanudar' : ' Pausar');

    panel.classList.toggle('en-descanso', esDescanso);
    panel.classList.toggle('en-marcha', !esDescanso);
    panel.classList.toggle('pausado', entrenamiento.pausado);
}

function renderizarRutina() {
    const lista = document.querySelector('.lista-ejercicios');
    const rutina = RUTINAS[entrenamiento.rutinaId || 'cuerpo_completo'];
    if (!lista || !rutina) return;

    lista.innerHTML = rutina.ejercicios.map(function (ejercicio, indice) {
        const detalle = ejercicio.tiempo + ' segundos' +
            (ejercicio.nota ? ' ' + ejercicio.nota : '') +
            ' | Descanso: ' + ejercicio.descanso + ' seg';

        return `
            <div class="item-ejercicio">
                <span class="numero">${indice + 1}</span>
                <div>
                    <h4>${escaparHTML(ejercicio.nombre)}</h4>
                    <p>${detalle}</p>
                </div>
            </div>
        `;
    }).join('');
}

function iniciarPaginaEntrenamiento() {
    if (!document.getElementById('cronometro')) return;

    entrenamiento.rutinaId = 'cuerpo_completo';
    renderizarRutina();
    actualizarJugador();

    const parametros = new URLSearchParams(window.location.search);
    if (parametros.get('iniciar') === '1') {
        iniciarEntrenamiento('cuerpo_completo');
    }
}

document.addEventListener('DOMContentLoaded', iniciarPaginaEntrenamiento);

// ===== HÁBITOS =====


function leerHabitos() {
    return VA.datos.habitos.listar();
}

function guardarHabitos(habitos) {
    return VA.datos.habitos.guardar(habitos);
}

function leerRecordatorioHabito() {
    return VA.datos.recordatorio.obtener();
}

function guardarRecordatorioHabito() {
    VA.datos.recordatorio.guardar({
        activo: recordatorioHabito.activo,
        hora: recordatorioHabito.hora
    });
}

// Mensajes breves de reconocimiento: variados, sin culpa y sin repetir el anterior.
const MENSAJES_HABITO = {
    construir: [
        'Hecho. Un paso más.',
        'Ahí está. Sigue así.',
        'Bien. Lo pequeño también cuenta.',
        'Cumplido. Mañana otra vez.',
        'Eso es constancia.',
        'Sin prisa, pero sin pausa.',
        'Un granito más.',
        'Tu yo de mañana lo agradece.'
    ],
    primero: [
        'Primer paso del día. Ya arrancaste.',
        'El día empezó bien.',
        'Ya hay algo hecho hoy.'
    ],
    reducir: [
        'Un día más limpio.',
        'Hoy también pudiste.',
        'Cuenta los días, no los tropiezos.',
        'Un día a la vez.',
        'Día limpio. Bien hecho.'
    ],
    regreso: [
        'Volviste. Eso también es avanzar.',
        'Los días no se borran. Seguimos.',
        'Retomar también es un hábito.'
    ],
    completo: [
        'Día completo. Disfrútalo.',
        'Todo listo por hoy. Te lo ganaste.',
        'Cerraste el día. Mañana seguimos.'
    ]
};

const HITOS_HABITO = {
    3: 'Tres días. Ya no es casualidad.',
    7: 'Una semana. Se está volviendo costumbre.',
    14: 'Dos semanas. Tu rutina ya te conoce.',
    21: '21 días. Esto ya es tuyo.',
    30: 'Un mes. Cambio real.',
    66: '66 días. Ya es automático.'
};

// Catálogo breve de hábitos generales. Son sugerencias, no indicaciones médicas.
const CATALOGO_HABITOS = [
    {
        id: 'caminar', emoji: '🚶', nombre: 'Caminar 20 minutos', cat: 'Movimiento', tipo: 'construir',
        resumen: 'Mueve tu cuerpo sin equipo ni horario fijo.',
        que: 'Caminar a paso cómodo, sin meta de velocidad. Puede ser en dos tandas de 10 minutos.',
        cuesta: 'No da recompensa inmediata y compite con el cansancio o el celular.',
        empezar: 'Después de comer o al bajar del transporte. Deja los tenis a la vista.'
    },
    {
        id: 'estirar', emoji: '🧘', nombre: 'Estirar al despertar', cat: 'Movimiento', tipo: 'construir',
        resumen: 'Cinco minutos para arrancar el día sin rigidez.',
        que: 'Movilidad suave de cuello, espalda y piernas al levantarte.',
        cuesta: 'Se siente prescindible cuando tienes prisa.',
        empezar: 'Antes de tomar el celular. Tres estiramientos, cinco minutos.'
    },
    {
        id: 'entrenar', emoji: '💪', nombre: 'Entrenar 2 veces por semana', cat: 'Movimiento', tipo: 'construir',
        resumen: 'Dos sesiones ya cuentan. No necesitas todos los días.',
        que: 'Fuerza o cardio, 20 a 30 minutos, en días fijos.',
        cuesta: 'Requiere planear y quita tiempo percibido.',
        empezar: 'Agéndalo como una cita y deja la ropa lista la noche anterior.'
    },
    {
        id: 'fruta', emoji: '🥗', nombre: 'Una fruta o verdura por comida', cat: 'Alimentación', tipo: 'construir',
        resumen: 'Suma, no quites: una porción en cada comida.',
        que: 'Agregar una fruta o verdura a lo que ya comes.',
        cuesta: 'Compite con botanas que están más a la mano.',
        empezar: 'Deja la fruta lavada y a la vista; úsala como postre.'
    },
    {
        id: 'pantallas', emoji: '🍽️', nombre: 'Comer sin pantallas', cat: 'Alimentación', tipo: 'construir',
        resumen: 'Una comida al día sin celular ni televisión.',
        que: 'Comer con atención, sin distracciones, al menos en una comida.',
        cuesta: 'El aburrimiento y la costumbre de comer viendo algo.',
        empezar: 'Deja el celular en otra habitación durante esa comida.'
    },
    {
        id: 'refresco', emoji: '🥤', nombre: 'Agua en lugar de refresco', cat: 'Alimentación', tipo: 'construir',
        resumen: 'Cambia una bebida azucarada al día por agua.',
        que: 'Sustituir, no eliminar todo de golpe.',
        cuesta: 'El sabor y la costumbre pesan más que la sed.',
        empezar: 'Ten agua fría a la mano y cambia solo una bebida al día.'
    },
    {
        id: 'dormir', emoji: '😴', nombre: 'Dormir 7 u 8 horas', cat: 'Sueño', tipo: 'construir',
        resumen: 'Horario parecido para acostarte y levantarte.',
        que: 'Sostener un horario estable, más que dormir perfecto.',
        cuesta: 'El ocio nocturno y las series se comen la hora.',
        empezar: 'Pon una alarma para acostarte, no solo para despertar.'
    },
    {
        id: 'celular', emoji: '📵', nombre: 'Celular fuera de la cama', cat: 'Sueño', tipo: 'construir',
        resumen: 'Carga el teléfono lejos de la almohada.',
        que: 'Dejarlo en otra superficie y usar despertador aparte.',
        cuesta: 'Es despertador, ocio y compañía al mismo tiempo.',
        empezar: 'Compra un despertador sencillo o usa el modo avión lejos de la cama.'
    },
    {
        id: 'agua', emoji: '💧', nombre: 'Tomar 8 vasos de agua', cat: 'Hidratación', tipo: 'construir',
        resumen: 'Reparte el agua en el día, no toda de golpe.',
        que: 'Beber a lo largo del día, no solo cuando hay sed.',
        cuesta: 'Sin sed no hay recordatorio natural.',
        empezar: 'Un vaso al levantarte y otro en cada comida.'
    },
    {
        id: 'respirar', emoji: '🌬️', nombre: 'Respirar 3 minutos', cat: 'Mente', tipo: 'construir',
        resumen: 'Una pausa corta para bajar el ritmo.',
        que: 'Respirar lento: inhalar 4 segundos, exhalar 6.',
        cuesta: 'Parece perder el tiempo cuando hay estrés.',
        empezar: 'Al cerrar la laptop o antes de una reunión difícil.'
    },
    {
        id: 'gratitud', emoji: '📓', nombre: 'Escribir algo bueno del día', cat: 'Mente', tipo: 'construir',
        resumen: 'Una línea al día, sin hacerlo perfecto.',
        que: 'Anotar una cosa que salió bien o que agradeces.',
        cuesta: 'Se siente trivial frente a los problemas.',
        empezar: 'Una nota en el celular antes de dormir.'
    },
    {
        id: 'fumar', emoji: '🚭', nombre: 'Día sin fumar', cat: 'Sustancias', tipo: 'reducir',
        resumen: 'Cuenta días limpios, no los tropiezos.',
        que: 'Un contador de días sin fumar, sin castigar recaídas.',
        cuesta: 'La nicotina crea dependencia física y el ritual acompaña el estrés.',
        empezar: 'Solo por hoy. Si hay recaída, mañana se vuelve a contar.'
    },
    {
        id: 'alcohol', emoji: '🍺', nombre: 'Días sin alcohol', cat: 'Sustancias', tipo: 'reducir',
        resumen: 'Menos días, no solo menos cantidad.',
        que: 'Elegir días de la semana sin beber.',
        cuesta: 'La norma social lo vuelve difícil de rechazar.',
        empezar: 'Escoge tres días fijos y avísale a quien te acompaña.'
    },
    {
        id: 'cafeina', emoji: '☕', nombre: 'Café solo antes de las 4', cat: 'Sustancias', tipo: 'reducir',
        resumen: 'Última taza temprano para dormir mejor.',
        que: 'Limitar café, té y refrescos de cola por la tarde.',
        cuesta: 'El cansancio pide más cafeína y altera el sueño.',
        empezar: 'Cambia la taza de la tarde por agua o descafeinado.'
    }
];

// Recomendación para quien no sabe con qué empezar: hábitos para construir,
// priorizando categorías que todavía no aparecen en su lista.
const PRIORIDAD_RECOMENDACION_HABITOS = [
    'respirar', 'dormir', 'fruta', 'estirar', 'agua', 'caminar',
    'gratitud', 'pantallas', 'refresco', 'celular', 'entrenar'
];

const RAZONES_RECOMENDACION_HABITOS = {
    respirar: 'Es corto, no necesita equipo y te da una pausa. Una buena forma de empezar sin sumar presión.',
    dormir: 'Un horario más estable ayuda a todo lo demás. Empieza moviendo solo 15 minutos tu hora de acostarte.',
    fruta: 'No se trata de quitar nada: suma una fruta o verdura a una comida que ya haces.',
    estirar: 'Cinco minutos al despertar, sin ropa especial ni ir al gimnasio.',
    agua: 'Un vaso al levantarte y otro en cada comida. Fácil de recordar.',
    caminar: 'No necesita equipo ni horario fijo. Diez minutos ya cuentan.',
    gratitud: 'Una línea antes de dormir. No tiene que ser profundo ni perfecto.',
    pantallas: 'Una comida al día sin celular. Empieza por la más fácil.',
    refresco: 'Cambia una sola bebida azucarada por agua. No elimines todo de golpe.',
    celular: 'Deja el teléfono lejos de la cama y usa un despertador aparte.',
    entrenar: 'Dos sesiones por semana ya cuentan. Agenda una y deja la ropa lista.'
};

const ultimoMensajeHabito = {};
let mensajeCompletoActual = '';
let temporizadorToastHabito = null;
let filtroCatalogo = 'Todos';
let focoAntesHojaHabito = null;
let indiceRecomendacionHabito = 0;
let recomendacionHabitoActual = null;
let recordatorioHabito = leerRecordatorioHabito();
let focoAntesAjustesHabito = null;

function elegirMensajeHabito(tipo) {
    const lista = MENSAJES_HABITO[tipo];
    let indice = Math.floor(Math.random() * lista.length);

    if (lista.length > 1 && indice === ultimoMensajeHabito[tipo]) {
        indice = (indice + 1) % lista.length;
    }

    ultimoMensajeHabito[tipo] = indice;
    return lista[indice];
}

function tipoDeHabito(habito) {
    if (habito.tipo === 'reducir' || habito.tipo === 'construir') return habito.tipo;

    const nombre = String(habito.nombre || '').toLowerCase();
    const claves = [
        'sin fumar', 'sin alcohol', 'sin azúcar', 'sin azucar',
        'día sin', 'dia sin', 'días sin', 'dias sin',
        'dejar de', 'reducir', 'menos '
    ];

    return claves.some(function (clave) {
        return nombre.indexOf(clave) >= 0;
    }) ? 'reducir' : 'construir';
}

function ultimoDiaAntesDeHoy(habito, hoy) {
    const anteriores = diasHabito(habito)
        .filter(function (dia) { return dia < hoy; })
        .sort();

    return anteriores.length ? anteriores[anteriores.length - 1] : null;
}

function diferenciaDiasISO(desde, hasta) {
    const inicio = new Date(desde + 'T12:00:00');
    const fin = new Date(hasta + 'T12:00:00');
    return Math.round((fin - inicio) / 86400000);
}

function hitoYaMostrado(id, racha, fecha) {
    try {
        return sessionStorage.getItem('vidaActivaHito:' + id + ':' + racha + ':' + fecha) === '1';
    } catch (error) {
        return false;
    }
}

function recordarHito(id, racha, fecha) {
    try {
        sessionStorage.setItem('vidaActivaHito:' + id + ':' + racha + ':' + fecha, '1');
    } catch (error) {
        // Si el navegador lo bloquea, el hito podría repetirse; los datos no se ven afectados.
    }
}

function mostrarToastHabito(texto, tipo) {
    const toast = document.getElementById('toastHabito');
    if (!toast) return;

    toast.textContent = texto;
    toast.classList.toggle('hito', tipo === 'hito');
    toast.classList.add('visible');

    clearTimeout(temporizadorToastHabito);
    temporizadorToastHabito = setTimeout(function () {
        toast.classList.remove('visible');
    }, tipo === 'hito' ? 3400 : 2300);
}

function normalizarNombreHabito(nombre) {
    return String(nombre || '').trim().toLowerCase();
}

function renderizarChipsCatalogo() {
    const contenedor = document.getElementById('chipsHabitos');
    if (!contenedor) return;

    const categorias = ['Todos'];
    CATALOGO_HABITOS.forEach(function (sugerencia) {
        if (categorias.indexOf(sugerencia.cat) < 0) categorias.push(sugerencia.cat);
    });

    contenedor.innerHTML = categorias.map(function (categoria) {
        const activo = categoria === filtroCatalogo ? 'activo' : '';
        return '<button type="button" class="chip-habito ' + activo + '" onclick="filtrarCatalogoHabitos(\'' + escaparHTML(categoria) + '\')">' + escaparHTML(categoria) + '</button>';
    }).join('');
}

function filtrarCatalogoHabitos(categoria) {
    filtroCatalogo = categoria;
    renderizarChipsCatalogo();
    renderizarCatalogoHabitos();
}

function renderizarCatalogoHabitos() {
    const contenedor = document.getElementById('listaSugerenciasHabitos');
    if (!contenedor) return;

    const habitos = leerHabitos();
    const nombres = habitos.map(function (habito) {
        return normalizarNombreHabito(habito.nombre);
    });

    const sugerencias = CATALOGO_HABITOS.filter(function (sugerencia) {
        const coincideCategoria = filtroCatalogo === 'Todos' || sugerencia.cat === filtroCatalogo;
        const yaExiste = nombres.indexOf(normalizarNombreHabito(sugerencia.nombre)) >= 0;
        return coincideCategoria && !yaExiste;
    });

    contenedor.innerHTML = sugerencias.map(function (sugerencia) {
        const etiqueta = sugerencia.tipo === 'reducir'
            ? '<span class="etiqueta-reducir">a reducir</span>'
            : '';
        const icono = window.VA && VA.iconoHabito && VA.icono
            ? VA.icono(VA.iconoHabito({ categoria: sugerencia.cat, nombre: sugerencia.nombre }))
            : '';

        return '<div class="sugerencia-habito' + (sugerencia.tipo === 'reducir' ? ' reducir' : '') + '" onclick="abrirHojaHabito(\'' + sugerencia.id + '\')">' +
            '<div class="sugerencia-icono">' + icono + '</div>' +
            '<div class="sugerencia-texto">' +
                '<h3>' + escaparHTML(sugerencia.nombre) + etiqueta + '</h3>' +
                '<p>' + escaparHTML(sugerencia.resumen) + '</p>' +
            '</div>' +
            '<button type="button" class="btn-sugerencia" onclick="event.stopPropagation(); agregarHabitoSugerido(\'' + sugerencia.id + '\')">+ Agregar</button>' +
        '</div>';
    }).join('') || '<p class="lista-vacia">Ya agregaste todas las ideas de esta categoría.</p>';

    const nota = document.getElementById('notaLimiteHabitos');
    if (nota) nota.classList.toggle('visible', habitos.length >= 3);
}

function obtenerRecomendacionesHabito() {
    const habitos = leerHabitos();
    const nombres = habitos.map(function (habito) {
        return normalizarNombreHabito(habito.nombre);
    });
    const categorias = {};

    habitos.forEach(function (habito) {
        if (habito.categoria) categorias[habito.categoria] = true;
    });

    return CATALOGO_HABITOS
        .filter(function (sugerencia) {
            return sugerencia.tipo !== 'reducir' &&
                nombres.indexOf(normalizarNombreHabito(sugerencia.nombre)) < 0;
        })
        .sort(function (a, b) {
            const aNueva = !categorias[a.cat];
            const bNueva = !categorias[b.cat];
            if (aNueva !== bNueva) return aNueva ? -1 : 1;

            const ia = PRIORIDAD_RECOMENDACION_HABITOS.indexOf(a.id);
            const ib = PRIORIDAD_RECOMENDACION_HABITOS.indexOf(b.id);
            return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
        });
}

function actualizarRecomendacionHabito() {
    const bloque = document.getElementById('recomendacionHabito');
    if (!bloque) return;

    const disponibles = obtenerRecomendacionesHabito();
    if (!disponibles.length) {
        bloque.hidden = true;
        recomendacionHabitoActual = null;
        return;
    }

    bloque.hidden = false;
    if (indiceRecomendacionHabito >= disponibles.length) indiceRecomendacionHabito = 0;

    const sugerencia = disponibles[indiceRecomendacionHabito];
    recomendacionHabitoActual = sugerencia;

    const habitos = leerHabitos();
    const enLimite = habitos.length >= 3;
    const categoriaNueva = habitos.every(function (habito) {
        return habito.categoria !== sugerencia.cat;
    });

    document.getElementById('recoHabitoPrefijo').textContent = enLimite
        ? 'También podría encajar:'
        : 'Te recomendamos:';
    document.getElementById('recoHabitoNombreBanner').textContent = sugerencia.nombre;
    document.getElementById('recoHabitoIcono').innerHTML = window.VA && VA.iconoHabito && VA.icono
        ? VA.icono(VA.iconoHabito({ categoria: sugerencia.cat, nombre: sugerencia.nombre }))
        : '';
    document.getElementById('recoHabitoNombre').textContent = sugerencia.nombre;
    document.getElementById('recoHabitoResumen').textContent = sugerencia.resumen;
    document.getElementById('recoHabitoAgregar').setAttribute('aria-label', 'Agregar ' + sugerencia.nombre);

    const contexto = categoriaNueva
        ? 'Te vendría bien algo de ' + sugerencia.cat + '. '
        : 'Complementa lo que ya haces. ';
    document.getElementById('recoHabitoPorque').textContent = contexto +
        (RAZONES_RECOMENDACION_HABITOS[sugerencia.id] || sugerencia.resumen);

    const aviso = document.getElementById('recoHabitoAviso');
    aviso.hidden = !enLimite;
    aviso.textContent = enLimite
        ? 'Ya tienes 3 hábitos. Puedes agregar otro, pero mejor pocos y constantes.'
        : '';

    const otra = document.getElementById('recoHabitoOtra');
    otra.hidden = disponibles.length <= 1;
}

function alternarRecomendacionHabito() {
    const panel = document.getElementById('recoHabitoPanel');
    const boton = document.getElementById('recoHabitoBanner');
    if (!panel || !boton) return;

    const abrir = panel.hidden;
    panel.hidden = !abrir;
    boton.setAttribute('aria-expanded', String(abrir));
    document.getElementById('recomendacionHabito').classList.toggle('abierta', abrir);
    if (abrir) actualizarRecomendacionHabito();
}

function otraRecomendacionHabito() {
    const disponibles = obtenerRecomendacionesHabito();
    if (disponibles.length <= 1) return;

    indiceRecomendacionHabito = (indiceRecomendacionHabito + 1) % disponibles.length;
    actualizarRecomendacionHabito();
}

function agregarRecomendadoHabito() {
    if (recomendacionHabitoActual) agregarHabitoSugerido(recomendacionHabitoActual.id);
}

function abrirDetalleRecomendadoHabito() {
    if (recomendacionHabitoActual) abrirHojaHabito(recomendacionHabitoActual.id);
}

function abrirHojaHabito(id) {
    const sugerencia = CATALOGO_HABITOS.find(function (habito) {
        return habito.id === id;
    });
    if (!sugerencia) return;

    document.getElementById('hojaHabitoIcono').innerHTML = window.VA && VA.iconoHabito && VA.icono
        ? VA.icono(VA.iconoHabito({ categoria: sugerencia.cat, nombre: sugerencia.nombre }))
        : '';
    document.getElementById('hojaHabitoNombre').textContent = sugerencia.nombre;
    document.getElementById('hojaHabitoTipo').textContent = sugerencia.cat + ' · ' +
        (sugerencia.tipo === 'reducir' ? 'Hábito a reducir' : 'Hábito para construir');
    document.getElementById('hojaHabitoQue').textContent = sugerencia.que;
    document.getElementById('hojaHabitoCuesta').textContent = sugerencia.cuesta;
    document.getElementById('hojaHabitoEmpezar').textContent = sugerencia.empezar;

    const yaEsta = leerHabitos().some(function (habito) {
        return normalizarNombreHabito(habito.nombre) === normalizarNombreHabito(sugerencia.nombre);
    });

    const boton = document.getElementById('hojaHabitoBoton');
    boton.textContent = yaEsta
        ? 'Ya está en tus hábitos'
        : (sugerencia.tipo === 'reducir' ? 'Empezar hoy' : 'Agregar a mis hábitos');
    boton.disabled = yaEsta;
    boton.onclick = function () { agregarHabitoSugerido(sugerencia.id); };

    focoAntesHojaHabito = document.activeElement;
    document.getElementById('hojaHabitoFondo').classList.add('abierto');
    document.body.style.overflow = 'hidden';

    const cerrar = document.querySelector('#hojaHabitoFondo .cerrar-hoja');
    if (cerrar) cerrar.focus();
}

function cerrarHojaHabito() {
    const fondo = document.getElementById('hojaHabitoFondo');
    if (fondo) fondo.classList.remove('abierto');
    document.body.style.overflow = '';

    if (focoAntesHojaHabito && typeof focoAntesHojaHabito.focus === 'function') {
        focoAntesHojaHabito.focus();
    }
    focoAntesHojaHabito = null;
}

function abrirAjustesHabito() {
    const fondo = document.getElementById('hojaAjustesFondo');
    if (!fondo) return;

    actualizarVistaRecordatorioHabito();
    const origen = document.activeElement;
    focoAntesAjustesHabito = origen && origen !== document.body
        ? origen
        : document.querySelector('header .btn-ajustes');
    fondo.classList.add('abierto');
    document.body.style.overflow = 'hidden';

    const cerrar = document.querySelector('#hojaAjustesFondo .cerrar-hoja');
    if (cerrar) cerrar.focus();
}

function cerrarAjustesHabito() {
    const fondo = document.getElementById('hojaAjustesFondo');
    if (fondo) fondo.classList.remove('abierto');
    document.body.style.overflow = '';

    if (focoAntesAjustesHabito && typeof focoAntesAjustesHabito.focus === 'function') {
        focoAntesAjustesHabito.focus();
    }
    focoAntesAjustesHabito = null;
}

function alternarRecordatorioHabito() {
    recordatorioHabito.activo = !recordatorioHabito.activo;
    guardarRecordatorioHabito();
    actualizarVistaRecordatorioHabito();
}

function cambiarHoraRecordatorio() {
    const hora = document.getElementById('horaRecordatorioHabito');
    recordatorioHabito.hora = (hora && hora.value) || '20:00';
    guardarRecordatorioHabito();
    actualizarVistaRecordatorioHabito();
}

function actualizarVistaRecordatorioHabito() {
    const interruptor = document.getElementById('switchRecordatorioHabito');
    if (!interruptor) return;

    interruptor.setAttribute('aria-checked', String(recordatorioHabito.activo));

    const hora = document.getElementById('horaRecordatorioHabito');
    if (hora) {
        hora.value = recordatorioHabito.hora;
        hora.disabled = !recordatorioHabito.activo;
    }

    const vista = document.getElementById('vistaPreviaRecordatorio');
    if (vista) vista.hidden = !recordatorioHabito.activo;

    const probar = document.getElementById('btnProbarRecordatorio');
    if (probar) probar.disabled = !recordatorioHabito.activo;

    const estado = document.getElementById('estadoRecordatorioHabito');
    if (estado) {
        estado.textContent = recordatorioHabito.activo
            ? 'Activo todos los días a las ' + recordatorioHabito.hora
            : 'Desactivado';
        estado.classList.toggle('activo', recordatorioHabito.activo);
    }
}

function probarAvisoHabito() {
    if (!recordatorioHabito.activo) return;
    mostrarToastHabito('🔔 Un momento para tus hábitos. Sin prisas.');
}

function iniciarAjustesHabito() {
    const fondo = document.getElementById('hojaAjustesFondo');
    if (!fondo) return;

    fondo.addEventListener('click', function (evento) {
        if (evento.target === fondo) cerrarAjustesHabito();
    });

    document.addEventListener('keydown', function (evento) {
        if (evento.key === 'Escape') cerrarAjustesHabito();
    });

    actualizarVistaRecordatorioHabito();
}

function agregarHabitoSugerido(id) {
    const sugerencia = CATALOGO_HABITOS.find(function (habito) {
        return habito.id === id;
    });
    if (!sugerencia) return;

    const habitos = leerHabitos();
    const yaExiste = habitos.some(function (habito) {
        return normalizarNombreHabito(habito.nombre) === normalizarNombreHabito(sugerencia.nombre);
    });

    if (yaExiste) {
        cerrarHojaHabito();
        return;
    }

    habitos.push({
        id: VA.datos.uuid(),
        nombre: sugerencia.nombre,
        dias: [],
        tipo: sugerencia.tipo,
        categoria: sugerencia.cat,
        created_at: VA.datos.ahoraISO()
    });
    guardarHabitos(habitos);
    cerrarHojaHabito();
    renderizarHabitos();
    renderizarCalendarioSemana();
    renderizarCatalogoHabitos();
    indiceRecomendacionHabito = 0;
    actualizarRecomendacionHabito();
    mostrarToastHabito('Agregado. Un paso a la vez 🌱');
}

function iniciarCatalogoHabitos() {
    if (!document.getElementById('listaSugerenciasHabitos')) return;

    renderizarChipsCatalogo();
    renderizarCatalogoHabitos();
    actualizarRecomendacionHabito();

    const fondo = document.getElementById('hojaHabitoFondo');
    if (fondo) {
        fondo.addEventListener('click', function (evento) {
            if (evento.target === fondo) cerrarHojaHabito();
        });
    }

    document.addEventListener('keydown', function (evento) {
        if (evento.key === 'Escape') cerrarHojaHabito();
    });
}

function agregarHabito() {
    const input = document.getElementById('nuevoHabito');
    if (!input) return;

    const nombre = input.value.trim();
    if (!nombre) {
        alert('Escribe el nombre del hábito.');
        input.focus();
        return;
    }

    const habitos = leerHabitos();
    const repetido = habitos.some(function (habito) {
        return normalizarNombreHabito(habito.nombre) === normalizarNombreHabito(nombre);
    });
    if (repetido) {
        alert('Ese hábito ya existe.');
        return;
    }

    habitos.push({
        id: VA.datos.uuid(),
        nombre: nombre,
        dias: [],
        tipo: tipoDeHabito({ nombre: nombre }),
        created_at: VA.datos.ahoraISO()
    });
    guardarHabitos(habitos);
    input.value = '';
    renderizarHabitos();
    renderizarCalendarioSemana();
    renderizarCatalogoHabitos();
    indiceRecomendacionHabito = 0;
    actualizarRecomendacionHabito();
}

function alternarHabito(id) {
    const hoy = obtenerFechaHoy();
    const habitos = leerHabitos();
    const habito = habitos.find(function (h) { return String(h.id) === String(id); });
    if (!habito) return;

    const dias = diasHabito(habito);
    const indice = dias.indexOf(hoy);
    const estabaHecho = indice >= 0;

    if (estabaHecho) dias.splice(indice, 1); else dias.push(hoy);

    // Al marcar y al desmarcar, actualizar updated_at: así la
    // sincronización no “resucita” la marca y la racha baja de verdad.
    const ahora = typeof VA.datos.ahoraISO === 'function' ? VA.datos.ahoraISO() : new Date().toISOString();
    const actualizado = Object.assign({}, habito, { dias: dias, updated_at: ahora });
    const otros = habitos.filter(function (h) { return String(h.id) !== String(id); });

    guardarHabitos(habitos.map(function (h) {
        return String(h.id) === String(id) ? actualizado : h;
    }));
    renderizarHabitos();
    renderizarCalendarioSemana();

    // La tarjeta de racha de la barra lateral también debe bajar al
    // desmarcar; si no, se queda mostrando la racha vieja.
    if (window.VA && VA.ui && typeof VA.ui.actualizar === 'function') {
        VA.ui.actualizar();
    }

    // Al desmarcar no se muestra ningún mensaje: nada de reproches.
    if (estabaHecho) return;

    const racha = calcularRachaHabito(actualizado);
    const primeroDelDia = otros.every(function (h) {
        return diasHabito(h).indexOf(hoy) < 0;
    });
    const ultimoDia = ultimoDiaAntesDeHoy(actualizado, hoy);
    const regreso = ultimoDia && diferenciaDiasISO(ultimoDia, hoy) >= 2;

    if (HITOS_HABITO[racha] && !hitoYaMostrado(id, racha, hoy)) {
        recordarHito(id, racha, hoy);
        mostrarToastHabito(HITOS_HABITO[racha], 'hito');
    } else if (regreso) {
        mostrarToastHabito(elegirMensajeHabito('regreso'));
    } else if (tipoDeHabito(actualizado) === 'reducir') {
        mostrarToastHabito(elegirMensajeHabito('reducir'));
    } else {
        mostrarToastHabito(elegirMensajeHabito(primeroDelDia ? 'primero' : 'construir'));
    }
}

function diasHabito(habito) {
    return Array.isArray(habito.dias) ? habito.dias.slice() : [];
}

function eliminarHabito(id) {
    const habitos = leerHabitos();
    const habito = habitos.find(function (h) { return String(h.id) === String(id); });
    if (!habito) return;
    if (!confirm('¿Eliminar el hábito "' + habito.nombre + '"?')) return;

    guardarHabitos(habitos.filter(function (h) { return String(h.id) !== String(id); }));
    renderizarHabitos();
    renderizarCalendarioSemana();
    renderizarCatalogoHabitos();
    indiceRecomendacionHabito = 0;
    actualizarRecomendacionHabito();
}

function calcularRachaHabito(habito) {
    const dias = diasHabito(habito);
    let racha = 0;
    const cursor = new Date();

    // Si hoy todavía no está marcado, la racha se mide hasta ayer.
    // Así, al desmarcar el día, la racha baja un día (4 → 3) en lugar
    // de desaparecer por completo.
    if (dias.indexOf(fechaISO(cursor)) < 0) {
        cursor.setDate(cursor.getDate() - 1);
    }

    while (dias.indexOf(fechaISO(cursor)) >= 0) {
        racha += 1;
        cursor.setDate(cursor.getDate() - 1);
    }

    return racha;
}

function renderizarHabitos() {
    const lista = document.getElementById('listaHabitos');
    if (!lista) return;

    const habitos = leerHabitos();
    const hoy = obtenerFechaHoy();
    const hechos = habitos.filter(function (h) { return diasHabito(h).indexOf(hoy) >= 0; }).length;

    const resumenCard = document.getElementById('resumenHabitosCard');
    if (resumenCard) resumenCard.hidden = !habitos.length;

    const hechosEl = document.getElementById('hechosHabitosHoy');
    if (hechosEl) hechosEl.textContent = hechos;

    const totalEl = document.getElementById('totalHabitosHoy');
    if (totalEl) totalEl.textContent = habitos.length;

    const porcentaje = habitos.length ? Math.round(hechos / habitos.length * 100) : 0;
    const porcentajeEl = document.getElementById('porcentajeHabitos');
    if (porcentajeEl) porcentajeEl.textContent = porcentaje + '%';

    const barra = document.getElementById('barraHabitos');
    if (barra) barra.style.width = porcentaje + '%';

    const barraContenedor = document.getElementById('barraHabitosContenedor');
    if (barraContenedor) barraContenedor.setAttribute('aria-valuenow', String(porcentaje));

    if (!habitos.length) {
        lista.innerHTML = '<p class="lista-vacia">Todavía no registras hábitos. Empieza con uno pequeño, como "caminar 10 minutos".</p>';
    } else {
        const icoLocal = function (id) {
            return window.VA && typeof VA.icono === 'function' ? VA.icono(id) : '';
        };
        lista.innerHTML = habitos.map(function (habito) {
            const hecho = diasHabito(habito).indexOf(hoy) >= 0;
            const racha = calcularRachaHabito(habito);
            const esReducir = tipoDeHabito(habito) === 'reducir';
            const mostrarRacha = racha > 1 || (esReducir && racha === 1);
            const insignia = mostrarRacha
                ? '<span class="habit-streak">' + icoLocal(esReducir ? 'i-shield' : 'i-flame') + ' ' + racha + '</span>'
                : '';
            const iconoHab = window.VA && VA.iconoHabito ? VA.iconoHabito(habito) : 'i-check';
            const nombre = escaparHTML(habito.nombre);
            const id = escaparHTML(habito.id);

            return '<div class="item-habito' + (hecho ? ' hecho' : '') + '">' +
                '<button type="button" class="check-habito' + (hecho ? ' hecho' : '') + '" onclick="alternarHabito(\'' + id + '\')" aria-pressed="' + (hecho ? 'true' : 'false') + '" aria-label="' + (hecho ? 'Desmarcar' : 'Marcar') + ' ' + nombre + '">' +
                    icoLocal('i-check') + (hecho ? '' : '') +
                '</button>' +
                '<span class="habit-copy"><strong>' + nombre + '</strong><small>' + icoLocal(iconoHab) + ' ' + (hecho ? 'Hecho hoy' : 'Pendiente hoy') + '</small></span>' +
                insignia +
                '<button class="btn-eliminar" title="Eliminar" onclick="eliminarHabito(\'' + id + '\')">' + icoLocal('i-trash') + '</button>' +
            '</div>';
        }).join('');
    }

    actualizarMensajeMotivacional(habitos, hechos);
}

function actualizarMensajeMotivacional(habitos, hechos) {
    const mensaje = document.getElementById('mensajeMotivacional');
    if (!mensaje) return;

    const todos = habitos.length > 0 && hechos === habitos.length;
    mensaje.classList.toggle('completo', todos);

    if (!habitos.length) {
        mensajeCompletoActual = '';
        mensaje.textContent = '';
        return;
    }

    if (todos) {
        if (!mensajeCompletoActual) mensajeCompletoActual = elegirMensajeHabito('completo');
        mensaje.textContent = mensajeCompletoActual;
        return;
    }

    mensajeCompletoActual = '';
    mensaje.textContent = hechos === 0
        ? 'Marca lo que ya hiciste. Sin prisa.'
        : 'Lo que llevas hoy ya cuenta.';
}

function renderizarCalendarioSemana() {
    const contenedor = document.getElementById('calendarioSemana');
    if (!contenedor) return;

    const habitos = leerHabitos();
    const hoy = obtenerFechaHoy();
    const inicio = obtenerLunes();
    const letras = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
    const dias = [];

    for (let i = 0; i < 7; i++) {
        const fecha = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + i);
        const iso = fechaISO(fecha);
        const hechos = habitos.filter(function (h) { return diasHabito(h).indexOf(iso) >= 0; }).length;
        const completo = habitos.length > 0 && hechos === habitos.length;

        dias.push(
            '<div class="day' + (completo ? ' hecho' : '') + (iso === hoy ? ' hoy' : '') + '" title="' + hechos + ' de ' + habitos.length + ' hábitos">' +
                '<span>' + letras[i] + '</span>' +
                '<strong>' + fecha.getDate() + '</strong>' +
            '</div>'
        );
    }

    contenedor.innerHTML = dias.join('');
}

function iniciarHabitos() {
    const input = document.getElementById('nuevoHabito');
    if (!input) return;

    input.addEventListener('keydown', function (evento) {
        if (evento.key === 'Enter') {
            evento.preventDefault();
            agregarHabito();
        }
    });

    renderizarHabitos();
    renderizarCalendarioSemana();
    iniciarCatalogoHabitos();
    iniciarAjustesHabito();
}

document.addEventListener('DOMContentLoaded', iniciarHabitos);

// ===== PROGRESO Y PANEL PRINCIPAL =====
function leerEntrenamientos() {
    return VA.datos.entrenamientos.listar();
}

function leerTodoComidas() {
    return VA.datos.comidas.obtenerTodo();
}

function normalizarRegistro(registro) {
    registro = registro || {};
    return {
        desayuno: registro.desayuno || [],
        almuerzo: registro.almuerzo || [],
        cena: registro.cena || []
    };
}

function contarComidas(registro) {
    const normalizado = normalizarRegistro(registro);
    return COMIDAS_DIA.reduce(function (total, comida) {
        return total + normalizado[comida].length;
    }, 0);
}

function calcularCaloriasRegistro(registro) {
    const normalizado = normalizarRegistro(registro);
    return COMIDAS_DIA.reduce(function (total, comida) {
        return total + normalizado[comida].reduce(function (suma, item) {
            return suma + (Number(item.kcal) || 0);
        }, 0);
    }, 0);
}

function obtenerDiasActividad() {
    const dias = new Set();

    leerEntrenamientos().forEach(function (entrenamiento) {
        if (entrenamiento.fecha) dias.add(entrenamiento.fecha);
    });

    const comidas = leerTodoComidas();
    Object.keys(comidas).forEach(function (fecha) {
        if (contarComidas(comidas[fecha]) > 0) dias.add(fecha);
    });

    leerHabitos().forEach(function (habito) {
        diasHabito(habito).forEach(function (fecha) { dias.add(fecha); });
    });

    return dias;
}

function calcularRachaMaxima(dias) {
    const ordenadas = Array.from(dias).sort();
    let maxima = 0;
    let actual = 0;
    let anterior = null;

    ordenadas.forEach(function (iso) {
        const fecha = new Date(iso + 'T12:00:00');
        actual = anterior && (fecha - anterior) === 86400000 ? actual + 1 : 1;
        anterior = fecha;
        maxima = Math.max(maxima, actual);
    });

    return maxima;
}

function calcularRachaActual(dias) {
    const cursor = new Date();
    if (!dias.has(fechaISO(cursor))) cursor.setDate(cursor.getDate() - 1);

    let racha = 0;
    while (dias.has(fechaISO(cursor))) {
        racha += 1;
        cursor.setDate(cursor.getDate() - 1);
    }

    return racha;
}

function formatearFechaCorta(iso) {
    return new Date(iso + 'T12:00:00').toLocaleDateString('es-MX', {
        weekday: 'short', day: 'numeric', month: 'short'
    });
}

function construirHistorial() {
    const actividades = [];

    leerEntrenamientos().forEach(function (entrenamiento) {
        actividades.push({
            fecha: entrenamiento.fecha,
            orden: 0,
            texto: 'Entrenamiento: ' + (entrenamiento.rutina_nombre || entrenamiento.rutina) + ' · ' + entrenamiento.minutos + ' min'
        });
    });

    const comidas = leerTodoComidas();
    Object.keys(comidas).forEach(function (fecha) {
        const numero = contarComidas(comidas[fecha]);
        if (!numero) return;

        actividades.push({
            fecha: fecha,
            orden: 1,
            texto: numero + ' alimento' + (numero === 1 ? '' : 's') +
                ' · ' + calcularCaloriasRegistro(comidas[fecha]) + ' kcal' +
                ' · ' + formatearPesos(calcularGasto(normalizarRegistro(comidas[fecha])))
        });
    });

    const porFecha = {};
    leerHabitos().forEach(function (habito) {
        diasHabito(habito).forEach(function (fecha) {
            porFecha[fecha] = (porFecha[fecha] || 0) + 1;
        });
    });

    Object.keys(porFecha).forEach(function (fecha) {
        actividades.push({
            fecha: fecha,
            orden: 2,
            texto: porFecha[fecha] + ' hábito' + (porFecha[fecha] === 1 ? '' : 's') + ' completado' + (porFecha[fecha] === 1 ? '' : 's')
        });
    });

    return actividades
        .sort(function (a, b) {
            if (a.fecha !== b.fecha) return a.fecha < b.fecha ? 1 : -1;
            return a.orden - b.orden;
        })
        .slice(0, 8);
}

function iniciarProgreso() {
    const totalEntrenamientosEl = document.getElementById('totalEntrenamientos');
    if (!totalEntrenamientosEl) return;

    const entrenamientos = leerEntrenamientos();
    const habitos = leerHabitos();
    const dias = obtenerDiasActividad();

    totalEntrenamientosEl.textContent = entrenamientos.length;

    const minutos = entrenamientos.reduce(function (total, item) {
        return total + (Number(item.minutos) || 0);
    }, 0);
    document.getElementById('totalMinutos').textContent = minutos;

    const totalHabitosEl = document.getElementById('totalHabitos');
    if (totalHabitosEl) totalHabitosEl.textContent = habitos.length;
    document.getElementById('rachaMaxima').textContent = calcularRachaMaxima(dias) + ' días';

    // Semana Propuesta + logros.
    const semana = document.getElementById('semanaProgreso');
    if (semana) {
        const hoyISO = obtenerFechaHoy();
        const inicio = obtenerLunes();
        const letras = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
        let conActividad = 0;
        const celdas = [];
        for (let i = 0; i < 7; i++) {
            const fecha = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + i);
            const iso = fechaISO(fecha);
            const hecho = dias.has(iso);
            if (hecho) conActividad += 1;
            celdas.push(
                '<div class="day' + (hecho ? ' hecho' : '') + (iso === hoyISO ? ' hoy' : '') + '">' +
                    '<span>' + letras[i] + '</span><strong>' + fecha.getDate() + '</strong>' +
                '</div>'
            );
        }
        semana.innerHTML = celdas.join('');
        const resumenSemana = document.getElementById('resumenSemanaProgreso');
        if (resumenSemana) resumenSemana.textContent = conActividad + ' de 7 días';
    }

    const rachaMaxima = calcularRachaMaxima(dias);
    const logros = {
        logroPrimero: entrenamientos.length >= 1,
        logroSemana: rachaMaxima >= 7,
        logroMes: rachaMaxima >= 30
    };
    Object.keys(logros).forEach(function (id) {
        const medalla = document.getElementById(id);
        if (medalla) medalla.classList.toggle('apagado', !logros[id]);
    });

    const historial = construirHistorial();
    const contenedor = document.getElementById('listaHistorial');

    if (!historial.length) {
        contenedor.innerHTML = '<p class="sin-datos">Aún no tienes actividad registrada. ¡Empieza hoy!</p>';
        return;
    }

    contenedor.innerHTML = historial.map(function (actividad) {
        return `
            <div class="item-historial">
                <span>${escaparHTML(actividad.texto)}</span>
                <span class="fecha">${formatearFechaCorta(actividad.fecha)}</span>
            </div>
        `;
    }).join('');
}

document.addEventListener('DOMContentLoaded', iniciarProgreso);

function iniciarPanelPrincipal() {
    const fechaEl = document.getElementById('fechaActual');
    if (!fechaEl) return;

    const hoy = new Date();
    const iso = fechaISO(hoy);
    const perfil = VA.datos.perfil.obtener();

    fechaEl.textContent = hoy.toLocaleDateString('es-MX', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });

    const saludo = document.getElementById('saludoPrincipal');
    if (saludo) {
        const nombre = perfil && perfil.nombre ? perfil.nombre.trim() : '';
        const hora = hoy.getHours();
        const saludoHora = hora < 13 ? 'Buenos días' : (hora < 20 ? 'Buenas tardes' : 'Buenas noches');
        saludo.textContent = nombre ? saludoHora + ', ' + nombre : '¡Bienvenido!';
    }

    const habitos = leerHabitos();
    const hechos = habitos.filter(function (h) { return diasHabito(h).indexOf(iso) >= 0; }).length;
    const totalHabitos = habitos.length;
    const porcentaje = totalHabitos ? Math.round(hechos / totalHabitos * 100) : 0;
    const racha = calcularRachaActual(obtenerDiasActividad());

    function fijar(id, texto) {
        const el = document.getElementById(id);
        if (el) el.textContent = texto;
    }

    fijar('resumen-habitos', hechos + '/' + totalHabitos);

    const entrenamientosHoy = leerEntrenamientos().filter(function (e) { return e.fecha === iso; });
    const entrenado = entrenamientosHoy.length > 0;
    fijar('resumen-entrenamiento', entrenado ? 'Completado' : 'Pendiente');

    const comidas = leerTodoComidas();
    const calorias = calcularCaloriasRegistro(comidas[iso]);
    const meta = (perfil && perfil.calorias_objetivo) || CALORIAS_META;
    fijar('resumen-calorias', calorias.toLocaleString('es-MX') + ' / ' + meta.toLocaleString('es-MX') + ' kcal');
    fijar('resumen-racha', racha + (racha === 1 ? ' día' : ' días'));

    // Hero Propuesta: anillo, textos y chips.
    fijar('heroPct', porcentaje + '%');
    const anillo = document.getElementById('heroRing');
    if (anillo) {
        const C = 2 * Math.PI * 58;
        anillo.setAttribute('stroke-dasharray', String(C));
        anillo.style.strokeDashoffset = String(C * (1 - porcentaje / 100));
    }
    fijar('heroRacha', racha + (racha === 1 ? ' día' : ' días') + ' de racha');
    fijar('heroHabitos', hechos + '/' + totalHabitos + ' hábitos');
    const heroTitulo = document.getElementById('heroTitulo');
    if (heroTitulo) {
        heroTitulo.textContent = !totalHabitos
            ? 'Empecemos hoy'
            : porcentaje === 100 ? '¡Día completo!'
            : porcentaje >= 50 ? 'Vas muy bien'
            : 'Un paso a la vez';
    }
    const heroTexto = document.getElementById('heroTexto');
    if (heroTexto) {
        heroTexto.textContent = !totalHabitos
            ? 'Agrega tu primer hábito y marca tu día.'
            : porcentaje === 100
                ? 'Completaste todos tus hábitos. Mañana seguimos.'
                : 'Completaste ' + hechos + ' de ' + totalHabitos + '. Te faltan ' + (totalHabitos - hechos) + ' para cerrar el día.';
    }

    renderizarSemanaPrincipal();
    actualizarRecordatorioDieta();
}

function renderizarSemanaPrincipal() {
    const contenedor = document.getElementById('semanaPrincipal');
    if (!contenedor) return;

    const habitos = leerHabitos();
    const diasActividad = obtenerDiasActividad();
    const hoy = obtenerFechaHoy();
    const inicio = obtenerLunes();
    const letras = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];
    let conActividad = 0;
    const celdas = [];

    for (let i = 0; i < 7; i++) {
        const fecha = new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate() + i);
        const iso = fechaISO(fecha);
        const hecho = diasActividad.has(iso);
        if (hecho) conActividad += 1;
        celdas.push(
            '<div class="day' + (hecho ? ' hecho' : '') + (iso === hoy ? ' hoy' : '') + '">' +
                '<span>' + letras[i] + '</span><strong>' + fecha.getDate() + '</strong>' +
            '</div>'
        );
    }

    contenedor.innerHTML = celdas.join('');
    const resumen = document.getElementById('semanaResumen');
    if (resumen) resumen.textContent = conActividad + ' de 7 días';
}

document.addEventListener('DOMContentLoaded', iniciarPanelPrincipal);

// ===== PERFIL Y PLAN PERSONALIZADO =====
function leerPerfilFormulario() {
    function valor(id) {
        const campo = document.getElementById(id);
        return campo ? campo.value : '';
    }

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

function validarPerfil(perfil) {
    if (!perfil.nombre) return 'Escribe tu nombre.';
    if (!(perfil.edad >= 12 && perfil.edad <= 100)) return 'La edad debe estar entre 12 y 100 años.';
    if (!(perfil.peso_kg >= 30 && perfil.peso_kg <= 300)) return 'El peso debe estar entre 30 y 300 kg.';
    if (!(perfil.estatura_cm >= 100 && perfil.estatura_cm <= 250)) return 'La estatura debe estar entre 100 y 250 cm.';
    if (perfil.peso_meta_kg && !(perfil.peso_meta_kg >= 30 && perfil.peso_meta_kg <= 300)) {
        return 'El peso objetivo debe estar entre 30 y 300 kg.';
    }
    return '';
}

function mostrarEstadoPerfil(mensaje, tipo) {
    const estado = document.getElementById('estadoPerfil');
    if (!estado) return;
    estado.textContent = mensaje;
    estado.className = 'estado-perfil ' + (tipo || '');
}

function calcularYMostrarCaloriasPerfil() {
    const perfil = leerPerfilFormulario();
    const calorias = VA.datos.calcularCaloriasObjetivo(perfil);
    const destino = document.getElementById('caloriasObjetivo');
    if (destino) destino.textContent = calorias.toLocaleString('es-MX') + ' kcal/día';
    return calorias;
}

function cargarPerfil() {
    const perfil = VA.datos.perfil.obtener();
    if (!perfil) {
        calcularYMostrarCaloriasPerfil();
        return;
    }

    const campos = {
        nombre: perfil.nombre,
        edad: perfil.edad || '',
        sexo: perfil.sexo || 'prefiero_no_decir',
        peso: perfil.peso_kg || '',
        estatura: perfil.estatura_cm || '',
        actividad: perfil.actividad || 'moderado',
        objetivo: perfil.objetivo || 'mantener',
        pesoMeta: perfil.peso_meta_kg || ''
    };

    Object.keys(campos).forEach(function (id) {
        const campo = document.getElementById(id);
        if (campo) campo.value = campos[id];
    });

    calcularYMostrarCaloriasPerfil();
}

async function guardarPerfil() {
    const perfil = leerPerfilFormulario();
    const error = validarPerfil(perfil);
    if (error) {
        mostrarEstadoPerfil(error, 'error');
        return;
    }

    const guardado = VA.datos.perfil.guardar(Object.assign({}, perfil, {
        onboarding_completado: true
    }));

    if (!guardado) {
        mostrarEstadoPerfil('No se pudo guardar el perfil. Revisa el almacenamiento del navegador.', 'error');
        return;
    }

    calcularYMostrarCaloriasPerfil();

    if (VA.auth.configurado()) {
        mostrarEstadoPerfil('Guardando en Supabase…', '');

        try {
            await VA.datos.perfil.guardarRemoto(guardado);
            mostrarEstadoPerfil('Perfil guardado y sincronizado con Supabase.', 'exito');
        } catch (errorRemoto) {
            console.error('VidaActiva: no se pudo sincronizar el perfil.', errorRemoto);
            mostrarEstadoPerfil(
                'Perfil guardado en este dispositivo, pero no se pudo sincronizar con Supabase. Revisa tu conexión e inténtalo de nuevo.',
                'error'
            );
        }
        return;
    }

    mostrarEstadoPerfil('Perfil guardado. Tus metas se actualizarán en toda la app.', 'exito');
}

function iniciarPerfil() {
    if (!document.getElementById('nombre') || !document.getElementById('formPerfil')) return;

    cargarPerfil();

    ['nombre', 'edad', 'sexo', 'peso', 'estatura', 'actividad', 'objetivo', 'pesoMeta'].forEach(function (id) {
        const campo = document.getElementById(id);
        if (!campo) return;
        campo.addEventListener('input', calcularYMostrarCaloriasPerfil);
        campo.addEventListener('change', calcularYMostrarCaloriasPerfil);
    });
}

document.addEventListener('DOMContentLoaded', iniciarPerfil);

function cargarPlanDieta() {
    if (!document.getElementById('formularioDieta')) return;

    cargarListasDieta();
    inicializarDialogoCambio();
    actualizarCamposPorSexo();
    mostrarOtrasAlergias();
    document.addEventListener('click', cerrarMultisDietaAlClicFuera);

    const plan = VA.datos.plan.obtener();
    if (plan && plan.presupuesto) {
        const asignar = function (id, valor) {
            const campo = document.getElementById(id);
            if (campo && valor) campo.value = valor;
        };

        asignar('presupuesto', plan.presupuesto);
        asignar('colaciones', plan.colaciones);
        if (plan.horarios) {
            asignar('horarioDesayuno', plan.horarios.desayuno);
            asignar('horarioComida', plan.horarios.comida);
            asignar('horarioCena', plan.horarios.cena);
            asignar('horarioColacion1', plan.horarios.colacion1);
            asignar('horarioColacion2', plan.horarios.colacion2);
        }
    }

    mostrarColaciones();

    if (plan && Array.isArray(plan.menu_semana) && plan.menu_semana.length) {
        planDietaActual = plan.menu_semana;
        perfilDietaActual = null;
        diaDietaActual = 0;
        renderizarPlanDieta();
    }
}

document.addEventListener('DOMContentLoaded', cargarPlanDieta);