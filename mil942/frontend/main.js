// --- ELEMENTOS DE LA UI Y CANVAS ---
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const gameContainer = document.getElementById('game-container');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const levelUpScreen = document.getElementById('level-up-screen');
const start1PButton = document.getElementById('start-1p-button');
const start2PButton = document.getElementById('start-2p-button');
const restartButton = document.getElementById('restart-button');
const finalScoreElement = document.getElementById('final-score');
const levelUpTitle = document.getElementById('level-up-title');
const body = document.body;

// --- CONFIGURACIÓN GLOBAL ---
let game;

function resizeCanvas() {
    const containerRect = gameContainer.getBoundingClientRect();

    if (body.classList.contains('two-players')) {
        canvas.width = containerRect.width;
        canvas.height = containerRect.height;
    } else {
        const aspectRatio = 3 / 4;
        let newWidth = containerRect.width;
        let newHeight = newWidth / aspectRatio;
        if (newHeight > containerRect.height) {
            newHeight = containerRect.height;
            newWidth = newHeight * aspectRatio;
        }
        canvas.width = 600;
        canvas.height = 800;
        canvas.style.width = `${newWidth}px`;
        canvas.style.height = `${newHeight}px`;
    }
}
window.addEventListener('resize', resizeCanvas);


// --- CLASES DEL JUEGO ---

class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = new Set();
        window.addEventListener('keydown', e => {
            const player1Keys = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', ' '];
            const player2Keys = ['s', 'w', 'a', 'd', 'q'];
            if (player1Keys.includes(e.key) || (this.game.gameMode === '2p' && player2Keys.includes(e.key.toLowerCase()))) {
                e.preventDefault();
                this.keys.add(e.key.toLowerCase());
            }
        });
        window.addEventListener('keyup', e => {
            this.keys.delete(e.key.toLowerCase());
        });
    }
}

class Projectile {
    constructor(game, x, y, angle = -Math.PI / 2, speed = 10, owner) {
        this.game = game; this.width = 5; this.height = 15; this.x = x - this.width * 0.5; this.y = y; this.speedX = speed * Math.cos(angle); this.speedY = speed * Math.sin(angle); this.markedForDeletion = false; this.owner = owner; this.color = this.owner === 'player1' ? '#00ffff' : '#ff9933';
    }
    update() {
        this.x += this.speedX; this.y += this.speedY; if (this.y < -this.height || this.y > this.game.height || this.x < -this.width || this.x > this.game.width) this.markedForDeletion = true;
    }
    draw(context) {
        context.save(); context.fillStyle = this.color; context.shadowColor = this.color; context.shadowBlur = 10; context.fillRect(this.x, this.y, this.width, this.height); context.restore();
    }
}

class PowerUp {
    constructor(game) {
        this.game = game; this.width = 30; this.height = 30; this.x = Math.random() * (this.game.width - this.width); this.y = -this.height; this.speedY = 2; this.markedForDeletion = false;
    }
    update() {
        this.y += this.speedY; if (this.y > this.game.height) this.markedForDeletion = true;
    }
    draw(context) {
        context.fillStyle = '#ffff00'; context.fillRect(this.x, this.y, this.width, this.height); context.fillStyle = '#000'; context.font = '20px "Press Start 2P"'; context.textAlign = 'center'; context.fillText('U', this.x + this.width * 0.5, this.y + this.height * 0.75);
    }
}

