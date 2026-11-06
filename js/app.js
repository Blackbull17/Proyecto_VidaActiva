// ===== CAMBIO FÍSICO Y GENERACIÓN DE DIETA =====
function mostrarOtrasEnfermedades() {
    const select = document.getElementById('tieneEnfermedad');
    const div = document.getElementById('otraEnfermedadDiv');
    div.style.display = select.value === 'otra' ? 'block' : 'none';
}

function mostrarOtrasAlergias() {
    const select = document.getElementById('tieneAlergia');
    const div = document.getElementById('otraAlergiaDiv');
    div.style.display = select.value === 'otra' ? 'block' : 'none';
}

function mostrarColaciones() {
    const select = document.getElementById('colaciones');
    const div = document.getElementById('colacionesDiv');
    const etiqueta2 = document.getElementById('etiquetaColacion2');
    const horario2 = document.getElementById('horarioColacion2');
    
    div.style.display = select.value !== 'no' ? 'block' : 'none';
    
    if (select.value === 'dos') {
        etiqueta2.style.display = 'block';
        horario2.style.display = 'block';
    } else {
        etiqueta2.style.display = 'none';
        horario2.style.display = 'none';
    }
}

function generarDieta() {
    const enfermedad = document.getElementById('tieneEnfermedad').value;
    const otraEnfermedad = document.getElementById('otraEnfermedad').value;
    const alergia = document.getElementById('tieneAlergia').value;
    const presupuesto = document.getElementById('presupuesto').value;
    const colaciones = document.getElementById('colaciones').value;
    const hDesayuno = document.getElementById('horarioDesayuno').value;
    const hComida = document.getElementById('horarioComida').value;
    const hCena = document.getElementById('horarioCena').value;
    const hCol1 = document.getElementById('horarioColacion1').value;
    const hCol2 = document.getElementById('horarioColacion2').value;

    // Definir dietas según condición médica
    let recomendaciones = obtenerRecomendaciones(enfermedad);
    let opcionesComida = obtenerMenuPorPresupuesto(presupuesto, enfermedad, alergia);
    let mensajePresupuesto = obtenerMensajePresupuesto(presupuesto);
    let indicadorPresupuesto = construirIndicadorPresupuesto(presupuesto, colaciones);

    guardarPlanDieta(presupuesto, colaciones);

    function icoDieta(id) {
        return window.VA && VA.icono ? VA.icono(id) : '';
    }

    // Construir horarios
    let horariosHTML = '<p><strong>Desayuno:</strong> ' + hDesayuno + '</p>' +
        '<p><strong>Comida:</strong> ' + hComida + '</p>' +
        '<p><strong>Cena:</strong> ' + hCena + '</p>';
    if (colaciones === 'una') {
        horariosHTML += '<p><strong>Colación:</strong> ' + hCol1 + '</p>';
    } else if (colaciones === 'dos') {
        horariosHTML += '<p><strong>Colación mañana:</strong> ' + hCol1 + '</p>' +
            '<p><strong>Colación tarde:</strong> ' + hCol2 + '</p>';
    }

    // Mostrar resultado
    const resultado = document.getElementById('resultadoDieta');
    resultado.style.display = 'block';
    resultado.innerHTML =
        '<div class="card" style="border-left:4px solid var(--green-500);">' +
            '<h2>' + icoDieta('i-check') + ' Tu dieta está lista</h2>' +
            '<h3>' + icoDieta('i-shield') + ' Consideraciones de salud</h3>' +
            '<p>' + recomendaciones + '</p>' +
            '<h3>' + icoDieta('i-scale') + ' Tu presupuesto</h3>' +
            '<p>' + mensajePresupuesto + '</p>' +
            '<h3>' + icoDieta('i-chart') + ' Indicador de presupuesto</h3>' +
            indicadorPresupuesto +
            '<h3>' + icoDieta('i-clock') + ' Horarios de comida</h3>' +
            horariosHTML +
            '<h3>' + icoDieta('i-food') + ' Menú sugerido del día</h3>' +
            '<div class="recomendacion-comida card" style="margin-top:10px;">' +
                '<p><strong>Desayuno</strong><br>' + opcionesComida.desayuno + '</p>' +
                (colaciones !== 'no' ? '<p><strong>Colación mañana</strong><br>' + opcionesComida.colacion1 + '</p>' : '') +
                '<p><strong>Comida</strong><br>' + opcionesComida.comida + '</p>' +
                (colaciones === 'dos' ? '<p><strong>Colación tarde</strong><br>' + opcionesComida.colacion2 + '</p>' : '') +
                '<p><strong>Cena</strong><br>' + opcionesComida.cena + '</p>' +
            '</div>' +
            '<p class="perfil-ayuda" style="margin-top:15px;">' +
                'Recuerda: Esta es una sugerencia general. Si tienes condiciones médicas específicas, ' +
                'consulta siempre con un nutricionista profesional.' +
            '</p>' +
        '</div>';
    resultado.scrollIntoView({ behavior: 'smooth' });
}

