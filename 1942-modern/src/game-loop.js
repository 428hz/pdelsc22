import { gameState, resetGameState } from './state.js';
import { renderGame } from './render.js';
import { createPlayer, updatePlayers } from './components/player.js';
import { spawnEnemies, updateEnemies } from './components/enemy.js';
import { updateBullets } from './components/bullet.js';
import { updatePowerUps } from './components/powerup.js';
import { handleCollisions } from './components/collisions.js';
import { checkGameConditions, hideStartMenu } from './components/ui.js';

let animationFrameId;

// Bucle principal del juego
function gameLoop() {
    if (gameState.gameStatus !== 'playing') {
        cancelAnimationFrame(animationFrameId);
        return;
    }

    // 1. Actualizar estado de los objetos
    updatePlayers();
    updateEnemies();
    updateBullets();
    updatePowerUps();
    spawnEnemies(); // Controla cuándo aparecen nuevos enemigos

    // 2. Detectar colisiones
    handleCollisions();

    // 3. Renderizar todo en la pantalla
    renderGame();
    
    // 4. Comprobar condiciones de victoria/derrota
    checkGameConditions();

    // 5. Solicitar el siguiente frame
    animationFrameId = requestAnimationFrame(gameLoop);
}

// Función para iniciar el juego
export function startGame(numPlayers) {
    hideStartMenu();
    resetGameState(numPlayers);
    
    // Crear jugadores
    for (let i = 1; i <= numPlayers; i++) {
        createPlayer(i);
    }

    // Iniciar el bucle del juego
    gameLoop();
}