class Player {
    constructor(game, playerType) {
        this.game = game; this.playerType = playerType; this.width = 50; this.height = 40; this.x = (this.playerType === 'player1') ? this.game.width * 0.35 : this.game.width * 0.65; this.y = this.game.height - this.height - 20; this.speed = 5; this.shootCooldown = 18; this.shootTimer = 0; this.color = (this.playerType === 'player1') ? '#00ffff' : '#ff9933'; this.lives = 3; this.weaponLevel = 1;
    }
    update(input) {
        const keys = (this.playerType === 'player1') ? { right: 'arrowright', left: 'arrowleft', up: 'arrowup', down: 'arrowdown', shoot: ' ' } : { right: 'd', left: 'a', up: 'w', down: 's', shoot: 'q' };
        if (input.keys.has(keys.right)) this.x += this.speed; else if (input.keys.has(keys.left)) this.x -= this.speed; if (input.keys.has(keys.up)) this.y -= this.speed; else if (input.keys.has(keys.down)) this.y += this.speed;
        if (this.x < 0) this.x = 0; if (this.x > this.game.width - this.width) this.x = this.game.width - this.width; if (this.y < 0) this.y = 0; if (this.y > this.game.height - this.height) this.y = this.game.height - this.height;
        if (input.keys.has(keys.shoot) && this.shootTimer <= 0) { this.shoot(); this.shootTimer = this.shootCooldown; }
        if (this.shootTimer > 0) this.shootTimer--;
    }
    draw(context) {
        context.fillStyle = this.color; context.beginPath(); context.moveTo(this.x + this.width / 2, this.y); context.lineTo(this.x, this.y + this.height); context.lineTo(this.x + this.width, this.y + this.height); context.closePath(); context.fill();
    }
    shoot() {
        const pSpeed = 10; const straight = -Math.PI / 2; const diagLeft = -Math.PI / 2 - 0.35; const diagRight = -Math.PI / 2 + 0.35;
        switch (this.weaponLevel) {
            case 1: this.game.projectiles.push(new Projectile(this.game, this.x + this.width * 0.5, this.y, straight, pSpeed, this.playerType)); break;
            case 2: this.game.projectiles.push(new Projectile(this.game, this.x + this.width * 0.2, this.y, straight, pSpeed, this.playerType)); this.game.projectiles.push(new Projectile(this.game, this.x + this.width * 0.8, this.y, straight, pSpeed, this.playerType)); break;
            case 3: this.game.projectiles.push(new Projectile(this.game, this.x + this.width * 0.2, this.y, straight, pSpeed, this.playerType)); this.game.projectiles.push(new Projectile(this.game, this.x + this.width * 0.8, this.y, straight, pSpeed, this.playerType)); this.game.projectiles.push(new Projectile(this.game, this.x + this.width * 0.5, this.y, diagLeft, pSpeed, this.playerType)); this.game.projectiles.push(new Projectile(this.game, this.x + this.width * 0.5, this.y, diagRight, pSpeed, this.playerType)); break;
        }
    }
    activatePowerUp() {
        if (this.weaponLevel < 3) { this.weaponLevel++; }
    }
}

class Enemy {
    constructor(game, startX, startY, pattern) {
        this.game = game; this.width = 40; this.height = 30; this.x = startX; this.y = startY; this.pattern = pattern; this.markedForDeletion = false; this.speed = 2.5 + (game.level - 1) * 0.5;
    }
    update() {
        switch (this.pattern) {
            case 'vertical_down': this.y += this.speed; break;
            case 'diag_from_top_left': this.x += this.speed; this.y += this.speed; break;
            case 'diag_from_top_right': this.x -= this.speed; this.y += this.speed; break;
            case 'horizontal_from_left': this.x += this.speed * 1.5; break;
            case 'horizontal_from_right': this.x -= this.speed * 1.5; break;
            case 'vertical_up_side': this.y -= this.speed; break;
        }
        if (this.y > this.game.height + this.height || this.y < -this.height || this.x < -this.width * 2 || this.x > this.game.width + this.width) { this.markedForDeletion = true; }
    }
    draw(context) {
        context.fillStyle = '#ff4500'; context.fillRect(this.x, this.y, this.width, this.height); context.strokeStyle = '#fff'; context.strokeRect(this.x, this.y, this.width, this.height);
    }
}

class Particle {
    constructor(game, x, y) {
        this.game = game; this.x = x; this.y = y; this.size = Math.random() * 5 + 2; this.speedX = Math.random() * 6 - 3; this.speedY = Math.random() * 6 - 3; this.color = `hsl(${Math.random() * 60 + 20}, 100%, 50%)`; this.life = 100; this.markedForDeletion = false;
    }
    update() {
        this.x += this.speedX; this.y += this.speedY; this.size *= 0.95; this.life--; if (this.life <= 0) this.markedForDeletion = true;
    }
    draw(context) {
        context.fillStyle = this.color; context.beginPath(); context.arc(this.x, this.y, this.size, 0, Math.PI * 2); context.fill();
    }
}

