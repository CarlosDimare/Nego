// Estado global del juego
let gameState = {
    sindicatoActual: null,
    fecha: new Date('2025-05-07'),
    stats: {
        moral: 70,
        fuerza: 60,
        influencia: 50
    },
    eventos: [],
    noticias: []
};

// Cargar datos del juego
async function cargarDatosJuego() {
    try {
        const response = await fetch('../data/base_completa.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al cargar datos:', error);
        return null;
    }
}

// Inicializar la pantalla de selección de sindicato
async function inicializarSeleccionSindicato() {
    const data = await cargarDatosJuego();
    if (!data) return;

    const grid = document.getElementById('sindicatos-grid');
    if (!grid) return;

    data.sindicatos.forEach(sindicato => {
        const card = document.createElement('div');
        card.className = 'sindicato-card';
        card.innerHTML = `
            <img src="${sindicato.logo}" alt="${sindicato.sigla}" class="sindicato-logo">
            <h2 class="sindicato-nombre">${sindicato.nombre}</h2>
            <h3 class="sindicato-sigla">${sindicato.sigla}</h3>
            <p class="sindicato-descripcion">${sindicato.descripcion}</p>
            <button class="btn-elegir" data-id="${sindicato.id}">Elegir Sindicato</button>
        `;
        grid.appendChild(card);

        card.querySelector('.btn-elegir').addEventListener('click', () => {
            elegirSindicato(sindicato);
        });
    });
}

// Elegir sindicato y comenzar el juego
function elegirSindicato(sindicato) {
    localStorage.setItem('sindicatoElegido', JSON.stringify(sindicato));
    window.location.href = 'tablero.html';
}

// Inicializar el tablero principal
async function inicializarTablero() {
    const sindicatoGuardado = localStorage.getItem('sindicatoElegido');
    if (!sindicatoGuardado) {
        window.location.href = 'index.html';
        return;
    }

    gameState.sindicatoActual = JSON.parse(sindicatoGuardado);
    actualizarInterfazTablero();
    inicializarNavegacion();
}

// Actualizar la interfaz del tablero
function actualizarInterfazTablero() {
    const infoSindicato = document.getElementById('info-sindicato');
    if (infoSindicato) {
        infoSindicato.innerHTML = `
            <h1>${gameState.sindicatoActual.nombre}</h1>
            <p>${gameState.sindicatoActual.sigla}</p>
        `;
    }

    actualizarEstadisticas();
}

// Actualizar las estadísticas mostradas
function actualizarEstadisticas() {
    for (const [stat, value] of Object.entries(gameState.stats)) {
        const elemento = document.getElementById(stat);
        if (elemento) {
            elemento.querySelector('.stat-value').textContent = `${value}%`;
        }
    }
}

// Inicializar la navegación del tablero
function inicializarNavegacion() {
    const botones = document.querySelectorAll('.nav-btn');
    botones.forEach(boton => {
        boton.addEventListener('click', () => {
            const seccion = boton.dataset.section;
            cambiarSeccion(seccion);
            
            if (seccion === 'continuar') {
                avanzarDia();
            }
        });
    });
}

// Cambiar sección activa
function cambiarSeccion(seccion) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    if (seccion !== 'continuar') {
        document.getElementById(seccion)?.classList.add('active');
        document.querySelector(`[data-section="${seccion}"]`)?.classList.add('active');
    }
}

// Avanzar un día en el juego
function avanzarDia() {
    gameState.fecha.setDate(gameState.fecha.getDate() + 1);
    simularEventosDiarios();
    actualizarInterfazTablero();
}

// Simular eventos diarios
function simularEventosDiarios() {
    const probabilidadEvento = Math.random();
    if (probabilidadEvento > 0.7) {
        generarEventoAleatorio();
    }
    actualizarEstadisticas();
}

// Generar evento aleatorio
function generarEventoAleatorio() {
    const eventos = [
        simularAsamblea,
        simularMovilizacion,
        simularNegociacion,
        simularHuelga,
        simularToma,
        simularJuicio
    ];
    
    const eventoAleatorio = eventos[Math.floor(Math.random() * eventos.length)];
    eventoAleatorio();
}

