// src/components/enemy.js
// Lógica de enemigos.

import { gameState } from '../state.js';
import { createPowerup } from './powerup.js';

const enemySpeed = 2;

// Spawn enemigos
export function spawnEnemies(timestamp) {
  if (timestamp - gameState.lastEnemySpawn > gameState.enemySpawnInterval) {
    for (let i = 0; i < Math.floor(gameState.waveSize); i++) {
      const type = Math.random() > 0.5 ? 'diver' : 'patrol';
      const x = Math.random() * 1000;
      const y = type === 'diver' ? -28 : 550 + 28; // Divers desde arriba, patrols desde abajo
      const enemy = { x, y, type, direction: Math.random() > 0.5 ? 1 : -1 }; // Para patrol
      if (type === 'patrol') enemy.patrolY = Math.random() * 300 + 100; // Altura de patrol
      gameState.enemies.push(enemy);
    }
    gameState.lastEnemySpawn = timestamp;
  }
}

// Actualizar enemigos
export function updateEnemies(deltaTime) {
  gameState.enemies = gameState.enemies.filter(enemy => {
    if (enemy.type === 'diver') {
      enemy.y += enemySpeed;
      if (enemy.y > 550) return false; // Fuera de pantalla
    } else { // patrol
      if (enemy.y > enemy.patrolY) {
        enemy.y -= enemySpeed; // Subir
      } else {
        enemy.x += enemy.direction * enemySpeed;
        if (enemy.x < 0 || enemy.x > 1000 - 28) enemy.direction *= -1; // Rebotar
      }
      if (enemy.y < -28) return false; // Improbable, pero por seguridad
    }
    return true;
  });
}

// Destruir enemigo
export function destroyEnemy(index) {
  const enemy = gameState.enemies[index];
  gameState.enemies.splice(index, 1);
  gameState.destroyedEnemies++;
  // Check for powerup
  const threshold = gameState.mode === 1 ? 5 : 10;
  if (gameState.destroyedEnemies % threshold === 0) {
    const type = Math.random() > 0.5 ? 'weapon_level' : 'diagonal_shot';
    gameState.powerups.push(createPowerup(enemy.x, enemy.y, type));
  }
}