class UI {
    constructor(game) { this.game = game; this.fontFamily = '"Press Start 2P"'; this.color = '#fff'; }
    draw(context) {
        context.save();
        context.shadowOffsetX = 2; context.shadowOffsetY = 2; context.shadowColor = 'black';
        context.fillStyle = this.color;
        if (this.game.gameMode === '2p') {
            const fontSize = 16; context.font = `${fontSize}px ${this.fontFamily}`;
            context.textAlign = 'left'; context.fillText(`P1: ${this.game.score} | Lives: ${this.game.player1.lives}`, 15, 30);
            context.textAlign = 'right'; context.fillText(`P2: ${this.game.scoreP2} | Lives: ${this.game.player2.lives}`, this.game.width - 15, 30);
            context.textAlign = 'center'; context.fillText(`Level: ${this.game.level}`, this.game.width * 0.5, 30);
        } else {
            const fontSize = 20; context.font = `${fontSize}px ${this.fontFamily}`;
            context.textAlign = 'left'; context.fillText(`Score: ${this.game.score}`, 20, 40);
            context.textAlign = 'right'; context.fillText(`Lives: ${this.game.player1.lives}`, this.game.width - 20, 40);
            context.textAlign = 'center'; context.fillText(`Level: ${this.game.level}`, this.game.width * 0.5, 40);
        }
        context.restore();
    }
}

class WaveManager {
    constructor(game) {
        this.game = game;
        this.waveCounter = 0;
        this.waves = [
            { spawns: [{ delay: 0, pattern: 'diag_from_top_left', count: 4, startX: 100, startY: -100, spacing: 50 }, { delay: 0, pattern: 'diag_from_top_right', count: 4, startX: this.game.width - 100, startY: -100, spacing: 50 }] },
            { spawns: [{ delay: 0, pattern: 'horizontal_from_left', count: 10, startX: -50, startY: 100, spacing: 60 }] },
            { spawns: [{ delay: 0, pattern: 'vertical_up_side', count: 6, startX: 50, startY: this.game.height + 50, spacing: 50 }, { delay: 500, pattern: 'vertical_up_side', count: 6, startX: this.game.width - 90, startY: this.game.height + 50, spacing: 50 }] },
            { spawns: [{ delay: 0, pattern: 'horizontal_from_right', count: 10, startX: this.game.width + 50, startY: 180, spacing: 60 }] },
            { spawns: [{ delay: 0, pattern: 'vertical_down', count: 8, startX: 'random', startY: -50, spacing: 100 }] }
        ];
    }
    spawnWave() {
        const wave = this.waves[this.waveCounter % this.waves.length];
        const enemyMultiplier = (this.game.gameMode === '2p') ? 2.5 : 1;
        wave.spawns.forEach(spawn => {
            setTimeout(() => {
                for (let i = 0; i < spawn.count * enemyMultiplier; i++) {
                    let startX = (spawn.startX === 'random') ? Math.random() * this.game.width : spawn.startX;
                    let startY = spawn.startY;
                    if (spawn.pattern === 'diag_from_top_left') startX += i * spawn.spacing;
                    if (spawn.pattern === 'diag_from_top_right') startX -= i * spawn.spacing;
                    if (spawn.pattern.includes('horizontal')) startX -= i * spawn.spacing;
                    if (spawn.pattern.includes('vertical')) startY += i * spawn.spacing;
                    if (spawn.pattern === 'vertical_down') startY -= i * spawn.spacing;
                    this.game.enemies.push(new Enemy(this.game, startX, startY, spawn.pattern));
                }
            }, spawn.delay);
        });
        this.waveCounter++;
    }
}

class Game {
    constructor(width, height, gameMode) {
        this.width = width;
        this.height = height;
        this.gameMode = gameMode;
        this.input = new InputHandler(this);
        this.ui = new UI(this);
        this.waveManager = new WaveManager(this);
        this.player1 = new Player(this, 'player1');
        this.player2 = (this.gameMode === '2p') ? new Player(this, 'player2') : null;
        this.enemies = [];
        this.projectiles = [];
        this.particles = [];
        this.powerUps = [];
        this.waveTimer = 0;
        this.waveInterval = 2500;
        this.gameOver = false;
        this.score = 0;
        this.scoreP2 = 0;
        this.level = 1;
        this.scoreForNextLevel = 5000;
        this.enemiesKilledCounter = 0;
        this.powerUpThreshold = (this.gameMode === '1p') ? 5 : 10;
        this.gameTime = 0;
        this.waveManager.spawnWave();
    }

