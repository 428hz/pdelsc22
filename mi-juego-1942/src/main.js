// src/main.js
// Punto de entrada principal. Inicializa el juego y maneja eventos de menú.

import { initGame, resetGame, startGameLoop } from './game-loop.js';
import { gameState, setGameMode } from './state.js';

// Elementos del DOM
const menuScreen = document.getElementById('menu-screen');
const gameScreen = document.getElementById('game-screen');
const victoryScreen = document.getElementById('victory-screen');
const gameoverScreen = document.getElementById('gameover-screen');
const onePlayerBtn = document.getElementById('one-player');
const twoPlayersBtn = document.getElementById('two-players');
const restartBtns = document.querySelectorAll('#restart');
const menuBtns = document.querySelectorAll('#menu');

// Eventos de menú
onePlayerBtn.addEventListener('click', () => startGame(1));
twoPlayersBtn.addEventListener('click', () => startGame(2));

restartBtns.forEach(btn => btn.addEventListener('click', () => {
  resetGame();
  startGame(gameState.mode);
}));

menuBtns.forEach(btn => btn.addEventListener('click', () => {
  resetGame();
  showMenu();
}));

function startGame(mode) {
  setGameMode(mode);
  initGame();
  menuScreen.classList.add('hidden');
  gameScreen.classList.remove('hidden');
  victoryScreen.classList.add('hidden');
  gameoverScreen.classList.add('hidden');
  startGameLoop();
}

function showMenu() {
  menuScreen.classList.remove('hidden');
  gameScreen.classList.add('hidden');
  victoryScreen.classList.add('hidden');
  gameoverScreen.classList.add('hidden');
}

// Inicializar al cargar
showMenu();