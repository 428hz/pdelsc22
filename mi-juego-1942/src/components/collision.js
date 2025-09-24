// src/components/collision.js
// Detección de colisiones.

import { gameState } from '../state.js';
import { destroyEnemy } from './enemy.js';
import { explosionSound } from '../game-loop.js';

export function checkCollisions() {
  // Balas vs Enemigos
  gameState.bullets.forEach((bullet, bIndex) => {
    gameState.enemies.forEach((enemy, eIndex) => {
      if (isColliding(bullet, enemy)) {
        gameState.bullets.splice(bIndex, 1);
        destroyEnemy(eIndex);
        explosionSound.play();
        // Añadir score (asumir bala de player 0 por simplicidad; extender si needed)
        gameState.players[0].score += 100; // Ajustar por playerIndex si multiple
      }
    });
  });

  // Jugadores vs Enemigos
  gameState.players.forEach((player, pIndex) => {
    if (!player.active) return;
    gameState.enemies.forEach((enemy, eIndex) => {
      if (isColliding(player, enemy)) {
        destroyEnemy(eIndex);
        explosionSound.play();
        player.score -= 500;
      }
    });
  });
}

function isColliding(a, b) {
  const aWidth = 'bullet' in a ? 18 : 28; // Simplificado
  const aHeight = aWidth;
  const bWidth = 28, bHeight = 28;
  return a.x < b.x + bWidth && a.x + aWidth > b.x && a.y < b.y + bHeight && a.y + aHeight > b.y;
}