// Funciones de simulación de eventos
function simularAsamblea() {
    const resultado = {
        tipo: 'asamblea',
        titulo: 'Asamblea General',
        descripcion: 'Los trabajadores se reúnen para discutir la situación actual.',
        efectos: {
            moral: Math.floor(Math.random() * 10),
            fuerza: Math.floor(Math.random() * 5)
        }
    };
    
    aplicarEfectosEvento(resultado);
    mostrarNotificacionEvento(resultado);
}

function simularMovilizacion() {
    const resultado = {
        tipo: 'movilizacion',
        titulo: 'Movilización',
        descripcion: 'Los trabajadores se movilizan en las calles.',
        efectos: {
            moral: Math.floor(Math.random() * 15),
            influencia: Math.floor(Math.random() * 10)
        }
    };
    
    aplicarEfectosEvento(resultado);
    mostrarNotificacionEvento(resultado);
}

function simularNegociacion() {
    const resultado = {
        tipo: 'negociacion',
        titulo: 'Negociación Paritaria',
        descripcion: 'Se lleva a cabo una reunión de negociación salarial.',
        efectos: {
            influencia: Math.floor(Math.random() * 10),
            moral: Math.floor(Math.random() * 5)
        }
    };
    
    aplicarEfectosEvento(resultado);
    mostrarNotificacionEvento(resultado);
}

function simularHuelga() {
    const resultado = {
        tipo: 'huelga',
        titulo: 'Huelga General',
        descripcion: 'Los trabajadores realizan un paro total de actividades.',
        efectos: {
            fuerza: Math.floor(Math.random() * 20),
            moral: Math.floor(Math.random() * 10),
            influencia: Math.floor(Math.random() * 15)
        }
    };
    
    aplicarEfectosEvento(resultado);
    mostrarNotificacionEvento(resultado);
}

function simularToma() {
    const resultado = {
        tipo: 'toma',
        titulo: 'Toma del Lugar de Trabajo',
        descripcion: 'Los trabajadores ocupan pacíficamente las instalaciones.',
        efectos: {
            fuerza: Math.floor(Math.random() * 25),
            moral: Math.floor(Math.random() * 15),
            influencia: Math.floor(Math.random() * -5)
        }
    };
    
    aplicarEfectosEvento(resultado);
    mostrarNotificacionEvento(resultado);
}

function simularJuicio() {
    const resultado = {
        tipo: 'juicio',
        titulo: 'Audiencia Judicial',
        descripcion: 'Se desarrolla una audiencia en el tribunal laboral.',
        efectos: {
            influencia: Math.floor(Math.random() * 20 - 10), // Puede ser positivo o negativo
            moral: Math.floor(Math.random() * 10 - 5)
        }
    };
    
    aplicarEfectosEvento(resultado);
    mostrarNotificacionEvento(resultado);
}

// Aplicar efectos de un evento
function aplicarEfectosEvento(evento) {
    for (const [stat, valor] of Object.entries(evento.efectos)) {
        gameState.stats[stat] = Math.max(0, Math.min(100, gameState.stats[stat] + valor));
    }
}

// Mostrar notificación de evento
function mostrarNotificacionEvento(evento) {
    const noticiasFeed = document.getElementById('noticias-feed');
    if (!noticiasFeed) return;

    const notificacion = document.createElement('div');
    notificacion.className = 'evento-card';
    notificacion.innerHTML = `
        <h3 class="evento-titulo">${evento.titulo}</h3>
        <p class="evento-descripcion">${evento.descripcion}</p>
        <div class="evento-efectos">
            ${Object.entries(evento.efectos).map(([stat, valor]) => 
                `<p>${stat}: ${valor > 0 ? '+' : ''}${valor}</p>`
            ).join('')}
        </div>
    `;
    
    noticiasFeed.insertBefore(notificacion, noticiasFeed.firstChild);
}

// Inicializar el juego según la página actual
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.sindicatos-grid')) {
        inicializarSeleccionSindicato();
    } else if (document.querySelector('.tablero-container')) {
        inicializarTablero();
    }
});