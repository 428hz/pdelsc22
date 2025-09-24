import { showStartMenu, setupUIEventListeners } from './components/ui.js';
import { startGame } from './game-loop.js';
import { gameState, resetGameState } from './state.js';

// Elementos del DOM
const start1PButton = document.getElementById('start-1p');
const start2PButton = document.getElementById('start-2p');

// Controles de Jugador
const controls = {
    player1: { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', fire: 'Space' },
    player2: { up: 'KeyW', down: 'KeyS', left: 'KeyA', right: 'KeyD', fire: 'KeyQ' }
};

// Event Listeners para el menú
start1PButton.addEventListener('click', () => {
    startGame(1);
});

start2PButton.addEventListener('click', () => {
    startGame(2);
});

// Listeners para el teclado
window.addEventListener('keydown', (e) => {
    // Usamos e.code para ser independientes del layout del teclado
    gameState.keysPressed[e.code] = true;
});

window.addEventListener('keyup', (e) => {
    gameState.keysPressed[e.code] = false;
});

// Configurar botones de reinicio y menú en las pantallas finales
setupUIEventListeners(startGame, showStartMenu);

// Mostrar el menú de inicio al cargar la página
showStartMenu();
export { controls };