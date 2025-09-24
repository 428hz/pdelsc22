import { gameState } from '../state.js';
import { applyPowerUp, trySpawnPowerUp } from './powerup.js';

const explosionSound = new Audio('/explosion.wav');

// Función AABB (Axis-Aligned Bounding Box) para detectar colisiones
function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Gestiona todas las posibles colisiones en el juego.
export function handleCollisions() {
    // Balas vs. Enemigos
    for (let i = gameState.bullets.length - 1; i >= 0; i--) {
        for (let j = gameState.enemies.length - 1; j >= 0; j--) {
            if (checkCollision(gameState.bullets[i], gameState.enemies[j])) {
                // Sonido de explosión
                explosionSound.currentTime = 0;
                explosionSound.play();
                
                // Intentar generar un power-up en la ubicación del enemigo
                trySpawnPowerUp(gameState.enemies[j].x, gameState.enemies[j].y);

                // Asignar puntos al jugador que disparó (requiere modificación en 'createBullet' para saber quién disparó)
                // Para simplificar, asignamos puntos al primer jugador activo.
                const activePlayer = gameState.players.find(p => p.isActive);
                if (activePlayer) {
                    activePlayer.score += 100;
                }
                
                // Eliminar bala y enemigo
                gameState.bullets.splice(i, 1);
                gameState.enemies.splice(j, 1);
                break; // La bala ya colisionó, no necesita seguir comprobando
            }
        }
    }

    // Jugadores vs. Enemigos
    gameState.players.forEach(player => {
        if (!player.isActive) return;
        for (let i = gameState.enemies.length - 1; i >= 0; i--) {
            if (checkCollision(player, gameState.enemies[i])) {
                player.score -= 500;
                gameState.enemies.splice(i, 1);
                 // Opcional: añadir un breve periodo de invencibilidad aquí.
            }
        }
    });

    // Jugadores vs. Power-ups
    gameState.players.forEach(player => {
        if (!player.isActive) return;
        for (let i = gameState.powerUps.length - 1; i >= 0; i--) {
            if (checkCollision(player, gameState.powerUps[i])) {
                applyPowerUp(player, gameState.powerUps[i]);
                gameState.powerUps.splice(i, 1);
            }
        }
    });
}