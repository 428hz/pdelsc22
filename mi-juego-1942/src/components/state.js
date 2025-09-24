// src/state.js
// Gestión del estado global del juego.

// Estado inicial
export let gameState = {
  mode: 1, // 1 o 2 jugadores
  players: [
    { x: 450, y: 450, score: 0, active: true, weaponLevel: 1, hasDiagonal: false, lastShot: 0, cooldown: 200 },
    { x: 550, y: 450, score: 0, active: false, weaponLevel: 1, hasDiagonal: false, lastShot: 0, cooldown: 200 }
  ],
  enemies: [],
  bullets: [],
  powerups: [],
  destroyedEnemies: 0,
  enemySpawnInterval: 1000, // Inicial
  lastEnemySpawn: 0,
  waveSize: 1, // Inicial
  timeElapsed: 0,
  gameOver: false,
  victory: false
};

export function setGameMode(mode) {
  gameState.mode = mode;
  gameState.players[1].active = mode === 2;
}

export function resetGame() {
  gameState = {
    mode: gameState.mode,
    players: [
      { x: 450, y: 450, score: 0, active: true, weaponLevel: 1, hasDiagonal: false, lastShot: 0, cooldown: 200 },
      { x: 550, y: 450, score: 0, active: gameState.mode === 2, weaponLevel: 1, hasDiagonal: false, lastShot: 0, cooldown: 200 }
    ],
    enemies: [],
    bullets: [],
    powerups: [],
    destroyedEnemies: 0,
    enemySpawnInterval: 1000,
    lastEnemySpawn: 0,
    waveSize: 1,
    timeElapsed: 0,
    gameOver: false,
    victory: false
  };
}