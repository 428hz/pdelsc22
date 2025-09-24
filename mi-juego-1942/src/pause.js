// src/pause.js

import { state } from './components/state.js';

const pauseMenu = document.getElementById('pause-menu');

export function togglePause() {
    // Si el juego no ha empezado, no hagas nada
    if (!state.gameMode) return;
    
    // Invertir el estado de pausa
    state.isPaused = !state.isPaused;
    
    // Mostrar u ocultar el menú
    if (state.isPaused) {
        pauseMenu.classList.remove('hidden');
    } else {
        pauseMenu.classList.add('hidden');
    }
}