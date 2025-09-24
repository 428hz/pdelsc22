// src/components/player.js
// Lógica del jugador.

import { gameState } from '../state.js';
import { createBullet } from './bullet.js';

const keys = {};
const speed = 5;

// Manejar input
export function handlePlayerInput() {
  window.addEventListener('keydown', e => keys[e.key] = true);
  window.addEventListener('keyup', e => keys[e.key] = false);
}

// Actualizar jugadores
export function updatePlayers(deltaTime) {
  gameState.players.forEach((player, index) => {
    if (!player.active) return;

    // Movimiento
    if (index === 0) { // Player 1
      if (keys['ArrowLeft']) player.x -= speed;
      if (keys['ArrowRight']) player.x += speed;
      if (keys['ArrowUp']) player.y -= speed;
      if (keys['ArrowDown']) player.y += speed;
    } else { // Player 2
      if (keys['a'] || keys['A']) player.x -= speed;
      if (keys['d'] || keys['D']) player.x += speed;
      if (keys['w'] || keys['W']) player.y -= speed;
      if (keys['s'] || keys['S']) player.y += speed;
    }

    // Límites
    player.x = Math.max(0, Math.min(1000 - 28, player.x));
    player.y = Math.max(0, Math.min(550 - 28, player.y));

    // Disparo automático
    const shootKey = index === 0 ? ' ' : 'q';
    if (keys[shootKey] && Date.now() - player.lastShot > player.cooldown) {
      shoot(player);
      player.lastShot = Date.now();
    }
  });
}

// Función de disparo
function shoot(player) {
  const baseX = player.x + 14; // Centro
  const y = player.y - 18;

  // Disparo base según nivel
  if (player.weaponLevel >= 1) {
    gameState.bullets.push(createBullet(baseX, y, 0, -10)); // Recto
  }
  if (player.weaponLevel >= 2) {
    gameState.bullets.push(createBullet(baseX - 10, y, 0, -10));
    gameState.bullets.push(createBullet(baseX + 10, y, 0, -10));
  }
  if (player.weaponLevel >= 3) {
    gameState.bullets.push(createBullet(baseX - 20, y, 0, -10));
    gameState.bullets.push(createBullet(baseX + 20, y, 0, -10));
  }

  // Disparos diagonales si tiene
  if (player.hasDiagonal) {
    gameState.bullets.push(createBullet(baseX - 5, y, -5, -10));
    gameState.bullets.push(createBullet(baseX + 5, y, 5, -10));
  }
}