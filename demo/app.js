(function () {
    'use strict';

    var galeria = document.getElementById('galeria');
    var btnPausa = document.getElementById('btnPausa');
    var btnNormal = document.getElementById('btnNormal');
    var btnLento = document.getElementById('btnLento');
    var tarjetas = [];
    var estado = {
        pausado: false,
        velocidad: 1,
        tiempo: 0,
        ultimo: 0,
        fijo: null
    };

    var ZONAS = {
        piernas: 'Piernas',
        cuerpo_completo: 'Cuerpo completo',
        pecho: 'Pecho',
        abdomen: 'Abdomen',
        brazos_hombros: 'Brazos y hombros',
        espalda: 'Espalda'
    };

    function crearTarjeta(ejercicio, indice) {
        var uid = 'demo' + indice;
        var vista = ejercicio.patron.vista || 'lado';
        var hold = Boolean(ejercicio.patron.hold);
        var zona = ZONAS[ejercicio.zona] || ejercicio.zona;
        var pista = ejercicio.tecnica.clave || ejercicio.tecnica.pasos[0] || 'Movimiento controlado y sin prisa.';
        var tarjeta = document.createElement('article');

        tarjeta.className = 'tarjeta';
        tarjeta.innerHTML =
            '<div class="tarjeta-cabecera">' +
                '<div>' +
                    '<span class="tarjeta-etiqueta">' + zona + ' · ' + ejercicio.equipo + '</span>' +
                    '<h2>' + ejercicio.nombre + '</h2>' +
                '</div>' +
                '<span class="chip">' + (hold ? 'Isométrico' : 'Movimiento') + '</span>' +
            '</div>' +
            '<div class="escenario">' + window.VADemoFigura.crearSVG(ejercicio, uid) + '</div>' +
            '<div class="tarjeta-pie">' +
                '<p>' + pista + '</p>' +
                '<span class="estado-anim">' + (hold ? 'Respiración activa' : 'Movimiento continuo') + '</span>' +
            '</div>';

        galeria.appendChild(tarjeta);

        var refs = {};
        tarjeta.querySelectorAll('[data-parte]').forEach(function (elemento) {
            refs[elemento.getAttribute('data-parte')] = elemento;
        });

        return {
            id: ejercicio.id,
            refs: refs,
            posturas: ejercicio.patron.posturas.map(window.VADemoFigura.puntosDe),
            vista: vista,
            hold: hold,
            duracion: ejercicio.patron.duracion > 0 ? ejercicio.patron.duracion : 2.6,
            offset: ejercicio.patron.offsetLejano || [5, 0],
            fase: (indice * 0.13) % 1
        };
    }

    function actualizarBotonPausa() {
        if (!btnPausa) return;
        btnPausa.textContent = estado.pausado ? 'Reanudar' : 'Pausar';
        btnPausa.setAttribute('aria-pressed', estado.pausado ? 'true' : 'false');
        document.body.classList.toggle('pausado', estado.pausado);
    }

    function cambiarVelocidad(valor, boton) {
        estado.velocidad = valor;
        [btnNormal, btnLento].forEach(function (opcion) {
            if (!opcion) return;
            var activo = opcion === boton;
            opcion.classList.toggle('activo', activo);
            opcion.setAttribute('aria-pressed', activo ? 'true' : 'false');
        });
    }

    function animar(ahora) {
        if (!estado.ultimo) estado.ultimo = ahora;
        var delta = Math.min(0.05, (ahora - estado.ultimo) / 1000);
        estado.ultimo = ahora;

        if (!estado.pausado) {
            estado.tiempo += delta * estado.velocidad;
        }

        tarjetas.forEach(function (tarjeta) {
            var t = estado.fijo !== null
                ? estado.fijo
                : (tarjeta.hold ? 0 : ((estado.tiempo / tarjeta.duracion) + tarjeta.fase) % 1);
            window.VADemoFigura.dibujar(tarjeta, t);
        });

        window.requestAnimationFrame(animar);
    }

    var datos = window.DEMO_EJERCICIOS || [];
    if (!galeria || !datos.length) return;

    datos.forEach(function (ejercicio, indice) {
        tarjetas.push(crearTarjeta(ejercicio, indice));
    });

    tarjetas.forEach(function (tarjeta) {
        window.VADemoFigura.dibujar(tarjeta, tarjeta.hold ? 0 : tarjeta.fase);
    });

    var parametros = new URLSearchParams(window.location.search);
    var tFijo = parametros.get('t');
    if (tFijo !== null && !isNaN(Number(tFijo))) {
        estado.fijo = Math.max(0, Math.min(1, Number(tFijo)));
        estado.pausado = true;
        tarjetas.forEach(function (tarjeta) {
            window.VADemoFigura.dibujar(tarjeta, estado.fijo);
        });
    }
    if (parametros.get('pausa') === '1') {
        estado.pausado = true;
    }

    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        estado.pausado = true;
        actualizarBotonPausa();
    }

    if (btnPausa) {
        btnPausa.addEventListener('click', function () {
            estado.pausado = !estado.pausado;
            actualizarBotonPausa();
        });
    }

    if (btnNormal) {
        btnNormal.addEventListener('click', function () {
            cambiarVelocidad(1, btnNormal);
        });
    }

    if (btnLento) {
        btnLento.addEventListener('click', function () {
            cambiarVelocidad(0.55, btnLento);
        });
    }

    actualizarBotonPausa();
    window.requestAnimationFrame(animar);
})();
