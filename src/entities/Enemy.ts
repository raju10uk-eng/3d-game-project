import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class Enemy {
  public position: THREE.Vector3;
  public velocity: THREE.Vector3 = new THREE.Vector3();
  public mesh: THREE.Group;
  public body: CANNON.Body;
  public health: number = 50;
  public maxHealth: number = 50;
  public speed: number = 5;
  public damage: number = 10;
  public detectionRange: number = 20;
  public attackRange: number = 2;
  public isAggro: boolean = false;
  public target: THREE.Vector3 | null = null;
  public lastAttackTime: number = 0;
  public attackCooldown: number = 1.5;

  constructor(position: THREE.Vector3, physicsWorld?: CANNON.World) {
    this.position = position;
    this.mesh = new THREE.Group();
    this.mesh.position.copy(position);

    // Create enemy body - more menacing appearance
    const bodyGeometry = new THREE.BoxGeometry(0.8, 2, 0.8);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      metalness: 0.5,
      roughness: 0.5,
      emissive: 0xff0000,
      emissiveIntensity: 0.2
    });
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    this.mesh.add(bodyMesh);

    // Create head with glowing eyes
    const headGeometry = new THREE.SphereGeometry(0.4, 32, 32);
    const headMesh = new THREE.Mesh(headGeometry, bodyMaterial);
    headMesh.position.y = 1.2;
    headMesh.castShadow = true;
    this.mesh.add(headMesh);

    // Glowing eyes
    const eyeGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.15, 1.5, 0.35);
    rightEye.position.set(0.15, 1.5, 0.35);
    this.mesh.add(leftEye);
    this.mesh.add(rightEye);

    // Physics body
    if (physicsWorld) {
      const shape = new CANNON.Box(new CANNON.Vec3(0.4, 1, 0.4));
      this.body = new CANNON.Body({
        mass: 1,
        shape,
        linearDamping: 0.3
      });
      this.body.position.copy(new CANNON.Vec3(position.x, position.y, position.z));
      physicsWorld.addBody(this.body);
    }
  }

  public update(deltaTime: number, playerPosition: THREE.Vector3): void {
    const distanceToPlayer = this.position.distanceTo(playerPosition);

    // Check if player is in detection range
    if (distanceToPlayer < this.detectionRange) {
      this.isAggro = true;
      this.target = playerPosition.clone();
    } else if (distanceToPlayer > this.detectionRange * 1.5) {
      this.isAggro = false;
      this.target = null;
    }

    if (this.isAggro && this.target) {
      // Move towards player
      const direction = this.target.clone().sub(this.position).normalize();
      this.velocity = direction.multiplyScalar(this.speed);

      // Rotate to face player
      this.mesh.lookAt(this.target);
    } else {
      // Patrol or idle
      this.velocity.lerp(new THREE.Vector3(0, this.velocity.y, 0), 0.1);
    }

    // Apply gravity
    this.velocity.y -= 9.82 * deltaTime;

    // Update position
    this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
    this.mesh.position.copy(this.position);
  }

  public canAttack(): boolean {
    return Date.now() - this.lastAttackTime > this.attackCooldown * 1000;
  }

  public attack(): void {
    if (this.canAttack()) {
      this.lastAttackTime = Date.now();
    }
  }

  public takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
  }

  public getMesh(): THREE.Group {
    return this.mesh;
  }

  public isAlive(): boolean {
    return this.health > 0;
  }
}
