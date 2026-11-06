(function () {
    'use strict';

    // ===== DATOS: ZONAS, NIVELES Y CATÁLOGO =====
    const GRUPOS = {
        cuerpo_completo: { nombre: 'Cuerpo completo', icono: 'i-body' },
        brazos_hombros: { nombre: 'Brazos y hombros', icono: 'i-arm' },
        piernas: { nombre: 'Piernas', icono: 'i-leg' },
        pecho: { nombre: 'Pecho', icono: 'i-heart' },
        abdomen: { nombre: 'Abdomen', icono: 'i-core' },
        espalda: { nombre: 'Espalda', icono: 'i-back' }
    };

    function iconoGrupoEjercicio(clave) {
        if (window.VA && typeof VA.icono === 'function') {
            return VA.icono((GRUPOS[clave] || {}).icono || 'i-dumbbell');
        }
        return (GRUPOS[clave] || {}).icono || '';
    }

    function ico(id) {
        if (window.VA && typeof VA.icono === 'function') return VA.icono(id);
        return '';
    }

    const NIVELES = ['Principiante', 'Intermedio', 'Avanzado'];

    function ficha(nombre, grupos, equipo, impacto, descripcion, progresion, regresion) {
        return {
            nombre: nombre,
            grupos: grupos,
            equipo: equipo,
            impacto: impacto,
            descripcion: descripcion,
            progresion: progresion || '',
            regresion: regresion || ''
        };
    }

    const CATALOGO = {
        sentadilla_clasica: ficha(
            'Sentadillas clásicas',
            ['piernas', 'cuerpo_completo'],
            'Sin equipo',
            'Bajo',
            'Pies al ancho de los hombros. Baja como si te sentaras en una silla, con la espalda larga y las rodillas alineadas con los pies.',
            'Añade una pausa de 2 segundos abajo o usa una mochila ligera.',
            'Hazla sentándote y levantándote de una silla.'
        ),
        zancada_frontal: ficha(
            'Zancadas hacia adelante',
            ['piernas', 'cuerpo_completo'],
            'Sin equipo',
            'Medio',
            'Da un paso al frente y baja la rodilla trasera sin tocar el suelo. Empuja con la pierna delantera para volver.',
            'Añade peso ligero en las manos.',
            'Apoya una mano en la pared o haz un paso más corto.'
        ),
        saltos_tijera: ficha(
            'Saltos de tijera',
            ['cuerpo_completo'],
            'Sin equipo',
            'Alto',
            'Abre y cierra piernas y brazos a la vez, saltando suave y cayendo con las rodillas flexibles.',
            'Aumenta el ritmo sin perder el control.',
            'Haz el movimiento sin salto, abriendo y cerrando los pies.'
        ),
        escaladores: ficha(
            'Escaladores',
            ['cuerpo_completo', 'abdomen'],
            'Sin equipo',
            'Medio',
            'En plancha alta, lleva una rodilla al pecho y alterna a ritmo constante sin perder la espalda neutra.',
            'Aumenta la velocidad manteniendo la cadera estable.',
            'Hazlo lento o apoya las manos en una superficie elevada.'
        ),
        flexiones_inclinadas: ficha(
            'Flexiones inclinadas',
            ['pecho', 'brazos_hombros', 'cuerpo_completo'],
            'Silla o superficie firme',
            'Bajo',
            'Manos en una silla o superficie estable. Baja el pecho manteniendo el cuerpo recto y los codos cerca del torso.',
            'Baja la superficie para aumentar la dificultad.',
            'Usa una pared o apoya las rodillas.'
        ),
        flexiones_rodillas: ficha(
            'Flexiones con rodillas',
            ['pecho'],
            'Sin equipo',
            'Bajo',
            'Apoya las rodillas y mantén el cuerpo recto desde las rodillas hasta la cabeza. Baja el pecho con control.',
            'Pasa a flexiones inclinadas y luego a clásicas.',
            'Apoya las manos en una silla.'
        ),
        flexiones_clasicas: ficha(
            'Flexiones clásicas',
            ['pecho', 'brazos_hombros', 'cuerpo_completo'],
            'Sin equipo',
            'Medio',
            'Cuerpo recto, manos bajo los hombros. Baja hasta que el pecho casi toque el suelo y empuja sin arquear la espalda.',
            'Eleva los pies o reduce el descanso.',
            'Hazlas con rodillas o inclinadas.'
        ),
        flexiones_manos_separadas: ficha(
            'Flexiones con manos separadas',
            ['pecho', 'brazos_hombros'],
            'Sin equipo',
            'Medio',
            'Manos más abiertas que los hombros. Baja controlado y mantén el core firme.',
            'Baja más y sube de forma explosiva.',
            'Reduce la apertura o hazlas inclinadas.'
        ),
        flexiones_diamante: ficha(
            'Flexiones diamante',
            ['pecho', 'brazos_hombros', 'cuerpo_completo'],
            'Sin equipo',
            'Alto',
            'Manos juntas formando un diamante. Baja con los codos cerca del torso y empuja con fuerza.',
            'Eleva los pies para más dificultad.',
            'Hazlas con rodillas o inclinadas.'
        ),
        flexiones_declinadas: ficha(
            'Flexiones declinadas',
            ['pecho'],
            'Silla',
            'Alto',
            'Pies elevados en una silla. Mantén el cuerpo recto y baja el pecho con control.',
            'Eleva más los pies o añade una pausa abajo.',
            'Baja los pies al suelo.'
        ),
        aperturas_botellas: ficha(
            'Aperturas con botellas acostado',
            ['pecho'],
            'Botellas',
            'Bajo',
            'Tumbado, botellas en las manos. Abre los brazos y baja hasta sentir el pecho, sin forzar el hombro.',
            'Usa un peso ligeramente mayor.',
            'Haz el movimiento sin peso o con un recorrido más corto.'
        ),
        aperturas_peso: ficha(
            'Aperturas con peso acostado',
            ['pecho'],
            'Peso ligero',
            'Medio',
            'Tumbado, brazos abiertos con peso. Abre y cierra sin forzar el hombro y con los codos ligeramente flexionados.',
            'Aumenta el peso de forma progresiva.',
            'Reduce el peso o el recorrido.'
        ),
        press_suelo_botellas: ficha(
            'Press de pecho en el suelo con botellas',
            ['pecho'],
            'Botellas',
            'Bajo',
            'Tumbado, botellas a los lados del pecho. Empuja hacia arriba y baja controlado.',
            'Usa más peso o una pausa abajo.',
            'Reduce el peso y el recorrido.'
        ),
        press_suelo_peso: ficha(
            'Press de pecho en el suelo con peso',
            ['pecho'],
            'Peso ligero',
            'Medio',
            'Tumbado, peso a los lados del pecho. Codos a 45 grados y empuja sin arquear la espalda.',
            'Aumenta el peso o haz una pausa abajo.',
            'Reduce el peso o usa botellas.'
        ),
        curl_botellas: ficha(
            'Curl con botellas',
            ['brazos_hombros'],
            'Botellas',
            'Bajo',
            'Con una botella en cada mano, flexiona los codos sin mover los hombros ni balancear el torso.',
            'Usa botellas más pesadas o sube más lento.',
            'Hazlo sentado o con menos peso.'
        ),
        curl_mochila: ficha(
            'Curl con mochila/peso',
            ['brazos_hombros'],
            'Mochila o peso',
            'Medio',
            'Mochila cargada o peso. Flexiona el codo sin balancear el torso y baja con control.',
            'Añade peso o haz una pausa arriba.',
            'Reduce el peso o usa botellas.'
        ),
        curl_peso: ficha(
            'Curl con peso',
            ['brazos_hombros'],
            'Peso ligero',
            'Medio',
            'Codo fijo. Sube el peso sin balancear y baja despacio hasta extender el brazo.',
            'Aumenta el peso o alterna brazos.',
            'Reduce el peso o hazlo sentado.'
        ),
        curl_martillo: ficha(
            'Curl martillo',
            ['brazos_hombros'],
            'Botellas o peso',
            'Medio',
            'Codo fijo. Sube el peso con las palmas enfrentadas y baja con control.',
            'Aumenta el peso de forma progresiva.',
            'Reduce el peso o hazlo sentado.'
        ),
        elevaciones_laterales: ficha(
            'Elevaciones laterales con peso',
            ['brazos_hombros'],
            'Botellas o peso',
            'Bajo',
            'Brazos ligeramente flexionados. Sube las botellas hasta la altura de los hombros y baja con control.',
            'Aumenta ligeramente el peso.',
            'Reduce el recorrido o hazlo sin peso.'
        ),
        elevaciones_frontales: ficha(
            'Elevaciones frontales con peso',
            ['brazos_hombros'],
            'Botellas o peso',
            'Bajo',
            'Sube el peso al frente hasta la altura de los hombros, sin balanceo y con el core firme.',
            'Aumenta el peso o haz una pausa arriba.',
            'Reduce el peso o alterna brazos.'
        ),
        circulos_brazos: ficha(
            'Círculos con los brazos',
            ['brazos_hombros'],
            'Sin equipo',
            'Bajo',
            'Brazos abiertos. Dibuja círculos pequeños y controlados, primero hacia delante y luego hacia atrás.',
            'Haz círculos más grandes o más lentos.',
            'Haz círculos más pequeños.'
        ),
        fondos_silla: ficha(
            'Fondos en silla',
            ['brazos_hombros'],
            'Silla firme',
            'Medio',
            'Manos en el borde de una silla. Baja el cuerpo flexionando los codos y empuja para subir.',
            'Estira más las piernas o eleva los pies.',
            'Acerca los pies al cuerpo.'
        ),
        fondos_piernas_estiradas: ficha(
            'Fondos en silla con piernas estiradas',
            ['brazos_hombros'],
            'Silla firme',
            'Alto',
            'Fondos en silla con las piernas estiradas. Baja controlado y empuja con los tríceps.',
            'Eleva los pies en otra silla.',
            'Flexiona las piernas.'
        ),
        dominadas: ficha(
            'Dominadas',
            ['espalda', 'brazos_hombros'],
            'Barra',
            'Alto',
            'Agarre firme en la barra. Tira del cuerpo hasta pasar la barbilla por encima y baja con control.',
            'Añade peso o sube más lento.',
            'Usa una banda elástica o haz dominadas asistidas.'
        ),
        patada_triceps: ficha(
            'Patada de tríceps con peso',
            ['brazos_hombros'],
            'Botellas o peso',
            'Medio',
            'Inclina el torso y mantén el codo pegado al cuerpo. Extiende el brazo hacia atrás y controla la vuelta.',
            'Aumenta el peso o haz una pausa arriba.',
            'Reduce el peso o hazlo con el brazo apoyado.'
        ),
        press_hombros: ficha(
            'Press de hombros con peso',
            ['brazos_hombros'],
            'Botellas o peso',
            'Medio',
            'Peso a la altura de los hombros. Empuja hacia arriba sin arquear la espalda y baja con control.',
            'Aumenta el peso o hazlo sentado.',
            'Reduce el peso o hazlo con un brazo.'
        ),
        puente_gluteo: ficha(
            'Puente de glúteo',
            ['piernas'],
            'Sin equipo',
            'Bajo',
            'Tumbado con los pies apoyados. Sube la cadera apretando los glúteos sin arquear la espalda.',
            'Haz una pausa arriba o eleva una pierna.',
            'Reduce el recorrido y aprieta menos tiempo.'
        ),
        puente_una_pierna: ficha(
            'Puente de glúteo a una pierna',
            ['piernas'],
            'Sin equipo',
            'Alto',
            'Puente de glúteo con una pierna elevada. Sube sin arquear la espalda y baja con control.',
            'Añade una pausa arriba.',
            'Hazlo con las dos piernas.'
        ),
        elevacion_talones: ficha(
            'Elevación de talones',
            ['piernas'],
            'Sin equipo',
            'Bajo',
            'De pie, sube los talones, aprieta los gemelos arriba y baja despacio.',
            'Hazlo a una pierna o con una pausa arriba.',
            'Apóyate en la pared.'
        ),
        elevacion_talones_escalon: ficha(
            'Elevación de talones en escalón',
            ['piernas'],
            'Escalón',
            'Medio',
            'Talones en el borde de un escalón. Sube y baja el talón con control y sin rebotes.',
            'Añade peso o hazlo a una pierna.',
            'Hazlo en el suelo con apoyo.'
        ),
        sentadilla_pared: ficha(
            'Sentadilla en pared',
            ['piernas'],
            'Pared',
            'Medio',
            'Espalda apoyada en la pared y rodillas a 90 grados. Mantén la posición respirando.',
            'Aumenta el tiempo o eleva ligeramente una pierna.',
            'Sube un poco la cadera o reduce el tiempo.'
        ),
        zancadas_laterales: ficha(
            'Zancadas laterales',
            ['piernas'],
            'Sin equipo',
            'Medio',
            'Da un paso lateral amplio. Flexiona la pierna que recibe y empuja con la otra para volver.',
            'Añade peso ligero o baja más.',
            'Haz un paso más corto y apóyate en una pared.'
        ),
        sentadilla_salto: ficha(
            'Sentadillas con salto',
            ['piernas', 'cuerpo_completo'],
            'Sin equipo',
            'Alto',
            'Haz una sentadilla y salta de forma explosiva. Aterriza suave con las rodillas flexionadas.',
            'Aumenta la altura o reduce el descanso.',
            'Haz sentadillas sin salto.'
        ),
        zancadas_alternas: ficha(
            'Zancadas alternas',
            ['piernas', 'cuerpo_completo'],
            'Sin equipo',
            'Medio',
            'Alterna las piernas manteniendo el torso erguido y el equilibrio.',
            'Añade peso ligero.',
            'Hazlas con apoyo o sin desplazamiento.'
        ),
        zancadas_salto: ficha(
            'Zancadas con salto',
            ['piernas', 'cuerpo_completo'],
            'Sin equipo',
            'Alto',
            'Haz una zancada y salta para cambiar de pierna. Aterriza suave y mantén el control.',
            'Aumenta la altura del salto.',
            'Haz zancadas sin salto.'
        ),
        sentadilla_bulgara: ficha(
            'Sentadilla búlgara',
            ['piernas'],
            'Silla o banco',
            'Alto',
            'Pie trasero apoyado en una silla. Baja la rodilla trasera y empuja con la pierna delantera.',
            'Añade peso o baja más.',
            'Usa una silla más baja o haz zancadas normales.'
        ),
        hip_thrust: ficha(
            'Hip thrust con peso',
            ['piernas'],
            'Silla y peso',
            'Medio',
            'Espalda alta apoyada en una silla y pies en el suelo. Sube la cadera y aprieta los glúteos.',
            'Añade peso o una pausa arriba.',
            'Haz un puente de glúteo en el suelo.'
        ),
        step_up: ficha(
            'Step-up en escalón',
            ['piernas'],
            'Escalón firme',
            'Medio',
            'Sube a un escalón firme con una pierna, extiende la cadera y baja con control.',
            'Añade peso o sube a un escalón más alto.',
            'Usa un escalón más bajo o apóyate en la pared.'
        ),
        crunches_suaves: ficha(
            'Abdominales cortos suaves',
            ['abdomen'],
            'Sin equipo',
            'Bajo',
            'Tumbado con las rodillas flexionadas. Eleva ligeramente los hombros sin tirar del cuello.',
            'Sube un poco más o haz una pausa arriba.',
            'Reduce el recorrido.'
        ),
        crunches: ficha(
            'Abdominales (crunches)',
            ['abdomen'],
            'Sin equipo',
            'Medio',
            'Eleva los hombros con el abdomen, no con el cuello. Exhala al subir y baja con control.',
            'Añade una pausa arriba o un peso ligero.',
            'Haz abdominales cortos.'
        ),
        plancha_abdominal: ficha(
            'Plancha abdominal',
            ['abdomen', 'cuerpo_completo'],
            'Sin equipo',
            'Medio',
            'Codos bajo los hombros. Mantén el cuerpo en línea y aprieta abdomen y glúteos.',
            'Aumenta el tiempo o eleva una pierna.',
            'Apoya las rodillas o hazla con las manos en una silla.'
        ),
        plancha_lateral: ficha(
            'Plancha lateral',
            ['abdomen', 'cuerpo_completo'],
            'Sin equipo',
            'Medio',
            'Codo bajo el hombro y cuerpo lateral en línea. Mantén la cadera alta.',
            'Aumenta el tiempo o eleva la pierna superior.',
            'Apoya la rodilla de abajo.'
        ),
        plancha_elevacion_pierna: ficha(
            'Plancha con elevación de pierna',
            ['abdomen', 'cuerpo_completo'],
            'Sin equipo',
            'Alto',
            'Plancha alta. Eleva una pierna sin mover la cadera y alterna.',
            'Aumenta el tiempo o hazlo más lento.',
            'Haz plancha normal.'
        ),
        plancha_lateral_toque: ficha(
            'Plancha lateral con toque de cadera',
            ['abdomen'],
            'Sin equipo',
            'Alto',
            'Plancha lateral. Toca la cadera con la mano libre y vuelve a la posición inicial.',
            'Aumenta el tiempo o eleva la pierna superior.',
            'Apoya la rodilla o haz plancha lateral normal.'
        ),
        plancha_toque_hombro: ficha(
            'Plancha con toque de hombro',
            ['abdomen'],
            'Sin equipo',
            'Medio',
            'Plancha alta. Toca un hombro con la mano opuesta sin mover la cadera.',
            'Aumenta el ritmo o eleva un pie.',
            'Hazlo con las rodillas apoyadas.'
        ),
        tijeras_abdominales: ficha(
            'Tijeras abdominales',
            ['abdomen'],
            'Sin equipo',
            'Medio',
            'Tumbado con las piernas elevadas. Crúzalas alternando sin despegar la zona lumbar.',
            'Baja más las piernas o aumenta el tiempo.',
            'Flexiona más las rodillas o reduce el tiempo.'
        ),
        elevaciones_piernas: ficha(
            'Elevaciones de piernas',
            ['abdomen'],
            'Sin equipo',
            'Medio',
            'Tumbado con las piernas juntas. Súbelas sin despegar la zona lumbar y baja lento.',
            'Baja más las piernas o haz una pausa arriba.',
            'Flexiona las rodillas o reduce el recorrido.'
        ),
        elevaciones_piernas_colgado: ficha(
            'Elevaciones de piernas colgando',
            ['abdomen'],
            'Barra',
            'Alto',
            'Colgado de una barra. Sube las piernas o las rodillas sin balancearte.',
            'Sube las piernas estiradas.',
            'Haz elevaciones de rodillas o usa una barra baja.'
        ),
        torsiones_tronco: ficha(
            'Torsiones de tronco',
            ['abdomen'],
            'Sin equipo',
            'Bajo',
            'Sentado, gira el torso a un lado y otro con control, sin tirar del cuello.',
            'Añade un peso ligero o hazlo más lento.',
            'Reduce el recorrido.'
        ),
        hollow_hold: ficha(
            'Hollow hold',
            ['abdomen'],
            'Sin equipo',
            'Alto',
            'Tumbado, eleva hombros y piernas. Mantén la lumbar pegada al suelo.',
            'Estira más las piernas o aumenta el tiempo.',
            'Flexiona las rodillas o apoya los pies.'
        ),
        dead_bug: ficha(
            'Dead bug (bicho muerto)',
            ['abdomen'],
            'Sin equipo',
            'Bajo',
            'Tumbado con brazos y piernas arriba. Baja un brazo y la pierna opuesta sin arquear la lumbar.',
            'Estira más las piernas o hazlo más lento.',
            'Reduce el recorrido.'
        ),
        superman: ficha(
            'Superman',
            ['espalda'],
            'Sin equipo',
            'Bajo',
            'Boca abajo, brazos y piernas estirados. Eleva ligeramente ambos y mantén la mirada al suelo.',
            'Mantén 2 segundos arriba.',
            'Eleva solo los brazos o solo las piernas.'
        ),
        superman_peso: ficha(
            'Superman con peso',
            ['espalda'],
            'Peso ligero',
            'Medio',
            'Superman con peso ligero. Eleva brazos y piernas sin forzar la lumbar.',
            'Aumenta el peso o la pausa.',
            'Hazlo sin peso.'
        ),
        remo_mochila: ficha(
            'Remo con mochila',
            ['espalda', 'cuerpo_completo'],
            'Mochila',
            'Bajo',
            'Inclina el torso con la espalda recta. Lleva la mochila hacia la cadera y aprieta la espalda.',
            'Añade peso o haz una pausa arriba.',
            'Reduce el peso o apoya una mano.'
        ),
        remo_peso: ficha(
            'Remos con peso',
            ['espalda', 'cuerpo_completo'],
            'Peso ligero',
            'Medio',
            'Remo con peso. Mantén la espalda recta y lleva el codo hacia atrás.',
            'Aumenta el peso o hazlo a una mano.',
            'Reduce el peso o usa una mochila.'
        ),
        remos_invertidos: ficha(
            'Remos invertidos en mesa',
            ['espalda'],
            'Mesa firme',
            'Medio',
            'Bajo una mesa firme, agarra el borde y tira del pecho hacia la mesa con el cuerpo recto.',
            'Estira más las piernas o eleva los pies.',
            'Flexiona las piernas y apoya los pies.'
        ),
        pajaro: ficha(
            'Pájaro con botellas o peso',
            ['espalda'],
            'Botellas o peso',
            'Bajo',
            'Inclinado, abre los brazos hacia los lados apretando la espalda alta.',
            'Aumenta el peso o haz una pausa.',
            'Reduce el peso o hazlo sentado.'
        ),
        face_pull: ficha(
            'Face pull con banda',
            ['espalda'],
            'Banda elástica',
            'Bajo',
            'Con la banda a la altura de la cara, tira hacia la frente separando las manos.',
            'Aumenta la tensión de la banda.',
            'Usa una banda más suave o hazlo sin banda.'
        ),
        gato_camello: ficha(
            'Gato-camello',
            ['espalda'],
            'Sin equipo',
            'Bajo',
            'A cuatro patas, alterna redondear y arquear la espalda lentamente, coordinando con la respiración.',
            'Hazlo más lento o añade movilidad de cadera.',
            'Reduce el recorrido.'
        ),
        estiramiento_espalda: ficha(
            'Estiramiento de espalda',
            ['espalda'],
            'Sin equipo',
            'Bajo',
            'Sentado o de pie, alarga la espalda y lleva el pecho hacia las rodillas sin rebotes.',
            'Mantén más tiempo.',
            'Reduce el recorrido.'
        ),
        burpees_basicos: ficha(
            'Burpees básicos',
            ['cuerpo_completo'],
            'Sin equipo',
            'Medio',
            'Baja a plancha, vuelve a pie y sube los brazos. Sin flexión ni salto si estás empezando.',
            'Añade la flexión o el salto.',
            'Hazlo con las manos en una silla.'
        ),
        burpees_completos: ficha(
            'Burpees completos',
            ['cuerpo_completo'],
            'Sin equipo',
            'Alto',
            'Plancha con flexión, salto de pies y salto final. Aterriza suave.',
            'Aumenta el ritmo o reduce el descanso.',
            'Haz burpees básicos o sin salto.'
        ),
        escaladores_intensos: ficha(
            'Escaladores intensos',
            ['cuerpo_completo', 'abdomen'],
            'Sin equipo',
            'Alto',
            'Plancha alta. Alterna rodillas al pecho a ritmo rápido pero controlado.',
            'Aumenta la velocidad sin perder la postura.',
            'Haz escaladores lentos o con las manos elevadas.'
        )
    };

    // ===== ALTERNATIVAS CURADAS =====
    // Cada ejercicio puede cambiarse por opciones que trabajan la misma zona
    // principal. "tipos" indica si la alternativa encaja en una dosis por
    // repeticiones, por tiempo o en ambas. El catálogo y las rutinas siguen
    // siendo estáticos; las elecciones del usuario se guardan aparte.
    function altOpcion(id, etiquetas, tipos) {
        return {
            id: id,
            etiquetas: etiquetas || [],
            tipos: tipos || ['rep', 'tiempo']
        };
    }

    const SUSTITUCIONES = {
        sentadilla_clasica: [
            altOpcion('sentadilla_pared', ['Más fácil', 'Apoyado'], ['tiempo']),
            altOpcion('puente_gluteo', ['Glúteos', 'Sin equipo']),
            altOpcion('step_up', ['Unilateral', 'Sin equipo'])
        ],
        zancada_frontal: [
            altOpcion('step_up', ['Más fácil', 'Unilateral']),
            altOpcion('puente_gluteo', ['Glúteos', 'Sin equipo']),
            altOpcion('sentadilla_pared', ['Apoyado'], ['tiempo'])
        ],
        saltos_tijera: [
            altOpcion('sentadilla_clasica', ['Piernas', 'Sin equipo']),
            altOpcion('zancadas_alternas', ['Bajo impacto', 'Sin equipo']),
            altOpcion('escaladores', ['Cardio', 'Sin equipo'])
        ],
        escaladores: [
            altOpcion('plancha_abdominal', ['Más fácil', 'Core'], ['tiempo']),
            altOpcion('dead_bug', ['Core', 'Sin impacto'])
        ],
        flexiones_inclinadas: [
            altOpcion('flexiones_rodillas', ['Más fácil', 'Sin equipo']),
            altOpcion('press_suelo_botellas', ['Pecho', 'Botellas']),
            altOpcion('aperturas_botellas', ['Pecho', 'Botellas'])
        ],
        flexiones_rodillas: [
            altOpcion('flexiones_inclinadas', ['Más fácil', 'Silla']),
            altOpcion('press_suelo_botellas', ['Pecho', 'Botellas']),
            altOpcion('aperturas_botellas', ['Pecho', 'Botellas'])
        ],
        flexiones_clasicas: [
            altOpcion('flexiones_inclinadas', ['Más fácil', 'Silla']),
            altOpcion('flexiones_rodillas', ['Más fácil', 'Sin equipo']),
            altOpcion('press_suelo_botellas', ['Pecho', 'Botellas'])
        ],
        flexiones_manos_separadas: [
            altOpcion('flexiones_clasicas', ['Más fácil', 'Sin equipo']),
            altOpcion('flexiones_inclinadas', ['Más fácil', 'Silla']),
            altOpcion('flexiones_rodillas', ['Más fácil', 'Sin equipo'])
        ],
        flexiones_diamante: [
            altOpcion('flexiones_clasicas', ['Más fácil', 'Sin equipo']),
            altOpcion('flexiones_inclinadas', ['Más fácil', 'Silla']),
            altOpcion('press_suelo_botellas', ['Pecho', 'Botellas'])
        ],
        flexiones_declinadas: [
            altOpcion('flexiones_clasicas', ['Más fácil', 'Sin equipo']),
            altOpcion('flexiones_inclinadas', ['Más fácil', 'Silla']),
            altOpcion('press_suelo_botellas', ['Pecho', 'Botellas'])
        ],
        aperturas_botellas: [
            altOpcion('press_suelo_botellas', ['Pecho', 'Botellas']),
            altOpcion('flexiones_inclinadas', ['Pecho', 'Silla']),
            altOpcion('flexiones_rodillas', ['Pecho', 'Sin equipo'])
        ],
        aperturas_peso: [
            altOpcion('aperturas_botellas', ['Más fácil', 'Botellas']),
            altOpcion('press_suelo_botellas', ['Pecho', 'Botellas']),
            altOpcion('flexiones_inclinadas', ['Pecho', 'Silla'])
        ],
        press_suelo_botellas: [
            altOpcion('flexiones_inclinadas', ['Más fácil', 'Silla']),
            altOpcion('flexiones_rodillas', ['Más fácil', 'Sin equipo']),
            altOpcion('aperturas_botellas', ['Pecho', 'Botellas'])
        ],
        press_suelo_peso: [
            altOpcion('press_suelo_botellas', ['Más fácil', 'Botellas']),
            altOpcion('flexiones_inclinadas', ['Pecho', 'Silla']),
            altOpcion('aperturas_botellas', ['Pecho', 'Botellas'])
        ],
        curl_botellas: [
            altOpcion('curl_mochila', ['Mismo patrón', 'Mochila']),
            altOpcion('curl_martillo', ['Otra empuñadura']),
            altOpcion('circulos_brazos', ['Sin peso', 'Hombros'])
        ],
        curl_mochila: [
            altOpcion('curl_botellas', ['Más fácil', 'Botellas']),
            altOpcion('curl_martillo', ['Otra empuñadura']),
            altOpcion('circulos_brazos', ['Sin peso', 'Hombros'])
        ],
        curl_peso: [
            altOpcion('curl_botellas', ['Más fácil', 'Botellas']),
            altOpcion('curl_mochila', ['Mochila']),
            altOpcion('curl_martillo', ['Otra empuñadura'])
        ],
        curl_martillo: [
            altOpcion('curl_botellas', ['Más fácil', 'Botellas']),
            altOpcion('curl_mochila', ['Mochila']),
            altOpcion('curl_peso', ['Peso ligero'])
        ],
        elevaciones_laterales: [
            altOpcion('elevaciones_frontales', ['Más fácil', 'Hombros']),
            altOpcion('circulos_brazos', ['Sin peso', 'Hombros'])
        ],
        elevaciones_frontales: [
            altOpcion('elevaciones_laterales', ['Hombros', 'Sin peso']),
            altOpcion('circulos_brazos', ['Más fácil', 'Sin peso'])
        ],
        circulos_brazos: [
            altOpcion('elevaciones_laterales', ['Hombros', 'Con peso']),
            altOpcion('elevaciones_frontales', ['Hombros', 'Con peso'])
        ],
        fondos_silla: [
            altOpcion('patada_triceps', ['Tríceps', 'Con peso']),
            altOpcion('flexiones_inclinadas', ['Pecho y brazos', 'Silla']),
            altOpcion('circulos_brazos', ['Sin peso', 'Hombros'])
        ],
        fondos_piernas_estiradas: [
            altOpcion('fondos_silla', ['Más fácil', 'Rodillas dobladas']),
            altOpcion('patada_triceps', ['Tríceps', 'Con peso']),
            altOpcion('flexiones_inclinadas', ['Pecho y brazos', 'Silla'])
        ],
        dominadas: [
            altOpcion('remos_invertidos', ['Más fácil', 'Mesa']),
            altOpcion('remo_mochila', ['Espalda', 'Mochila']),
            altOpcion('face_pull', ['Espalda alta', 'Banda'])
        ],
        patada_triceps: [
            altOpcion('fondos_silla', ['Tríceps', 'Silla']),
            altOpcion('flexiones_inclinadas', ['Pecho y brazos', 'Silla']),
            altOpcion('circulos_brazos', ['Sin peso', 'Hombros'])
        ],
        press_hombros: [
            altOpcion('elevaciones_frontales', ['Más fácil', 'Hombros']),
            altOpcion('elevaciones_laterales', ['Hombros', 'Sin peso']),
            altOpcion('circulos_brazos', ['Sin peso', 'Hombros'])
        ],
        puente_gluteo: [
            altOpcion('sentadilla_clasica', ['Piernas', 'Sin equipo']),
            altOpcion('step_up', ['Unilateral', 'Sin equipo']),
            altOpcion('elevacion_talones', ['Pantorrillas', 'Sin equipo'])
        ],
        puente_una_pierna: [
            altOpcion('puente_gluteo', ['Más fácil', 'Dos piernas']),
            altOpcion('sentadilla_pared', ['Apoyado'], ['tiempo']),
            altOpcion('step_up', ['Unilateral', 'Sin equipo'])
        ],
        elevacion_talones: [
            altOpcion('puente_gluteo', ['Glúteos', 'Sin equipo']),
            altOpcion('step_up', ['Piernas', 'Sin equipo']),
            altOpcion('sentadilla_clasica', ['Piernas', 'Sin equipo'])
        ],
        elevacion_talones_escalon: [
            altOpcion('elevacion_talones', ['Más fácil', 'Sin escalón']),
            altOpcion('puente_gluteo', ['Glúteos', 'Sin equipo']),
            altOpcion('step_up', ['Piernas', 'Escalón'])
        ],
        sentadilla_pared: [
            altOpcion('sentadilla_clasica', ['Más movimiento', 'Sin pared']),
            altOpcion('puente_gluteo', ['Glúteos', 'Sin equipo']),
            altOpcion('step_up', ['Unilateral', 'Sin equipo'])
        ],
        zancadas_laterales: [
            altOpcion('step_up', ['Más fácil', 'Unilateral']),
            altOpcion('puente_gluteo', ['Glúteos', 'Sin equipo']),
            altOpcion('zancada_frontal', ['Piernas', 'Sin equipo'])
        ],
        sentadilla_salto: [
            altOpcion('sentadilla_clasica', ['Sin salto', 'Sin equipo']),
            altOpcion('sentadilla_pared', ['Apoyado'], ['tiempo']),
            altOpcion('step_up', ['Bajo impacto', 'Unilateral'])
        ],
        zancadas_alternas: [
            altOpcion('zancada_frontal', ['Más fácil', 'Sin equipo']),
            altOpcion('step_up', ['Unilateral', 'Sin equipo']),
            altOpcion('puente_gluteo', ['Glúteos', 'Sin equipo'])
        ],
        zancadas_salto: [
            altOpcion('zancada_frontal', ['Sin salto', 'Sin equipo']),
            altOpcion('step_up', ['Bajo impacto', 'Unilateral']),
            altOpcion('sentadilla_clasica', ['Piernas', 'Sin equipo'])
        ],
        sentadilla_bulgara: [
            altOpcion('step_up', ['Más fácil', 'Unilateral']),
            altOpcion('sentadilla_pared', ['Apoyado'], ['tiempo']),
            altOpcion('sentadilla_clasica', ['Sin silla', 'Sin equipo'])
        ],
        hip_thrust: [
            altOpcion('puente_gluteo', ['Más fácil', 'Sin banco']),
            altOpcion('sentadilla_pared', ['Apoyado'], ['tiempo']),
            altOpcion('step_up', ['Unilateral', 'Sin equipo'])
        ],
        step_up: [
            altOpcion('sentadilla_clasica', ['Más fácil', 'Sin escalón']),
            altOpcion('puente_gluteo', ['Glúteos', 'Sin equipo']),
            altOpcion('elevacion_talones', ['Pantorrillas', 'Sin equipo'])
        ],
        crunches_suaves: [
            altOpcion('dead_bug', ['Más fácil', 'Core']),
            altOpcion('plancha_abdominal', ['Core', 'Sin impacto'], ['tiempo']),
            altOpcion('torsiones_tronco', ['Core', 'Sin equipo'])
        ],
        crunches: [
            altOpcion('crunches_suaves', ['Más fácil', 'Sin equipo']),
            altOpcion('dead_bug', ['Core', 'Sin equipo']),
            altOpcion('plancha_abdominal', ['Core', 'Sin impacto'], ['tiempo'])
        ],
        plancha_abdominal: [
            altOpcion('plancha_lateral', ['Core', 'Lateral'], ['tiempo']),
            altOpcion('dead_bug', ['Core', 'Sin impacto']),
            altOpcion('crunches_suaves', ['Core', 'Sin equipo'])
        ],
        plancha_lateral: [
            altOpcion('plancha_abdominal', ['Más fácil', 'Frontal'], ['tiempo']),
            altOpcion('dead_bug', ['Core', 'Sin impacto']),
            altOpcion('crunches_suaves', ['Core', 'Sin equipo'])
        ],
        plancha_elevacion_pierna: [
            altOpcion('plancha_abdominal', ['Más fácil', 'Frontal'], ['tiempo']),
            altOpcion('plancha_lateral', ['Core', 'Lateral'], ['tiempo']),
            altOpcion('dead_bug', ['Core', 'Sin impacto'])
        ],
        plancha_lateral_toque: [
            altOpcion('plancha_lateral', ['Más fácil', 'Sin toque'], ['tiempo']),
            altOpcion('plancha_abdominal', ['Core', 'Frontal'], ['tiempo']),
            altOpcion('dead_bug', ['Core', 'Sin impacto'])
        ],
        plancha_toque_hombro: [
            altOpcion('plancha_abdominal', ['Más fácil', 'Sin toque'], ['tiempo']),
            altOpcion('plancha_lateral', ['Core', 'Lateral'], ['tiempo']),
            altOpcion('dead_bug', ['Core', 'Sin impacto'])
        ],
        tijeras_abdominales: [
            altOpcion('dead_bug', ['Más fácil', 'Core']),
            altOpcion('crunches_suaves', ['Core', 'Sin equipo']),
            altOpcion('plancha_abdominal', ['Core', 'Sin impacto'], ['tiempo'])
        ],
        elevaciones_piernas: [
            altOpcion('dead_bug', ['Más fácil', 'Core']),
            altOpcion('crunches_suaves', ['Core', 'Sin equipo']),
            altOpcion('tijeras_abdominales', ['Core', 'Sin equipo'])
        ],
        elevaciones_piernas_colgado: [
            altOpcion('elevaciones_piernas', ['Más fácil', 'Sin barra']),
            altOpcion('dead_bug', ['Core', 'Sin equipo']),
            altOpcion('crunches_suaves', ['Core', 'Sin equipo'])
        ],
        torsiones_tronco: [
            altOpcion('crunches_suaves', ['Más fácil', 'Core']),
            altOpcion('dead_bug', ['Core', 'Sin equipo']),
            altOpcion('plancha_lateral', ['Core', 'Lateral'], ['tiempo'])
        ],
        hollow_hold: [
            altOpcion('plancha_abdominal', ['Más fácil', 'Frontal'], ['tiempo']),
            altOpcion('dead_bug', ['Core', 'Sin impacto']),
            altOpcion('crunches_suaves', ['Core', 'Sin equipo'])
        ],
        dead_bug: [
            altOpcion('crunches_suaves', ['Más fácil', 'Core']),
            altOpcion('plancha_abdominal', ['Core', 'Sin impacto'], ['tiempo']),
            altOpcion('torsiones_tronco', ['Core', 'Sin equipo'])
        ],
        superman: [
            altOpcion('gato_camello', ['Más suave', 'Movilidad']),
            altOpcion('remo_mochila', ['Espalda', 'Mochila']),
            altOpcion('pajaro', ['Espalda', 'Botellas'])
        ],
        superman_peso: [
            altOpcion('superman', ['Más fácil', 'Sin peso']),
            altOpcion('remo_mochila', ['Espalda', 'Mochila']),
            altOpcion('pajaro', ['Espalda', 'Botellas'])
        ],
        remo_mochila: [
            altOpcion('pajaro', ['Espalda', 'Botellas']),
            altOpcion('superman', ['Espalda', 'Sin equipo']),
            altOpcion('face_pull', ['Espalda alta', 'Banda'])
        ],
        remo_peso: [
            altOpcion('remo_mochila', ['Más fácil', 'Mochila']),
            altOpcion('pajaro', ['Espalda', 'Botellas']),
            altOpcion('remos_invertidos', ['Espalda', 'Mesa'])
        ],
        remos_invertidos: [
            altOpcion('remo_mochila', ['Más fácil', 'Mochila']),
            altOpcion('pajaro', ['Espalda', 'Botellas']),
            altOpcion('face_pull', ['Espalda alta', 'Banda'])
        ],
        pajaro: [
            altOpcion('superman', ['Más fácil', 'Sin peso']),
            altOpcion('remo_mochila', ['Espalda', 'Mochila']),
            altOpcion('face_pull', ['Espalda alta', 'Banda'])
        ],
        face_pull: [
            altOpcion('pajaro', ['Más fácil', 'Botellas']),
            altOpcion('remo_mochila', ['Espalda', 'Mochila']),
            altOpcion('superman', ['Espalda', 'Sin equipo'])
        ],
        gato_camello: [
            altOpcion('estiramiento_espalda', ['Más suave', 'Movilidad']),
            altOpcion('superman', ['Espalda', 'Sin equipo']),
            altOpcion('pajaro', ['Espalda', 'Botellas'])
        ],
        estiramiento_espalda: [
            altOpcion('gato_camello', ['Movilidad', 'Sin equipo']),
            altOpcion('superman', ['Espalda', 'Sin equipo']),
            altOpcion('pajaro', ['Espalda', 'Botellas'])
        ],
        burpees_basicos: [
            altOpcion('sentadilla_clasica', ['Más fácil', 'Sin equipo']),
            altOpcion('plancha_abdominal', ['Core', 'Sin impacto'], ['tiempo']),
            altOpcion('escaladores', ['Cardio', 'Sin equipo'])
        ],
        burpees_completos: [
            altOpcion('burpees_basicos', ['Más fácil', 'Sin flexión ni salto']),
            altOpcion('sentadilla_clasica', ['Sin impacto', 'Sin equipo']),
            altOpcion('plancha_abdominal', ['Core', 'Sin impacto'], ['tiempo'])
        ],
        escaladores_intensos: [
            altOpcion('escaladores', ['Más fácil', 'Ritmo medio']),
            altOpcion('plancha_abdominal', ['Core', 'Sin impacto'], ['tiempo']),
            altOpcion('dead_bug', ['Core', 'Sin impacto'])
        ]
    };

    // ===== DEMOSTRACIONES ANIMADAS =====
    // Motor de figuras articuladas. Cada ejercicio usa una secuencia de posturas
    // (2-4 fotogramas) y, si hace falta, una vista frontal y accesorios sencillos.
    // Las variantes de un mismo movimiento comparten patrón y cambian la pista.

    const POSTURAS = {
        // --- Vista lateral: de pie y piernas ---
        dePie: {
            cabeza: [118, 40], hombro: [118, 58], codo: [110, 80], mano: [104, 101],
            cadera: [118, 108], rodilla: [116, 140], tobillo: [118, 176], pie: [136, 176]
        },
        sentadillaAbajo: {
            cabeza: [106, 72], hombro: [112, 87], codo: [92, 95], mano: [70, 94],
            cadera: [124, 136], rodilla: [95, 149], tobillo: [118, 176], pie: [136, 176]
        },
        zancadaAbajo: {
            cabeza: [102, 78], hombro: [108, 94], codo: [98, 114], mano: [92, 134],
            cadera: [118, 124], rodilla: [88, 148], tobillo: [78, 176], pie: [98, 176]
        },
        zancadaLateralAbajo: {
            cabeza: [96, 80], hombro: [104, 96], codo: [94, 116], mano: [88, 136],
            cadera: [110, 130], rodilla: [80, 150], tobillo: [74, 176], pie: [92, 176]
        },
        zancadaAire: {
            cabeza: [106, 50], hombro: [110, 68], codo: [100, 88], mano: [94, 108],
            cadera: [118, 102], rodilla: [96, 128], tobillo: [80, 150], pie: [96, 156]
        },
        sentadillaAire: {
            cabeza: [118, 26], hombro: [118, 44], codo: [110, 66], mano: [104, 87],
            cadera: [118, 94], rodilla: [116, 126], tobillo: [118, 160], pie: [136, 154]
        },
        paredAbajo: {
            cabeza: [86, 68], hombro: [86, 86], codo: [72, 102], mano: [54, 102],
            cadera: [86, 130], rodilla: [124, 130], tobillo: [124, 176], pie: [142, 176]
        },
        bulgaraArriba: {
            cabeza: [110, 48], hombro: [110, 66], codo: [102, 88], mano: [96, 109],
            cadera: [110, 116], rodilla: [108, 146], tobillo: [112, 176], pie: [130, 176],
            rodillaTrasera: [144, 152], tobilloTrasero: [172, 140], pieTrasero: [186, 140]
        },
        bulgaraAbajo: {
            cabeza: [100, 74], hombro: [106, 90], codo: [96, 110], mano: [90, 130],
            cadera: [112, 132], rodilla: [92, 150], tobillo: [96, 176], pie: [114, 176],
            rodillaTrasera: [146, 160], tobilloTrasero: [172, 140], pieTrasero: [186, 140]
        },
        talonesArriba: {
            cabeza: [118, 32], hombro: [118, 50], codo: [110, 72], mano: [104, 93],
            cadera: [118, 100], rodilla: [116, 132], tobillo: [118, 168], pie: [136, 176]
        },
        talonesEscalonAbajo: {
            cabeza: [118, 44], hombro: [118, 62], codo: [110, 84], mano: [104, 105],
            cadera: [118, 112], rodilla: [116, 144], tobillo: [120, 170], pie: [136, 160]
        },
        talonesEscalonArriba: {
            cabeza: [118, 34], hombro: [118, 52], codo: [110, 74], mano: [104, 95],
            cadera: [118, 102], rodilla: [116, 134], tobillo: [120, 160], pie: [136, 160]
        },
        hipThrustAbajo: {
            cabeza: [50, 124], hombro: [72, 140], codo: [92, 148], mano: [108, 156],
            cadera: [120, 158], rodilla: [150, 132], tobillo: [164, 176], pie: [182, 176]
        },
        hipThrustArriba: {
            cabeza: [50, 124], hombro: [72, 140], codo: [92, 148], mano: [108, 156],
            cadera: [120, 128], rodilla: [150, 128], tobillo: [164, 176], pie: [182, 176]
        },
        stepAbajo: {
            cabeza: [96, 58], hombro: [96, 76], codo: [88, 98], mano: [82, 118],
            cadera: [96, 126], rodilla: [118, 142], tobillo: [126, 160], pie: [144, 160]
        },
        stepArriba: {
            cabeza: [96, 38], hombro: [96, 56], codo: [88, 78], mano: [82, 98],
            cadera: [96, 106], rodilla: [118, 132], tobillo: [126, 160], pie: [144, 160]
        },

        // --- Empujes y flexiones ---
        flexionArriba: {
            cabeza: [80, 122], hombro: [96, 132], codo: [82, 150], mano: [64, 174],
            cadera: [150, 140], rodilla: [172, 148], tobillo: [192, 160], pie: [204, 174]
        },
        flexionAbajo: {
            cabeza: [78, 140], hombro: [94, 150], codo: [94, 173], mano: [64, 174],
            cadera: [148, 158], rodilla: [170, 164], tobillo: [190, 170], pie: [202, 176]
        },
        flexionRodillasArriba: {
            cabeza: [80, 124], hombro: [96, 134], codo: [82, 152], mano: [64, 174],
            cadera: [148, 142], rodilla: [174, 172], tobillo: [196, 158], pie: [208, 150]
        },
        flexionRodillasAbajo: {
            cabeza: [78, 142], hombro: [94, 152], codo: [94, 174], mano: [64, 174],
            cadera: [146, 158], rodilla: [174, 174], tobillo: [196, 164], pie: [208, 156]
        },
        flexionInclinadaArriba: {
            cabeza: [84, 114], hombro: [100, 124], codo: [84, 138], mano: [66, 148],
            cadera: [154, 134], rodilla: [176, 144], tobillo: [196, 158], pie: [208, 172]
        },
        flexionInclinadaAbajo: {
            cabeza: [82, 130], hombro: [98, 140], codo: [92, 154], mano: [66, 148],
            cadera: [152, 150], rodilla: [174, 158], tobillo: [194, 166], pie: [206, 176]
        },
        flexionDeclinadaArriba: {
            cabeza: [80, 134], hombro: [96, 144], codo: [82, 156], mano: [64, 174],
            cadera: [150, 138], rodilla: [174, 140], tobillo: [196, 138], pie: [208, 142]
        },
        flexionDeclinadaAbajo: {
            cabeza: [78, 148], hombro: [94, 158], codo: [92, 174], mano: [64, 174],
            cadera: [148, 152], rodilla: [172, 152], tobillo: [194, 146], pie: [206, 150]
        },
        plancha: {
            cabeza: [80, 122], hombro: [96, 132], codo: [78, 172], mano: [52, 174],
            cadera: [150, 140], rodilla: [172, 148], tobillo: [192, 160], pie: [204, 174]
        },
        planchaPiernaArriba: {
            cabeza: [80, 122], hombro: [96, 132], codo: [78, 172], mano: [52, 174],
            cadera: [150, 138], rodilla: [174, 132], tobillo: [200, 126], pie: [212, 122]
        },
        planchaHombroArriba: {
            cabeza: [80, 122], hombro: [96, 132], codo: [96, 142], mano: [104, 132],
            cadera: [150, 140], rodilla: [172, 148], tobillo: [192, 160], pie: [204, 174]
        },
        planchaLateral: {
            cabeza: [78, 118], hombro: [94, 130], codo: [82, 152], mano: [68, 174],
            cadera: [148, 142], rodilla: [174, 152], tobillo: [198, 164], pie: [210, 174]
        },
        planchaLateralAbajo: {
            cabeza: [78, 120], hombro: [94, 132], codo: [84, 154], mano: [68, 174],
            cadera: [148, 152], rodilla: [174, 160], tobillo: [198, 170], pie: [210, 176]
        },
        escaladoresAbajo: {
            cabeza: [80, 122], hombro: [96, 132], codo: [82, 150], mano: [64, 174],
            cadera: [150, 140], rodilla: [172, 148], tobillo: [192, 160], pie: [204, 174]
        },
        escaladoresArriba: {
            cabeza: [80, 122], hombro: [96, 132], codo: [82, 150], mano: [64, 174],
            cadera: [150, 138], rodilla: [112, 150], tobillo: [96, 162], pie: [90, 172]
        },
        fondosAbajo: {
            cabeza: [100, 110], hombro: [112, 124], codo: [134, 142], mano: [152, 140],
            cadera: [96, 142], rodilla: [72, 150], tobillo: [58, 174], pie: [42, 174]
        },
        fondosArriba: {
            cabeza: [98, 128], hombro: [110, 142], codo: [134, 154], mano: [152, 140],
            cadera: [94, 158], rodilla: [70, 162], tobillo: [56, 174], pie: [40, 174]
        },
        fondosEstiradosAbajo: {
            cabeza: [100, 110], hombro: [112, 124], codo: [134, 142], mano: [152, 140],
            cadera: [96, 142], rodilla: [70, 146], tobillo: [44, 160], pie: [28, 166]
        },
        fondosEstiradosArriba: {
            cabeza: [98, 128], hombro: [110, 142], codo: [134, 154], mano: [152, 140],
            cadera: [94, 158], rodilla: [68, 160], tobillo: [42, 168], pie: [26, 174]
        },

        // --- Curl, hombros y tríceps ---
        curlArriba: {
            cabeza: [118, 40], hombro: [118, 58], codo: [118, 82], mano: [96, 64],
            cadera: [118, 108], rodilla: [116, 140], tobillo: [118, 176], pie: [136, 176]
        },
        elevacionFrontalArriba: {
            cabeza: [118, 40], hombro: [118, 58], codo: [96, 62], mano: [72, 60],
            cadera: [118, 108], rodilla: [116, 140], tobillo: [118, 176], pie: [136, 176]
        },
        patadaAbajo: {
            cabeza: [96, 64], hombro: [108, 80], codo: [120, 98], mano: [134, 112],
            cadera: [134, 100], rodilla: [128, 138], tobillo: [118, 176], pie: [136, 176]
        },
        patadaArriba: {
            cabeza: [96, 64], hombro: [108, 80], codo: [120, 98], mano: [154, 90],
            cadera: [134, 100], rodilla: [128, 138], tobillo: [118, 176], pie: [136, 176]
        },

        // --- Suelo: pecho, abdomen y espalda ---
        pressSueloAbajo: {
            cabeza: [54, 152], hombro: [76, 150], codo: [84, 138], mano: [96, 128],
            cadera: [118, 152], rodilla: [150, 132], tobillo: [164, 176], pie: [182, 176]
        },
        pressSueloArriba: {
            cabeza: [54, 152], hombro: [76, 150], codo: [80, 126], mano: [96, 108],
            cadera: [118, 152], rodilla: [150, 132], tobillo: [164, 176], pie: [182, 176]
        },
        aperturasArriba: {
            cabeza: [54, 152], hombro: [76, 150], codo: [82, 134], mano: [94, 116],
            cadera: [118, 152], rodilla: [150, 132], tobillo: [164, 176], pie: [182, 176]
        },
        aperturasAbierta: {
            cabeza: [54, 152], hombro: [76, 150], codo: [70, 146], mano: [46, 150],
            cadera: [118, 152], rodilla: [150, 132], tobillo: [164, 176], pie: [182, 176]
        },
        crunchAbajo: {
            cabeza: [54, 152], hombro: [74, 152], codo: [82, 144], mano: [94, 136],
            cadera: [118, 154], rodilla: [150, 132], tobillo: [164, 176], pie: [182, 176]
        },
        crunchArriba: {
            cabeza: [66, 136], hombro: [84, 142], codo: [96, 132], mano: [106, 124],
            cadera: [118, 154], rodilla: [150, 132], tobillo: [164, 176], pie: [182, 176]
        },
        crunchSuaveArriba: {
            cabeza: [62, 142], hombro: [80, 146], codo: [90, 138], mano: [102, 130],
            cadera: [118, 154], rodilla: [150, 132], tobillo: [164, 176], pie: [182, 176]
        },
        elevacionPiernasAbajo: {
            cabeza: [54, 156], hombro: [74, 156], codo: [84, 164], mano: [98, 168],
            cadera: [118, 158], rodilla: [150, 168], tobillo: [178, 174], pie: [194, 176]
        },
        elevacionPiernasArriba: {
            cabeza: [54, 156], hombro: [74, 156], codo: [84, 164], mano: [98, 168],
            cadera: [118, 158], rodilla: [140, 130], tobillo: [144, 102], pie: [146, 88]
        },
        hollow: {
            cabeza: [54, 138], hombro: [74, 146], codo: [64, 156], mano: [50, 166],
            cadera: [118, 158], rodilla: [150, 150], tobillo: [180, 140], pie: [196, 134]
        },
        deadBugA: {
            cabeza: [54, 152], hombro: [76, 150], codo: [70, 136], mano: [64, 120],
            cadera: [118, 154], rodilla: [140, 130], tobillo: [150, 106], pie: [152, 94]
        },
        deadBugB: {
            cabeza: [54, 152], hombro: [76, 150], codo: [60, 148], mano: [40, 146],
            cadera: [118, 154], rodilla: [156, 160], tobillo: [186, 170], pie: [200, 174]
        },
        puenteAbajo: {
            cabeza: [54, 152], hombro: [76, 150], codo: [86, 160], mano: [102, 166],
            cadera: [118, 152], rodilla: [150, 132], tobillo: [164, 176], pie: [182, 176]
        },
        puenteArriba: {
            cabeza: [56, 150], hombro: [78, 148], codo: [88, 158], mano: [104, 164],
            cadera: [120, 124], rodilla: [148, 128], tobillo: [164, 176], pie: [182, 176]
        },
        puenteUnaArriba: {
            cabeza: [56, 150], hombro: [78, 148], codo: [88, 158], mano: [104, 164],
            cadera: [120, 124], rodilla: [158, 118], tobillo: [186, 112], pie: [202, 108]
        },
        supermanAbajo: {
            cabeza: [52, 150], hombro: [72, 152], codo: [52, 148], mano: [32, 144],
            cadera: [130, 158], rodilla: [160, 166], tobillo: [190, 170], pie: [204, 174]
        },
        supermanArriba: {
            cabeza: [56, 138], hombro: [74, 144], codo: [54, 136], mano: [34, 128],
            cadera: [130, 150], rodilla: [160, 152], tobillo: [190, 154], pie: [204, 158]
        },
        gatoA: {
            cabeza: [68, 116], hombro: [86, 124], codo: [80, 150], mano: [64, 174],
            cadera: [148, 118], rodilla: [150, 156], tobillo: [170, 174], pie: [182, 174]
        },
        gatoB: {
            cabeza: [62, 126], hombro: [84, 132], codo: [78, 154], mano: [64, 174],
            cadera: [148, 108], rodilla: [150, 156], tobillo: [170, 174], pie: [182, 174]
        },
        estiramiento: {
            cabeza: [72, 118], hombro: [88, 128], codo: [70, 142], mano: [50, 156],
            cadera: [132, 158], rodilla: [164, 164], tobillo: [188, 168], pie: [202, 172]
        },

        // --- Espalda: remo y face pull ---
        remoAbajo: {
            cabeza: [94, 64], hombro: [106, 80], codo: [112, 102], mano: [116, 126],
            cadera: [128, 106], rodilla: [124, 140], tobillo: [118, 176], pie: [136, 176]
        },
        remoArriba: {
            cabeza: [94, 64], hombro: [106, 80], codo: [128, 84], mano: [120, 108],
            cadera: [128, 106], rodilla: [124, 140], tobillo: [118, 176], pie: [136, 176]
        },
        pajaroAbajo: {
            cabeza: [94, 64], hombro: [106, 80], codo: [100, 102], mano: [96, 124],
            cadera: [128, 106], rodilla: [124, 140], tobillo: [118, 176], pie: [136, 176]
        },
        pajaroArriba: {
            cabeza: [94, 64], hombro: [106, 80], codo: [92, 68], mano: [74, 58],
            cadera: [128, 106], rodilla: [124, 140], tobillo: [118, 176], pie: [136, 176]
        },
        remosInvertidosAbajo: {
            cabeza: [76, 140], hombro: [94, 142], codo: [86, 120], mano: [80, 104],
            cadera: [146, 146], rodilla: [176, 152], tobillo: [204, 160], pie: [216, 166]
        },
        remosInvertidosArriba: {
            cabeza: [76, 132], hombro: [94, 130], codo: [86, 114], mano: [80, 104],
            cadera: [146, 140], rodilla: [176, 150], tobillo: [204, 158], pie: [216, 164]
        },

        // --- Vista frontal ---
        frenteBase: {
            cabeza: [120, 34], hombro: [120, 52], cadera: [120, 104],
            codoI: [104, 72], manoI: [100, 94], codoD: [136, 72], manoD: [140, 94],
            rodillaI: [112, 140], pieI: [108, 176], rodillaD: [128, 140], pieD: [132, 176]
        },
        frenteAbierto: {
            cabeza: [120, 34], hombro: [120, 52], cadera: [120, 104],
            codoI: [94, 36], manoI: [72, 20], codoD: [146, 36], manoD: [168, 20],
            rodillaI: [102, 140], pieI: [76, 176], rodillaD: [138, 140], pieD: [164, 176]
        },
        frenteLateral: {
            cabeza: [120, 34], hombro: [120, 52], cadera: [120, 104],
            codoI: [94, 60], manoI: [68, 52], codoD: [146, 60], manoD: [172, 52],
            rodillaI: [112, 140], pieI: [108, 176], rodillaD: [128, 140], pieD: [132, 176]
        },
        frentePressAbajo: {
            cabeza: [120, 34], hombro: [120, 52], cadera: [120, 104],
            codoI: [100, 64], manoI: [94, 48], codoD: [140, 64], manoD: [146, 48],
            rodillaI: [112, 140], pieI: [108, 176], rodillaD: [128, 140], pieD: [132, 176]
        },
        frentePressArriba: {
            cabeza: [120, 34], hombro: [120, 52], cadera: [120, 104],
            codoI: [108, 40], manoI: [106, 16], codoD: [132, 40], manoD: [134, 16],
            rodillaI: [112, 140], pieI: [108, 176], rodillaD: [128, 140], pieD: [132, 176]
        },
        frenteCirculoArriba: {
            cabeza: [120, 34], hombro: [120, 52], cadera: [120, 104],
            codoI: [108, 32], manoI: [108, 10], codoD: [132, 32], manoD: [132, 10],
            rodillaI: [112, 140], pieI: [108, 176], rodillaD: [128, 140], pieD: [132, 176]
        },
        frenteDominadaAbajo: {
            cabeza: [120, 60], hombro: [120, 74], cadera: [120, 116],
            codoI: [100, 50], manoI: [96, 30], codoD: [140, 50], manoD: [144, 30],
            rodillaI: [114, 146], pieI: [112, 178], rodillaD: [126, 146], pieD: [128, 178]
        },
        frenteDominadaArriba: {
            cabeza: [120, 50], hombro: [120, 64], cadera: [120, 102],
            codoI: [94, 44], manoI: [96, 30], codoD: [146, 44], manoD: [144, 30],
            rodillaI: [110, 132], pieI: [102, 156], rodillaD: [130, 132], pieD: [138, 156]
        },
        frenteColgadoAbajo: {
            cabeza: [120, 58], hombro: [120, 72], cadera: [120, 114],
            codoI: [104, 50], manoI: [96, 30], codoD: [136, 50], manoD: [144, 30],
            rodillaI: [114, 146], pieI: [112, 178], rodillaD: [126, 146], pieD: [128, 178]
        },
        frenteColgadoArriba: {
            cabeza: [120, 54], hombro: [120, 68], cadera: [120, 106],
            codoI: [104, 48], manoI: [96, 30], codoD: [136, 48], manoD: [144, 30],
            rodillaI: [104, 110], pieI: [94, 88], rodillaD: [136, 110], pieD: [146, 88]
        },
        frenteFaceAbajo: {
            cabeza: [120, 42], hombro: [120, 58], cadera: [120, 110],
            codoI: [102, 74], manoI: [108, 60], codoD: [138, 74], manoD: [132, 60],
            rodillaI: [112, 142], pieI: [108, 176], rodillaD: [128, 142], pieD: [132, 176]
        },
        frenteFaceArriba: {
            cabeza: [120, 42], hombro: [120, 58], cadera: [120, 110],
            codoI: [94, 58], manoI: [104, 50], codoD: [146, 58], manoD: [136, 50],
            rodillaI: [112, 142], pieI: [108, 176], rodillaD: [128, 142], pieD: [132, 176]
        },
        frenteTorsionA: {
            cabeza: [116, 42], hombro: [116, 58], cadera: [118, 108],
            codoI: [100, 74], manoI: [88, 88], codoD: [132, 76], manoD: [96, 90],
            rodillaI: [106, 136], pieI: [90, 170], rodillaD: [134, 136], pieD: [150, 170]
        },
        frenteTorsionB: {
            cabeza: [124, 42], hombro: [124, 58], cadera: [118, 108],
            codoI: [108, 76], manoI: [144, 90], codoD: [140, 74], manoD: [152, 88],
            rodillaI: [106, 136], pieI: [90, 170], rodillaD: [134, 136], pieD: [150, 170]
        }
    };

    function patron(posturas, duracion, pista, extra) {
        return Object.assign({ posturas: posturas, duracion: duracion, pista: pista }, extra || {});
    }

    const PATRONES = {
        sentadilla: patron([POSTURAS.dePie, POSTURAS.sentadillaAbajo], 2.6,
            'Baja la cadera hacia atrás y abajo, con el pecho arriba y las rodillas siguiendo la punta de los pies.'),
        zancada: patron([POSTURAS.dePie, POSTURAS.zancadaAbajo], 2.6,
            'Da un paso al frente y baja la rodilla trasera sin tocar el suelo. Empuja con la pierna delantera para volver.', { offsetLejano: [10, 3] }),
        zancadaLateral: patron([POSTURAS.dePie, POSTURAS.zancadaLateralAbajo], 2.8,
            'Abre un pie hacia el lado y lleva la cadera atrás, manteniendo el otro pie firme. Empuja para volver al centro.', { offsetLejano: [16, 4] }),
        zancadaSalto: patron([POSTURAS.zancadaAbajo, POSTURAS.zancadaAire], 1.8,
            'Baja a la zancada y salta para cambiar de pierna, cayendo con las rodillas flexibles.', { offsetLejano: [10, 3] }),
        sentadillaSalto: patron([POSTURAS.dePie, POSTURAS.sentadillaAbajo, POSTURAS.sentadillaAire], 2.4,
            'Baja a la sentadilla y salta hacia arriba. Aterriza suave, con las rodillas alineadas.'),
        sentadillaPared: patron([POSTURAS.paredAbajo], 0,
            'Espalda apoyada en la pared, muslos paralelos al suelo y rodillas a 90 grados. Mantén la posición.', { hold: true, props: [{ tipo: 'pared', x: 74 }] }),
        bulgara: patron([POSTURAS.bulgaraArriba, POSTURAS.bulgaraAbajo], 2.8,
            'Pie trasero elevado en la silla. Baja controlando la pierna delantera y empuja con el talón.', { props: [{ tipo: 'silla', x: 150, y: 140, ancho: 64, respaldo: true }] }),
        talones: patron([POSTURAS.dePie, POSTURAS.talonesArriba], 1.8,
            'Sube los talones todo lo que puedas y baja despacio, sin perder el equilibrio.'),
        talonesEscalon: patron([POSTURAS.talonesEscalonAbajo, POSTURAS.talonesEscalonArriba], 1.8,
            'Puntas de los pies en el escalón. Deja bajar los talones y sube con control.', { props: [{ tipo: 'escalon', x: 100, y: 160, ancho: 90 }] }),
        hipThrust: patron([POSTURAS.hipThrustAbajo, POSTURAS.hipThrustArriba], 2.4,
            'Apoya la espalda alta en el banco. Sube la cadera apretando los glúteos y baja sin perder el control.', { props: [{ tipo: 'banco', x: 36, y: 142, ancho: 56 }], peso: 'cadera' }),
        stepUp: patron([POSTURAS.stepAbajo, POSTURAS.stepArriba], 2.2,
            'Sube al escalón empujando con la pierna de arriba. Baja controlado y repite.', { props: [{ tipo: 'escalon', x: 112, y: 160, ancho: 92 }] }),
        puente: patron([POSTURAS.puenteAbajo, POSTURAS.puenteArriba], 2.4,
            'Tumbado, pies apoyados y rodillas dobladas. Sube la cadera apretando los glúteos y baja sin arquear la espalda.'),
        puenteUna: patron([POSTURAS.puenteAbajo, POSTURAS.puenteUnaArriba], 2.8,
            'Con una pierna extendida, sube la cadera con la otra. Mantén la pelvis nivelada.'),

        flexion: patron([POSTURAS.flexionArriba, POSTURAS.flexionAbajo], 2.4,
            'Mantén el cuerpo en línea recta. Baja el pecho con los codos cerca del torso y empuja sin arquear la espalda.', { guia: true }),
        flexionRodillas: patron([POSTURAS.flexionRodillasArriba, POSTURAS.flexionRodillasAbajo], 2.4,
            'Apoya las rodillas y mantén la línea desde las rodillas hasta la cabeza. Baja el pecho con control.', { guia: true }),
        flexionInclinada: patron([POSTURAS.flexionInclinadaArriba, POSTURAS.flexionInclinadaAbajo], 2.4,
            'Manos en la silla. Baja el pecho manteniendo el cuerpo recto y los codos cerca del torso.', { props: [{ tipo: 'silla', x: 40, y: 148, ancho: 56 }], guia: true }),
        flexionDeclinada: patron([POSTURAS.flexionDeclinadaArriba, POSTURAS.flexionDeclinadaAbajo], 2.4,
            'Pies elevados en la silla. Mantén el cuerpo recto y baja el pecho con control.', { props: [{ tipo: 'silla', x: 186, y: 140, ancho: 40 }], guia: true }),
        plancha: patron([POSTURAS.plancha], 0,
            'Antebrazos y puntas de los pies en el suelo. Aprieta el abdomen y mantén una línea recta de la cabeza a los talones.', { hold: true, guia: true, nucleo: [150, 140] }),
        planchaPierna: patron([POSTURAS.plancha, POSTURAS.planchaPiernaArriba], 2.8,
            'En plancha, eleva una pierna sin mover la cadera. Baja y alterna.', { guia: true, nucleo: [150, 140] }),
        planchaHombro: patron([POSTURAS.flexionArriba, POSTURAS.planchaHombroArriba], 2.4,
            'En plancha alta, toca el hombro contrario con una mano sin balancear la cadera.', { guia: true }),
        planchaLateral: patron([POSTURAS.planchaLateral], 0,
            'Apoya el antebrazo y el lateral del pie. Mantén la cadera arriba y el cuerpo en línea.', { hold: true, guia: true, nucleo: [140, 150] }),
        planchaLateralToque: patron([POSTURAS.planchaLateral, POSTURAS.planchaLateralAbajo], 3.0,
            'En plancha lateral, baja la cadera sin tocar el suelo y vuelve a subir con control.', { guia: true }),
        escaladores: patron([POSTURAS.escaladoresAbajo, POSTURAS.escaladoresArriba], 1.8,
            'En plancha alta, lleva una rodilla al pecho y alterna a ritmo constante sin perder la espalda neutra.', { guia: true }),
        fondos: patron([POSTURAS.fondosAbajo, POSTURAS.fondosArriba], 2.4,
            'Manos en el borde de la silla, codos hacia atrás. Baja el cuerpo y empuja sin encoger los hombros.', { props: [{ tipo: 'silla', x: 140, y: 140, ancho: 60 }] }),
        fondosEstirados: patron([POSTURAS.fondosEstiradosAbajo, POSTURAS.fondosEstiradosArriba], 2.4,
            'Piernas estiradas al frente. Baja y sube con los codos apuntando atrás.', { props: [{ tipo: 'silla', x: 140, y: 140, ancho: 60 }] }),

        curl: patron([POSTURAS.dePie, POSTURAS.curlArriba], 2.0,
            'Codo pegado al torso. Sube el peso sin balancear el cuerpo y baja despacio.', { peso: true }),
        elevacionLateral: patron([POSTURAS.frenteBase, POSTURAS.frenteLateral], 2.4,
            'Sube los brazos hacia los lados hasta la altura de los hombros, sin encoger el cuello.', { vista: 'frente', peso: true }),
        elevacionFrontal: patron([POSTURAS.dePie, POSTURAS.elevacionFrontalArriba], 2.4,
            'Sube los brazos al frente hasta la altura de los hombros y baja controlando el peso.', { peso: true }),
        circulos: patron([POSTURAS.frenteBase, POSTURAS.frenteLateral, POSTURAS.frenteCirculoArriba, POSTURAS.frenteLateral], 2.8,
            'Haz círculos amplios y controlados con los brazos, sin mover el tronco.', { vista: 'frente' }),
        pressHombros: patron([POSTURAS.frentePressAbajo, POSTURAS.frentePressArriba], 2.4,
            'Empuja los pesos por encima de la cabeza sin arquear la espalda. Baja con control.', { vista: 'frente', peso: true }),
        patadaTriceps: patron([POSTURAS.patadaAbajo, POSTURAS.patadaArriba], 2.0,
            'Codo fijo y pegado al torso. Extiende el antebrazo hacia atrás y vuelve despacio.', { peso: true }),

        aperturas: patron([POSTURAS.aperturasArriba, POSTURAS.aperturasAbierta], 2.4,
            'Tumbado, abre los brazos con los codos ligeramente flexionados. Siente el pecho y vuelve.', { peso: true }),
        pressSuelo: patron([POSTURAS.pressSueloAbajo, POSTURAS.pressSueloArriba], 2.2,
            'Tumbado, empuja los pesos hacia arriba sin bloquear los codos. Baja con control.', { peso: true }),

        crunch: patron([POSTURAS.crunchAbajo, POSTURAS.crunchArriba], 2.2,
            'Despega los omóplatos del suelo sin tirar del cuello. Baja controlando el abdomen.'),
        crunchSuave: patron([POSTURAS.crunchAbajo, POSTURAS.crunchSuaveArriba], 2.2,
            'Haz un crunch corto y suave. Despega solo los omóplatos y mantén el cuello relajado.'),
        tijeras: patron([POSTURAS.elevacionPiernasArriba, POSTURAS.elevacionPiernasAbajo], 1.6,
            'Tumbado, eleva las piernas y alterna arriba y abajo sin tocar el suelo con los talones.'),
        elevacionPiernas: patron([POSTURAS.elevacionPiernasAbajo, POSTURAS.elevacionPiernasArriba], 2.4,
            'Tumbado, sube las piernas manteniendo la espalda baja pegada al suelo. Baja despacio.'),
        hollow: patron([POSTURAS.hollow], 0,
            'Tumbado, eleva hombros y piernas formando una banana. Aprieta el abdomen y mantén la espalda baja cerca del suelo.', { hold: true, nucleo: [118, 148] }),
        deadBug: patron([POSTURAS.deadBugA, POSTURAS.deadBugB], 2.8,
            'Tumbado, extiende un brazo y la pierna contraria sin despegar la espalda baja. Vuelve y cambia.'),
        superman: patron([POSTURAS.supermanAbajo, POSTURAS.supermanArriba], 2.4,
            'Boca abajo, eleva brazos y piernas a la vez. Mantén el cuello largo y baja con control.'),
        gatoCamello: patron([POSTURAS.gatoA, POSTURAS.gatoB], 3.0,
            'A cuatro patas, alterna redondear la espalda y arquearla. Mueve despacio y respira.'),
        estiramiento: patron([POSTURAS.estiramiento], 0,
            'Sentado, alarga la espalda y lleva las manos hacia los pies. Respira y suelta sin rebotar.', { hold: true }),

        remo: patron([POSTURAS.remoAbajo, POSTURAS.remoArriba], 2.0,
            'Espalda larga y rodillas suaves. Tira del peso llevando el codo hacia atrás, sin encoger el hombro.', { peso: true }),
        pajaro: patron([POSTURAS.pajaroAbajo, POSTURAS.pajaroArriba], 2.0,
            'Inclinado, abre los brazos hacia los lados apretando la espalda. Baja con control.', { peso: true }),
        remosInvertidos: patron([POSTURAS.remosInvertidosAbajo, POSTURAS.remosInvertidosArriba], 2.4,
            'Bajo la mesa, tira del borde para subir el pecho. Mantén el cuerpo recto y los codos cerca.', { props: [{ tipo: 'mesa', x1: 36, x2: 204, y: 104 }] }),
        facePull: patron([POSTURAS.frenteFaceAbajo, POSTURAS.frenteFaceArriba], 2.2,
            'Tira de la banda hacia la cara, con los codos altos y abiertos. Aprieta la espalda alta.', { vista: 'frente', props: [{ tipo: 'banda', ancla: [120, 18] }] }),

        dominadas: patron([POSTURAS.frenteDominadaAbajo, POSTURAS.frenteDominadaArriba], 2.4,
            'Cuelga de la barra y tira con la espalda hasta subir el pecho. Baja controlado, sin balanceo.', { vista: 'frente', props: [{ tipo: 'barra', x1: 80, x2: 160, y: 28 }] }),
        elevacionColgado: patron([POSTURAS.frenteColgadoAbajo, POSTURAS.frenteColgadoArriba], 2.4,
            'Colgado de la barra, eleva las piernas sin balancear el cuerpo. Baja despacio.', { vista: 'frente', props: [{ tipo: 'barra', x1: 80, x2: 160, y: 28 }] }),
        torsion: patron([POSTURAS.frenteTorsionA, POSTURAS.frenteTorsionB], 2.4,
            'Sentado, gira el torso de un lado a otro manteniendo el pecho arriba y el abdomen activo.', { vista: 'frente', peso: true }),

        jumpingJack: patron([POSTURAS.frenteBase, POSTURAS.frenteAbierto], 1.4,
            'Abre y cierra piernas y brazos a la vez, saltando suave y cayendo con las rodillas flexibles.', { vista: 'frente' }),

        burpeeBasico: patron([POSTURAS.dePie, POSTURAS.sentadillaAbajo, POSTURAS.flexionArriba], 3.2,
            'Baja a la sentadilla, lleva las manos al suelo y pasa a plancha. Vuelve a la sentadilla y levántate.', { guia: true }),
        burpeeCompleto: patron([POSTURAS.dePie, POSTURAS.sentadillaAbajo, POSTURAS.flexionArriba, POSTURAS.sentadillaAire], 3.6,
            'Sentadilla, plancha, flexión y salto. Mantén el abdomen firme y aterriza suave.', { guia: true })
    };

    const ANIMACIONES = {
        sentadilla_clasica: { patron: 'sentadilla' },
        zancada_frontal: { patron: 'zancada' },
        saltos_tijera: { patron: 'jumpingJack' },
        escaladores: { patron: 'escaladores' },
        flexiones_inclinadas: { patron: 'flexionInclinada' },
        flexiones_rodillas: { patron: 'flexionRodillas' },
        flexiones_clasicas: { patron: 'flexion' },
        flexiones_manos_separadas: { patron: 'flexion', pista: 'Manos más abiertas que los hombros. Baja controlado y mantén el core firme.' },
        flexiones_diamante: { patron: 'flexion', pista: 'Manos juntas formando un diamante. Baja con los codos cerca del torso y empuja con fuerza.' },
        flexiones_declinadas: { patron: 'flexionDeclinada' },
        aperturas_botellas: { patron: 'aperturas', peso: true },
        aperturas_peso: { patron: 'aperturas', peso: true },
        press_suelo_botellas: { patron: 'pressSuelo', peso: true },
        press_suelo_peso: { patron: 'pressSuelo', peso: true },
        curl_botellas: { patron: 'curl', peso: true },
        curl_mochila: { patron: 'curl', peso: true },
        curl_peso: { patron: 'curl', peso: true },
        curl_martillo: { patron: 'curl', peso: true, pista: 'Codo pegado al torso y palmas enfrentadas. Sube y baja sin balancear el cuerpo.' },
        elevaciones_laterales: { patron: 'elevacionLateral', peso: true },
        elevaciones_frontales: { patron: 'elevacionFrontal', peso: true },
        circulos_brazos: { patron: 'circulos' },
        fondos_silla: { patron: 'fondos' },
        fondos_piernas_estiradas: { patron: 'fondosEstirados' },
        dominadas: { patron: 'dominadas' },
        patada_triceps: { patron: 'patadaTriceps', peso: true },
        press_hombros: { patron: 'pressHombros', peso: true },
        puente_gluteo: { patron: 'puente' },
        puente_una_pierna: { patron: 'puenteUna' },
        elevacion_talones: { patron: 'talones' },
        elevacion_talones_escalon: { patron: 'talonesEscalon' },
        sentadilla_pared: { patron: 'sentadillaPared' },
        zancadas_laterales: { patron: 'zancadaLateral' },
        sentadilla_salto: { patron: 'sentadillaSalto' },
        zancadas_alternas: { patron: 'zancada', duracion: 2.2, pista: 'Alterna una pierna y otra, bajando la rodilla trasera sin tocar el suelo.' },
        zancadas_salto: { patron: 'zancadaSalto' },
        sentadilla_bulgara: { patron: 'bulgara' },
        hip_thrust: { patron: 'hipThrust', peso: 'cadera' },
        step_up: { patron: 'stepUp' },
        crunches_suaves: { patron: 'crunchSuave' },
        crunches: { patron: 'crunch' },
        plancha_abdominal: { patron: 'plancha' },
        plancha_lateral: { patron: 'planchaLateral' },
        plancha_elevacion_pierna: { patron: 'planchaPierna' },
        plancha_lateral_toque: { patron: 'planchaLateralToque' },
        plancha_toque_hombro: { patron: 'planchaHombro' },
        tijeras_abdominales: { patron: 'tijeras' },
        elevaciones_piernas: { patron: 'elevacionPiernas' },
        elevaciones_piernas_colgado: { patron: 'elevacionColgado' },
        torsiones_tronco: { patron: 'torsion' },
        hollow_hold: { patron: 'hollow' },
        dead_bug: { patron: 'deadBug' },
        superman: { patron: 'superman' },
        superman_peso: { patron: 'superman', peso: true },
        remo_mochila: { patron: 'remo', peso: true },
        remo_peso: { patron: 'remo', peso: true },
        remos_invertidos: { patron: 'remosInvertidos' },
        pajaro: { patron: 'pajaro', peso: true },
        face_pull: { patron: 'facePull' },
        gato_camello: { patron: 'gatoCamello' },
        estiramiento_espalda: { patron: 'estiramiento' },
        burpees_basicos: { patron: 'burpeeBasico' },
        burpees_completos: { patron: 'burpeeCompleto' },
        escaladores_intensos: { patron: 'escaladores', duracion: 1.4, pista: 'Ritmo alto en plancha alta. Lleva las rodillas al pecho sin perder la espalda neutra.' }
    };

    // ===== PASOS Y CLAVES PARA ENTENDER LA TÉCNICA =====
    function tecnica(pasos, clave, respira) {
        return {
            pasos: pasos || [],
            clave: clave || '',
            respira: respira || ''
        };
    }

    const TECNICA = {
        sentadilla: tecnica(
            ['Pies al ancho de los hombros y pecho arriba.', 'Baja la cadera como si te sentaras, con las rodillas alineadas.', 'Empuja con los talones y vuelve a subir.'],
            'No dejes que las rodillas se metan hacia dentro.',
            'Inhala al bajar, exhala al subir.'
        ),
        zancada: tecnica(
            ['Da un paso al frente y apoya bien el pie.', 'Baja la rodilla trasera sin tocar el suelo.', 'Empuja con la pierna delantera para volver.'],
            'Mantén el torso erguido y la rodilla delantera sobre el pie.'
        ),
        zancadaLateral: tecnica(
            ['Abre un pie hacia el lado.', 'Lleva la cadera atrás manteniendo el otro pie firme.', 'Empuja para volver al centro.'],
            'No dejes que la rodilla se vaya hacia dentro.'
        ),
        zancadaSalto: tecnica(
            ['Baja a la zancada.', 'Salta y cambia de pierna.', 'Aterriza con las rodillas flexibles.'],
            'Aterriza suave, sin hacer ruido.'
        ),
        sentadillaSalto: tecnica(
            ['Baja a la sentadilla.', 'Salta hacia arriba.', 'Aterriza con las rodillas alineadas.'],
            'Aterriza suave y recupera el equilibrio antes de repetir.'
        ),
        sentadillaPared: tecnica(
            ['Apoya la espalda en la pared y separa los pies.', 'Baja hasta que los muslos queden paralelos al suelo.', 'Mantén la posición respirando.'],
            'Rodillas a 90 grados y espalda apoyada.',
            'Respira despacio; no aguantes el aire.'
        ),
        bulgara: tecnica(
            ['Pon el pie trasero elevado en una silla.', 'Baja controlando la pierna delantera.', 'Empuja con el talón para subir.'],
            'La mayor parte del peso va en la pierna delantera.'
        ),
        talones: tecnica(
            ['De pie, sube los talones todo lo que puedas.', 'Aguanta arriba un segundo.', 'Baja despacio.'],
            'No te balances hacia delante.'
        ),
        talonesEscalon: tecnica(
            ['Puntas de los pies en el escalón.', 'Deja bajar los talones.', 'Sube con control.'],
            'Usa una pared para mantener el equilibrio.'
        ),
        hipThrust: tecnica(
            ['Apoya la espalda alta en el banco.', 'Sube la cadera apretando los glúteos.', 'Baja sin perder el control.'],
            'No arquees la espalda al subir.'
        ),
        stepUp: tecnica(
            ['Pon un pie completo en el escalón.', 'Sube empujando con esa pierna.', 'Baja controlado y cambia de lado.'],
            'No impulses con la pierna que queda en el suelo.'
        ),
        puente: tecnica(
            ['Tumbado, pies apoyados y rodillas dobladas.', 'Sube la cadera apretando los glúteos.', 'Baja sin arquear la espalda.'],
            'Empuja con los talones, no con la lumbar.'
        ),
        puenteUna: tecnica(
            ['Tumbado, extiende una pierna.', 'Sube la cadera con la otra.', 'Mantén la pelvis nivelada y baja.'],
            'No dejes que la cadera se caiga hacia un lado.'
        ),
        flexion: tecnica(
            ['Cuerpo en línea recta, manos bajo los hombros.', 'Baja el pecho con los codos cerca del torso.', 'Empuja sin arquear la espalda.'],
            'Aprieta el abdomen y los glúteos.'
        ),
        flexionRodillas: tecnica(
            ['Apoya las rodillas y cruza los tobillos.', 'Mantén la línea desde las rodillas hasta la cabeza.', 'Baja el pecho con control.'],
            'No dejes caer la cadera.'
        ),
        flexionInclinada: tecnica(
            ['Manos en una silla o superficie firme.', 'Cuerpo recto y codos cerca del torso.', 'Baja el pecho y empuja.'],
            'Cuanto más alta la superficie, más fácil.'
        ),
        flexionDeclinada: tecnica(
            ['Pies elevados en una silla.', 'Mantén el cuerpo recto.', 'Baja el pecho con control.'],
            'No levantes la cadera para compensar.'
        ),
        plancha: tecnica(
            ['Antebrazos y puntas de los pies en el suelo.', 'Aprieta abdomen y glúteos.', 'Mantén una línea recta de la cabeza a los talones.'],
            'No dejes caer la cadera ni subas el trasero.',
            'Respira lento y constante.'
        ),
        planchaPierna: tecnica(
            ['Colócate en plancha.', 'Eleva una pierna sin mover la cadera.', 'Baja y alterna.'],
            'La cadera debe quedar nivelada.'
        ),
        planchaHombro: tecnica(
            ['En plancha alta.', 'Toca el hombro contrario con una mano.', 'Vuelve y alterna sin balancear la cadera.'],
            'Abre un poco los pies para tener más estabilidad.'
        ),
        planchaLateral: tecnica(
            ['Apoya el antebrazo y el lateral del pie.', 'Sube la cadera.', 'Mantén el cuerpo en línea.'],
            'No dejes que la cadera caiga hacia el suelo.',
            'Respira sin bloquear el aire.'
        ),
        planchaLateralToque: tecnica(
            ['En plancha lateral.', 'Baja la cadera sin tocar el suelo.', 'Sube con control.'],
            'El movimiento es corto; no gires el torso.'
        ),
        escaladores: tecnica(
            ['En plancha alta.', 'Lleva una rodilla al pecho.', 'Alterna sin perder la espalda neutra.'],
            'La cadera se queda quieta; solo se mueven las piernas.'
        ),
        fondos: tecnica(
            ['Manos en el borde de la silla.', 'Codos hacia atrás y cerca del cuerpo.', 'Baja y empuja sin encoger los hombros.'],
            'Si te cuesta, dobla más las rodillas.'
        ),
        fondosEstirados: tecnica(
            ['Piernas estiradas al frente.', 'Baja con los codos apuntando atrás.', 'Empuja para subir.'],
            'No bloquees los codos de golpe.'
        ),
        curl: tecnica(
            ['Codo pegado al torso.', 'Sube el peso sin balancear el cuerpo.', 'Baja despacio.'],
            'No uses impulso de la espalda.'
        ),
        elevacionLateral: tecnica(
            ['Brazos a los lados con codos suaves.', 'Sube hasta la altura de los hombros.', 'Baja controlando.'],
            'No encojas el cuello ni subas los hombros.'
        ),
        elevacionFrontal: tecnica(
            ['Brazos al frente.', 'Sube hasta la altura de los hombros.', 'Baja controlando.'],
            'Mantén el abdomen firme para no arquear la espalda.'
        ),
        circulos: tecnica(
            ['Brazos abiertos a los lados.', 'Haz círculos amplios y controlados.', 'Cambia de sentido sin mover el tronco.'],
            'El movimiento sale del hombro, no de la espalda.'
        ),
        pressHombros: tecnica(
            ['Pesos a la altura de los hombros.', 'Empuja hacia arriba sin arquear la espalda.', 'Baja con control.'],
            'No bloquees los codos con golpe.'
        ),
        patadaTriceps: tecnica(
            ['Codo fijo y pegado al torso.', 'Extiende el antebrazo hacia atrás.', 'Vuelve despacio.'],
            'Solo se mueve el antebrazo.'
        ),
        aperturas: tecnica(
            ['Tumbado, brazos arriba con codos suaves.', 'Abre los brazos hacia los lados.', 'Siente el pecho y vuelve.'],
            'No bajes los brazos más allá de lo cómodo.'
        ),
        pressSuelo: tecnica(
            ['Tumbado, pesos a los lados del pecho.', 'Empuja hacia arriba.', 'Baja sin bloquear los codos.'],
            'Mantén las muñecas firmes.'
        ),
        crunch: tecnica(
            ['Tumbado, rodillas dobladas y pies apoyados.', 'Despega los omóplatos sin tirar del cuello.', 'Baja controlando el abdomen.'],
            'El movimiento es corto; no te sientes del todo.'
        ),
        crunchSuave: tecnica(
            ['Tumbado, cuello relajado.', 'Despega solo los omóplatos.', 'Baja suave.'],
            'No tires de la cabeza con las manos.'
        ),
        tijeras: tecnica(
            ['Tumbado, piernas elevadas.', 'Alterna una pierna arriba y otra abajo.', 'Sin tocar el suelo con los talones.'],
            'Mantén la espalda baja cerca del suelo.'
        ),
        elevacionPiernas: tecnica(
            ['Tumbado, espalda baja pegada al suelo.', 'Sube las piernas manteniendo el control.', 'Baja despacio.'],
            'Si la lumbar se despega, baja menos las piernas.'
        ),
        hollow: tecnica(
            ['Tumbado, eleva hombros y piernas.', 'Aprieta el abdomen formando una banana.', 'Mantén la lumbar cerca del suelo.'],
            'Si te cuesta, dobla las rodillas.',
            'Respira corto y constante.'
        ),
        deadBug: tecnica(
            ['Tumbado, brazos y rodillas arriba.', 'Extiende un brazo y la pierna contraria.', 'Vuelve y cambia.'],
            'La espalda baja no debe despegarse del suelo.'
        ),
        superman: tecnica(
            ['Boca abajo, brazos al frente.', 'Eleva brazos y piernas a la vez.', 'Baja con control.'],
            'Mantén el cuello largo; no mires al techo.'
        ),
        gatoCamello: tecnica(
            ['A cuatro patas, manos bajo los hombros.', 'Redondea la espalda y luego arquéala.', 'Mueve despacio y respira.'],
            'No fuerces el rango; busca movilidad cómoda.'
        ),
        estiramiento: tecnica(
            ['Sentado, piernas al frente.', 'Alarga la espalda y lleva las manos hacia los pies.', 'Respira y suelta sin rebotar.'],
            'No tires de la espalda; alarga primero.',
            'Respira profundo y mantén.'
        ),
        remo: tecnica(
            ['Espalda larga y rodillas suaves.', 'Tira del peso llevando el codo hacia atrás.', 'Baja controlando.'],
            'No encojas el hombro ni redondees la espalda.'
        ),
        pajaro: tecnica(
            ['Inclinado, espalda recta.', 'Abre los brazos apretando la espalda.', 'Baja con control.'],
            'El movimiento es corto; no uses impulso.'
        ),
        remosInvertidos: tecnica(
            ['Bajo una mesa firme.', 'Tira del borde para subir el pecho.', 'Mantén el cuerpo recto y los codos cerca.'],
            'Cuanto más horizontal el cuerpo, más difícil.'
        ),
        facePull: tecnica(
            ['Banda a la altura de la cara.', 'Tira con los codos altos y abiertos.', 'Aprieta la espalda alta.'],
            'No encorves el torso para acercar la banda.'
        ),
        dominadas: tecnica(
            ['Cuelga de la barra con brazos extendidos.', 'Tira hasta subir el pecho.', 'Baja controlado, sin balanceo.'],
            'Si no sale una dominada, usa una silla o banda para asistirte.'
        ),
        elevacionColgado: tecnica(
            ['Colgado de la barra.', 'Eleva las piernas sin balancear el cuerpo.', 'Baja despacio.'],
            'Si el cuerpo se balancea, baja las piernas y reinicia.'
        ),
        torsion: tecnica(
            ['Sentado, pecho arriba y abdomen activo.', 'Gira el torso de un lado a otro.', 'Mantén el movimiento controlado.'],
            'No uses los brazos para tirar del torso.'
        ),
        jumpingJack: tecnica(
            ['De pie, brazos abajo.', 'Abre piernas y brazos a la vez.', 'Cierra y aterriza suave.'],
            'Si molesta el impacto, hazlo sin salto.'
        ),
        burpeeBasico: tecnica(
            ['Baja a sentadilla y lleva las manos al suelo.', 'Pasa a plancha.', 'Vuelve a sentadilla y levántate.'],
            'No hace falta flexión ni salto en esta versión.'
        ),
        burpeeCompleto: tecnica(
            ['Baja a sentadilla y pasa a plancha.', 'Haz una flexión.', 'Sube, salta y aterriza suave.'],
            'Si pierdes la técnica, vuelve a la versión básica.'
        )
    };

    // Movimiento que se resalta con una flecha en la animación.
    const FLECHAS = {
        sentadilla: { punto: 'cadera', etiqueta: 'Baja y sube' },
        zancada: { punto: 'cadera', etiqueta: 'Baja y sube' },
        zancadaLateral: { punto: 'cadera', etiqueta: 'Abre y vuelve' },
        zancadaSalto: { punto: 'cadera', etiqueta: 'Salta' },
        sentadillaSalto: { punto: 'cadera', etiqueta: 'Salta' },
        sentadillaPared: { punto: 'cadera', etiqueta: 'Baja' },
        bulgara: { punto: 'cadera', etiqueta: 'Baja y sube' },
        hipThrust: { punto: 'cadera', etiqueta: 'Sube' },
        stepUp: { punto: 'cadera', etiqueta: 'Sube' },
        puente: { punto: 'cadera', etiqueta: 'Sube' },
        puenteUna: { punto: 'cadera', etiqueta: 'Sube' },
        flexion: { punto: 'hombro', etiqueta: 'Baja y empuja' },
        flexionRodillas: { punto: 'hombro', etiqueta: 'Baja y empuja' },
        flexionInclinada: { punto: 'hombro', etiqueta: 'Baja y empuja' },
        flexionDeclinada: { punto: 'hombro', etiqueta: 'Baja y empuja' },
        planchaPierna: { punto: 'tobillo', etiqueta: 'Eleva' },
        planchaLateralToque: { punto: 'cadera', etiqueta: 'Sube y baja' },
        escaladores: { punto: 'rodilla', etiqueta: 'Rodilla al pecho' },
        fondos: { punto: 'hombro', etiqueta: 'Baja y sube' },
        fondosEstirados: { punto: 'hombro', etiqueta: 'Baja y sube' },
        curl: { punto: 'mano', etiqueta: 'Sube' },
        elevacionLateral: { punto: 'manoI', etiqueta: 'Sube' },
        elevacionFrontal: { punto: 'mano', etiqueta: 'Sube' },
        pressHombros: { punto: 'manoI', etiqueta: 'Empuja' },
        patadaTriceps: { punto: 'mano', etiqueta: 'Extiende' },
        aperturas: { punto: 'mano', etiqueta: 'Abre' },
        pressSuelo: { punto: 'mano', etiqueta: 'Empuja' },
        crunch: { punto: 'hombro', etiqueta: 'Sube' },
        crunchSuave: { punto: 'hombro', etiqueta: 'Sube' },
        tijeras: { punto: 'tobillo', etiqueta: 'Alterna' },
        elevacionPiernas: { punto: 'tobillo', etiqueta: 'Sube' },
        deadBug: { punto: 'mano', etiqueta: 'Extiende' },
        superman: { punto: 'mano', etiqueta: 'Eleva' },
        gatoCamello: { punto: 'cabeza', etiqueta: 'Redondea' },
        estiramiento: { punto: 'mano', etiqueta: 'Alarga' },
        remo: { punto: 'mano', etiqueta: 'Tira' },
        pajaro: { punto: 'mano', etiqueta: 'Abre' },
        remosInvertidos: { punto: 'hombro', etiqueta: 'Sube' },
        facePull: { punto: 'manoI', etiqueta: 'Tira' },
        dominadas: { punto: 'hombro', etiqueta: 'Sube' },
        elevacionColgado: { punto: 'tobillo', etiqueta: 'Eleva' },
        torsion: { punto: 'manoI', etiqueta: 'Gira' },
        jumpingJack: { punto: 'manoI', etiqueta: 'Abre y cierra' },
        burpeeBasico: { punto: 'cadera', etiqueta: 'Baja y sube' },
        burpeeCompleto: { punto: 'cadera', etiqueta: 'Baja y salta' }
    };

    function redondear(valor) {
        return Math.round(valor * 100) / 100;
    }

    function framesDe(posturas, obtener) {
        const n = posturas.length;
        const frames = [];

        for (let i = 0; i < n; i++) {
            const inicio = i / n;
            const medio = inicio + 0.32 / n;
            const fin = (i + 1) / n;
            const actual = obtener(posturas[i]);
            const siguiente = obtener(posturas[(i + 1) % n]);

            if (i === 0) frames.push({ t: inicio, v: redondear(actual) });
            frames.push({ t: medio, v: redondear(actual) });
            frames.push({ t: fin, v: redondear(siguiente) });
        }

        return frames;
    }

    function animarAtributo(nombre, frames, duracion) {
        if (!frames || frames.length < 2 || !duracion) return '';

        const valores = frames.map(function (f) { return f.v; }).join(';');
        const tiempos = frames.map(function (f) { return f.t.toFixed(4); }).join(';');
        const splines = frames.slice(1).map(function () { return '0.42 0 0.58 1'; }).join(';');

        return '<animate attributeName="' + nombre + '" values="' + valores + '"' +
            ' keyTimes="' + tiempos + '" calcMode="spline" keySplines="' + splines + '"' +
            ' dur="' + duracion + 's" repeatCount="indefinite" />';
    }

    function linea(posturas, desde, hasta, clase, dx, dy, duracion) {
        dx = dx || 0;
        dy = dy || 0;
        const p = posturas[0];
        const a = p[desde];
        const b = p[hasta];
        let attrs = 'x1="' + redondear(a[0] + dx) + '" y1="' + redondear(a[1] + dy) + '"' +
            ' x2="' + redondear(b[0] + dx) + '" y2="' + redondear(b[1] + dy) + '"';
        let animaciones = '';

        if (posturas.length > 1 && duracion > 0) {
            animaciones =
                animarAtributo('x1', framesDe(posturas, function (q) { return q[desde][0] + dx; }), duracion) +
                animarAtributo('y1', framesDe(posturas, function (q) { return q[desde][1] + dy; }), duracion) +
                animarAtributo('x2', framesDe(posturas, function (q) { return q[hasta][0] + dx; }), duracion) +
                animarAtributo('y2', framesDe(posturas, function (q) { return q[hasta][1] + dy; }), duracion);
        }

        return '<line class="' + clase + '" ' + attrs + '>' + animaciones + '</line>';
    }

    function circulo(posturas, clave, clase, radio, dx, dy, duracion) {
        dx = dx || 0;
        dy = dy || 0;
        const p = posturas[0];
        const c = p[clave];
        let attrs = 'cx="' + redondear(c[0] + dx) + '" cy="' + redondear(c[1] + dy) + '" r="' + radio + '"';
        let animaciones = '';

        if (posturas.length > 1 && duracion > 0) {
            animaciones =
                animarAtributo('cx', framesDe(posturas, function (q) { return q[clave][0] + dx; }), duracion) +
                animarAtributo('cy', framesDe(posturas, function (q) { return q[clave][1] + dy; }), duracion);
        }

        return '<circle class="' + clase + '" ' + attrs + '>' + animaciones + '</circle>';
    }

    function lineaBanda(ancla, posturas, clave, duracion) {
        const p = posturas[0][clave];
        const framesX = framesDe(posturas, function (q) { return q[clave][0]; });
        const framesY = framesDe(posturas, function (q) { return q[clave][1]; });

        return '<line class="tecnica-banda" x1="' + ancla[0] + '" y1="' + ancla[1] + '"' +
            ' x2="' + p[0] + '" y2="' + p[1] + '">' +
            animarAtributo('x2', framesX, duracion) +
            animarAtributo('y2', framesY, duracion) +
            '</line>';
    }

    function dibujarProp(prop, posturas, duracion, vista) {
        if (prop.tipo === 'banda') {
            if (vista === 'frente') {
                return lineaBanda(prop.ancla, posturas, 'manoI', duracion) +
                    lineaBanda(prop.ancla, posturas, 'manoD', duracion);
            }
            return lineaBanda(prop.ancla, posturas, 'mano', duracion);
        }

        if (prop.tipo === 'silla') {
            const x = prop.x;
            const y = prop.y;
            const w = prop.ancho || 56;
            let html = '<g class="tecnica-prop">' +
                '<line x1="' + x + '" y1="' + y + '" x2="' + (x + w) + '" y2="' + y + '"></line>' +
                '<line x1="' + (x + 6) + '" y1="' + y + '" x2="' + (x + 6) + '" y2="178"></line>' +
                '<line x1="' + (x + w - 6) + '" y1="' + y + '" x2="' + (x + w - 6) + '" y2="178"></line>';
            if (prop.respaldo) {
                html += '<line x1="' + (x + w) + '" y1="' + y + '" x2="' + (x + w) + '" y2="' + (y - 34) + '"></line>';
            }
            return html + '</g>';
        }

        if (prop.tipo === 'banco') {
            const x = prop.x;
            const y = prop.y;
            const w = prop.ancho || 56;
            return '<g class="tecnica-prop">' +
                '<rect class="tecnica-prop-relleno" x="' + x + '" y="' + (y - 6) + '" width="' + w + '" height="6"></rect>' +
                '<line x1="' + (x + 6) + '" y1="' + y + '" x2="' + (x + 6) + '" y2="178"></line>' +
                '<line x1="' + (x + w - 6) + '" y1="' + y + '" x2="' + (x + w - 6) + '" y2="178"></line>' +
                '</g>';
        }

        if (prop.tipo === 'escalon') {
            const x = prop.x;
            const y = prop.y;
            const w = prop.ancho || 90;
            return '<g class="tecnica-prop">' +
                '<rect class="tecnica-prop-relleno" x="' + x + '" y="' + y + '" width="' + w + '" height="' + (178 - y) + '"></rect>' +
                '<line x1="' + x + '" y1="' + y + '" x2="' + (x + w) + '" y2="' + y + '"></line>' +
                '</g>';
        }

        if (prop.tipo === 'mesa') {
            return '<g class="tecnica-prop">' +
                '<line x1="' + prop.x1 + '" y1="' + prop.y + '" x2="' + prop.x2 + '" y2="' + prop.y + '"></line>' +
                '<line x1="' + (prop.x1 + 6) + '" y1="' + prop.y + '" x2="' + (prop.x1 + 6) + '" y2="178"></line>' +
                '<line x1="' + (prop.x2 - 6) + '" y1="' + prop.y + '" x2="' + (prop.x2 - 6) + '" y2="178"></line>' +
                '</g>';
        }

        if (prop.tipo === 'barra') {
            return '<g class="tecnica-prop">' +
                '<line x1="' + prop.x1 + '" y1="' + prop.y + '" x2="' + prop.x2 + '" y2="' + prop.y + '"></line>' +
                '<line x1="' + prop.x1 + '" y1="' + (prop.y - 8) + '" x2="' + prop.x1 + '" y2="' + (prop.y + 8) + '"></line>' +
                '<line x1="' + prop.x2 + '" y1="' + (prop.y - 8) + '" x2="' + prop.x2 + '" y2="' + (prop.y + 8) + '"></line>' +
                '</g>';
        }

        if (prop.tipo === 'pared') {
            return '<line class="tecnica-prop" x1="' + prop.x + '" y1="28" x2="' + prop.x + '" y2="178"></line>';
        }

        return '';
    }

    function lineaGuia(posturas) {
        const p = posturas[0];
        const a = p.cabeza;
        const b = p.tobillo;
        if (!a || !b) return '';

        return '<line class="tecnica-guia" x1="' + (a[0] + 4) + '" y1="' + (a[1] + 12) + '"' +
            ' x2="' + (b[0] + 2) + '" y2="' + (b[1] + 2) + '"></line>';
    }

    function flechaTecnica(datos) {
        const config = FLECHAS[datos.patron];
        if (!config || !datos.posturas || datos.posturas.length < 2 || !datos.duracion) return '';

        const desde = config.desde != null ? config.desde : 0;
        const hasta = config.hasta != null ? config.hasta : Math.min(1, datos.posturas.length - 1);
        const p0 = datos.posturas[desde];
        const p1 = datos.posturas[hasta];
        if (!p0 || !p1) return '';

        const a = p0[config.punto];
        const b = p1[config.punto];
        if (!a || !b) return '';

        const dx = b[0] - a[0];
        const dy = b[1] - a[1];
        const largo = Math.sqrt((dx * dx) + (dy * dy));
        if (largo < 8) return '';

        const ux = dx / largo;
        const uy = dy / largo;
        const inicio = [a[0] + (ux * 12), a[1] + (uy * 12)];
        const fin = [b[0] - (ux * 12), b[1] - (uy * 12)];
        const perp = [-uy * 4, ux * 4];
        const punta = [
            b[0] - (ux * 2),
            b[1] - (uy * 2)
        ];
        const basePunta = [
            punta[0] - (ux * 11) + perp[0],
            punta[1] - (uy * 11) + perp[1]
        ];
        const basePunta2 = [
            punta[0] - (ux * 11) - perp[0],
            punta[1] - (uy * 11) - perp[1]
        ];
        const etiqueta = config.etiqueta || '';
        const texto = etiqueta
            ? '<text class="tecnica-flecha-texto" x="' + redondear((inicio[0] + fin[0]) / 2 + 8) +
                '" y="' + redondear((inicio[1] + fin[1]) / 2 - 5) + '">' + escaparHTML(etiqueta) + '</text>'
            : '';

        return '<g class="tecnica-flecha-grupo">' +
            '<line class="tecnica-flecha" x1="' + redondear(inicio[0]) + '" y1="' + redondear(inicio[1]) +
            '" x2="' + redondear(fin[0]) + '" y2="' + redondear(fin[1]) + '"></line>' +
            '<polygon class="tecnica-flecha-punta" points="' +
            redondear(punta[0]) + ',' + redondear(punta[1]) + ' ' +
            redondear(basePunta[0]) + ',' + redondear(basePunta[1]) + ' ' +
            redondear(basePunta2[0]) + ',' + redondear(basePunta2[1]) + '"></polygon>' +
            texto +
            '</g>';
    }

    function articulaciones(posturas, puntos, duracion) {
        return puntos.filter(function (punto) {
            return posturas[0] && posturas[0][punto];
        }).map(function (punto) {
            return circulo(posturas, punto, 'tecnica-articulacion', 2.6, 0, 0, duracion);
        }).join('');
    }

    function escenaBase(datos) {
        const piezas = [];
        piezas.push('<line class="tecnica-suelo" x1="24" y1="178" x2="216" y2="178"></line>');
        piezas.push('<ellipse class="tecnica-sombra" cx="130" cy="181" rx="78" ry="6"></ellipse>');

        (datos.props || []).forEach(function (prop) {
            piezas.push(dibujarProp(prop, datos.posturas, datos.duracion, datos.vista));
        });

        if (datos.guia) piezas.push(lineaGuia(datos.posturas));
        piezas.push(flechaTecnica(datos));

        return piezas.join('');
    }

    function svgLado(datos) {
        const posturas = datos.posturas;
        const duracion = datos.duracion;
        const offset = datos.offsetLejano || [7, 2];
        const piezas = [];
        const segmentosBrazo = [
            ['hombro', 'codo'], ['codo', 'mano']
        ];
        const segmentosPierna = [
            ['cadera', 'rodilla'], ['rodilla', 'tobillo'], ['tobillo', 'pie']
        ];

        segmentosBrazo.forEach(function (segmento) {
            piezas.push(linea(posturas, segmento[0], segmento[1], 'tecnica-linea tecnica-linea-lejana', offset[0], offset[1], duracion));
        });

        if (posturas[0].rodillaTrasera) {
            piezas.push(linea(posturas, 'cadera', 'rodillaTrasera', 'tecnica-linea tecnica-linea-trasera', 0, 0, duracion));
            piezas.push(linea(posturas, 'rodillaTrasera', 'tobilloTrasero', 'tecnica-linea tecnica-linea-trasera', 0, 0, duracion));
            piezas.push(linea(posturas, 'tobilloTrasero', 'pieTrasero', 'tecnica-linea tecnica-linea-trasera', 0, 0, duracion));
        } else {
            segmentosPierna.forEach(function (segmento) {
                piezas.push(linea(posturas, segmento[0], segmento[1], 'tecnica-linea tecnica-linea-lejana', offset[0], offset[1], duracion));
            });
        }

        piezas.push(linea(posturas, 'hombro', 'cadera', 'tecnica-linea', 0, 0, duracion));

        segmentosBrazo.forEach(function (segmento) {
            piezas.push(linea(posturas, segmento[0], segmento[1], 'tecnica-linea', 0, 0, duracion));
        });
        segmentosPierna.forEach(function (segmento) {
            piezas.push(linea(posturas, segmento[0], segmento[1], 'tecnica-linea', 0, 0, duracion));
        });

        piezas.push(linea(posturas, 'hombro', 'cabeza', 'tecnica-linea tecnica-cuello', 0, 0, duracion));
        piezas.push(circulo(posturas, 'cabeza', 'tecnica-cabeza', 13, 0, 0, duracion));
        piezas.push(articulaciones(posturas, ['hombro', 'codo', 'cadera', 'rodilla', 'tobillo'], duracion));
        if (!datos.peso) piezas.push(articulaciones(posturas, ['mano'], duracion));

        if (datos.peso === 'cadera') {
            piezas.push(circulo(posturas, 'cadera', 'tecnica-peso', 5, 0, 0, duracion));
        } else if (datos.peso) {
            piezas.push(circulo(posturas, 'mano', 'tecnica-peso', 5, 0, 0, duracion));
        }

        if (datos.nucleo) {
            piezas.push('<circle class="tecnica-core" cx="' + datos.nucleo[0] + '" cy="' + datos.nucleo[1] + '" r="6"' +
                ' style="transform-origin:' + datos.nucleo[0] + 'px ' + datos.nucleo[1] + 'px"></circle>');
        }

        const clase = 'tecnica-figura' + (datos.hold ? ' tecnica-hold' : '');
        return escenaBase(datos) + '<g class="' + clase + '">' + piezas.join('') + '</g>';
    }

    function svgFrente(datos) {
        const posturas = datos.posturas;
        const duracion = datos.duracion;
        const piezas = [];

        [
            ['cadera', 'rodillaI'], ['rodillaI', 'pieI'],
            ['cadera', 'rodillaD'], ['rodillaD', 'pieD']
        ].forEach(function (segmento) {
            piezas.push(linea(posturas, segmento[0], segmento[1], 'tecnica-linea', 0, 0, duracion));
        });

        piezas.push(linea(posturas, 'hombro', 'cadera', 'tecnica-linea', 0, 0, duracion));

        [
            ['hombro', 'codoI'], ['codoI', 'manoI'],
            ['hombro', 'codoD'], ['codoD', 'manoD']
        ].forEach(function (segmento) {
            piezas.push(linea(posturas, segmento[0], segmento[1], 'tecnica-linea', 0, 0, duracion));
        });

        piezas.push(linea(posturas, 'hombro', 'cabeza', 'tecnica-linea tecnica-cuello', 0, 0, duracion));
        piezas.push(circulo(posturas, 'cabeza', 'tecnica-cabeza', 13, 0, 0, duracion));
        piezas.push(articulaciones(posturas, ['hombro', 'codoI', 'codoD', 'cadera', 'rodillaI', 'rodillaD'], duracion));

        if (datos.peso) {
            piezas.push(circulo(posturas, 'manoI', 'tecnica-peso', 5, 0, 0, duracion));
            piezas.push(circulo(posturas, 'manoD', 'tecnica-peso', 5, 0, 0, duracion));
        }

        if (datos.nucleo) {
            piezas.push('<circle class="tecnica-core" cx="' + datos.nucleo[0] + '" cy="' + datos.nucleo[1] + '" r="6"' +
                ' style="transform-origin:' + datos.nucleo[0] + 'px ' + datos.nucleo[1] + 'px"></circle>');
        }

        const clase = 'tecnica-figura' + (datos.hold ? ' tecnica-hold' : '');
        return escenaBase(datos) + '<g class="' + clase + '">' + piezas.join('') + '</g>';
    }

    function svgAnimacion(id, factorVelocidad) {
        const animacion = ANIMACIONES[id];
        if (!animacion) return '';

        const base = PATRONES[animacion.patron];
        if (!base) return '';

        const factor = Number(factorVelocidad) > 0 ? Number(factorVelocidad) : 1;
        const duracionBase = animacion.duracion != null ? animacion.duracion : base.duracion;

        const datos = Object.assign({}, base, animacion, {
            patron: animacion.patron,
            posturas: animacion.posturas || base.posturas,
            duracion: duracionBase > 0 ? duracionBase * factor : duracionBase,
            vista: animacion.vista || base.vista || 'lado',
            props: animacion.props || base.props || [],
            peso: animacion.peso != null ? animacion.peso : base.peso,
            guia: animacion.guia != null ? animacion.guia : base.guia,
            nucleo: animacion.nucleo || base.nucleo,
            hold: animacion.hold != null ? animacion.hold : base.hold,
            offsetLejano: animacion.offsetLejano || base.offsetLejano
        });

        const cuerpo = datos.vista === 'frente' ? svgFrente(datos) : svgLado(datos);
        const nombre = CATALOGO[id] ? CATALOGO[id].nombre : id;

        return '<svg class="tecnica-svg" viewBox="0 0 240 200" role="img" aria-label="Técnica animada de ' +
            escaparHTML(nombre) + '"><title>Técnica animada de ' + escaparHTML(nombre) + '</title>' +
            cuerpo + '</svg>';
    }

    function pausarAnimacionesReducidas(contenedor) {
        if (!contenedor) return;
        if (!window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        contenedor.querySelectorAll('svg').forEach(function (svg) {
            if (typeof svg.pauseAnimations === 'function') svg.pauseAnimations();
        });

        contenedor.querySelectorAll('[data-anim-toggle]').forEach(function (boton) {
            const caja = boton.closest('.tecnica-caja');
            if (caja) caja.classList.add('pausada');
            boton.innerHTML = ico('i-play') + ' Reanudar animación';
            boton.setAttribute('aria-pressed', 'true');
        });
    }

    function datosTecnica(id) {
        const animacion = ANIMACIONES[id];
        if (!animacion) return null;

        const base = PATRONES[animacion.patron] || {};
        const info = TECNICA[animacion.patron] || {};
        const pista = animacion.pista || base.pista || '';
        let pasos = info.pasos;

        if (!pasos || !pasos.length) {
            pasos = pista
                ? pista.split('. ').map(function (paso) { return paso.trim(); }).filter(Boolean)
                : ['Realiza el movimiento con control y sin prisa.'];
        }

        return {
            pasos: pasos,
            clave: info.clave || '',
            respira: info.respira || 'Respira con el movimiento; no aguantes el aire.'
        };
    }

    function duracionAnimacion(id) {
        const animacion = ANIMACIONES[id];
        if (!animacion) return 0;
        const base = PATRONES[animacion.patron];
        return animacion.duracion != null ? animacion.duracion : (base ? base.duracion : 0);
    }

    function bloqueAnimacion(id) {
        const info = datosTecnica(id);
        if (!info) return '';

        const animada = duracionAnimacion(id) > 0;
        const pasosHTML = info.pasos.map(function (paso) {
            return '<li>' + escaparHTML(paso) + '</li>';
        }).join('');

        return '<div class="tecnica-caja" data-ejercicio="' + escaparHTML(id) + '" data-velocidad="1">' +
            '<div class="tecnica-lienzo">' + svgAnimacion(id) + '</div>' +
            '<div class="tecnica-texto">' +
                '<span class="tecnica-etiqueta">Cómo se hace</span>' +
                '<ol class="tecnica-pasos">' + pasosHTML + '</ol>' +
                (info.clave ? '<p class="tecnica-clave"><strong>Clave:</strong> ' + escaparHTML(info.clave) + '</p>' : '') +
                '<p class="tecnica-respira">' + escaparHTML(info.respira) + '</p>' +
                '<div class="tecnica-control">' +
                    (animada
                        ? '<button type="button" class="btn-anim" data-anim-toggle aria-pressed="false">' + ico('i-pause') + ' Pausar animación</button>' +
                          '<button type="button" class="btn-anim" data-anim-velocidad="1.7" aria-pressed="false">Lento</button>' +
                          '<button type="button" class="btn-anim activo" data-anim-velocidad="1" aria-pressed="true">' + ico('i-play') + ' Normal</button>'
                        : '<span class="tecnica-hold-nota">Mantén la posición el tiempo indicado.</span>') +
                '</div>' +
            '</div>' +
        '</div>';
    }

    function cambiarVelocidadAnimacion(boton) {
        const caja = boton.closest('.tecnica-caja');
        if (!caja) return;

        const id = caja.getAttribute('data-ejercicio');
        const factor = Number(boton.getAttribute('data-anim-velocidad')) || 1;
        const lienzo = caja.querySelector('.tecnica-lienzo');
        if (!id || !lienzo) return;

        lienzo.innerHTML = svgAnimacion(id, factor);
        caja.setAttribute('data-velocidad', String(factor));

        caja.querySelectorAll('[data-anim-velocidad]').forEach(function (opcion) {
            const activa = Number(opcion.getAttribute('data-anim-velocidad')) === factor;
            opcion.classList.toggle('activo', activa);
            opcion.setAttribute('aria-pressed', activa ? 'true' : 'false');
        });

        if (caja.classList.contains('pausada')) {
            const svg = lienzo.querySelector('svg');
            if (svg && typeof svg.pauseAnimations === 'function') svg.pauseAnimations();
        }

        pausarAnimacionesReducidas(caja);
    }

    function alternarAnimacionTecnica(boton) {
        const caja = boton.closest('.tecnica-caja');
        if (!caja) return;

        const pausada = caja.classList.toggle('pausada');
        const svg = caja.querySelector('svg');
        if (svg) {
            if (pausada && typeof svg.pauseAnimations === 'function') svg.pauseAnimations();
            if (!pausada && typeof svg.unpauseAnimations === 'function') svg.unpauseAnimations();
        }

        boton.innerHTML = pausada ? ico('i-play') + ' Reanudar animación' : ico('i-pause') + ' Pausar animación';
        boton.setAttribute('aria-pressed', pausada ? 'true' : 'false');
    }


    function rep(id, repeticiones, descanso, opciones) {
        return Object.assign({
            id: id,
            tipo: 'repeticiones',
            repeticiones: repeticiones,
            descanso: descanso
        }, opciones || {});
    }

    function tiempo(id, segundos, descanso, opciones) {
        return Object.assign({
            id: id,
            tipo: 'tiempo',
            tiempo: segundos,
            descanso: descanso
        }, opciones || {});
    }

    function crearRutina(id, nombre, grupo, nivel, rondas, descansoRonda, ejercicios, extra) {
        return Object.assign({
            id: id,
            nombre: nombre,
            grupo: grupo,
            nivel: nivel,
            rondas: rondas,
            descansoRonda: descansoRonda,
            ejercicios: ejercicios
        }, extra || {});
    }

    // ===== RUTINAS =====
    const RUTINAS = {
        rapida: crearRutina(
            'rapida', 'Rutina rápida', 'cuerpo_completo', 'Principiante', 1, 0,
            [
                tiempo('sentadilla_clasica', 30, 10),
                tiempo('flexiones_clasicas', 30, 10),
                tiempo('plancha_abdominal', 20, 10),
                tiempo('zancada_frontal', 30, 10, { lados: 2, nota: 'cada pierna' }),
                tiempo('saltos_tijera', 30, 10)
            ],
            { rapida: true, descripcion: 'La rutina de siempre, en formato corto para esos días con poco tiempo.' }
        ),

        cuerpo_completo_principiante: crearRutina(
            'cuerpo_completo_principiante', 'Cuerpo completo', 'cuerpo_completo', 'Principiante', 2, 90,
            [
                rep('sentadilla_clasica', '10', 45),
                rep('zancada_frontal', '8', 45, { lados: 2, nota: 'por cada pierna' }),
                rep('flexiones_inclinadas', '8–10', 45),
                rep('remo_mochila', '10–12', 45),
                tiempo('saltos_tijera', 20, 30),
                tiempo('escaladores', 20, 30),
                tiempo('plancha_abdominal', 25, 45)
            ],
            { descripcion: 'Circuito de 2 rondas para empezar a mover todo el cuerpo.' }
        ),
        cuerpo_completo_intermedio: crearRutina(
            'cuerpo_completo_intermedio', 'Cuerpo completo', 'cuerpo_completo', 'Intermedio', 3, 90,
            [
                rep('sentadilla_salto', '12', 45),
                rep('zancadas_alternas', '10', 45, { lados: 2, nota: 'por cada pierna' }),
                rep('flexiones_clasicas', '10–12', 45),
                rep('remo_peso', '12', 45, { lados: 2, nota: 'por cada lado' }),
                rep('burpees_basicos', '8–10', 60),
                tiempo('escaladores', 30, 30),
                tiempo('saltos_tijera', 30, 30),
                tiempo('plancha_lateral', 20, 30, { lados: 2, nota: 'por lado' })
            ],
            { descripcion: 'Circuito de 3 rondas con más trabajo de fuerza y core.' }
        ),
        cuerpo_completo_avanzado: crearRutina(
            'cuerpo_completo_avanzado', 'Cuerpo completo', 'cuerpo_completo', 'Avanzado', 3, 90,
            [
                rep('sentadilla_salto', '15', 45),
                rep('zancadas_salto', '10', 45, { lados: 2, nota: 'por cada pierna' }),
                rep('flexiones_diamante', '12–15', 45),
                rep('remo_peso', '15', 45, { lados: 2, nota: 'por cada lado' }),
                rep('burpees_completos', '12–15', 60),
                tiempo('escaladores_intensos', 45, 30),
                tiempo('saltos_tijera', 45, 30),
                tiempo('plancha_elevacion_pierna', 45, 30)
            ],
            { descripcion: 'Circuito exigente de 3 rondas. Ajusta el ritmo y cuida la técnica.' }
        ),

        brazos_hombros_principiante: crearRutina(
            'brazos_hombros_principiante', 'Brazos y hombros', 'brazos_hombros', 'Principiante', 2, 75,
            [
                rep('flexiones_inclinadas', '8–10', 45),
                rep('curl_botellas', '10–12', 45, { lados: 2, nota: 'por brazo' }),
                rep('elevaciones_laterales', '10–12', 30),
                tiempo('circulos_brazos', 30, 20, { nota: '15 s adelante y 15 s atrás' }),
                rep('press_hombros', '10', 45, { nota: 'con botellas' })
            ],
            { descripcion: 'Trabajo de empuje, curl y hombros con material sencillo.' }
        ),
        brazos_hombros_intermedio: crearRutina(
            'brazos_hombros_intermedio', 'Brazos y hombros', 'brazos_hombros', 'Intermedio', 3, 75,
            [
                rep('flexiones_clasicas', '10–12', 45),
                rep('fondos_silla', '12–15', 45),
                rep('curl_mochila', '12', 45, { lados: 2, nota: 'por brazo' }),
                rep('patada_triceps', '12', 45, { lados: 2, nota: 'por brazo' }),
                rep('elevaciones_laterales', '12–15', 30),
                rep('press_hombros', '12', 45),
                rep('curl_martillo', '12', 45, { lados: 2, nota: 'por brazo' })
            ],
            { descripcion: 'Más volumen para brazos y hombros, con descansos cortos.' }
        ),
        brazos_hombros_avanzado: crearRutina(
            'brazos_hombros_avanzado', 'Brazos y hombros', 'brazos_hombros', 'Avanzado', 3, 75,
            [
                rep('flexiones_diamante', '12–15', 45),
                rep('flexiones_manos_separadas', '15', 45),
                rep('dominadas', '10–12', 60),
                rep('fondos_piernas_estiradas', '12–15', 45),
                rep('curl_peso', '15', 45, { lados: 2, nota: 'por brazo' }),
                rep('patada_triceps', '15', 45, { lados: 2, nota: 'por brazo' }),
                rep('press_hombros', '15', 45),
                rep('elevaciones_frontales', '12', 30)
            ],
            { descripcion: 'Rutina exigente. Si dominadas o fondos son demasiado, usa la versión de menor nivel.' }
        ),

        piernas_principiante: crearRutina(
            'piernas_principiante', 'Piernas', 'piernas', 'Principiante', 2, 75,
            [
                rep('sentadilla_clasica', '10', 45),
                rep('puente_gluteo', '10–12', 45),
                rep('elevacion_talones', '15', 30),
                rep('step_up', '8', 45, { lados: 2, nota: 'por cada pierna' })
            ],
            { descripcion: 'Fuerza básica de piernas y glúteos, sin saltos.' }
        ),
        piernas_intermedio: crearRutina(
            'piernas_intermedio', 'Piernas', 'piernas', 'Intermedio', 3, 90,
            [
                rep('sentadilla_clasica', '15', 45),
                rep('zancada_frontal', '10', 45, { lados: 2, nota: 'por cada pierna' }),
                rep('puente_gluteo', '12–15', 45),
                rep('elevacion_talones', '20', 30),
                tiempo('sentadilla_pared', 30, 60),
                rep('zancadas_laterales', '10', 45, { lados: 2, nota: 'por lado' }),
                rep('step_up', '10', 45, { lados: 2, nota: 'por cada pierna' })
            ],
            { descripcion: 'Circuito de 3 rondas con trabajo unilateral y resistencia.' }
        ),
        piernas_avanzado: crearRutina(
            'piernas_avanzado', 'Piernas', 'piernas', 'Avanzado', 3, 90,
            [
                rep('sentadilla_salto', '15', 45),
                tiempo('sentadilla_pared', 60, 60),
                rep('puente_una_pierna', '10–12', 45, { lados: 2, nota: 'por cada pierna' }),
                rep('zancadas_laterales', '12', 45, { lados: 2, nota: 'por lado' }),
                rep('elevacion_talones_escalon', '25', 30),
                rep('sentadilla_bulgara', '10', 45, { lados: 2, nota: 'por cada pierna' }),
                rep('hip_thrust', '12', 45)
            ],
            { descripcion: 'Fuerza avanzada de piernas y glúteos. Calienta bien las rodillas.' }
        ),

        pecho_principiante: crearRutina(
            'pecho_principiante', 'Pecho', 'pecho', 'Principiante', 2, 60,
            [
                rep('flexiones_inclinadas', '8–10', 45),
                rep('flexiones_rodillas', '8–10', 45),
                rep('aperturas_botellas', '10–12', 30),
                rep('press_suelo_botellas', '10–12', 45)
            ],
            { descripcion: 'Una rutina de pecho completa para empezar, con botellas y silla.' }
        ),
        pecho_intermedio: crearRutina(
            'pecho_intermedio', 'Pecho', 'pecho', 'Intermedio', 3, 75,
            [
                rep('flexiones_clasicas', '10–15', 45),
                rep('flexiones_manos_separadas', '10–12', 45),
                rep('aperturas_peso', '12–15', 30),
                rep('flexiones_declinadas', '8–12', 45),
                rep('press_suelo_peso', '10–12', 45)
            ],
            { descripcion: 'Más volumen y ángulos para pecho, con control en cada repetición.' }
        ),
        pecho_avanzado: crearRutina(
            'pecho_avanzado', 'Pecho', 'pecho', 'Avanzado', 3, 75,
            [
                rep('flexiones_clasicas', '15–20', 45),
                rep('flexiones_diamante', '12–15', 45),
                rep('aperturas_peso', '15–20', 30),
                rep('flexiones_declinadas', '12–15', 45),
                rep('press_suelo_peso', '12–15', 45)
            ],
            { descripcion: 'Rutina avanzada de pecho. Mantén los codos controlados y no arquees la espalda.' }
        ),

        abdomen_principiante: crearRutina(
            'abdomen_principiante', 'Abdomen', 'abdomen', 'Principiante', 2, 60,
            [
                rep('crunches_suaves', '12–15', 30),
                tiempo('plancha_abdominal', 25, 45),
                tiempo('tijeras_abdominales', 20, 30),
                rep('dead_bug', '10', 30, { lados: 2, nota: 'por lado' })
            ],
            { descripcion: 'Core suave y seguro para empezar, sin tirones en el cuello.' }
        ),
        abdomen_intermedio: crearRutina(
            'abdomen_intermedio', 'Abdomen', 'abdomen', 'Intermedio', 3, 60,
            [
                rep('elevaciones_piernas', '12–15', 45),
                tiempo('plancha_abdominal', 40, 45),
                rep('crunches', '15–20', 30),
                tiempo('torsiones_tronco', 20, 30),
                tiempo('tijeras_abdominales', 30, 30),
                tiempo('plancha_lateral', 20, 30, { lados: 2, nota: 'por lado' }),
                tiempo('plancha_toque_hombro', 20, 30)
            ],
            { descripcion: 'Circuito de 3 rondas para abdomen y estabilidad.' }
        ),
        abdomen_avanzado: crearRutina(
            'abdomen_avanzado', 'Abdomen', 'abdomen', 'Avanzado', 3, 60,
            [
                rep('elevaciones_piernas_colgado', '12–15', 45),
                tiempo('plancha_abdominal', 60, 45),
                tiempo('plancha_elevacion_pierna', 45, 30),
                tiempo('tijeras_abdominales', 45, 30),
                tiempo('plancha_lateral_toque', 30, 30, { lados: 2, nota: 'por lado' }),
                rep('crunches', '20–25', 30),
                tiempo('hollow_hold', 30, 30)
            ],
            { descripcion: 'Core avanzado. Si algo se siente en la lumbar, vuelve a una versión más fácil.' }
        ),

        espalda_principiante: crearRutina(
            'espalda_principiante', 'Espalda', 'espalda', 'Principiante', 2, 60,
            [
                rep('superman', '10', 45),
                rep('remo_mochila', '10–12', 45),
                rep('pajaro', '10–12', 30),
                tiempo('gato_camello', 20, 0, { movilidad: true }),
                tiempo('estiramiento_espalda', 30, 0, { movilidad: true })
            ],
            { descripcion: 'Fuerza suave y movilidad para la espalda. Sin rebotes.' }
        ),
        espalda_intermedio: crearRutina(
            'espalda_intermedio', 'Espalda', 'espalda', 'Intermedio', 3, 75,
            [
                rep('superman', '12–15', 45),
                rep('remo_peso', '12', 45, { lados: 2, nota: 'por lado' }),
                rep('remos_invertidos', '10–12', 45),
                rep('face_pull', '12–15', 30),
                rep('pajaro', '12', 30),
                tiempo('gato_camello', 30, 0, { movilidad: true })
            ],
            { descripcion: 'Más trabajo de espalda y postura, con una mesa firme para los remos.' }
        ),
        espalda_avanzado: crearRutina(
            'espalda_avanzado', 'Espalda', 'espalda', 'Avanzado', 3, 75,
            [
                rep('superman_peso', '15', 45),
                rep('remo_peso', '15', 45, { lados: 2, nota: 'por lado' }),
                rep('remos_invertidos', '15', 45),
                rep('dominadas', '8–12', 60),
                rep('face_pull', '15', 30),
                tiempo('gato_camello', 30, 0, { movilidad: true })
            ],
            { descripcion: 'Rutina avanzada de espalda. Usa banda o asistencia si las dominadas todavía no salen.' }
        )
    };

    // ===== UTILIDADES =====
    function escaparHTML(texto) {
        return String(texto).replace(/[&<>"']/g, function (caracter) {
            return {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            }[caracter];
        });
    }

    function claveNivel(nivel) {
        return nivel.toLowerCase();
    }

    function etiquetaNivel(nivel) {
        return '<span class="nivel nivel-' + claveNivel(nivel) + '">' +
            '<span class="nivel-punto nivel-' + claveNivel(nivel) + '"></span> ' + nivel + '</span>';
    }

    function obtenerRutina(id) {
        return RUTINAS[id] || null;
    }

    function obtenerEjercicio(id) {
        return CATALOGO[id] || null;
    }

    function nombreEjercicio(item) {
        const ejercicio = obtenerEjercicio(item.id);
        return ejercicio ? ejercicio.nombre : item.id;
    }

    function estimarRepeticiones(texto) {
        const numeros = String(texto).match(/\d+/g);
        return numeros ? Number(numeros[numeros.length - 1]) : 10;
    }

    function segundosDeTrabajo(item) {
        if (item.tipo === 'tiempo') {
            return (item.tiempo || 0) * (item.lados || 1);
        }
        return Math.max(10, estimarRepeticiones(item.repeticiones) * (item.lados || 1) * 3);
    }

    function estimarDuracion(rutina, rondas) {
        const totalRondas = Math.max(1, Number(rondas) || rutina.rondas || 1);
        let total = 0;

        for (let ronda = 0; ronda < totalRondas; ronda += 1) {
            rutina.ejercicios.forEach(function (item, indice) {
                total += segundosDeTrabajo(item);
                const esUltimo = indice === rutina.ejercicios.length - 1;
                if (esUltimo) {
                    if (ronda < totalRondas - 1) total += rutina.descansoRonda || 0;
                } else {
                    total += item.descanso || 0;
                }
            });
        }

        return Math.max(1, Math.round(total / 60));
    }

    function dosisTexto(item) {
        if (item.tipo === 'tiempo') {
            let texto = item.tiempo + ' s';
            if (item.nota) texto += ' · ' + item.nota;
            else if (item.lados) texto += ' por lado';
            return texto;
        }

        let texto = item.repeticiones + ' repeticiones';
        if (item.nota) texto += ' ' + item.nota;
        else if (item.lados) texto += ' por lado';
        return texto;
    }

    function descansoTexto(item) {
        return item.descanso > 0 ? 'Descanso ' + item.descanso + ' s' : 'Sin descanso';
    }

    function etiquetaImpacto(impacto) {
        const clase = impacto.toLowerCase();
        return '<span class="etiqueta etiqueta-impacto impacto-' + clase + '">' + impacto + '</span>';
    }

    function etiquetaEquipo(equipo) {
        return '<span class="etiqueta etiqueta-equipo">' + escaparHTML(equipo) + '</span>';
    }

    function formatearTiempo(segundos) {
        const total = Math.max(0, Math.ceil(segundos));
        const minutos = Math.floor(total / 60);
        const resto = total % 60;
        return String(minutos).padStart(2, '0') + ':' + String(resto).padStart(2, '0');
    }

    function rutinasDeGrupo(grupo) {
        return Object.values(RUTINAS)
            .filter(function (rutina) { return rutina.grupo === grupo && !rutina.rapida; })
            .sort(function (a, b) { return NIVELES.indexOf(a.nivel) - NIVELES.indexOf(b.nivel); });
    }

    function rutinasConEjercicio(id) {
        return Object.values(RUTINAS).filter(function (rutina) {
            return rutina.ejercicios.some(function (item) { return item.id === id; });
        });
    }

    // ===== PÁGINA DE EJERCICIOS =====
    function iniciarPaginaEjercicios() {
        let filtroNivel = 'todos';
        let filtroGrupo = 'todos';
        let busqueda = '';
        let focoAntesFicha = null;

        const zonasGrid = document.getElementById('zonasGrid');
        const listaCatalogo = document.getElementById('listaCatalogo');
        const filtrosZona = document.getElementById('filtrosZona');
        const filtrosNivel = document.getElementById('filtrosNivel');
        const buscar = document.getElementById('buscarEjercicio');
        const hoja = document.getElementById('hojaEjercicioFondo');
        const cerrarHoja = document.getElementById('cerrarEjercicio');
        const tituloHoja = document.getElementById('tituloEjercicio');
        const grupoHoja = document.getElementById('grupoEjercicio');
        const iconoHoja = document.getElementById('iconoEjercicio');
        const contenidoHoja = document.getElementById('contenidoEjercicio');

        function renderizarZonas() {
            if (!zonasGrid) return;

            zonasGrid.innerHTML = Object.keys(GRUPOS).map(function (claveGrupo) {
                const grupo = GRUPOS[claveGrupo];
                const rutinas = rutinasDeGrupo(claveGrupo);

                const niveles = rutinas.map(function (rutina) {
                    return '<a class="nivel-link nivel-' + claveNivel(rutina.nivel) + '" data-nivel="' + claveNivel(rutina.nivel) + '" href="rutina.html?rutina=' + encodeURIComponent(rutina.id) + '">' +
                        etiquetaNivel(rutina.nivel) +
                    '</a>';
                }).join('');

                return '<article class="zona-card" data-grupo="' + claveGrupo + '">' +
                    '<span class="zona-icono" aria-hidden="true">' + iconoGrupoEjercicio(claveGrupo) + '</span>' +
                    '<h3>' + grupo.nombre + '</h3>' +
                    '<p class="zona-cuenta">' + rutinas.length + ' rutinas</p>' +
                    '<div class="zona-niveles">' + niveles + '</div>' +
                '</article>';
            }).join('');

            aplicarFiltroNivel();
        }

        function aplicarFiltroNivel() {
            if (!zonasGrid) return;
            zonasGrid.querySelectorAll('.nivel-link').forEach(function (enlace) {
                enlace.classList.toggle('oculto', filtroNivel !== 'todos' && enlace.dataset.nivel !== filtroNivel);
            });
        }

        function renderizarFiltrosZona() {
            if (!filtrosZona) return;
            const opciones = [{ clave: 'todos', nombre: 'Todos' }].concat(
                Object.keys(GRUPOS).map(function (clave) {
                    return { clave: clave, nombre: GRUPOS[clave].nombre };
                })
            );

            filtrosZona.innerHTML = opciones.map(function (opcion) {
                return '<button type="button" class="chip-zona' + (opcion.clave === filtroGrupo ? ' activo' : '') + '" data-grupo="' + opcion.clave + '">' + opcion.nombre + '</button>';
            }).join('');
        }

        function renderizarCatalogo() {
            if (!listaCatalogo) return;

            const texto = busqueda.trim().toLowerCase();
            const entradas = Object.keys(CATALOGO).filter(function (id) {
                const ejercicio = CATALOGO[id];
                const coincideGrupo = filtroGrupo === 'todos' || ejercicio.grupos.indexOf(filtroGrupo) !== -1;
                const coincideTexto = !texto ||
                    ejercicio.nombre.toLowerCase().indexOf(texto) !== -1 ||
                    ejercicio.equipo.toLowerCase().indexOf(texto) !== -1 ||
                    ejercicio.grupos.some(function (grupo) { return GRUPOS[grupo].nombre.toLowerCase().indexOf(texto) !== -1; });
                return coincideGrupo && coincideTexto;
            }).sort(function (a, b) {
                const grupoA = CATALOGO[a].grupos[0];
                const grupoB = CATALOGO[b].grupos[0];
                const ordenGrupo = Object.keys(GRUPOS).indexOf(grupoA) - Object.keys(GRUPOS).indexOf(grupoB);
                if (ordenGrupo !== 0) return ordenGrupo;
                return CATALOGO[a].nombre.localeCompare(CATALOGO[b].nombre, 'es');
            });

            if (!entradas.length) {
                listaCatalogo.innerHTML = '<p class="sin-resultados">No encontré ejercicios con ese filtro. Prueba con otra palabra.</p>';
                return;
            }

            listaCatalogo.innerHTML = entradas.map(function (id) {
                const ejercicio = CATALOGO[id];
                const grupos = ejercicio.grupos.map(function (grupo) {
                    return '<span class="etiqueta etiqueta-grupo">' + GRUPOS[grupo].nombre + '</span>';
                }).join('');

                return '<button type="button" class="ejercicio-item" data-ejercicio="' + id + '" aria-label="Ver ficha de ' + escaparHTML(ejercicio.nombre) + '">' +
                    '<span class="ejercicio-item-icono" aria-hidden="true">' + iconoGrupoEjercicio(ejercicio.grupos[0] || '') + '</span>' +
                    '<span class="ejercicio-item-texto">' +
                        '<strong>' + escaparHTML(ejercicio.nombre) + '</strong>' +
                        '<span class="ejercicio-item-tags">' + grupos + etiquetaEquipo(ejercicio.equipo) + etiquetaImpacto(ejercicio.impacto) + '</span>' +
                    '</span>' +
                    '<span class="ejercicio-item-flecha" aria-hidden="true">›</span>' +
                '</button>';
            }).join('');
        }

        function abrirFicha(id) {
            const ejercicio = obtenerEjercicio(id);
            if (!ejercicio || !hoja) return;

            focoAntesFicha = document.activeElement;
            tituloHoja.textContent = ejercicio.nombre;
            grupoHoja.textContent = ejercicio.grupos.map(function (grupo) { return GRUPOS[grupo].nombre; }).join(' · ');
            iconoHoja.innerHTML = iconoGrupoEjercicio(ejercicio.grupos[0] || '');

            const usos = rutinasConEjercicio(id);
            const usosHTML = usos.length
                ? '<ul class="ficha-usos">' + usos.map(function (rutina) {
                    return '<li><a href="rutina.html?rutina=' + encodeURIComponent(rutina.id) + '">' + escaparHTML(rutina.nombre) + ' · ' + rutina.nivel + '</a></li>';
                }).join('') + '</ul>'
                : '<p class="ficha-texto">Todavía no está asignado a una rutina.</p>';

            const alternativas = (SUSTITUCIONES[id] || []).map(function (alternativa) {
                return { opcion: alternativa, ejercicio: CATALOGO[alternativa.id] };
            }).filter(function (item) { return Boolean(item.ejercicio); });

            const alternativasHTML = alternativas.length
                ? '<ul class="ficha-alternativas">' + alternativas.map(function (item) {
                    const etiquetas = item.opcion.etiquetas.map(function (etiqueta) {
                        return '<span class="ficha-alt-tag">' + escaparHTML(etiqueta) + '</span>';
                    }).join('');
                    return '<li><strong>' + escaparHTML(item.ejercicio.nombre) + '</strong>' + etiquetas + '</li>';
                }).join('') + '</ul>' +
                '<p class="ficha-texto">Dentro de una rutina puedes cambiarlo por una de estas opciones sin perder la zona de trabajo.</p>'
                : '';

            contenidoHoja.innerHTML =
                '<div class="ficha-tags">' + etiquetaEquipo(ejercicio.equipo) + etiquetaImpacto(ejercicio.impacto) + '</div>' +
                bloqueAnimacion(id) +
                '<div class="ficha-bloque"><span>Cómo hacerlo</span><p>' + escaparHTML(ejercicio.descripcion) + '</p></div>' +
                (ejercicio.progresion ? '<div class="ficha-bloque"><span>Para progresar</span><p>' + escaparHTML(ejercicio.progresion) + '</p></div>' : '') +
                (ejercicio.regresion ? '<div class="ficha-bloque"><span>Si te cuesta</span><p>' + escaparHTML(ejercicio.regresion) + '</p></div>' : '') +
                (alternativasHTML ? '<div class="ficha-bloque"><span>Alternativas en rutina</span>' + alternativasHTML + '</div>' : '') +
                '<div class="ficha-bloque"><span>Aparece en</span>' + usosHTML + '</div>' +
                '<p class="nota-hoja">Si sientes dolor o molestia, para y consulta con un profesional.</p>';

            hoja.classList.add('abierto');
            document.body.style.overflow = 'hidden';
            pausarAnimacionesReducidas(contenidoHoja);
            if (cerrarHoja) cerrarHoja.focus();
        }

        function cerrarFicha() {
            if (!hoja) return;
            hoja.classList.remove('abierto');
            document.body.style.overflow = '';
            if (contenidoHoja) contenidoHoja.innerHTML = '';
            if (focoAntesFicha && typeof focoAntesFicha.focus === 'function') focoAntesFicha.focus();
            focoAntesFicha = null;
        }

        renderizarZonas();
        renderizarFiltrosZona();
        renderizarCatalogo();

        if (filtrosNivel) {
            filtrosNivel.addEventListener('click', function (evento) {
                const boton = evento.target.closest('[data-nivel]');
                if (!boton) return;
                filtroNivel = boton.dataset.nivel;
                filtrosNivel.querySelectorAll('.chip-nivel').forEach(function (chip) {
                    chip.classList.toggle('activo', chip === boton);
                });
                aplicarFiltroNivel();
            });
        }

        if (filtrosZona) {
            filtrosZona.addEventListener('click', function (evento) {
                const boton = evento.target.closest('[data-grupo]');
                if (!boton) return;
                filtroGrupo = boton.dataset.grupo;
                renderizarFiltrosZona();
                renderizarCatalogo();
            });
        }

        if (buscar) {
            buscar.addEventListener('input', function () {
                busqueda = buscar.value;
                renderizarCatalogo();
            });
        }

        if (listaCatalogo) {
            listaCatalogo.addEventListener('click', function (evento) {
                const boton = evento.target.closest('[data-ejercicio]');
                if (boton) abrirFicha(boton.dataset.ejercicio);
            });
        }

        if (cerrarHoja) cerrarHoja.addEventListener('click', cerrarFicha);

        if (hoja) {
            hoja.addEventListener('click', function (evento) {
                const botonVelocidad = evento.target.closest('[data-anim-velocidad]');
                if (botonVelocidad) {
                    cambiarVelocidadAnimacion(botonVelocidad);
                    return;
                }
                const botonAnimacion = evento.target.closest('[data-anim-toggle]');
                if (botonAnimacion) {
                    alternarAnimacionTecnica(botonAnimacion);
                    return;
                }
                if (evento.target === hoja) cerrarFicha();
            });
        }

        document.addEventListener('keydown', function (evento) {
            if (evento.key === 'Escape' && hoja && hoja.classList.contains('abierto')) cerrarFicha();
        });
    }

    // ===== PÁGINA DE RUTINA =====
    function iniciarPaginaRutina() {
        const parametros = new URLSearchParams(window.location.search);
        const rutinaBase = obtenerRutina(parametros.get('rutina')) || obtenerRutina('cuerpo_completo_principiante');
        if (!rutinaBase) return;

        const estado = {
            rutina: aplicarSustituciones(rutinaBase),
            rondas: rutinaBase.rondas,
            ronda: 1,
            indice: 0,
            lado: 1,
            fase: 'inactivo',
            restante: 0,
            finFase: 0,
            pausado: false,
            intervalo: null,
            inicio: null,
            guardado: false
        };

        const titulo = document.getElementById('tituloRutina');
        const subtitulo = document.getElementById('subtituloRutina');
        const meta = document.getElementById('rutinaMeta');
        const lista = document.getElementById('listaEjercicios');
        const entrenador = document.getElementById('entrenador');
        const progreso = document.getElementById('entrenadorProgreso');
        const faseBadge = document.getElementById('faseBadge');
        const cronometro = document.getElementById('cronometro');
        const faseEl = document.getElementById('entrenadorFase');
        const detalle = document.getElementById('entrenadorDetalle');
        const barra = document.getElementById('barraProgresoRutina');
        const rondasControl = document.getElementById('rondasControl');
        const selectRondas = document.getElementById('rondasRutina');
        const btnEntrenamiento = document.getElementById('btnEntrenamiento');
        const btnHecho = document.getElementById('btnHecho');
        const btnSaltar = document.getElementById('btnSaltar');
        const btnDetener = document.getElementById('btnDetener');
        const estadoTexto = document.getElementById('estadoEntrenamiento');
        const calentamientoEntrenador = document.getElementById('calentamientoEntrenador');
        const cierreEntrenador = document.getElementById('cierreEntrenador');
        const tecnicaEntrenador = document.getElementById('tecnicaEntrenador');
        const hojaTecnica = document.getElementById('hojaTecnicaFondo');
        const cerrarTecnica = document.getElementById('cerrarTecnica');
        const tituloTecnica = document.getElementById('tituloTecnica');
        const grupoTecnica = document.getElementById('grupoTecnica');
        const iconoTecnica = document.getElementById('iconoTecnica');
        const contenidoTecnica = document.getElementById('contenidoTecnica');
        const hojaSustitucion = document.getElementById('hojaSustitucionFondo');
        const cerrarSustitucion = document.getElementById('cerrarSustitucion');
        const tituloSustitucion = document.getElementById('tituloSustitucion');
        const grupoSustitucion = document.getElementById('grupoSustitucion');
        const iconoSustitucion = document.getElementById('iconoSustitucion');
        const contenidoSustitucion = document.getElementById('contenidoSustitucion');
        let tecnicaVisible = '';
        let focoAntesTecnica = null;
        let indiceSustitucion = -1;
        let motivoSustitucion = 'facil';
        let focoAntesSustitucion = null;

        function fechaLocalISO(fecha) {
            return fecha.getFullYear() + '-' +
                String(fecha.getMonth() + 1).padStart(2, '0') + '-' +
                String(fecha.getDate()).padStart(2, '0');
        }

        function guardarEntrenamiento() {
            if (estado.guardado) return;

            const minutos = estado.inicio
                ? Math.max(1, Math.round((Date.now() - estado.inicio) / 60000))
                : estimarDuracion(estado.rutina, estado.rondas);

            const registro = {
                id: (window.VA && VA.datos) ? VA.datos.uuid() : String(Date.now()),
                rutina_id: estado.rutina.id,
                rutina_nombre: estado.rutina.nombre,
                nivel: estado.rutina.nivel,
                rutina: estado.rutina.nombre + ' · ' + estado.rutina.nivel,
                fecha: fechaLocalISO(new Date()),
                minutos: minutos,
                rondas: estado.rondas,
                completado_en: new Date().toISOString()
            };

            if (window.VA && VA.datos) {
                VA.datos.entrenamientos.agregar(registro);
            } else {
                // Respaldo mínimo si la página se abre sin js/datos.js.
                let historial = [];
                try {
                    historial = JSON.parse(localStorage.getItem('vidaActivaEntrenamientos') || '[]');
                } catch (error) {
                    historial = [];
                }
                if (!Array.isArray(historial)) historial = [];
                historial.unshift(registro);
                localStorage.setItem('vidaActivaEntrenamientos', JSON.stringify(historial.slice(0, 200)));
            }

            estado.guardado = true;
        }

        function iniciarIntervalo() {
            detenerIntervalo();
            estado.finFase = Date.now() + estado.restante * 1000;
            estado.intervalo = setInterval(tic, 250);
        }

        function detenerIntervalo() {
            if (estado.intervalo) {
                clearInterval(estado.intervalo);
                estado.intervalo = null;
            }
        }

        function tic() {
            if (estado.pausado) return;

            const restante = Math.ceil((estado.finFase - Date.now()) / 1000);
            estado.restante = Math.max(0, restante);

            if (restante > 0) {
                if (cronometro) cronometro.textContent = formatearTiempo(estado.restante);
                return;
            }

            avanzarFase();
        }

        function faseTrabajo(item) {
            // Al pasar de preparación/descanso a un ejercicio por repeticiones
            // hay que cortar el intervalo anterior. Si no, el siguiente tic
            // vuelve a avanzar y salta el ejercicio directamente al descanso.
            detenerIntervalo();
            estado.fase = item.tipo === 'repeticiones' ? 'repeticiones' : 'trabajo';
            estado.restante = item.tipo === 'tiempo' ? (item.tiempo || 0) : 0;
            if (item.tipo === 'tiempo') iniciarIntervalo();
            actualizarJugador();
        }

        function iniciarEntrenamiento() {
            detenerIntervalo();
            estado.ronda = 1;
            estado.indice = 0;
            estado.lado = 1;
            estado.fase = 'preparacion';
            estado.restante = 3;
            estado.pausado = false;
            estado.inicio = Date.now();
            estado.guardado = false;
            renderizarLista();
            iniciarIntervalo();
            actualizarJugador();
            mostrarEstado('¡Empezamos! Prepara el primer ejercicio.', 'info');
        }

        function avanzarFase() {
            const item = estado.rutina.ejercicios[estado.indice];
            if (!item) return;

            if (estado.fase === 'preparacion') {
                faseTrabajo(item);
                return;
            }

            if (estado.fase === 'cambio_lado') {
                faseTrabajo(item);
                return;
            }

            if (estado.fase === 'trabajo' || estado.fase === 'repeticiones') {
                if (item.lados && estado.lado < item.lados) {
                    estado.lado += 1;
                    estado.fase = 'cambio_lado';
                    estado.restante = 3;
                    iniciarIntervalo();
                    actualizarJugador();
                    return;
                }
                irADescansoOAvanzar();
                return;
            }

            if (estado.fase === 'descanso') {
                siguienteEjercicio();
                return;
            }

            if (estado.fase === 'descanso_ronda') {
                estado.ronda += 1;
                estado.indice = 0;
                estado.lado = 1;
                estado.fase = 'preparacion';
                estado.restante = 3;
                iniciarIntervalo();
                actualizarJugador();
            }
        }

        function irADescansoOAvanzar() {
            const item = estado.rutina.ejercicios[estado.indice];
            const esUltimo = estado.indice === estado.rutina.ejercicios.length - 1;

            // En el último ejercicio de una ronda no sumamos dos descansos:
            // o pasamos al descanso entre rondas, o terminamos.
            if (esUltimo) {
                siguienteEjercicio();
                return;
            }

            if (item.descanso > 0) {
                estado.fase = 'descanso';
                estado.restante = item.descanso;
                iniciarIntervalo();
                actualizarJugador();
                return;
            }

            siguienteEjercicio();
        }

        function siguienteEjercicio() {
            const total = estado.rutina.ejercicios.length;

            if (estado.indice < total - 1) {
                estado.indice += 1;
                estado.lado = 1;
                faseTrabajo(estado.rutina.ejercicios[estado.indice]);
                return;
            }

            if (estado.ronda < estado.rondas) {
                estado.fase = 'descanso_ronda';
                estado.restante = estado.rutina.descansoRonda || 60;
                iniciarIntervalo();
                actualizarJugador();
                return;
            }

            finalizarEntrenamiento();
        }

        function saltarPaso() {
            if (estado.fase === 'inactivo' || estado.fase === 'completado') return;
            detenerIntervalo();
            estado.pausado = false;

            if (estado.fase === 'descanso') {
                siguienteEjercicio();
                return;
            }

            if (estado.fase === 'descanso_ronda') {
                estado.ronda += 1;
                estado.indice = 0;
                estado.lado = 1;
                estado.fase = 'preparacion';
                estado.restante = 3;
                iniciarIntervalo();
                actualizarJugador();
                return;
            }

            // "Saltar" descarta el ejercicio actual completo, incluidos sus lados.
            siguienteEjercicio();
        }

        function pausarReanudar() {
            if (estado.fase === 'inactivo' || estado.fase === 'completado' || estado.fase === 'repeticiones') return;

            if (estado.pausado) {
                estado.pausado = false;
                estado.finFase = Date.now() + estado.restante * 1000;
                estado.intervalo = setInterval(tic, 250);
                mostrarEstado('Entrenamiento reanudado.', 'info');
            } else {
                estado.pausado = true;
                detenerIntervalo();
                estado.restante = Math.max(0, Math.ceil((estado.finFase - Date.now()) / 1000));
                mostrarEstado('Entrenamiento en pausa.', 'info');
            }
            actualizarJugador();
        }

        function detenerEntrenamiento() {
            detenerIntervalo();
            estado.fase = 'inactivo';
            estado.ronda = 1;
            estado.indice = 0;
            estado.lado = 1;
            estado.restante = 0;
            estado.pausado = false;
            estado.inicio = null;
            estado.guardado = false;
            renderizarLista();
            actualizarJugador();
            mostrarEstado('Entrenamiento detenido. Puedes empezar de nuevo cuando quieras.', 'info');
        }

        function finalizarEntrenamiento() {
            detenerIntervalo();
            estado.fase = 'completado';
            estado.restante = 0;
            estado.pausado = false;
            guardarEntrenamiento();
            renderizarLista();
            actualizarJugador();
            mostrarEstado('¡Entrenamiento completado! Se guardó en tu progreso.', 'exito');
            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
        }

        function mostrarEstado(texto, tipo) {
            if (!estadoTexto) return;
            estadoTexto.textContent = texto;
            estadoTexto.className = 'estado-entrenamiento ' + (tipo || '');
        }

        function marcarLista(activo, completados) {
            if (!lista) return;
            lista.querySelectorAll('.item-ejercicio').forEach(function (item, indice) {
                item.classList.toggle('activo', indice === activo);
                item.classList.toggle('completado', indice < completados);
            });
        }

        function actualizarTecnicaEntrenador(item, visible) {
            if (!tecnicaEntrenador) return;
            const id = visible && item && ANIMACIONES[item.id] ? item.id : '';
            if (id === tecnicaVisible) return;

            tecnicaVisible = id;
            if (!id) {
                tecnicaEntrenador.hidden = true;
                tecnicaEntrenador.innerHTML = '';
                return;
            }

            tecnicaEntrenador.innerHTML = '<button type="button" class="btn-tecnica btn-tecnica-entrenador" data-tecnica="' + id + '">' + ico('i-play') + ' Ver técnica animada</button>';
            tecnicaEntrenador.hidden = false;
        }

        function pausarEntrenamientoPorTecnica() {
            if (estado.fase === 'inactivo' || estado.fase === 'completado') return false;
            if (estado.fase === 'repeticiones' || estado.pausado) return false;

            pausarReanudar();
            mostrarEstado('Entrenamiento en pausa mientras ves la técnica. Pulsa Reanudar al terminar.', 'info');
            return true;
        }

        function abrirTecnica(id) {
            const ejercicio = obtenerEjercicio(id);
            if (!ejercicio || !hojaTecnica) return;

            focoAntesTecnica = document.activeElement;
            pausarEntrenamientoPorTecnica();

            if (tituloTecnica) tituloTecnica.textContent = ejercicio.nombre;
            if (grupoTecnica) grupoTecnica.textContent = ejercicio.grupos.map(function (grupo) { return GRUPOS[grupo].nombre; }).join(' · ');
            if (iconoTecnica) iconoTecnica.innerHTML = ico('i-play');

            if (contenidoTecnica) {
                contenidoTecnica.innerHTML =
                    bloqueAnimacion(id) +
                    '<div class="ficha-bloque"><span>Cómo hacerlo</span><p>' + escaparHTML(ejercicio.descripcion) + '</p></div>' +
                    (ejercicio.progresion ? '<div class="ficha-bloque"><span>Para progresar</span><p>' + escaparHTML(ejercicio.progresion) + '</p></div>' : '') +
                    (ejercicio.regresion ? '<div class="ficha-bloque"><span>Si te cuesta</span><p>' + escaparHTML(ejercicio.regresion) + '</p></div>' : '') +
                    '<p class="nota-hoja">Si sientes dolor o molestia, para y consulta con un profesional.</p>';
            }

            hojaTecnica.classList.add('abierto');
            document.body.style.overflow = 'hidden';
            pausarAnimacionesReducidas(contenidoTecnica);
            if (cerrarTecnica) cerrarTecnica.focus();
        }

        function cerrarTecnicaFicha() {
            if (!hojaTecnica) return;
            hojaTecnica.classList.remove('abierto');
            document.body.style.overflow = '';
            if (contenidoTecnica) contenidoTecnica.innerHTML = '';
            if (focoAntesTecnica && typeof focoAntesTecnica.focus === 'function') focoAntesTecnica.focus();
            focoAntesTecnica = null;
        }

        function aplicarSustituciones(base) {
            const mapa = {};
            if (window.VA && VA.datos && VA.datos.sustituciones) {
                VA.datos.sustituciones.listar(base.id).forEach(function (registro) {
                    mapa[registro.ejercicio_original_id] = registro;
                });
            }

            return Object.assign({}, base, {
                ejercicios: base.ejercicios.map(function (item) {
                    const registro = mapa[item.id];
                    if (!registro || !CATALOGO[registro.ejercicio_sustituto_id] ||
                        registro.ejercicio_sustituto_id === item.id) {
                        return Object.assign({}, item);
                    }

                    return Object.assign({}, item, {
                        id: registro.ejercicio_sustituto_id,
                        id_original: item.id,
                        sustitucion_motivo: registro.motivo || ''
                    });
                })
            });
        }

        function tipoDosis(item) {
            return item.tipo === 'repeticiones' ? 'rep' : 'tiempo';
        }

        function alternativasDisponibles(item, indice) {
            const originalId = item.id_original || item.id;
            const tipo = tipoDosis(item);
            const usados = {};

            estado.rutina.ejercicios.forEach(function (otro, otroIndice) {
                if (otroIndice !== indice) usados[otro.id] = true;
            });

            return (SUSTITUCIONES[originalId] || []).map(function (opcion) {
                const ejercicio = CATALOGO[opcion.id];
                if (!ejercicio) return null;
                if (opcion.id === item.id || opcion.id === originalId) return null;
                if ((opcion.tipos || ['rep', 'tiempo']).indexOf(tipo) < 0) return null;

                return {
                    id: opcion.id,
                    etiquetas: opcion.etiquetas || [],
                    ejercicio: ejercicio,
                    yaEnRutina: Boolean(usados[opcion.id])
                };
            }).filter(Boolean);
        }

        function cerrarSustitucionFicha() {
            if (!hojaSustitucion) return;
            hojaSustitucion.classList.remove('abierto');
            document.body.style.overflow = '';
            if (contenidoSustitucion) contenidoSustitucion.innerHTML = '';
            if (focoAntesSustitucion && typeof focoAntesSustitucion.focus === 'function') focoAntesSustitucion.focus();
            focoAntesSustitucion = null;
            indiceSustitucion = -1;
        }

        function alternativasHTML(alternativas) {
            if (!alternativas.length) {
                return '<p class="hoja-aviso">No hay una alternativa compatible con este formato de dosis. Puedes volver al original o usar la versión más fácil que aparece en la ficha del ejercicio.</p>';
            }

            return '<div class="lista-alternativas">' + alternativas.map(function (alternativa) {
                const etiquetas = alternativa.etiquetas.map(function (etiqueta) {
                    return '<span class="alternativa-tag">' + escaparHTML(etiqueta) + '</span>';
                }).join('');

                return '<button type="button" class="alternativa' + (alternativa.yaEnRutina ? ' alternativa-bloqueada' : '') +
                    '" data-sustituir="' + escaparHTML(alternativa.id) + '"' + (alternativa.yaEnRutina ? ' disabled' : '') + '>' +
                    '<span class="alternativa-cabecera"><strong>' + escaparHTML(alternativa.ejercicio.nombre) + '</strong>' +
                        (alternativa.yaEnRutina ? '<span class="alternativa-nota">Ya está en la rutina</span>' : '') +
                    '</span>' +
                    '<span class="alternativa-tags">' +
                        etiquetaEquipo(alternativa.ejercicio.equipo) +
                        etiquetaImpacto(alternativa.ejercicio.impacto) +
                        etiquetas +
                    '</span>' +
                '</button>';
            }).join('') + '</div>';
        }

        function abrirSustitucion(indice) {
            if (!hojaSustitucion) return;
            if (estado.fase !== 'inactivo') {
                mostrarEstado('Termina la sesión actual antes de cambiar ejercicios.', 'info');
                return;
            }

            const item = estado.rutina.ejercicios[indice];
            if (!item) return;

            const originalId = item.id_original || item.id;
            const original = obtenerEjercicio(originalId);
            const actual = obtenerEjercicio(item.id);
            const alternativas = alternativasDisponibles(item, indice);
            const motivos = [
                { id: 'facil', texto: 'Me cuesta', nota: 'Quiero una versión más fácil' },
                { id: 'comodo', texto: 'Me incomoda', nota: 'Buscar una postura más cómoda' },
                { id: 'equipo', texto: 'No tengo equipo', nota: 'Necesito una opción con lo que tengo' },
                { id: 'gusto', texto: 'No me gusta', nota: 'Preferir otro ejercicio de la misma zona' }
            ];

            indiceSustitucion = indice;
            motivoSustitucion = item.sustitucion_motivo || 'facil';
            focoAntesSustitucion = document.activeElement;

            if (tituloSustitucion) {
                tituloSustitucion.textContent = original ? 'Cambiar: ' + original.nombre : 'Cambiar ejercicio';
            }
            if (grupoSustitucion) {
                const grupos = original
                    ? original.grupos.map(function (grupo) { return GRUPOS[grupo].nombre; }).join(' · ')
                    : '';
                grupoSustitucion.textContent = grupos + (item.id_original && actual ? ' · Ahora: ' + actual.nombre : '');
            }
            if (iconoSustitucion) iconoSustitucion.innerHTML = ico('i-refresh');

            if (contenidoSustitucion) {
                const actualHTML = item.id_original
                    ? '<div class="sustitucion-actual">' +
                        '<p><strong>Ahora:</strong> ' + escaparHTML(actual ? actual.nombre : item.id) + '</p>' +
                        '<p class="hoja-texto">Original: ' + escaparHTML(original ? original.nombre : originalId) + '</p>' +
                        '<button type="button" class="btn-anim" data-restaurar-sheet>' + ico('i-refresh') + ' Volver al original</button>' +
                    '</div>'
                    : '';

                contenidoSustitucion.innerHTML =
                    '<p class="hoja-texto">Elige por qué quieres cambiarlo y después una alternativa. Se guardará solo para esta rutina y no modifica el catálogo ni tu historial.</p>' +
                    '<div class="motivos-sustitucion">' + motivos.map(function (motivo) {
                        const activo = motivo.id === motivoSustitucion;
                        return '<button type="button" class="motivo-btn' + (activo ? ' activo' : '') + '" data-motivo="' + motivo.id + '" aria-pressed="' + (activo ? 'true' : 'false') + '">' +
                            '<strong>' + motivo.texto + '</strong><span>' + motivo.nota + '</span>' +
                        '</button>';
                    }).join('') + '</div>' +
                    actualHTML +
                    '<p class="hoja-texto hoja-texto-fuerte">Alternativas que trabajan la misma zona:</p>' +
                    alternativasHTML(alternativas);
            }

            hojaSustitucion.classList.add('abierto');
            document.body.style.overflow = 'hidden';
            if (cerrarSustitucion) cerrarSustitucion.focus();
        }

        function seleccionarMotivo(boton) {
            motivoSustitucion = boton.getAttribute('data-motivo') || 'facil';
            if (!contenidoSustitucion) return;

            contenidoSustitucion.querySelectorAll('[data-motivo]').forEach(function (opcion) {
                const activo = opcion === boton;
                opcion.classList.toggle('activo', activo);
                opcion.setAttribute('aria-pressed', activo ? 'true' : 'false');
            });
        }

        function recargarRutina() {
            estado.rutina = aplicarSustituciones(rutinaBase);
            estado.rondas = Math.max(1, Math.min(3, Number(estado.rondas) || rutinaBase.rondas));
            renderizarMeta();
            renderizarLista();
            llenarRondas();
            actualizarJugador();
        }

        function aplicarSustitucion(id) {
            if (estado.fase !== 'inactivo') return;

            const item = estado.rutina.ejercicios[indiceSustitucion];
            if (!item) return;

            const alternativas = alternativasDisponibles(item, indiceSustitucion);
            const elegida = alternativas.filter(function (alternativa) {
                return alternativa.id === id && !alternativa.yaEnRutina;
            })[0];

            if (!elegida) return;
            if (!window.VA || !VA.datos || !VA.datos.sustituciones) {
                mostrarEstado('No se pudo guardar el cambio en este dispositivo.', 'error');
                return;
            }

            const guardado = VA.datos.sustituciones.guardar({
                rutina_id: rutinaBase.id,
                ejercicio_original_id: item.id_original || item.id,
                ejercicio_sustituto_id: id,
                motivo: motivoSustitucion
            });

            if (!guardado) {
                mostrarEstado('No se pudo guardar el cambio. Inténtalo de nuevo.', 'error');
                return;
            }

            cerrarSustitucionFicha();
            recargarRutina();
            mostrarEstado('Ejercicio cambiado y guardado para esta rutina.', 'exito');
        }

        function restaurarSustitucion(indice) {
            const posicion = indice != null ? indice : indiceSustitucion;
            const item = estado.rutina.ejercicios[posicion];
            if (!item || !item.id_original) {
                cerrarSustitucionFicha();
                return;
            }

            if (estado.fase !== 'inactivo') {
                mostrarEstado('Termina la sesión actual antes de cambiar ejercicios.', 'info');
                return;
            }

            if (!window.VA || !VA.datos || !VA.datos.sustituciones) {
                mostrarEstado('No se pudo restaurar el ejercicio en este dispositivo.', 'error');
                return;
            }

            const restaurado = VA.datos.sustituciones.eliminar(rutinaBase.id, item.id_original);
            if (!restaurado) {
                mostrarEstado('No se pudo restaurar el ejercicio. Inténtalo de nuevo.', 'error');
                return;
            }

            cerrarSustitucionFicha();
            recargarRutina();
            mostrarEstado('Ejercicio original restaurado.', 'exito');
        }

        function actualizarJugador() {
            if (!entrenador || !cronometro) return;

            entrenador.classList.remove('en-marcha', 'en-descanso', 'pausado', 'preparacion');
            const totalEjercicios = estado.rutina.ejercicios.length;
            const item = estado.rutina.ejercicios[estado.indice];
            const ejercicio = item ? obtenerEjercicio(item.id) : null;

            if (estado.fase === 'inactivo') {
                entrenador.classList.add('preparacion');
                if (progreso) progreso.textContent = totalEjercicios + ' ejercicios · ' + estado.rondas + ' ronda' + (estado.rondas === 1 ? '' : 's');
                if (faseBadge) faseBadge.textContent = 'LISTO';
                if (cronometro) cronometro.textContent = '00:00';
                if (faseEl) faseEl.textContent = 'Listo para empezar';
                if (detalle) detalle.textContent = 'Calentamiento: 5 min. Empieza cuando quieras.';
                if (barra) barra.style.width = '0%';
                if (calentamientoEntrenador) calentamientoEntrenador.hidden = false;
                if (cierreEntrenador) cierreEntrenador.hidden = true;
                actualizarTecnicaEntrenador(null, false);
                if (rondasControl) rondasControl.hidden = false;
                if (btnEntrenamiento) {
                    btnEntrenamiento.hidden = false;
                    btnEntrenamiento.innerHTML = ico('i-play') + ' Iniciar';
                }
                if (btnHecho) btnHecho.hidden = true;
                if (btnSaltar) btnSaltar.hidden = true;
                if (btnDetener) btnDetener.hidden = true;
                marcarLista(-1, 0);
                return;
            }

            if (estado.fase === 'completado') {
                entrenador.classList.add('en-marcha');
                if (progreso) progreso.textContent = 'Rutina terminada';
                if (faseBadge) faseBadge.textContent = 'COMPLETADO';
                if (cronometro) cronometro.textContent = '✓';
                if (faseEl) faseEl.textContent = '¡Buen trabajo!';
                if (detalle) detalle.textContent = 'Registrado en tu progreso de hoy.';
                if (barra) barra.style.width = '100%';
                if (calentamientoEntrenador) calentamientoEntrenador.hidden = true;
                if (cierreEntrenador) cierreEntrenador.hidden = false;
                actualizarTecnicaEntrenador(null, false);
                if (rondasControl) rondasControl.hidden = true;
                if (btnEntrenamiento) {
                    btnEntrenamiento.hidden = false;
                    btnEntrenamiento.innerHTML = ico('i-refresh') + ' Repetir';
                }
                if (btnHecho) btnHecho.hidden = true;
                if (btnSaltar) btnSaltar.hidden = true;
                if (btnDetener) btnDetener.hidden = true;
                marcarLista(-1, totalEjercicios);
                return;
            }

            if (rondasControl) rondasControl.hidden = true;
            if (calentamientoEntrenador) calentamientoEntrenador.hidden = true;
            if (cierreEntrenador) cierreEntrenador.hidden = true;

            const mostrarTecnica = estado.fase === 'preparacion' || estado.fase === 'cambio_lado' ||
                estado.fase === 'trabajo' || estado.fase === 'repeticiones';
            actualizarTecnicaEntrenador(item, mostrarTecnica);

            if (btnEntrenamiento) btnEntrenamiento.hidden = false;
            if (btnHecho) btnHecho.hidden = true;
            if (btnSaltar) btnSaltar.hidden = false;
            if (btnDetener) btnDetener.hidden = false;

            if (progreso) {
                progreso.textContent = 'Ronda ' + estado.ronda + ' de ' + estado.rondas + ' · Ejercicio ' + (estado.indice + 1) + ' de ' + totalEjercicios;
            }

            const completados = (estado.ronda - 1) * totalEjercicios + estado.indice;
            if (barra) {
                const porcentaje = Math.round((completados / (estado.rondas * totalEjercicios)) * 100);
                barra.style.width = porcentaje + '%';
            }

            if (estado.fase === 'preparacion') {
                entrenador.classList.add('preparacion');
                if (estado.pausado) entrenador.classList.add('pausado');
                if (faseBadge) faseBadge.textContent = 'PREPÁRATE';
                if (cronometro) cronometro.textContent = formatearTiempo(estado.restante);
                if (faseEl) faseEl.textContent = 'Prepárate';
                if (detalle) detalle.textContent = 'Empieza en 3 segundos. Respira y colócate.';
                marcarLista(-1, completados % totalEjercicios);
                if (btnEntrenamiento) btnEntrenamiento.innerHTML = ico(estado.pausado ? 'i-play' : 'i-pause') + (estado.pausado ? ' Reanudar' : ' Pausar');
                return;
            }

            if (estado.fase === 'cambio_lado') {
                entrenador.classList.add('preparacion');
                if (estado.pausado) entrenador.classList.add('pausado');
                if (faseBadge) faseBadge.textContent = 'CAMBIA DE LADO';
                if (cronometro) cronometro.textContent = formatearTiempo(estado.restante);
                if (faseEl) faseEl.textContent = 'Cambia de lado';
                if (detalle) detalle.textContent = 'Lado ' + estado.lado + ' de ' + item.lados + '. Colócate bien.';
                marcarLista(estado.indice, estado.indice);
                if (btnEntrenamiento) btnEntrenamiento.innerHTML = ico(estado.pausado ? 'i-play' : 'i-pause') + (estado.pausado ? ' Reanudar' : ' Pausar');
                return;
            }

            if (estado.fase === 'descanso') {
                entrenador.classList.add('en-descanso');
                if (faseBadge) faseBadge.textContent = 'DESCANSO';
                if (cronometro) cronometro.textContent = formatearTiempo(estado.restante);
                if (faseEl) faseEl.textContent = 'Descanso';
                if (detalle) {
                    const siguiente = estado.rutina.ejercicios[estado.indice + 1];
                    detalle.textContent = siguiente ? 'Siguiente: ' + nombreEjercicio(siguiente) : 'Último ejercicio de la ronda.';
                }
                marcarLista(-1, estado.indice + 1);
                if (btnEntrenamiento) btnEntrenamiento.innerHTML = ico(estado.pausado ? 'i-play' : 'i-pause') + (estado.pausado ? ' Reanudar' : ' Pausar');
                if (estado.pausado) entrenador.classList.add('pausado');
                return;
            }

            if (estado.fase === 'descanso_ronda') {
                entrenador.classList.add('en-descanso');
                if (faseBadge) faseBadge.textContent = 'RONDA COMPLETADA';
                if (cronometro) cronometro.textContent = formatearTiempo(estado.restante);
                if (faseEl) faseEl.textContent = 'Descanso entre rondas';
                if (detalle) detalle.textContent = 'Siguiente: ronda ' + (estado.ronda + 1) + ' de ' + estado.rondas + '.';
                if (barra) barra.style.width = '100%';
                marcarLista(-1, totalEjercicios);
                if (btnEntrenamiento) btnEntrenamiento.innerHTML = ico(estado.pausado ? 'i-play' : 'i-pause') + (estado.pausado ? ' Reanudar' : ' Pausar');
                if (estado.pausado) entrenador.classList.add('pausado');
                return;
            }

            if (estado.fase === 'repeticiones') {
                entrenador.classList.add('en-marcha');
                if (faseBadge) faseBadge.textContent = 'REPETICIONES';
                if (cronometro) cronometro.textContent = item.repeticiones;
                if (faseEl) faseEl.textContent = ejercicio ? ejercicio.nombre : item.id;
                if (detalle) detalle.textContent = dosisTexto(item) + ' · ' + (ejercicio ? ejercicio.descripcion : '');
                marcarLista(estado.indice, estado.indice);
                if (btnEntrenamiento) btnEntrenamiento.hidden = true;
                if (btnHecho) {
                    btnHecho.hidden = false;
                    btnHecho.innerHTML = ico('i-check') + ' Hecho';
                }
                if (btnSaltar) btnSaltar.hidden = false;
                if (btnDetener) btnDetener.hidden = false;
                return;
            }

            if (estado.fase === 'trabajo') {
                entrenador.classList.add('en-marcha');
                if (faseBadge) faseBadge.textContent = item.movilidad ? 'MOVILIDAD' : 'TRABAJO';
                if (cronometro) cronometro.textContent = formatearTiempo(estado.restante);
                if (faseEl) faseEl.textContent = ejercicio ? ejercicio.nombre : item.id;
                if (detalle) {
                    detalle.textContent = dosisTexto(item) +
                        (item.lados ? ' · Lado ' + estado.lado + ' de ' + item.lados : '') +
                        (ejercicio ? ' · ' + ejercicio.descripcion : '');
                }
                marcarLista(estado.indice, estado.indice);
                if (btnEntrenamiento) {
                    btnEntrenamiento.hidden = false;
                    btnEntrenamiento.innerHTML = ico(estado.pausado ? 'i-play' : 'i-pause') + (estado.pausado ? ' Reanudar' : ' Pausar');
                }
                if (btnHecho) btnHecho.hidden = true;
                if (estado.pausado) entrenador.classList.add('pausado');
            }
        }

        function renderizarMeta() {
            if (titulo) titulo.textContent = estado.rutina.nombre;
            if (subtitulo) {
                const partesSubtitulo = [];
                if (estado.rutina.rapida) partesSubtitulo.push(GRUPOS[estado.rutina.grupo].nombre);
                partesSubtitulo.push(estado.rutina.nivel);
                partesSubtitulo.push(estimarDuracion(estado.rutina, estado.rondas) + ' min');
                subtitulo.textContent = partesSubtitulo.join(' · ');
            }
            if (meta) {
                meta.innerHTML =
                    '<div class="meta-chip">' + estado.rutina.ejercicios.length + ' ejercicios</div>' +
                    '<div class="meta-chip">' + estado.rondas + ' ronda' + (estado.rondas === 1 ? '' : 's') + '</div>' +
                    '<div class="meta-chip">≈ ' + estimarDuracion(estado.rutina, estado.rondas) + ' min</div>' +
                    etiquetaNivel(estado.rutina.nivel);
            }
            document.title = 'VidaActiva — ' + estado.rutina.nombre;
        }

        function renderizarLista() {
            if (!lista) return;
            const puedeCambiar = estado.fase === 'inactivo';

            lista.innerHTML = estado.rutina.ejercicios.map(function (item, indice) {
                const ejercicio = obtenerEjercicio(item.id);
                const original = item.id_original ? obtenerEjercicio(item.id_original) : null;
                const tieneAnimacion = !!ANIMACIONES[item.id];
                const alternativas = alternativasDisponibles(item, indice);
                const mostrarCambiar = alternativas.length > 0 || Boolean(original);

                return '<div class="item-ejercicio" data-indice="' + indice + '">' +
                    '<span class="numero">' + (indice + 1) + '</span>' +
                    '<div class="item-ejercicio-contenido">' +
                        '<h4>' + escaparHTML(ejercicio ? ejercicio.nombre : item.id) +
                            (original ? '<span class="etiqueta-adaptado">Adaptado</span>' : '') +
                        '</h4>' +
                        '<p>' + dosisTexto(item) + ' <span class="separador">·</span> ' + descansoTexto(item) + '</p>' +
                        (original ? '<p class="item-ejercicio-original">En lugar de ' + escaparHTML(original.nombre) + '</p>' : '') +
                        '<div class="item-tags">' + etiquetaEquipo(ejercicio ? ejercicio.equipo : 'Sin equipo') + etiquetaImpacto(ejercicio ? ejercicio.impacto : 'Bajo') +
                            (tieneAnimacion ? '<button type="button" class="btn-tecnica" data-tecnica="' + item.id + '">' + ico('i-play') + ' Ver técnica</button>' : '') +
                            (mostrarCambiar ? '<button type="button" class="btn-tecnica btn-cambiar" data-cambiar="' + indice + '"' +
                                (puedeCambiar ? '' : ' disabled title="Termina la sesión actual para cambiar ejercicios"') + '>' + ico('i-refresh') + ' Cambiar</button>' : '') +
                            (original ? '<button type="button" class="btn-tecnica btn-restaurar" data-restaurar="' + indice + '"' +
                                (puedeCambiar ? '' : ' disabled title="Termina la sesión actual para cambiar ejercicios"') + '>' + ico('i-refresh') + ' Original</button>' : '') +
                        '</div>' +
                    '</div>' +
                '</div>';
            }).join('');
        }

        function llenarRondas() {
            if (!selectRondas) return;
            const opciones = [1, 2, 3];
            selectRondas.innerHTML = opciones.map(function (numero) {
                return '<option value="' + numero + '"' + (numero === estado.rondas ? ' selected' : '') + '>' + numero + '</option>';
            }).join('');
            selectRondas.disabled = estado.fase !== 'inactivo';
        }

        renderizarMeta();
        renderizarLista();
        llenarRondas();
        actualizarJugador();

        if (selectRondas) {
            selectRondas.addEventListener('change', function () {
                estado.rondas = Number(selectRondas.value) || 1;
                renderizarMeta();
                actualizarJugador();
            });
        }

        if (btnEntrenamiento) {
            btnEntrenamiento.addEventListener('click', function () {
                if (estado.fase === 'inactivo' || estado.fase === 'completado') {
                    iniciarEntrenamiento();
                } else {
                    pausarReanudar();
                }
            });
        }

        if (btnHecho) {
            btnHecho.addEventListener('click', function () {
                if (estado.fase === 'repeticiones') avanzarFase();
            });
        }

        if (btnSaltar) btnSaltar.addEventListener('click', saltarPaso);
        if (btnDetener) btnDetener.addEventListener('click', detenerEntrenamiento);

        if (lista) {
            lista.addEventListener('click', function (evento) {
                const botonCambiar = evento.target.closest('[data-cambiar]');
                if (botonCambiar) {
                    abrirSustitucion(Number(botonCambiar.dataset.cambiar));
                    return;
                }

                const botonRestaurar = evento.target.closest('[data-restaurar]');
                if (botonRestaurar) {
                    restaurarSustitucion(Number(botonRestaurar.dataset.restaurar));
                    return;
                }

                const boton = evento.target.closest('[data-tecnica]');
                if (boton) abrirTecnica(boton.dataset.tecnica);
            });
        }

        if (tecnicaEntrenador) {
            tecnicaEntrenador.addEventListener('click', function (evento) {
                const boton = evento.target.closest('[data-tecnica]');
                if (boton) abrirTecnica(boton.dataset.tecnica);
            });
        }

        if (cerrarTecnica) cerrarTecnica.addEventListener('click', cerrarTecnicaFicha);
        if (cerrarSustitucion) cerrarSustitucion.addEventListener('click', cerrarSustitucionFicha);

        if (hojaSustitucion) {
            hojaSustitucion.addEventListener('click', function (evento) {
                const botonMotivo = evento.target.closest('[data-motivo]');
                if (botonMotivo) {
                    seleccionarMotivo(botonMotivo);
                    return;
                }

                const botonSustituir = evento.target.closest('[data-sustituir]');
                if (botonSustituir) {
                    aplicarSustitucion(botonSustituir.getAttribute('data-sustituir'));
                    return;
                }

                if (evento.target.closest('[data-restaurar-sheet]')) {
                    restaurarSustitucion();
                    return;
                }

                if (evento.target === hojaSustitucion) cerrarSustitucionFicha();
            });
        }

        if (hojaTecnica) {
            hojaTecnica.addEventListener('click', function (evento) {
                const botonVelocidad = evento.target.closest('[data-anim-velocidad]');
                if (botonVelocidad) {
                    cambiarVelocidadAnimacion(botonVelocidad);
                    return;
                }
                const botonAnimacion = evento.target.closest('[data-anim-toggle]');
                if (botonAnimacion) {
                    alternarAnimacionTecnica(botonAnimacion);
                    return;
                }
                if (evento.target === hojaTecnica) cerrarTecnicaFicha();
            });
        }

        document.addEventListener('keydown', function (evento) {
            if (evento.key !== 'Escape') return;
            if (hojaSustitucion && hojaSustitucion.classList.contains('abierto')) {
                cerrarSustitucionFicha();
                return;
            }
            if (hojaTecnica && hojaTecnica.classList.contains('abierto')) cerrarTecnicaFicha();
        });

        window.addEventListener('beforeunload', detenerIntervalo);
    }

    // ===== ARRANQUE =====

    Object.keys(RUTINAS).forEach(function (idRutina) {
        RUTINAS[idRutina].ejercicios.forEach(function (item) {
            if (!CATALOGO[item.id]) console.warn('Ejercicio sin ficha en la rutina ' + idRutina + ': ' + item.id);
        });
    });

    document.addEventListener('DOMContentLoaded', function () {
        if (document.getElementById('appEjercicios')) iniciarPaginaEjercicios();
        if (document.getElementById('appRutina')) iniciarPaginaRutina();
    });
})();
