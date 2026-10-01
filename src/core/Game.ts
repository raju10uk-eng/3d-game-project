import * as THREE from 'three';
import { PhysicsEngine } from '../systems/PhysicsEngine';
import { RenderingEngine } from '../systems/RenderingEngine';
import { AISystem } from '../systems/AISystem';
import { InputManager } from '../systems/InputManager';
import { AudioManager } from '../systems/AudioManager';

export class Game {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private physicsEngine: PhysicsEngine;
  private renderingEngine: RenderingEngine;
  private aiSystem: AISystem;
  private inputManager: InputManager;
  private audioManager: AudioManager;
  private isRunning: boolean = false;
  private difficulty: 'normal' | 'hard' | 'nightmare' = 'normal';

  constructor(containerElement: HTMLElement) {
    // Initialize Three.js scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a2e);

    // Setup camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 5, 10);

    // Setup renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    containerElement.appendChild(this.renderer.domElement);

    // Initialize game systems
    this.physicsEngine = new PhysicsEngine();
    this.renderingEngine = new RenderingEngine(this.scene, this.camera);
    this.aiSystem = new AISystem();
    this.inputManager = new InputManager();
    this.audioManager = new AudioManager();

    this.setupLighting();
    this.setupEnvironment();
    this.setupEventListeners();
  }

  private setupLighting(): void {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    // Directional light (sun)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    // Point lights for atmosphere
    const pointLight = new THREE.PointLight(0xff6b6b, 1, 100);
    pointLight.position.set(-20, 10, 0);
    this.scene.add(pointLight);
  }

  private setupEnvironment(): void {
    // Create ground plane
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x2a2a3e,
      roughness: 0.8,
      metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Add atmospheric fog
    this.scene.fog = new THREE.Fog(0x1a1a2e, 100, 500);
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', () => this.onWindowResize());
    window.addEventListener('keydown', (e) => this.inputManager.handleKeyDown(e));
    window.addEventListener('keyup', (e) => this.inputManager.handleKeyUp(e));
    window.addEventListener('mousemove', (e) => this.inputManager.handleMouseMove(e));
  }

  public setDifficulty(difficulty: 'normal' | 'hard' | 'nightmare'): void {
    this.difficulty = difficulty;
    this.aiSystem.setDifficulty(difficulty);
  }

  public start(): void {
    this.isRunning = true;
    this.gameLoop();
  }

  public stop(): void {
    this.isRunning = false;
  }

  private gameLoop = (): void => {
    if (!this.isRunning) return;

    requestAnimationFrame(this.gameLoop);

    // Update systems
    const deltaTime = 1 / 60; // 60 FPS
    this.physicsEngine.update(deltaTime);
    this.aiSystem.update(deltaTime, this.scene);
    this.inputManager.update(deltaTime);

    // Render scene
    this.renderer.render(this.scene, this.camera);
  };

  private onWindowResize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public getScene(): THREE.Scene {
    return this.scene;
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }
}
