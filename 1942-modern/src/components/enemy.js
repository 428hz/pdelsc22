import { gameState } from '../state.js';

// --> ESTA FUNCIÓN AUMENTA LA DIFICULTAD CON EL TIEMPO
function updateDifficulty() {
    const elapsedTime = (Date.now() - gameState.gameStartTime) / 1000; // en segundos
    const { difficulty } = gameState;

    // Aumentar la velocidad de aparición cada 15 segundos
    if (elapsedTime > 15 && difficulty.spawnInterval > 800) {
        difficulty.spawnInterval = 2000 - Math.floor(elapsedTime / 15) * 200;
    }
    // --> Aumentar la cantidad de enemigos por oleada cada 20 segundos
    if (elapsedTime > 20 && difficulty.waveSize < 10) {
        difficulty.waveSize = 2 + Math.floor(elapsedTime / 20);
    }
    // Aumentar la velocidad de los enemigos cada 30 segundos
    if (elapsedTime > 30 && difficulty.enemySpeed < 6) {
        difficulty.enemySpeed = 2 + Math.floor(elapsedTime / 30);
    }
}


// Crea y añade enemigos al estado del juego.
export function spawnEnemies() {
    updateDifficulty();
    const now = Date.now();
    if (now - gameState.lastSpawnTime > gameState.difficulty.spawnInterval) {
        gameState.lastSpawnTime = now;
        
        let waveCount = gameState.difficulty.waveSize;
        
        // --> SI HAY 2 JUGADORES, SE DUPLICA LA CANTIDAD DE ENEMIGOS
        if (gameState.numPlayers === 2) {
            waveCount *= 2; // <-- AJUSTE REALIZADO: Ahora es el doble.
        }

        for (let i = 0; i < waveCount; i++) {
            // --> Hay un 30% de probabilidad de que aparezca el nuevo tipo de enemigo
            const type = Math.random() > 0.3 ? 'diver' : 'patrol';
            
            if (type === 'diver') {
                gameState.enemies.push(createDiverEnemy());
            } else {
                gameState.enemies.push(createPatrolEnemy());
            }
        }
    }
}

// Actualiza la posición de todos los enemigos.
export function updateEnemies() {
    gameState.enemies.forEach((enemy, index) => {
        // Lógica de movimiento específica para cada tipo
        enemy.move();

        // Eliminar enemigos que salen de la pantalla
        if (enemy.y > 600 || enemy.y < -50 || enemy.x < -50 || enemy.x > 850) {
            gameState.enemies.splice(index, 1);
        }
    });
}

// Fábrica para el enemigo clásico 'Diver'
function createDiverEnemy() {
    return {
        x: Math.random() * 750,
        y: -30,
        width: 28,
        height: 28,
        type: 'diver',
        className: 'enemy-diver',
        move: function() {
            this.y += gameState.difficulty.enemySpeed;
        }
    };
}

// --> ESTA ES LA LÓGICA DEL NUEVO ENEMIGO QUE VIENE DESDE ABAJO
function createPatrolEnemy() {
    const side = Math.random() > 0.5 ? 'left' : 'right';
    return {
        x: Math.random() * 750,
        y: 630, // Empieza desde abajo de la pantalla
        width: 28,
        height: 28,
        type: 'patrol',
        className: 'enemy-patrol',
        patrolTargetY: 100 + Math.random() * 150,
        patrolDirection: side === 'left' ? -2 : 2,
        state: 'ascending', // Tiene 3 estados: 'ascending', 'movingToSide', 'patrolling'
        move: function() {
            // 1. Sube hasta alcanzar una altura determinada
            if (this.state === 'ascending') {
                this.y -= gameState.difficulty.enemySpeed;
                if (this.y <= this.patrolTargetY) {
                    this.state = 'movingToSide';
                }
            // 2. Se mueve hacia un costado de la pantalla
            } else if (this.state === 'movingToSide') {
                this.x += this.patrolDirection * 2;
                if (this.x <= 50 || this.x >= 750) {
                    this.state = 'patrolling';
                }
            // 3. Comienza a moverse horizontalmente de lado a lado
            } else if (this.state === 'patrolling') {
                this.x += this.patrolDirection;
                if (this.x <= 20 || this.x >= 780) {
                    this.patrolDirection *= -1; // Invierte la dirección al llegar al borde
                }
            }
        }
    };
}