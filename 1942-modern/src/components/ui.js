import { gameState } from '../state.js';

// Referencias a los elementos del DOM
const startMenu = document.getElementById('start-menu');
const inGameUI = document.getElementById('in-game-ui');
const endScreen = document.getElementById('end-screen');
const endMessage = document.getElementById('end-message');
const p1ScoreDisplay = document.getElementById('player1-score');
const p2ScoreDisplay = document.getElementById('player2-score');

export function showStartMenu() {
    startMenu.classList.remove('hidden');
    inGameUI.classList.add('hidden');
    endScreen.classList.add('hidden');
    gameState.gameStatus = 'menu';
}

export function hideStartMenu() {
    startMenu.classList.add('hidden');
    inGameUI.classList.remove('hidden');
}

export function showEndScreen(message) {
    endMessage.textContent = message;
    inGameUI.classList.add('hidden');
    endScreen.classList.remove('hidden');
    gameState.gameStatus = message === 'VICTORIA' ? 'victory' : 'gameOver';
}

export function setupUIEventListeners(startGameCallback, showMenuCallback) {
    document.getElementById('restart-button').addEventListener('click', () => {
        startGameCallback(gameState.numPlayers);
        endScreen.classList.add('hidden');
    });

    document.getElementById('menu-button').addEventListener('click', () => {
        showMenuCallback();
    });
}

export function updateScoreUI() {
    gameState.players.forEach(player => {
        if (player.id === 1) {
            p1ScoreDisplay.textContent = `P1: ${player.score}`;
            p1ScoreDisplay.style.display = player.isActive ? 'block' : 'none';
        } else if (player.id === 2) {
            p2ScoreDisplay.textContent = `P2: ${player.score}`;
            p2ScoreDisplay.style.display = player.isActive ? 'block' : 'none';
        }
    });
    // Ocultar P2 si no está en la partida
    if (gameState.numPlayers < 2) {
        p2ScoreDisplay.style.display = 'none';
    }
}


export function checkGameConditions() {
    // Condición de Victoria
    const winner = gameState.players.find(p => p.score >= 5000 && p.isActive);
    if (winner) {
        showEndScreen('VICTORIA');
    }

    // Condición de Derrota
    const allPlayersEliminated = gameState.players.every(p => !p.isActive);
    if (allPlayersEliminated) {
        showEndScreen('GAME OVER');
    }
}