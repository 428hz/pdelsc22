import { gameState } from './state.js';
import { updateScoreUI } from './components/ui.js';

const gameContainer = document.getElementById('game-container');

// Función principal que orquesta el renderizado de todos los elementos.
export function renderGame() {
    // Generar el HTML para todos los elementos del juego
    const playersHTML = gameState.players.map(p => `<div class="player" id="player-${p.id}" style="left:${p.x}px; top:${p.y}px;"></div>`).join('');
    
    const enemiesHTML = gameState.enemies.map(e => `<div class="enemy ${e.className}" style="left:${e.x}px; top:${e.y}px;"></div>`).join('');
    
    const bulletsHTML = gameState.bullets.map(b => `<div class="bullet" style="left:${b.x}px; top:${b.y}px;"></div>`).join('');

    const powerUpsHTML = gameState.powerUps.map(p => `<div class="power-up ${p.className}" style="left:${p.x}px; top:${p.y}px;"></div>`).join('');

    // Actualizar el DOM de una sola vez para mejorar el rendimiento
    gameContainer.innerHTML = playersHTML + enemiesHTML + bulletsHTML + powerUpsHTML;

    // Actualizar la UI de puntuación
    updateScoreUI();
}