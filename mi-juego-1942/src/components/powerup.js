// src/components/powerup.js
// Lógica de powerups.

import { gameState } from '../state.js';

export function createPowerup(x, y, type) {
  return { x, y, type, dy: 2 }; // Caen lentamente
}

export function updatePowerups(deltaTime) {
  gameState.powerups = gameState.powerups.filter(powerup => {
    powerup.y += powerup.dy;
    return powerup.y < 550; // Fuera de pantalla
  });
}

export function checkPowerupCollision() {
  gameState.powerups.forEach((powerup, pIndex) => {
    gameState.players.forEach((player, playerIndex) => {
      if (player.active && isColliding(player, powerup)) {
        applyPowerup(player, powerup.type);
        gameState.powerups.splice(pIndex, 1);
      }
    });
  });
}

function applyPowerup(player, type) {
  if (type === 'weapon_level') {
    player.weaponLevel = Math.min(3, player.weaponLevel + 1);
  } else {
    player.hasDiagonal = true;
  }
}

function isColliding(a, b) {
  return a.x < b.x + 20 && a.x + 28 > b.x && a.y < b.y + 20 && a.y + 28 > b.y;
}