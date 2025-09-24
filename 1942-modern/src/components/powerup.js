import { gameState } from '../state.js';

const POWERUP_SPAWN_RATE_1P = 5;
const POWERUP_SPAWN_RATE_2P = 10;
const POWERUP_SPEED = 2;

// Intenta generar un power-up cuando un enemigo es derrotado.
export function trySpawnPowerUp(x, y) {
    gameState.enemiesDefeated++;
    const spawnThreshold = gameState.numPlayers === 1 ? POWERUP_SPAWN_RATE_1P : POWERUP_SPAWN_RATE_2P;

    if (gameState.enemiesDefeated % spawnThreshold === 0) {
        const type = Math.random() > 0.5 ? 'weapon_level' : 'diagonal_shot';
        gameState.powerUps.push({
            x,
            y,
            width: 20,
            height: 20,
            type,
            className: `power-up-${type}`,
        });
    }
}

// Mueve los power-ups hacia abajo y los elimina si salen de la pantalla.
export function updatePowerUps() {
    for (let i = gameState.powerUps.length - 1; i >= 0; i--) {
        const powerUp = gameState.powerUps[i];
        powerUp.y += POWERUP_SPEED;
        
        if (powerUp.y > 600) {
            gameState.powerUps.splice(i, 1);
        }
    }
}

// Aplica el efecto de un power-up a un jugador.
export function applyPowerUp(player, powerUp) {
    if (powerUp.type === 'weapon_level') {
        if (player.weaponLevel < 3) {
            player.weaponLevel++;
        }
    } else if (powerUp.type === 'diagonal_shot') {
        player.hasDiagonalShot = true;
    }
}