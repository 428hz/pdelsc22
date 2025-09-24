// Este objeto centraliza todo el estado del juego.
export let gameState = {};

// Función para reiniciar el estado a sus valores iniciales.
export function resetGameState(numPlayers) {
    gameState.gameStatus = 'playing'; // 'menu', 'playing', 'victory', 'gameOver'
    gameState.numPlayers = numPlayers;
    gameState.players = [];
    gameState.enemies = [];
    gameState.bullets = [];
    gameState.powerUps = [];
    gameState.keysPressed = {};
    
    // Contadores para mecánicas
    gameState.enemySpawnCounter = 0;
    gameState.enemiesDefeated = 0;
    
    // Tiempos para control de dificultad y cooldowns
    gameState.gameStartTime = Date.now();
    gameState.lastSpawnTime = 0;

    // Configuración de dificultad inicial
    gameState.difficulty = {
        spawnInterval: 2000, // ms
        waveSize: 2,
        enemySpeed: 2,
    };
}