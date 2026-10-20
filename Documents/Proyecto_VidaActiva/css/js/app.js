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

    // Construir horarios
    let horariosHTML = `
        <p><strong>🌅 Desayuno:</strong> ${hDesayuno}</p>
        <p><strong>☀️ Comida:</strong> ${hComida}</p>
        <p><strong>🌙 Cena:</strong> ${hCena}</p>
    `;
    if (colaciones === 'una') {
        horariosHTML += `<p><strong>🍎 Colación:</strong> ${hCol1}</p>`;
    } else if (colaciones === 'dos') {
        horariosHTML += `
            <p><strong>🍎 Colación mañana:</strong> ${hCol1}</p>
            <p><strong>🥨 Colación tarde:</strong> ${hCol2}</p>
        `;
    }

    // Mostrar resultado
    const resultado = document.getElementById('resultadoDieta');
    resultado.style.display = 'block';
    resultado.innerHTML = `
        <div class="tarjeta" style="border-left: 4px solid #2f855a;">
            <h2 style="color:#2f855a; margin-top:0;">✅ Tu dieta está lista</h2>
            
            <h3>🩺 Consideraciones de salud</h3>
            <p>${recomendaciones}</p>
            
            <h3>💰 Tu presupuesto</h3>
            <p>${mensajePresupuesto}</p>
            
            <h3>⏰ Horarios de comida</h3>
            ${horariosHTML}
            
            <h3>🍽️ Menú sugerido del día</h3>
            <div style="background:#f7fafc; padding:15px; border-radius:8px;">
                <p><strong>🌅 Desayuno</strong><br>${opcionesComida.desayuno}</p>
                ${colaciones !== 'no' ? `<p><strong>🍎 Colación mañana</strong><br>${opcionesComida.colacion1}</p>` : ''}
                <p><strong>☀️ Comida</strong><br>${opcionesComida.comida}</p>
                ${colaciones === 'dos' ? `<p><strong>🥨 Colación tarde</strong><br>${opcionesComida.colacion2}</p>` : ''}
                <p><strong>🌙 Cena</strong><br>${opcionesComida.cena}</p>
            </div>
            
            <p style="margin-top:15px; font-size:0.85rem; color:#718096;">
                ⚠️ Recuerda: Esta es una sugerencia general. Si tienes condiciones médicas específicas, 
                consulta siempre con un nutricionista profesional.
            </p>
        </div>
    `;
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
            return '💡 Has elegido un presupuesto ajustado. Se priorizarán alimentos económicos pero nutritivos: legumbres, huevos, frutas y verduras de temporada, arroz y avena. Comprar al mayoreo y evitar productos procesados te ayudará a ahorrar más.';
        case 'medio':
            return '💡 Con tu presupuesto puedes comprar una buena variedad de alimentos frescos: pollo, pescado, frutas, verduras, cereales y lácteos. Una buena distribución te permitirá comer muy bien sin gastar de más.';
        case 'amplio':
            return '💡 Tienes un buen presupuesto disponible. Puedes incluir mayor variedad de proteínas, frutas variadas, y alimentos de mejor calidad nutricional.';
        case 'generoso':
            return '💡 Excelente presupuesto. Puedes elegir alimentos orgánicos, cortes de carne de mejor calidad, una amplia variedad de frutas, verduras y opciones saludables para cada momento del día.';
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