    update(deltaTime) {
        if (this.gameOver) return;
        this.gameTime += deltaTime;
        this.waveInterval = Math.max(800, 2500 - this.gameTime / 100);
        this.player1.update(this.input);
        if (this.player2) this.player2.update(this.input);
        this.projectiles.forEach(p => p.update());
        this.projectiles = this.projectiles.filter(p => !p.markedForDeletion);
        this.powerUps.forEach(p => p.update());
        this.powerUps = this.powerUps.filter(p => !p.markedForDeletion);
        if (this.waveTimer > this.waveInterval) {
            this.waveManager.spawnWave();
            this.waveTimer = 0;
        } else { this.waveTimer += deltaTime; }
        this.enemies.forEach(enemy => {
            enemy.update();
            this.checkPlayerCollision(this.player1, enemy);
            if (this.player2) this.checkPlayerCollision(this.player2, enemy);
        });
        this.enemies = this.enemies.filter(e => !e.markedForDeletion);
        this.particles.forEach(p => p.update());
        this.particles = this.particles.filter(p => !p.markedForDeletion);
        if (this.score + this.scoreP2 >= this.scoreForNextLevel) { this.levelUp(); }
        const p1Dead = this.player1.lives <= 0;
        const p2Dead = this.player2 ? this.player2.lives <= 0 : true;
        if (p1Dead && (this.gameMode === '1p' || p2Dead)) { this.setGameOver(); }
    }
    
    draw(context) {
        context.clearRect(0, 0, this.width, this.height);
        this.player1.draw(context);
        if (this.player2) this.player2.draw(context);
        this.projectiles.forEach(p => p.draw(context));
        this.powerUps.forEach(p => p.draw(context));
        this.enemies.forEach(e => e.draw(context));
        this.particles.forEach(p => p.draw(context));
        this.ui.draw(context);
    }
    
    checkPlayerCollision(player, enemy) {
        if (player.lives > 0 && this.checkCollision(player, enemy)) {
            enemy.markedForDeletion = true; this.createExplosion(enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5); player.lives--;
        }
        this.projectiles.forEach(projectile => {
            if (projectile.owner === player.playerType && this.checkCollision(projectile, enemy)) {
                enemy.markedForDeletion = true; projectile.markedForDeletion = true; this.createExplosion(enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5);
                if (player.playerType === 'player1') this.score += 100; else this.scoreP2 += 100;
                this.enemiesKilledCounter++;
                if (this.enemiesKilledCounter >= this.powerUpThreshold) {
                    this.powerUps.push(new PowerUp(this)); this.enemiesKilledCounter = 0;
                }
            }
        });
        this.powerUps.forEach(powerUp => {
            if (player.lives > 0 && this.checkCollision(player, powerUp)) {
                powerUp.markedForDeletion = true; player.activatePowerUp();
            }
        });
    }

    levelUp() {
        this.level++; if (this.level > 3) { this.setGameOver("¡Has ganado!"); return; }
        this.scoreForNextLevel *= 2.5; this.waveInterval *= 0.85; levelUpTitle.textContent = `Nivel ${this.level}`; levelUpScreen.style.display = 'flex';
        setTimeout(() => { levelUpScreen.style.display = 'none'; }, 2000);
    }

    setGameOver(message = "Game Over") {
        this.gameOver = true; const finalScore = this.score + this.scoreP2;
        finalScoreElement.textContent = `Puntuación Final: ${finalScore}`; gameOverScreen.querySelector('h1').textContent = message; gameOverScreen.style.display = 'flex';
    }

    checkCollision(rect1, rect2) {
        return (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y);
    }

    createExplosion(x, y) {
        for (let i = 0; i < 20; i++) { this.particles.push(new Particle(this, x, y)); }
    }
}

// --- LÓGICA DE INICIO Y BUCLE PRINCIPAL ---
function startGame(mode) {
    body.className = (mode === '1p') ? 'single-player' : 'two-players';
    resizeCanvas();
    game = new Game(canvas.width, canvas.height, mode);
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    animate(0);
}

start1PButton.addEventListener('click', () => startGame('1p'));
start2PButton.addEventListener('click', () => startGame('2p'));
restartButton.addEventListener('click', () => {
    startScreen.style.display = 'flex';
    gameOverScreen.style.display = 'none';
    body.className = 'single-player';
    resizeCanvas();
});

let lastTime = 0;
function animate(timeStamp) {
    if (!game || game.gameOver) return;
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    game.update(deltaTime || 0);
    game.draw(ctx);
    requestAnimationFrame(animate);
}

resizeCanvas();