function obtenerRecomendaciones(enfermedad) {
    switch(enfermedad) {
        case 'diabetes':
            return 'Se ha diseñado una dieta baja en azúcares simples y carbohidratos refinados, con énfasis en vegetales, proteínas magras y porciones controladas de cereales integrales. Distribuiremos los alimentos para mantener estables tus niveles de glucosa.';
        case 'hipertension':
            return 'Tu dieta será baja en sal y sodio. Evitaremos alimentos procesados y enlatados, priorizando alimentos frescos. Se recomienda incluir alimentos ricos en potasio como plátano, espinaca y aguacate.';
        case 'gastritis':
            return 'Se han evitado alimentos irritantes como picantes, café, grasas abundantes y alimentos muy ácidos. Optaremos por preparaciones suaves: al vapor, cocidas, al horno, sin exceso de condimentos.';
        case 'colesterol':
            return 'Dieta baja en grasas saturadas y colesterol. Incluiremos más fibra, legumbres, pescado y aceite de oliva. Reduciremos carnes rojas, embutidos y productos lácteos enteros.';
        case 'tiroides':
            return 'Se han incluido alimentos ricos en yodo como pescados, mariscos y sal yodada, además de proteínas y vegetales. Algunos vegetales como coliflor o repollo se consumirán cocidos y en moderación.';
        case 'celiaquia':
            return 'Todos los alimentos sugeridos son libres de trigo, centeno y cebada. Revisa siempre las etiquetas de los productos empaquetados.';
        case 'intolerancia_lactosa':
            return 'Se han sustituido los lácteos por alternativas como leche de almendras, soya o avena, y quesos y yogures sin lactosa.';
        case 'otra':
            return 'Se ha tomado en cuenta tu condición especial. Recuerda que estas recomendaciones son generales y complementarias a lo que indique tu médico tratante.';
        default:
            return '¡Excelente! Sin condiciones médicas especiales. Seguiremos una dieta equilibrada y variada que incluya todos los grupos de alimentos.';
    }
}

function obtenerMensajePresupuesto(presupuesto) {
    switch(presupuesto) {
        case 'economico':
            return 'Has elegido un presupuesto ajustado. Se priorizarán alimentos económicos pero nutritivos: legumbres, huevos, frutas y verduras de temporada, arroz y avena. Comprar al mayoreo y evitar productos procesados te ayudará a ahorrar más.';
        case 'medio':
            return 'Con tu presupuesto puedes comprar una buena variedad de alimentos frescos: pollo, pescado, frutas, verduras, cereales y lácteos. Una buena distribución te permitirá comer muy bien sin gastar de más.';
        case 'amplio':
            return 'Tienes un buen presupuesto disponible. Puedes incluir mayor variedad de proteínas, frutas variadas, y alimentos de mejor calidad nutricional.';
        case 'generoso':
            return 'Excelente presupuesto. Puedes elegir alimentos orgánicos, cortes de carne de mejor calidad, una amplia variedad de frutas, verduras y opciones saludables para cada momento del día.';
    }
}

