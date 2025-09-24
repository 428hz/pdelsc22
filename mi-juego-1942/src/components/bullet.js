// src/components/bullet.js
// Lógica de balas.

import { gameState } from '../state.js';

export function createBullet(x, y, dx, dy) {
  return { x, y, dx: dx || 0, dy: dy || -10, playerIndex: 0 }; // playerIndex para scoring, pero simplificado
}

export function updateBullets(deltaTime) {
  gameState.bullets = gameState.bullets.filter(bullet => {
    bullet.x += bullet.dx;
    bullet.y += bullet.dy;
    return bullet.y > -18; // Fuera de pantalla
  });
}