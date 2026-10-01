import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class Player {
  public position: THREE.Vector3;
  public velocity: THREE.Vector3 = new THREE.Vector3();
  public mesh: THREE.Group;
  public body: CANNON.Body;
  public health: number = 100;
  public maxHealth: number = 100;
  public speed: number = 10;
  public isJumping: boolean = false;
  public stamina: number = 100;
  public maxStamina: number = 100;
  public weaponEquipped: string = 'sword';

  constructor(
    position: THREE.Vector3 = new THREE.Vector3(0, 2, 0),
    physicsWorld?: CANNON.World
  ) {
    this.position = position;
    this.mesh = new THREE.Group();
    this.mesh.position.copy(position);

    // Create player body
    const bodyGeometry = new THREE.CapsuleGeometry(0.5, 2, 8, 20);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: 0xff6b6b,
      metalness: 0.3,
      roughness: 0.6
    });
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    this.mesh.add(bodyMesh);

    // Create head
    const headGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    const headMesh = new THREE.Mesh(headGeometry, bodyMaterial);
    headMesh.position.y = 1.3;
    headMesh.castShadow = true;
    this.mesh.add(headMesh);

    // Physics body
    if (physicsWorld) {
      const shape = new CANNON.Sphere(0.5);
      this.body = new CANNON.Body({
        mass: 1,
        shape,
        linearDamping: 0.3,
        angularDamping: 0.3
      });
      this.body.position.copy(new CANNON.Vec3(position.x, position.y, position.z));
      physicsWorld.addBody(this.body);
    }
  }

  public update(deltaTime: number, inputX: number, inputZ: number): void {
    // Update velocity based on input
    const moveDirection = new THREE.Vector3(inputX, 0, inputZ).normalize();
    if (moveDirection.length() > 0) {
      this.velocity.copy(moveDirection.multiplyScalar(this.speed));
    } else {
      this.velocity.lerp(new THREE.Vector3(0, this.velocity.y, 0), 0.1);
    }

    // Apply gravity
    this.velocity.y -= 9.82 * deltaTime;

    // Update position
    this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
    this.mesh.position.copy(this.position);

    // Stamina regeneration
    if (this.stamina < this.maxStamina) {
      this.stamina += this.maxStamina * 0.1 * deltaTime;
    }
  }

  public takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
  }

  public heal(amount: number): void {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  public jump(): void {
    if (!this.isJumping && this.stamina >= 10) {
      this.velocity.y = 15;
      this.isJumping = true;
      this.stamina -= 10;
    }
  }

  public getMesh(): THREE.Group {
    return this.mesh;
  }

  public isAlive(): boolean {
    return this.health > 0;
  }
}
