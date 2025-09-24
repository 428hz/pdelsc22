import { gameState } from '../state.js';

// Añade una nueva bala al juego.
export function createBullet(x, y, vx, vy) {
    gameState.bullets.push({ x, y, vx, vy, width: 18, height: 18 });
}

// Mueve todas las balas y las elimina si salen de la pantalla.
export function updateBullets() {
    // Iteramos en reversa para poder eliminar elementos sin afectar el índice.
    for (let i = gameState.bullets.length - 1; i >= 0; i--) {
        const bullet = gameState.bullets[i];
        bullet.y += bullet.vy;
        bullet.x += bullet.vx;
        
        if (bullet.y < -20) {
            gameState.bullets.splice(i, 1);
        }
    }
}