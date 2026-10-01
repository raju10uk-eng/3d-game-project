import * as THREE from 'three';

export interface AIEntity {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  targetPosition: THREE.Vector3;
  health: number;
  maxHealth: number;
  speed: number;
  detectionRange: number;
  isAggro: boolean;
}

export class AISystem {
  private entities: Map<string, AIEntity> = new Map();
  private difficulty: 'normal' | 'hard' | 'nightmare' = 'normal';
  private difficultyMultipliers = {
    normal: { speed: 1, health: 1, damage: 1, detectionRange: 1 },
    hard: { speed: 1.3, health: 1.5, damage: 1.2, detectionRange: 1.4 },
    nightmare: { speed: 1.8, health: 2.5, damage: 1.8, detectionRange: 2 }
  };

  public setDifficulty(difficulty: 'normal' | 'hard' | 'nightmare'): void {
    this.difficulty = difficulty;
  }

  public addEntity(id: string, entity: AIEntity): void {
    this.entities.set(id, entity);
  }

  public removeEntity(id: string): void {
    this.entities.delete(id);
  }

  public update(deltaTime: number, scene: THREE.Scene): void {
    const multiplier = this.difficultyMultipliers[this.difficulty];

    this.entities.forEach((entity) => {
      // Update AI behavior
      this.updateEntityBehavior(entity, multiplier, deltaTime);
      this.updateEntityMovement(entity, multiplier, deltaTime);
    });
  }

  private updateEntityBehavior(
    entity: AIEntity,
    multiplier: { speed: number; health: number; damage: number; detectionRange: number },
    deltaTime: number
  ): void {
    // Simulate detection and aggression
    if (Math.random() < 0.1) {
      entity.isAggro = Math.random() < (this.difficulty === 'normal' ? 0.3 : 0.7);
    }

    // Health regeneration on lower difficulties
    if (this.difficulty === 'normal' && entity.health < entity.maxHealth) {
      entity.health += entity.maxHealth * 0.01 * deltaTime;
    }
  }

  private updateEntityMovement(
    entity: AIEntity,
    multiplier: { speed: number; health: number; damage: number; detectionRange: number },
    deltaTime: number
  ): void {
    if (entity.isAggro) {
      // Chase target
      const direction = entity.targetPosition.clone().sub(entity.position).normalize();
      entity.velocity = direction.multiplyScalar(entity.speed * multiplier.speed);
    } else {
      // Patrol behavior
      entity.velocity.multiplyScalar(0.9);
    }

    // Update position
    entity.position.add(entity.velocity.clone().multiplyScalar(deltaTime));
  }
}
