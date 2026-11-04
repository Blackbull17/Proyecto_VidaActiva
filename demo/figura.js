(function () {
    'use strict';

    var K = 0.5522847498;
    var RESPALDO = {
        rodillaLejana: 'rodilla',
        tobilloLejano: 'tobillo',
        pieLejano: 'pie',
        codoLejano: 'codo',
        manoLejano: 'mano'
    };

    function p(x, y) {
        return { x: x, y: y };
    }

    function sumar(a, b) {
        return p(a.x + b.x, a.y + b.y);
    }

    function restar(a, b) {
        return p(a.x - b.x, a.y - b.y);
    }

    function escalar(a, n) {
        return p(a.x * n, a.y * n);
    }

    function normalizar(a) {
        var largo = Math.sqrt((a.x * a.x) + (a.y * a.y)) || 1;
        return p(a.x / largo, a.y / largo);
    }

    function mezclar(a, b, t) {
        return p(a.x + ((b.x - a.x) * t), a.y + ((b.y - a.y) * t));
    }

    function f(n) {
        return Math.round(n * 10) / 10;
    }

    function P(a) {
        return f(a.x) + ' ' + f(a.y);
    }

    function puntosDe(postura) {
        var salida = {};
        Object.keys(postura).forEach(function (clave) {
            salida[clave] = p(postura[clave][0], postura[clave][1]);
        });
        return salida;
    }

    function interpolarPostura(a, b, t) {
        var salida = {};
        var claves = Object.keys(a);
        Object.keys(b).forEach(function (clave) {
            if (claves.indexOf(clave) === -1) claves.push(clave);
        });

        claves.forEach(function (clave) {
            if (!a[clave] && !b[clave]) return;
            var alias = RESPALDO[clave];
            var pa = a[clave] || (alias ? a[alias] : null) || b[clave];
            var pb = b[clave] || (alias ? b[alias] : null) || a[clave];
            salida[clave] = mezclar(pa, pb, t);
        });

        return salida;
    }

    function muestrear(posturas, t) {
        if (!posturas.length) return {};
        if (posturas.length === 1) return posturas[0];

        var n = posturas.length;
        var total = (n - 1) * 2;
        var pos = (((t % 1) + 1) % 1) * total;
        var indice = Math.floor(pos);
        var a;
        var b;

        if (indice < n - 1) {
            a = indice;
            b = indice + 1;
        } else {
            a = (n - 1) - (indice - (n - 1));
            b = a - 1;
        }

        var fraccion = pos - indice;
        fraccion = fraccion * fraccion * (3 - (2 * fraccion));
        return interpolarPostura(posturas[a], posturas[b], fraccion);
    }

    function capsula(a, b, anchoA, anchoB) {
        var direccion = restar(b, a);
        var largo = Math.sqrt((direccion.x * direccion.x) + (direccion.y * direccion.y));
        if (largo < 0.01) return '';

        var u = escalar(direccion, 1 / largo);
        var normal = p(-u.y, u.x);
        var ra = anchoA / 2;
        var rb = anchoB / 2;
        var a1 = sumar(a, escalar(normal, ra));
        var a2 = restar(a, escalar(normal, ra));
        var b1 = sumar(b, escalar(normal, rb));
        var b2 = restar(b, escalar(normal, rb));
        var curvaA = escalar(u, ra * K);
        var curvaB = escalar(u, rb * K);

        return 'M ' + P(a1) +
            ' L ' + P(b1) +
            ' C ' + P(sumar(b1, curvaB)) + ' ' + P(sumar(b2, curvaB)) + ' ' + P(b2) +
            ' L ' + P(a2) +
            ' C ' + P(restar(a2, curvaA)) + ' ' + P(restar(a1, curvaA)) + ' ' + P(a1) +
            ' Z';
    }

    function zapatoPath(a, b) {
        var direccion = restar(b, a);
        var largo = Math.sqrt((direccion.x * direccion.x) + (direccion.y * direccion.y));
        if (largo < 0.01) return capsula(a, b, 9, 7.2);

        var u = escalar(direccion, 1 / largo);
        var n = p(-u.y, u.x);
        var p1 = sumar(sumar(a, escalar(u, -2.5)), escalar(n, -4.6));
        var p2 = sumar(sumar(a, escalar(u, largo * 0.38)), escalar(n, -5));
        var p3 = sumar(b, escalar(n, -3.2));
        var p4 = sumar(b, escalar(n, 3.6));
        var p5 = sumar(sumar(a, escalar(u, 2.5)), escalar(n, 4.8));
        var p6 = sumar(sumar(a, escalar(u, -3)), escalar(n, 0.8));

        return 'M ' + P(p1) +
            ' C ' + P(sumar(p1, escalar(u, largo * 0.18))) + ' ' + P(sumar(p2, escalar(u, -largo * 0.16))) + ' ' + P(p2) +
            ' C ' + P(sumar(p2, escalar(u, largo * 0.3))) + ' ' + P(sumar(p3, escalar(u, -largo * 0.24))) + ' ' + P(p3) +
            ' C ' + P(sumar(p3, escalar(u, largo * 0.04))) + ' ' + P(sumar(p4, escalar(u, largo * 0.04))) + ' ' + P(p4) +
            ' L ' + P(p5) +
            ' C ' + P(sumar(p5, escalar(u, -largo * 0.08))) + ' ' + P(sumar(p6, escalar(u, largo * 0.08))) + ' ' + P(p6) +
            ' Z';
    }

    function ejePie(a, b) {
        var direccion = restar(b, a);
        var largo = Math.sqrt((direccion.x * direccion.x) + (direccion.y * direccion.y));
        if (largo < 0.01) return p(0, 1);
        return p(-direccion.y / largo, direccion.x / largo);
    }

    function torsoPath(postura, vista) {
        var hombro = postura.hombro;
        var cadera = postura.cadera;
        var u = normalizar(restar(cadera, hombro));
        var normal = p(-u.y, u.x);
        var anchoHombro = (vista === 'frente' ? 30 : 23) / 2;
        var anchoCadera = (vista === 'frente' ? 23 : 18) / 2;
        var sL = sumar(hombro, escalar(normal, anchoHombro));
        var sR = restar(hombro, escalar(normal, anchoHombro));
        var hL = sumar(cadera, escalar(normal, anchoCadera));
        var hR = restar(cadera, escalar(normal, anchoCadera));
        var c1 = sumar(sumar(sL, escalar(u, 8)), escalar(normal, 1.4));
        var c2 = sumar(restar(hL, escalar(u, 8)), escalar(normal, 1.4));
        var c3 = restar(restar(hR, escalar(u, 8)), escalar(normal, 1.4));
        var c4 = restar(sumar(sR, escalar(u, 8)), escalar(normal, 1.4));
        var arriba = restar(hombro, escalar(u, 3.5));
        var abajo = sumar(cadera, escalar(u, 2.5));

        return 'M ' + P(sL) +
            ' C ' + P(c1) + ' ' + P(c2) + ' ' + P(hL) +
            ' Q ' + P(abajo) + ' ' + P(hR) +
            ' C ' + P(c3) + ' ' + P(c4) + ' ' + P(sR) +
            ' Q ' + P(arriba) + ' ' + P(sL) +
            ' Z';
    }

    function setPath(el, d) {
        if (el) el.setAttribute('d', d || '');
    }

    function setEllipse(el, centro, rx, ry) {
        if (!el) return;
        el.setAttribute('cx', f(centro.x));
        el.setAttribute('cy', f(centro.y));
        el.setAttribute('rx', f(rx));
        el.setAttribute('ry', f(ry));
    }

    function grados(rad) {
        return rad * 180 / Math.PI;
    }

    function cabezaLado(uid) {
        return [
            '<path d="M -13 -12 C -18 -1 -16 11 -8 18 L -3 12 C -10 6 -10 -2 -6 -8 Z" fill="url(#hair-' + uid + ')"/>',
            '<ellipse cx="0" cy="0" rx="11.5" ry="14" fill="url(#skin-' + uid + ')"/>',
            '<path d="M 10 -2 Q 15 2 10 5 Z" fill="url(#skinDark-' + uid + ')"/>',
            '<circle cx="-9" cy="2" r="3.2" fill="url(#skinDark-' + uid + ')"/>',
            '<path d="M -12 -7 C -12 -17 1 -21 9 -12 C 5 -8 -1 -7 -5 -4 C -8 -2 -10 1 -12 -7 Z" fill="url(#hair-' + uid + ')"/>',
            '<circle cx="7" cy="-2" r="1.3" fill="#2d3748"/>',
            '<path d="M 3 -6 Q 7 -8 10 -6" stroke="#3f2a24" stroke-width="1.2" fill="none" stroke-linecap="round"/>',
            '<path d="M 5 7 Q 8 9 10 7" stroke="#a05a4a" stroke-width="1.2" fill="none" stroke-linecap="round"/>',
            '<circle cx="4" cy="4" r="2.2" fill="#e88d72" opacity=".18"/>'
        ].join('');
    }

    function cabezaFrente(uid) {
        return [
            '<ellipse cx="0" cy="0" rx="13" ry="15" fill="url(#skin-' + uid + ')"/>',
            '<path d="M -13 -3 C -15 -17 -2 -22 8 -17 C 15 -14 15 -7 13 -2 C 10 -7 5 -9 0 -7 C -6 -5 -9 -1 -13 -3 Z" fill="url(#hair-' + uid + ')"/>',
            '<circle cx="-13" cy="2" r="3" fill="url(#skinDark-' + uid + ')"/>',
            '<circle cx="13" cy="2" r="3" fill="url(#skinDark-' + uid + ')"/>',
            '<circle cx="-4.5" cy="-1" r="1.4" fill="#2d3748"/>',
            '<circle cx="4.5" cy="-1" r="1.4" fill="#2d3748"/>',
            '<path d="M -7 -5 Q -4.5 -7 -2 -5" stroke="#3f2a24" stroke-width="1.1" fill="none" stroke-linecap="round"/>',
            '<path d="M 2 -5 Q 4.5 -7 7 -5" stroke="#3f2a24" stroke-width="1.1" fill="none" stroke-linecap="round"/>',
            '<path d="M -1 5 Q 0 7 1 5" stroke="#c98a63" stroke-width="1.1" fill="none" stroke-linecap="round"/>',
            '<path d="M -4 8 Q 0 11 4 8" stroke="#a05a4a" stroke-width="1.2" fill="none" stroke-linecap="round"/>',
            '<circle cx="-8" cy="5" r="2.5" fill="#e88d72" opacity=".16"/>',
            '<circle cx="8" cy="5" r="2.5" fill="#e88d72" opacity=".16"/>'
        ].join('');
    }

    function defsSVG(uid) {
        return '<defs>' +
            '<linearGradient id="bg-' + uid + '" x1="0" y1="0" x2="0" y2="1">' +
                '<stop offset="0" stop-color="#f8fffb"/>' +
                '<stop offset="1" stop-color="#e8f8f1"/>' +
            '</linearGradient>' +
            '<linearGradient id="skin-' + uid + '" x1="0" y1="0" x2="1" y2="1">' +
                '<stop offset="0" stop-color="#f6d0ad"/>' +
                '<stop offset="1" stop-color="#d9966e"/>' +
            '</linearGradient>' +
            '<linearGradient id="skinDark-' + uid + '" x1="0" y1="0" x2="1" y2="1">' +
                '<stop offset="0" stop-color="#d9a17d"/>' +
                '<stop offset="1" stop-color="#b97955"/>' +
            '</linearGradient>' +
            '<linearGradient id="shirt-' + uid + '" x1="0" y1="0" x2="1" y2="1">' +
                '<stop offset="0" stop-color="#48bb78"/>' +
                '<stop offset="1" stop-color="#2f855a"/>' +
            '</linearGradient>' +
            '<linearGradient id="shirtDark-' + uid + '" x1="0" y1="0" x2="1" y2="1">' +
                '<stop offset="0" stop-color="#2f855a"/>' +
                '<stop offset="1" stop-color="#22543d"/>' +
            '</linearGradient>' +
            '<linearGradient id="shorts-' + uid + '" x1="0" y1="0" x2="1" y2="1">' +
                '<stop offset="0" stop-color="#4a5568"/>' +
                '<stop offset="1" stop-color="#2d3748"/>' +
            '</linearGradient>' +
            '<linearGradient id="shortsDark-' + uid + '" x1="0" y1="0" x2="1" y2="1">' +
                '<stop offset="0" stop-color="#2d3748"/>' +
                '<stop offset="1" stop-color="#1a202c"/>' +
            '</linearGradient>' +
            '<linearGradient id="hair-' + uid + '" x1="0" y1="0" x2="1" y2="1">' +
                '<stop offset="0" stop-color="#4a342c"/>' +
                '<stop offset="1" stop-color="#2d1f1a"/>' +
            '</linearGradient>' +
            '<linearGradient id="shoe-' + uid + '" x1="0" y1="0" x2="1" y2="1">' +
                '<stop offset="0" stop-color="#4a5568"/>' +
                '<stop offset="1" stop-color="#1a202c"/>' +
            '</linearGradient>' +
            '<linearGradient id="shoeDark-' + uid + '" x1="0" y1="0" x2="1" y2="1">' +
                '<stop offset="0" stop-color="#2d3748"/>' +
                '<stop offset="1" stop-color="#0f172a"/>' +
            '</linearGradient>' +
            '<linearGradient id="mat-' + uid + '" x1="0" y1="0" x2="1" y2="0">' +
                '<stop offset="0" stop-color="#c6f6d5"/>' +
                '<stop offset="1" stop-color="#9ae6b4"/>' +
            '</linearGradient>' +
            '<filter id="shadow-' + uid + '" x="-30%" y="-30%" width="160%" height="160%">' +
                '<feGaussianBlur stdDeviation="3.8"/>' +
            '</filter>' +
            '<filter id="drop-' + uid + '" x="-25%" y="-25%" width="150%" height="150%">' +
                '<feDropShadow dx="0" dy="2.4" stdDeviation="1.8" flood-color="#1a202c" flood-opacity=".14"/>' +
            '</filter>' +
        '</defs>';
    }

    function figuraLado(uid, conPeso) {
        var skin = 'url(#skin-' + uid + ')';
        var skinDark = 'url(#skinDark-' + uid + ')';
        var shirt = 'url(#shirt-' + uid + ')';
        var shirtDark = 'url(#shirtDark-' + uid + ')';
        var shorts = 'url(#shorts-' + uid + ')';
        var shortsDark = 'url(#shortsDark-' + uid + ')';
        var shoe = 'url(#shoe-' + uid + ')';
        var shoeDark = 'url(#shoeDark-' + uid + ')';

        return [
            '<path data-parte="brazoLejanoSup" fill="' + skinDark + '"/>',
            '<path data-parte="mangaLejano" fill="' + shirtDark + '"/>',
            '<path data-parte="brazoLejanoInf" fill="' + skinDark + '"/>',
            '<ellipse data-parte="manoLejana" fill="' + skinDark + '"/>',
            '<path data-parte="piernaLejanaSup" fill="' + shortsDark + '"/>',
            '<path data-parte="piernaLejanaInf" fill="' + skinDark + '"/>',
            '<path data-parte="zapatoLejana" fill="' + shoeDark + '"/>',
            '<path data-parte="suelaLejana" fill="#a0aec0"/>',
            '<path data-parte="calcetinLejana" fill="#cbd5e0"/>',
            '<path data-parte="torso" fill="' + shirt + '"/>',
            '<path data-parte="cuello" fill="' + skin + '"/>',
            '<g data-parte="cabeza">' + cabezaLado(uid) + '</g>',
            '<path data-parte="brazoSup" fill="' + skin + '"/>',
            '<path data-parte="manga" fill="' + shirt + '"/>',
            '<path data-parte="brazoInf" fill="' + skin + '"/>',
            '<ellipse data-parte="mano" fill="' + skin + '"/>',
            '<path data-parte="piernaSup" fill="' + shorts + '"/>',
            '<path data-parte="piernaInf" fill="' + skin + '"/>',
            '<path data-parte="zapato" fill="' + shoe + '"/>',
            '<path data-parte="suela" fill="#cbd5e0"/>',
            '<path data-parte="calcetin" fill="#edf2f7"/>',
            conPeso ? '<g data-parte="peso">' +
                '<rect x="-11" y="-3" width="22" height="6" rx="3" fill="#cbd5e0"/>' +
                '<rect x="-14" y="-7" width="5" height="14" rx="2" fill="#4a5568"/>' +
                '<rect x="9" y="-7" width="5" height="14" rx="2" fill="#4a5568"/>' +
                '<rect x="-2" y="-2" width="4" height="4" rx="1" fill="#a0aec0"/>' +
            '</g>' : ''
        ].join('');
    }

    function figuraFrente(uid) {
        var skin = 'url(#skin-' + uid + ')';
        var shirt = 'url(#shirt-' + uid + ')';
        var shorts = 'url(#shorts-' + uid + ')';
        var shoe = 'url(#shoe-' + uid + ')';

        return [
            '<path data-parte="piernaI-Sup" fill="' + shorts + '"/>',
            '<path data-parte="piernaI-Inf" fill="' + skin + '"/>',
            '<path data-parte="zapatoI" fill="' + shoe + '"/>',
            '<path data-parte="suelaI" fill="#cbd5e0"/>',
            '<path data-parte="calcetinI" fill="#edf2f7"/>',
            '<path data-parte="piernaD-Sup" fill="' + shorts + '"/>',
            '<path data-parte="piernaD-Inf" fill="' + skin + '"/>',
            '<path data-parte="zapatoD" fill="' + shoe + '"/>',
            '<path data-parte="suelaD" fill="#cbd5e0"/>',
            '<path data-parte="calcetinD" fill="#edf2f7"/>',
            '<path data-parte="torso" fill="' + shirt + '"/>',
            '<path data-parte="cuello" fill="' + skin + '"/>',
            '<g data-parte="cabeza">' + cabezaFrente(uid) + '</g>',
            '<path data-parte="brazoI-Sup" fill="' + skin + '"/>',
            '<path data-parte="mangaI" fill="' + shirt + '"/>',
            '<path data-parte="brazoI-Inf" fill="' + skin + '"/>',
            '<ellipse data-parte="manoI" fill="' + skin + '"/>',
            '<path data-parte="brazoD-Sup" fill="' + skin + '"/>',
            '<path data-parte="mangaD" fill="' + shirt + '"/>',
            '<path data-parte="brazoD-Inf" fill="' + skin + '"/>',
            '<ellipse data-parte="manoD" fill="' + skin + '"/>'
        ].join('');
    }

    function crearSVG(ejercicio, uid) {
        var vista = ejercicio.patron.vista || 'lado';
        var hold = Boolean(ejercicio.patron.hold);
        var conPeso = Boolean(ejercicio.anim.peso || ejercicio.patron.peso);
        var conEsterilla = ejercicio.id === 'plancha_abdominal' || ejercicio.id === 'flexiones_clasicas';
        var figura = vista === 'frente' ? figuraFrente(uid) : figuraLado(uid, conPeso);

        return '<svg viewBox="0 0 240 200" role="img" aria-label="Animación de ' + ejercicio.nombre + '">' +
            defsSVG(uid) +
            '<rect width="240" height="200" fill="url(#bg-' + uid + ')"/>' +
            '<circle cx="194" cy="48" r="54" fill="#ffffff" opacity=".30"/>' +
            '<circle cx="42" cy="156" r="28" fill="#ffffff" opacity=".22"/>' +
            '<line x1="20" y1="179" x2="220" y2="179" stroke="#cbd5e0" stroke-width="1.5" stroke-linecap="round" opacity=".7"/>' +
            (conEsterilla ? '<rect x="28" y="173" width="184" height="9" rx="4.5" fill="url(#mat-' + uid + ')"/>' : '') +
            '<ellipse data-parte="sombra" cx="120" cy="182" rx="42" ry="6" fill="#0f172a" opacity=".12" filter="url(#shadow-' + uid + ')"/>' +
            '<g data-parte="figura" class="' + (hold ? 'respira' : '') + '" filter="url(#drop-' + uid + ')">' + figura + '</g>' +
            '</svg>';
    }

    function actualizarBrazoLado(refs, postura, prefijo, offset, alterno) {
        var hombro = sumar(postura.hombro, offset);
        var codoBase = alterno && postura.codoLejano ? postura.codoLejano : postura.codo;
        var manoBase = alterno && postura.manoLejano ? postura.manoLejano : postura.mano;
        var codo = sumar(codoBase, offset);
        var mano = sumar(manoBase, offset);

        setPath(refs['brazo' + prefijo + 'Sup'], capsula(hombro, codo, 10, 8));
        setPath(refs['manga' + prefijo], capsula(hombro, mezclar(hombro, codo, 0.58), 12.5, 11.5));
        setPath(refs['brazo' + prefijo + 'Inf'], capsula(codo, mano, 8, 6));
        setEllipse(refs['mano' + prefijo], mano, 4.8, 4.4);
        return { codo: codo, mano: mano };
    }

    function pintarPierna(refs, prefijo, cadera, rodilla, tobillo, pie) {
        var normalPie = ejePie(tobillo, pie);
        setPath(refs['pierna' + prefijo + 'Sup'], capsula(cadera, rodilla, 15, 11));
        setPath(refs['pierna' + prefijo + 'Inf'], capsula(rodilla, tobillo, 10, 7));
        setPath(refs['zapato' + prefijo], zapatoPath(tobillo, pie));
        setPath(refs['suela' + prefijo], capsula(
            sumar(tobillo, escalar(normalPie, 3.7)),
            sumar(pie, escalar(normalPie, 3.7)),
            2.4, 2.2
        ));
        setPath(refs['calcetin' + prefijo], capsula(mezclar(rodilla, tobillo, 0.74), mezclar(rodilla, tobillo, 0.88), 8.6, 8));
    }

    function actualizarPiernaLado(refs, postura, prefijo, offset, alterna) {
        var cadera = sumar(postura.cadera, offset);
        var rodillaBase = alterna && postura.rodillaLejana ? postura.rodillaLejana : postura.rodilla;
        var tobilloBase = alterna && postura.tobilloLejano ? postura.tobilloLejano : postura.tobillo;
        var pieBase = alterna && postura.pieLejano ? postura.pieLejano : postura.pie;
        var rodilla = sumar(rodillaBase, offset);
        var tobillo = sumar(tobilloBase, offset);
        var pie = sumar(pieBase, offset);

        pintarPierna(refs, prefijo, cadera, rodilla, tobillo, pie);
    }

    function actualizarBrazoFrente(refs, postura, sufijo) {
        var hombro = postura.hombro;
        var codo = postura['codo' + sufijo];
        var mano = postura['mano' + sufijo];
        if (!codo || !mano) return;

        setPath(refs['brazo' + sufijo + '-Sup'], capsula(hombro, codo, 10, 8));
        setPath(refs['manga' + sufijo], capsula(hombro, mezclar(hombro, codo, 0.56), 12.5, 11.5));
        setPath(refs['brazo' + sufijo + '-Inf'], capsula(codo, mano, 8, 6));
        setEllipse(refs['mano' + sufijo], mano, 4.8, 4.4);
    }

    function actualizarPiernaFrente(refs, postura, sufijo) {
        var cadera = postura.cadera;
        var rodilla = postura['rodilla' + sufijo];
        var pie = postura['pie' + sufijo];
        if (!rodilla || !pie) return;

        var tobillo = mezclar(rodilla, pie, 0.82);
        var normalPie = ejePie(tobillo, pie);
        setPath(refs['pierna' + sufijo + '-Sup'], capsula(cadera, rodilla, 15, 11));
        setPath(refs['pierna' + sufijo + '-Inf'], capsula(rodilla, tobillo, 10, 7));
        setPath(refs['zapato' + sufijo], zapatoPath(tobillo, pie));
        setPath(refs['suela' + sufijo], capsula(
            sumar(tobillo, escalar(normalPie, 3.7)),
            sumar(pie, escalar(normalPie, 3.7)),
            2.4, 2.2
        ));
        setPath(refs['calcetin' + sufijo], capsula(mezclar(rodilla, tobillo, 0.74), mezclar(rodilla, tobillo, 0.88), 8.6, 8));
    }

    function actualizarCabeza(refs, postura, vista) {
        var hombro = postura.hombro;
        var cabeza = postura.cabeza;
        var angulo = vista === 'frente' ? 0 : Math.atan2(cabeza.x - hombro.x, hombro.y - cabeza.y);
        var seno = Math.sin(angulo);
        var coseno = Math.cos(angulo);
        var finCuello = p(cabeza.x - (seno * 13), cabeza.y + (coseno * 13));

        setPath(refs.cuello, capsula(hombro, finCuello, vista === 'frente' ? 12 : 10, 9));
        if (refs.cabeza) {
            var voltear = vista === 'lado' && postura.cabeza.x < postura.cadera.x - 8;
            refs.cabeza.setAttribute('transform',
                'translate(' + f(cabeza.x) + ' ' + f(cabeza.y) + ') rotate(' + f(grados(angulo)) + ')' +
                (voltear ? ' scale(-1 1)' : ''));
        }
    }

    function actualizarSombra(refs, postura) {
        if (!refs.sombra) return;

        var xs = [];
        Object.keys(postura).forEach(function (clave) {
            xs.push(postura[clave].x);
        });
        if (!xs.length) return;

        var min = Math.min.apply(Math, xs);
        var max = Math.max.apply(Math, xs);
        var centro = (min + max) / 2;
        var radio = Math.min(92, Math.max(31, ((max - min) / 2) + 13));
        refs.sombra.setAttribute('cx', f(centro));
        refs.sombra.setAttribute('rx', f(radio));
    }

    function dibujar(tarjeta, t) {
        var refs = tarjeta.refs;
        var postura = muestrear(tarjeta.posturas, t);
        var vista = tarjeta.vista;
        var offset = tarjeta.offset;
        var salto = 0;

        if (tarjeta.id === 'saltos_tijera') {
            salto = Math.sin(Math.PI * (((t % 1) + 1) % 1)) * 2.8;
            refs.figura.setAttribute('transform', 'translate(0 ' + f(-salto) + ')');
        } else if (refs.figura) {
            refs.figura.removeAttribute('transform');
        }

        setPath(refs.torso, torsoPath(postura, vista));
        actualizarCabeza(refs, postura, vista);

        if (vista === 'frente') {
            actualizarBrazoFrente(refs, postura, 'I');
            actualizarBrazoFrente(refs, postura, 'D');
            actualizarPiernaFrente(refs, postura, 'I');
            actualizarPiernaFrente(refs, postura, 'D');
        } else {
            var offsetLejano = p(offset[0], offset[1]);
            actualizarBrazoLado(refs, postura, 'Lejano', offsetLejano, true);
            actualizarPiernaLado(refs, postura, 'Lejana', offsetLejano, true);
            var brazo = actualizarBrazoLado(refs, postura, '', p(0, 0), false);
            actualizarPiernaLado(refs, postura, '', p(0, 0), false);

            if (refs.peso && brazo) {
                var angulo = Math.atan2(brazo.mano.y - brazo.codo.y, brazo.mano.x - brazo.codo.x);
                refs.peso.setAttribute('transform',
                    'translate(' + f(brazo.mano.x) + ' ' + f(brazo.mano.y) + ') rotate(' + f(grados(angulo) - 90) + ')');
            }
        }

        actualizarSombra(refs, postura);

        if (refs.sombra) {
            refs.sombra.setAttribute('opacity', f(0.12 - (salto * 0.006)));
        }
    }

    window.VADemoFigura = {
        crearSVG: crearSVG,
        puntosDe: puntosDe,
        dibujar: dibujar
    };
})();
