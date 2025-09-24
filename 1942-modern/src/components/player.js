import { gameState } from '../state.js';
import { controls } from '../main.js';
import { createBullet } from './bullet.js';

const PLAYER_SPEED = 5;
const FIRE_COOLDOWN = 150; // ms

// Crea un nuevo jugador y lo añade al estado.
export function createPlayer(playerNumber) {
    gameState.players.push({
        id: playerNumber,
        x: playerNumber === 1 ? 350 : 450,
        y: 500,
        width: 28,
        height: 28,
        score: 0,
        weaponLevel: 1,
        hasDiagonalShot: false,
        lastShotTime: 0,
        isActive: true,
    });
}

// Actualiza la posición y acciones de todos los jugadores activos.
export function updatePlayers() {
    gameState.players.forEach(player => {
        if (!player.isActive) return;

        const playerControls = player.id === 1 ? controls.player1 : controls.player2;

        // Movimiento
        if (gameState.keysPressed[playerControls.left] && player.x > 0) player.x -= PLAYER_SPEED;
        if (gameState.keysPressed[playerControls.right] && player.x < 800 - player.width) player.x += PLAYER_SPEED;
        if (gameState.keysPressed[playerControls.up] && player.y > 0) player.y -= PLAYER_SPEED;
        if (gameState.keysPressed[playerControls.down] && player.y < 600 - player.height) player.y += PLAYER_SPEED;
        
        // Disparo (Rapid Fire)
        const now = Date.now();
        if (gameState.keysPressed[playerControls.fire] && now - player.lastShotTime > FIRE_COOLDOWN) {
            fireWeapon(player);
            player.lastShotTime = now;
        }

        // Comprobar eliminación
        if (player.score < -1500) {
            player.isActive = false;
        }
    });
}

// Lógica de disparo basada en el nivel de arma y power-ups
function fireWeapon(player) {
    const baseSpeed = -7;
    
    // Nivel 1: Disparo único
    if (player.weaponLevel === 1) {
        createBullet(player.x + player.width / 2 - 9, player.y, 0, baseSpeed);
    }
    
    // Nivel 2: Disparo doble
    if (player.weaponLevel === 2) {
        createBullet(player.x, player.y, 0, baseSpeed);
        createBullet(player.x + player.width - 18, player.y, 0, baseSpeed);
    }
    
    // Nivel 3: Disparo cuádruple
    if (player.weaponLevel >= 3) {
        createBullet(player.x - 5, player.y + 10, 0, baseSpeed);
        createBullet(player.x + player.width - 13, player.y + 10, 0, baseSpeed);
        createBullet(player.x + 5, player.y, 0, baseSpeed);
        createBullet(player.x + player.width - 23, player.y, 0, baseSpeed);
    }

    // Power-up de disparo diagonal (se suma a cualquier nivel)
    if (player.hasDiagonalShot) {
        createBullet(player.x, player.y, -3, baseSpeed);
        createBullet(player.x + player.width - 18, player.y, 3, baseSpeed);
    }
}