function obtenerMenuPorPresupuesto(presupuesto, enfermedad, alergia) {
    // Menús base
    const menus = {
        economico: {
            desayuno: 'Avena con agua o leche sin lactosa • 1 plátano • 1 rebanada de pan integral',
            colacion1: '1 fruta de temporada (manzana, pera o plátano) • 1 vaso de agua simple',
            comida: 'Arroz • Frijoles • Huevo revuelto con nopales o espinaca • Ensalada de lechuga y jitomate • 1 tortilla',
            colacion2: 'Un puñado de zanahoria o pepino • 1 vaso de agua simple',
            cena: 'Sopa de verduras • Pan integral o tortillas • Fruta picada'
        },
        medio: {
            desayuno: '2 huevos (revueltos o cocidos) • 1 rebanada de pan integral o tortilla • 1 taza de fruta picada • Café o té sin azúcar',
            colacion1: '1 yogur natural • 1 manzana o pera',
            comida: 'Arroz integral • Pechuga de pollo a la plancha • Ensalada grande de lechuga, pepino, jitomate y aguacate • 2 tortillas',
            colacion2: 'Un puñado de nueces o almendras • 1 fruta',
            cena: 'Pescado o atún • Verduras al vapor • 1 porción pequeña de arroz o papa cocida'
        },
        amplio: {
            desayuno: 'Yogur griego con granola y fruta fresca • 1 rebanada de pan integral con aguacate • Café o té',
            colacion1: 'Batido de fruta con leche o bebida vegetal • 1 puñado de frutos secos',
            comida: 'Quinoa o arroz integral • Salmón o pechuga de pollo • Ensalada variada con aguacate y semillas • 1 fruta',
            colacion2: 'Hummus con bastones de zanahoria y apio • 1 té o infusión',
            cena: 'Tacos de pescado o ensalada de pollo • Sopa de verduras • Gelatina sin azúcar'
        },
        generoso: {
            desayuno: 'Tostada integral con aguacate y huevo pochado • Frutas variadas (fresas, arándanos, plátano) • Café con leche o té verde',
            colacion1: 'Smoothie bowl con frutas y semillas • 1 barra de cereal integral sin azúcar',
            comida: 'Arroz salvaje o quinoa • Salmón a la plancha con limón y eneldo • Verduras asadas • Ensalada verde con semillas • Postre: fruta fresca',
            colacion2: 'Yogur con miel y nueces • Galletas integrales sin azúcar • Infusión de hierbas',
            cena: 'Pechuga de pollo a las hierbas • Puré de papa natural • Brócoli al vapor • Ensalada fresca • 1 té de manzanilla'
        }
    };

    let menu = {...menus[presupuesto]};

    // Ajustes según enfermedades
    if (enfermedad === 'diabetes') {
        Object.keys(menu).forEach(k => {
            menu[k] = menu[k].replace(/azúcar/g, '').replace('pan integral', 'pan integral en porción moderada').replace('arroz ', 'arroz integral en porción moderada ');
        });
    }
    if (enfermedad === 'hipertension') {
        Object.keys(menu).forEach(k => {
            menu[k] = menu[k] + ' • Sin sal añadida';
        });
    }
    if (enfermedad === 'gastritis') {
        Object.keys(menu).forEach(k => {
            menu[k] = menu[k].replace('café', 'té de manzanilla o té suave').replace('picante', 'sin condimentos picantes');
        });
    }
    if (alergia === 'intolerancia_lactosa') {
        Object.keys(menu).forEach(k => {
            menu[k] = menu[k].replace('leche', 'leche sin lactosa o bebida vegetal').replace('yogur', 'yogur sin lactosa');
        });
    }
    if (alergia === 'frutos_secos') {
        Object.keys(menu).forEach(k => {
            menu[k] = menu[k].replace(/nueces|almendras|frutos secos/g, 'semillas de calabaza o girasol');
        });
    }

    return menu;
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

function guardarPlanDieta(presupuesto, colaciones) {
    const horarios = {};
    const campos = {
        horarioDesayuno: 'desayuno',
        horarioComida: 'comida',
        horarioCena: 'cena',
        horarioColacion1: 'colacion1',
        horarioColacion2: 'colacion2'
    };

    Object.keys(campos).forEach(function (id) {
        const campo = document.getElementById(id);
        if (campo && campo.value) horarios[campos[id]] = campo.value;
    });

    return VA.datos.plan.guardar({
        presupuesto: presupuesto,
        colaciones: colaciones,
        horarios: horarios,
        updated_at: VA.datos.ahoraISO()
    });
}

function leerPlanDieta() {
    return VA.datos.plan.obtener();
}

function construirIndicadorPresupuesto(presupuesto, colaciones) {
    const datos = PRESUPUESTOS[presupuesto] || PRESUPUESTOS.medio;
    const comidas = 3 + (colaciones === 'dos' ? 2 : (colaciones === 'una' ? 1 : 0));

    const semanal = datos.abierto
        ? 'más de ' + formatearPesos(datos.minimo)
        : formatearPesos(datos.minimo) + ' a ' + formatearPesos(datos.maximo);

    const diario = datos.abierto
        ? 'más de ' + formatearPesos(datos.minimo / 7)
        : formatearPesos(datos.minimo / 7) + ' a ' + formatearPesos(datos.maximo / 7);

    const porComida = datos.abierto
        ? 'más de ' + formatearPesos(datos.minimo / 7 / comidas)
        : formatearPesos(datos.minimo / 7 / comidas) + ' a ' + formatearPesos(datos.maximo / 7 / comidas);

    return '<div class="recomendacion-comida card" style="margin-top:10px;">' +
            '<p><strong>Presupuesto semanal:</strong> ' + semanal + '</p>' +
            '<p><strong>Equivalente por día:</strong> ' + diario + ' (entre 7 días)</p>' +
            '<p><strong>Repartido en ' + comidas + ' comidas:</strong> ' + porComida + ' por comida</p>' +
            '<p class="perfil-ayuda" style="margin-top:8px;">' +
                'Es una estimación a partir del rango que elegiste. Los precios reales cambian según la tienda y la región.' +
            '</p>' +
        '</div>';
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

    const actualizado = Object.assign({}, habito, { dias: dias });
    const otros = habitos.filter(function (h) { return String(h.id) !== String(id); });

    guardarHabitos(habitos.map(function (h) {
        return String(h.id) === String(id) ? actualizado : h;
    }));
    renderizarHabitos();
    renderizarCalendarioSemana();

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

    const plan = VA.datos.plan.obtener();
    if (!plan || !plan.presupuesto) return;

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

    if (typeof mostrarColaciones === 'function') mostrarColaciones();
}

document.addEventListener('DOMContentLoaded', cargarPlanDieta);