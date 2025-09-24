// src/game-loop.js
// Bucle principal del juego.

import { gameState } from './state.js';
import { updatePlayers, handlePlayerInput } from './components/player.js';
import { updateEnemies, spawnEnemies } from './components/enemy.js';
import { updateBullets } from './components/bullet.js';
import { updatePowerups, checkPowerupCollision } from './components/powerup.js';
import { checkCollisions } from './components/collision.js';
import { renderGame } from './render.js';

let animationFrameId;
let lastTime = 0;
const canvas = document.getElementById('canvas');
const explosionSound = new Audio('/public/explosion.wav');

// Inicializar juego
export function initGame() {
  // Limpiar canvas
  canvas.innerHTML = '';
  // Añadir event listeners para input
  handlePlayerInput();
}

// Iniciar bucle
export function startGameLoop() {
  function loop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    if (!gameState.gameOver && !gameState.victory) {
      gameState.timeElapsed += deltaTime;

      // Actualizar dificultad
      updateDifficulty(deltaTime);

      // Spawn enemigos
      spawnEnemies(timestamp);

      // Actualizar entidades
      updatePlayers(deltaTime);
      updateEnemies(deltaTime);
      updateBullets(deltaTime);
      updatePowerups(deltaTime);

      // Colisiones
      checkCollisions();
      checkPowerupCollision();

      // Verificar fin de juego
      checkEndConditions();

      // Render
      renderGame();
    } else {
      showEndScreen();
    }

    animationFrameId = requestAnimationFrame(loop);
  }
  loop();
}

export function resetGame() {
  cancelAnimationFrame(animationFrameId);
  // Resetear estado (ya en state.js)
}

// Actualizar dificultad basada en tiempo
function updateDifficulty(deltaTime) {
  // Reducir intervalo de spawn cada 10 segundos
  if (gameState.timeElapsed > 10000) {
    gameState.enemySpawnInterval = Math.max(500, gameState.enemySpawnInterval - 0.1 * deltaTime);
    gameState.waveSize = Math.min(5, gameState.waveSize + 0.001 * deltaTime);
  }
  // Ajustar para 2 jugadores
  if (gameState.mode === 2) {
    gameState.waveSize *= 1.5;
    gameState.enemySpawnInterval *= 0.8;
  }
}

// Verificar condiciones de fin
function checkEndConditions() {
  const activePlayers = gameState.players.filter(p => p.active);
  if (activePlayers.some(p => p.score >= 5000)) {
    gameState.victory = true;
  }
  if (activePlayers.every(p => p.score < -1500)) {
    gameState.gameOver = true;
  }
  // Eliminar jugadores con score < -1500
  gameState.players.forEach(p => {
    if (p.score < -1500) p.active = false;
  });
}

// Mostrar pantalla final
function showEndScreen() {
  const gameScreen = document.getElementById('game-screen');
  const victoryScreen = document.getElementById('victory-screen');
  const gameoverScreen = document.getElementById('gameover-screen');
  gameScreen.classList.add('hidden');
  if (gameState.victory) {
    victoryScreen.classList.remove('hidden');
  } else {
    gameoverScreen.classList.remove('hidden');
  }
}

export { explosionSound };