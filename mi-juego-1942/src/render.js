// src/render.js
// Lógica para dibujar elementos en pantalla.

import { gameState } from './state.js';

const canvas = document.getElementById('canvas');
const scoreP1 = document.getElementById('score-player1');
const scoreP2 = document.getElementById('score-player2');

export function renderGame() {
  // Limpiar canvas (remover elementos no activos)
  canvas.querySelectorAll('.hero, .enemy-diver, .enemy-patrol, .bullet, .powerup-weapon, .powerup-diagonal').forEach(el => el.remove());

  // Render jugadores
  gameState.players.forEach((player, index) => {
    if (player.active) {
      const hero = document.createElement('div');
      hero.classList.add('hero');
      if (index === 1) hero.classList.add('hero-player2');
      hero.style.left = `${player.x}px`;
      hero.style.top = `${player.y}px`;
      canvas.appendChild(hero);
    }
  });

  // Render enemigos
  gameState.enemies.forEach(enemy => {
    const el = document.createElement('div');
    el.classList.add(enemy.type === 'diver' ? 'enemy-diver' : 'enemy-patrol');
    el.style.left = `${enemy.x}px`;
    el.style.top = `${enemy.y}px`;
    canvas.appendChild(el);
  });

  // Render balas
  gameState.bullets.forEach(bullet => {
    const el = document.createElement('div');
    el.classList.add('bullet');
    el.style.left = `${bullet.x}px`;
    el.style.top = `${bullet.y}px`;
    canvas.appendChild(el);
  });

  // Render powerups
  gameState.powerups.forEach(powerup => {
    const el = document.createElement('div');
    el.classList.add(powerup.type === 'weapon_level' ? 'powerup-weapon' : 'powerup-diagonal');
    el.style.left = `${powerup.x}px`;
    el.style.top = `${powerup.y}px`;
    canvas.appendChild(el);
  });

  // Actualizar scores
  scoreP1.textContent = `Player 1: ${gameState.players[0].score}`;
  if (gameState.mode === 2) {
    scoreP2.classList.remove('hidden');
    scoreP2.textContent = `Player 2: ${gameState.players[1].score}`;
  } else {
    scoreP2.classList.add('hidden');
  }
}