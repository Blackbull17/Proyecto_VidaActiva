/* ============================================================
   VidaActiva — Interfaz compartida
   - Inyecta el sprite SVG de iconos de línea.
   - Construye la barra lateral, la cabecera móvil y el nav inferior.
   - Rellena nombre, inicial y racha desde los datos locales.
   ============================================================ */
(function () {
    'use strict';

    var SPRITE = ''
        + '<svg aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden" focusable="false">'
        + '<defs>'
        + '<linearGradient id="grad-anillo" x1="0" y1="0" x2="1" y2="1">'
        + '<stop offset="0%" stop-color="#a3e635"/><stop offset="100%" stop-color="#22c55e"/>'
        + '</linearGradient>'
        + '<linearGradient id="grad-area" x1="0" y1="0" x2="0" y2="1">'
        + '<stop offset="0%" stop-color="#22c55e" stop-opacity=".35"/>'
        + '<stop offset="100%" stop-color="#22c55e" stop-opacity="0"/>'
        + '</linearGradient>'
        + '</defs>'
        + '<symbol id="i-leaf" viewBox="0 0 24 24"><path d="M20 4C11 4 5 9 5 16c0 2 1 4 1 4s8-1 11-6c2-3 3-7 3-10Z"/><path d="M5 20C8 14 13 10 20 8"/></symbol>'
        + '<symbol id="i-home" viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/></symbol>'
        + '<symbol id="i-food" viewBox="0 0 24 24"><path d="M4 3v7a2 2 0 0 0 2 2 2 2 0 0 0 2-2V3"/><path d="M6 12v9"/><path d="M17 3c-1.7 0-3 1.8-3 4v5h3v9"/></symbol>'
        + '<symbol id="i-dumbbell" viewBox="0 0 24 24"><path d="M6 7v10M18 7v10M3 9v6M21 9v6M6 12h12"/></symbol>'
        + '<symbol id="i-check" viewBox="0 0 24 24"><path d="m5 12 5 5L20 7"/></symbol>'
        + '<symbol id="i-chart" viewBox="0 0 24 24"><path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-6"/></symbol>'
        + '<symbol id="i-settings" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="7" cy="18" r="2"/></symbol>'
        + '<symbol id="i-flame" viewBox="0 0 24 24"><path d="M12 22c4 0 6-2.7 6-6 0-2.5-1.5-4.5-3-6.5-.4 1.5-1.2 2.5-2 3 0-3-1-6-4-9 .2 4-1.5 6-3 8.5C5.2 13.5 5 14.8 5 16c0 3.3 3 6 7 6Z"/></symbol>'
        + '<symbol id="i-apple" viewBox="0 0 24 24"><path d="M12 7c-3-2-6 0-6 4 0 5 4 9 6 9s6-4 6-9c0-4-3-6-6-4Z"/><path d="M12 7c0-2 1-4 3-5"/></symbol>'
        + '<symbol id="i-play" viewBox="0 0 24 24"><path d="M8 5v14l11-7Z"/></symbol>'
        + '<symbol id="i-pause" viewBox="0 0 24 24"><path d="M9 5v14M15 5v14"/></symbol>'
        + '<symbol id="i-plus" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></symbol>'
        + '<symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>'
        + '<symbol id="i-arrow-up" viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6"/></symbol>'
        + '<symbol id="i-bell" viewBox="0 0 24 24"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></symbol>'
        + '<symbol id="i-target" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></symbol>'
        + '<symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></symbol>'
        + '<symbol id="i-moon" viewBox="0 0 24 24"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/></symbol>'
        + '<symbol id="i-medal" viewBox="0 0 24 24"><circle cx="12" cy="9" r="6"/><path d="m8 14-2 8 6-3 6 3-2-8"/></symbol>'
        + '<symbol id="i-timer" viewBox="0 0 24 24"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M9 2h6"/></symbol>'
        + '<symbol id="i-user" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7"/></symbol>'
        + '<symbol id="i-alert" viewBox="0 0 24 24"><path d="M12 3 2 21h20L12 3Z"/><path d="M12 9v5"/><circle cx="12" cy="18" r=".6" fill="currentColor" stroke="none"/></symbol>'
        + '<symbol id="i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v6"/><circle cx="12" cy="7.5" r=".6" fill="currentColor" stroke="none"/></symbol>'
        + '<symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-4"/></symbol>'
        + '<symbol id="i-heart" viewBox="0 0 24 24"><path d="M12 21s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.6-7 10-7 10Z"/></symbol>'
        + '<symbol id="i-walk" viewBox="0 0 24 24"><circle cx="13" cy="4" r="2"/><path d="m11 22 2-6-3-3 2-5 3 3 3 1"/><path d="m8 14 2-3"/><path d="m13 16 3 6"/></symbol>'
        + '<symbol id="i-water" viewBox="0 0 24 24"><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/><path d="M9 15a3 3 0 0 0 3 3"/></symbol>'
        + '<symbol id="i-book" viewBox="0 0 24 24"><path d="M4 4h7a3 3 0 0 1 3 3v14a2 2 0 0 0-2-2H4V4Z"/><path d="M20 4h-4a3 3 0 0 0-3 3v14a2 2 0 0 1 2-2h5V4Z"/></symbol>'
        + '<symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></symbol>'
        + '<symbol id="i-calendar" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></symbol>'
        + '<symbol id="i-scale" viewBox="0 0 24 24"><path d="M12 3v18M5 21h14"/><path d="m6 7 4-2 4 2 4-2"/><path d="m6 7-3 6a3 3 0 0 0 6 0L6 7Z"/><path d="m18 7-3 6a3 3 0 0 0 6 0l-3-6Z"/></symbol>'
        + '<symbol id="i-trend" viewBox="0 0 24 24"><path d="m3 17 6-6 4 4 8-8"/><path d="M15 7h6v6"/></symbol>'
        + '<symbol id="i-download" viewBox="0 0 24 24"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M4 21h16"/></symbol>'
        + '<symbol id="i-upload" viewBox="0 0 24 24"><path d="M12 21V9"/><path d="m7 14 5-5 5 5"/><path d="M4 3h16"/></symbol>'
        + '<symbol id="i-lock" viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></symbol>'
        + '<symbol id="i-logout" viewBox="0 0 24 24"><path d="M10 4H5v16h5"/><path d="M14 8l4 4-4 4"/><path d="M18 12H9"/></symbol>'
        + '<symbol id="i-zap" viewBox="0 0 24 24"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/></symbol>'
        + '<symbol id="i-spark" viewBox="0 0 24 24"><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/></symbol>'
        + '<symbol id="i-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></symbol>'
        + '<symbol id="i-skip" viewBox="0 0 24 24"><path d="M5 5v14l9-7-9-7Z"/><path d="M19 5v14"/></symbol>'
        + '<symbol id="i-stop" viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2"/></symbol>'
        + '<symbol id="i-refresh" viewBox="0 0 24 24"><path d="M20 11a8 8 0 1 0-2.3 6.3"/><path d="M20 4v7h-7"/></symbol>'
        + '<symbol id="i-bulb" viewBox="0 0 24 24"><path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.8.7 1 1.3 1 2.5h6c0-1.2.2-1.8 1-2.5A6 6 0 0 0 12 3Z"/></symbol>'
        + '<symbol id="i-close" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18"/></symbol>'
        + '<symbol id="i-chevron" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></symbol>'
        + '<symbol id="i-edit" viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16v4Z"/><path d="m14 6 4 4"/></symbol>'
        + '<symbol id="i-trash" viewBox="0 0 24 24"><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14"/><path d="M10 11v6M14 11v6"/></symbol>'
        + '<symbol id="i-body" viewBox="0 0 24 24"><circle cx="12" cy="4.5" r="2"/><path d="M12 6.5V14M6 9l6 2 6-2M8 21l4-7 4 7"/></symbol>'
        + '<symbol id="i-arm" viewBox="0 0 24 24"><path d="M5 20 9 9l4 2 2-4 4 2-3 6-4-1-2 6H5Z"/></symbol>'
        + '<symbol id="i-leg" viewBox="0 0 24 24"><path d="M8 3h6l-1 8 4 7-3 3-4-6-2 6H5l2-9 1-9Z"/></symbol>'
        + '<symbol id="i-core" viewBox="0 0 24 24"><rect x="6" y="3" width="12" height="18" rx="4"/><path d="M9 8h6M9 12h6M9 16h6"/></symbol>'
        + '<symbol id="i-back" viewBox="0 0 24 24"><path d="M8 6c4 0 8 3 8 7v5"/><path d="m12 14 4 4 4-4"/><path d="M6 3v18"/></symbol>'
        + '</svg>';

    var NAV = [
        { id: 'inicio', href: 'principal.html', label: 'Inicio', icono: 'i-home' },
        { id: 'alimentacion', href: 'alimentacion.html', label: 'Alimentación', icono: 'i-food' },
        { id: 'ejercicios', href: 'ejercicios.html', label: 'Ejercicios', icono: 'i-dumbbell' },
        { id: 'habitos', href: 'habitos.html', label: 'Hábitos', icono: 'i-check' },
        { id: 'progreso', href: 'progreso.html', label: 'Progreso', icono: 'i-chart' }
    ];

    function icono(nombre, clase) {
        var id = String(nombre || 'i-spark');
        if (id.indexOf('i-') !== 0) id = 'i-' + id;
        return '<svg class="icon ' + (clase || '') + '" aria-hidden="true"><use href="#' + id + '"/></svg>';
    }

    function iconoHabito(habito) {
        var texto = String((habito && (habito.categoria || habito.nombre)) || '').toLowerCase();
        if (texto.indexOf('agua') >= 0 || texto.indexOf('hidrat') >= 0) return 'i-water';
        if (texto.indexOf('dorm') >= 0 || texto.indexOf('sue') >= 0 || texto.indexOf('descans') >= 0) return 'i-moon';
        if (texto.indexOf('camin') >= 0 || texto.indexOf('mov') >= 0 || texto.indexOf('estir') >= 0) return 'i-walk';
        if (texto.indexOf('com') >= 0 || texto.indexOf('aliment') >= 0 || texto.indexOf('fruta') >= 0) return 'i-apple';
        if (texto.indexOf('ment') >= 0 || texto.indexOf('respir') >= 0 || texto.indexOf('grat') >= 0) return 'i-heart';
        if (texto.indexOf('fum') >= 0 || texto.indexOf('sustan') >= 0) return 'i-shield';
        if (texto.indexOf('leer') >= 0 || texto.indexOf('libro') >= 0) return 'i-book';
        return 'i-check';
    }

    function iconoGrupo(grupo) {
        var mapa = {
            cuerpo_completo: 'i-body',
            brazos_hombros: 'i-arm',
            piernas: 'i-leg',
            pecho: 'i-heart',
            abdomen: 'i-core',
            espalda: 'i-back'
        };
        return mapa[grupo] || 'i-dumbbell';
    }

    function fechaISO(fecha) {
        return fecha.getFullYear() + '-' +
            String(fecha.getMonth() + 1).padStart(2, '0') + '-' +
            String(fecha.getDate()).padStart(2, '0');
    }

    function calcularRacha() {
        try {
            if (!window.VA || !VA.datos) return 0;
            var dias = {};
            (VA.datos.habitos.listar() || []).forEach(function (habito) {
                (habito.dias || []).forEach(function (dia) { dias[dia] = true; });
            });
            (VA.datos.entrenamientos.listar() || []).forEach(function (entreno) {
                if (entreno && entreno.fecha) dias[entreno.fecha] = true;
            });

            var cursor = new Date();
            if (!dias[fechaISO(cursor)]) cursor.setDate(cursor.getDate() - 1);

            var racha = 0;
            while (dias[fechaISO(cursor)]) {
                racha += 1;
                cursor.setDate(cursor.getDate() - 1);
            }
            return racha;
        } catch (error) {
            return 0;
        }
    }

    function datosUsuario() {
        var nombre = '';
        var email = '';
        try {
            var perfil = window.VA && VA.datos ? VA.datos.perfil.obtener() : null;
            if (perfil && perfil.nombre) nombre = perfil.nombre;
        } catch (error) { /* sin perfil todavía */ }
        try {
            if (window.VA && VA.auth && typeof VA.auth.usuarioEmail === 'function') {
                email = VA.auth.usuarioEmail() || '';
            }
        } catch (error) { /* modo local */ }
        if (!nombre && email) nombre = email.split('@')[0];
        return { nombre: nombre || 'Tu cuenta', email: email };
    }

    function paginaActual() {
        var pagina = (document.body && document.body.dataset ? document.body.dataset.page : '') || '';
        if (pagina) return pagina;
        var archivo = (window.location.pathname.split('/').pop() || 'principal.html').toLowerCase();
        if (archivo === 'rutina.html') return 'ejercicios';
        if (archivo === 'cambio_fisico.html') return 'alimentacion';
        if (archivo === 'perfil.html' || archivo === 'cuenta.html' || archivo === 'onboarding.html') return 'cuenta';
        if (archivo === 'principal.html' || archivo === '' || archivo === 'index.html') return 'inicio';
        return archivo.replace('.html', '');
    }

    function construirSidebar() {
        var contenedor = document.querySelector('[data-va-sidebar]');
        if (!contenedor) return;
        var activo = paginaActual();
        var usuario = datosUsuario();
        var inicial = (usuario.nombre || 'V').trim().charAt(0).toUpperCase() || 'V';

        var enlaces = NAV.map(function (item) {
            return '<a class="side-item' + (item.id === activo ? ' activo' : '') + '" href="' + item.href + '" data-nav="' + item.id + '">' +
                icono(item.icono) + '<span>' + item.label + '</span></a>';
        }).join('');

        contenedor.innerHTML =
            '<a class="brand" href="principal.html" aria-label="VidaActiva, ir al inicio">' +
                '<span class="brand-mark">' + icono('i-leaf') + '</span>' +
                '<span class="brand-name">Vida<span>Activa</span></span>' +
            '</a>' +
            '<nav class="side-nav" aria-label="Navegación principal">' + enlaces + '</nav>' +
            '<div class="side-bottom">' +
                '<a class="side-streak" href="habitos.html" aria-label="Racha actual">' +
                    '<span class="streak-flame">' + icono('i-flame') + '</span>' +
                    '<div><strong data-va-racha>0 días</strong><span>de racha</span></div>' +
                '</a>' +
                '<div class="side-user">' +
                    '<span class="avatar" aria-hidden="true" data-va-avatar>' + inicial + '</span>' +
                    '<div><strong data-va-nombre>' + escapar(usuario.nombre) + '</strong><span>Cuenta personal</span></div>' +
                    '<a class="icon-btn" href="cuenta.html" aria-label="Mi cuenta" title="Mi cuenta">' + icono('i-settings') + '</a>' +
                '</div>' +
            '</div>';
    }

    function construirMobileTop() {
        var contenedor = document.querySelector('[data-va-mobile-top]');
        if (!contenedor) return;
        var usuario = datosUsuario();
        var inicial = (usuario.nombre || 'V').trim().charAt(0).toUpperCase() || 'V';
        contenedor.innerHTML =
            '<a class="brand" href="principal.html" aria-label="VidaActiva, ir al inicio">' +
                '<span class="brand-mark">' + icono('i-leaf') + '</span>' +
                '<span class="brand-name">Vida<span>Activa</span></span>' +
            '</a>' +
            '<div class="mobile-actions">' +
                '<a class="icon-btn" href="habitos.html" aria-label="Hábitos y recordatorios">' + icono('i-bell') + '<span class="dot"></span></a>' +
                '<a class="avatar" href="cuenta.html" aria-label="Mi cuenta" data-va-avatar>' + inicial + '</a>' +
            '</div>';
    }

    function construirBottomNav() {
        var contenedor = document.querySelector('[data-va-bottom-nav]');
        if (!contenedor) return;
        var activo = paginaActual();
        contenedor.innerHTML = NAV.map(function (item) {
            return '<a class="nav-item' + (item.id === activo ? ' activo' : '') + '" href="' + item.href + '" data-nav="' + item.id + '">' +
                icono(item.icono) + '<span>' + item.label + '</span></a>';
        }).join('');
    }

    function escapar(texto) {
        return String(texto == null ? '' : texto)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function actualizarDatosUsuario() {
        var usuario = datosUsuario();
        var inicial = (usuario.nombre || 'V').trim().charAt(0).toUpperCase() || 'V';
        document.querySelectorAll('[data-va-nombre]').forEach(function (el) {
            el.textContent = usuario.nombre;
        });
        document.querySelectorAll('[data-va-avatar]').forEach(function (el) {
            el.textContent = inicial;
        });
        var racha = calcularRacha();
        document.querySelectorAll('[data-va-racha]').forEach(function (el) {
            el.textContent = racha + (racha === 1 ? ' día' : ' días');
        });
    }

    function iniciar() {
        if (!document.getElementById('grad-anillo')) {
            document.body.insertAdjacentHTML('afterbegin', SPRITE);
        }
        construirSidebar();
        construirMobileTop();
        construirBottomNav();
        actualizarDatosUsuario();
    }

    window.VA = window.VA || {};
    VA.icono = icono;
    VA.iconoHabito = iconoHabito;
    VA.iconoGrupo = iconoGrupo;
    VA.ui = {
        actualizar: actualizarDatosUsuario,
        racha: calcularRacha,
        icono: icono
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', iniciar);
    } else {
        iniciar();
    }
})();
