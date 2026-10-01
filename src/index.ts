import { Game } from './core/Game';
import { Player } from './entities/Player';
import { Enemy } from './entities/Enemy';
import * as THREE from 'three';

const container = document.getElementById('game-container');
if (!container) {
  throw new Error('Game container not found');
}

// Create game instance
const game = new Game(container);

// Set difficulty level
const difficulty = new URLSearchParams(window.location.search).get('difficulty') as 'normal' | 'hard' | 'nightmare' || 'normal';
game.setDifficulty(difficulty);

// Create player
const player = new Player(new THREE.Vector3(0, 2, 0));
game.getScene().add(player.getMesh());

// Spawn enemies
for (let i = 0; i < (difficulty === 'normal' ? 3 : difficulty === 'hard' ? 6 : 10); i++) {
  const angle = (i / (difficulty === 'normal' ? 3 : difficulty === 'hard' ? 6 : 10)) * Math.PI * 2;
  const distance = 15 + Math.random() * 10;
  const enemyPosition = new THREE.Vector3(
    Math.cos(angle) * distance,
    2,
    Math.sin(angle) * distance
  );
  const enemy = new Enemy(enemyPosition);
  game.getScene().add(enemy.getMesh());
}

// Start game
game.start();

// Display difficulty
console.log(`Game started on ${difficulty.toUpperCase()} difficulty!`);
