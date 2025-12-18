// index.js - v3.1.0 - Corrección de CORS y Rutas
document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');

    const navLinks = {
        'nav-clientes': () => renderContent('/clientes/', 'Clientes', renderClientesTable),
        'nav-barberos': () => renderContent('/barberos/', 'Barberos', renderBarberosTable),
        'nav-servicios': () => renderContent('/servicios/', 'Servicios', renderServiciosTable),
        'nav-citas': () => renderContent('/citas/', 'Citas', renderCitasTable),
        'nav-agenda': () => renderContent('/agenda/', 'Agenda', (data) => `<p>Contenido de Agenda no implementado.</p>`),
    };

    Object.keys(navLinks).forEach(id => {
        const link = document.getElementById(id);
        if (link) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                navLinks[id]();
            });
        }
    });

    const safe = (v, fallback = '') => (v ?? fallback);
    const asArray = (data) => (Array.isArray(data) ? data : (data ? [data] : []));

    async function fetchData(endpoint) {
        // Usamos el proxy de Vite, pero la ruta debe ser exacta para evitar redirecciones
        const url = `/api${endpoint}`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error de Red: ${response.status} al acceder a ${url}. Respuesta: ${errorText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`FALLO FETCH en ${url}:`, error);
            throw error;
        }
    }

    async function renderContent(endpoint, title, renderer) {
        mainContent.innerHTML = `<h2>${title}</h2><div id="list-container">Cargando...</div>`;
        try {
            const data = await fetchData(endpoint);
            const items = asArray(data);
            mainContent.querySelector('#list-container').innerHTML = renderer(items);
        } catch (error) {
            mainContent.innerHTML = `<div class="error"><h3>Error al cargar ${title}</h3><p>${error.message}</p></div>`;
        }
    }

    function renderClientesTable(clientes) {
        const rows = clientes.map(c => `
            <tr>
                <td>${safe(c.rut)}</td>
                <td>${safe(c.nombre)}</td>
                <td>${safe(c.apellido)}</td>
                <td>${safe(c.correo)}</td>
                <td>${safe(c.celular)}</td>
            </tr>`).join('');
        return `<table><thead><tr><th>RUT</th><th>Nombre</th><th>Apellido</th><th>Correo</th><th>Celular</th></tr></thead><tbody>${rows}</tbody></table>`;
    }

    function renderBarberosTable(barberos) {
        const rows = barberos.map(b => `
            <tr>
                <td>${safe(b.id_barbero)}</td>
                <td>${safe(b.nombre)}</td>
                <td>${safe(b.usuario)}</td>
                <td>${b.activo ? 'Sí' : 'No'}</td>
            </tr>`).join('');
        return `<table><thead><tr><th>ID</th><th>Nombre</th><th>Usuario</th><th>Activo</th></tr></thead><tbody>${rows}</tbody></table>`;
    }

    function renderServiciosTable(servicios) {
        const rows = servicios.map(s => `
            <tr>
                <td>${safe(s.id_servicio)}</td>
                <td>${safe(s.nombre)}</td>
                <td>${safe(s.duracion_min)} min</td>
                <td>$${safe(s.precio)}</td>
            </tr>`).join('');
        return `<table><thead><tr><th>ID</th><th>Nombre</th><th>Duración</th><th>Precio</th></tr></thead><tbody>${rows}</tbody></table>`;
    }

    function renderCitasTable(citas) {
        const rows = citas.map(c => `
            <tr>
                <td>${safe(c.id_cita)}</td>
                <td>${safe(c.cliente_nombre)}</td>
                <td>${safe(c.barbero_nombre)}</td>
                <td>${safe(c.servicio_nombre)}</td>
                <td>${safe(new Date(c.fecha_programada).toLocaleString())}</td>
                <td>${safe(c.estado)}</td>
            </tr>`).join('');
        return `<table><thead><tr><th>ID</th><th>Cliente</th><th>Barbero</th><th>Servicio</th><th>Fecha</th><th>Estado</th></tr></thead><tbody>${rows}</tbody></table>`;
    }

    // Carga inicial
    renderContent('/clientes/', 'Clientes', renderClientesTable);
});
