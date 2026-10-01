import * as THREE from 'three';

export class RenderingEngine {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private materials: Map<string, THREE.Material> = new Map();

  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera) {
    this.scene = scene;
    this.camera = camera;
    this.initializeMaterials();
  }

  private initializeMaterials(): void {
    // Standard material for characters
    this.materials.set('character', new THREE.MeshStandardMaterial({
      color: 0xff6b6b,
      metalness: 0.3,
      roughness: 0.6
    }));

    // Metallic material for weapons
    this.materials.set('weapon', new THREE.MeshStandardMaterial({
      color: 0xc0c0c0,
      metalness: 0.9,
      roughness: 0.1
    }));

    // Enemy material
    this.materials.set('enemy', new THREE.MeshStandardMaterial({
      color: 0x2a2a3e,
      metalness: 0.4,
      roughness: 0.7,
      emissive: 0xff0000,
      emissiveIntensity: 0.2
    }));
  }

  public getMaterial(name: string): THREE.Material {
    return this.materials.get(name) || new THREE.MeshStandardMaterial();
  }

  public createModel(geometry: THREE.BufferGeometry, materialName: string): THREE.Mesh {
    const mesh = new THREE.Mesh(geometry, this.getMaterial(materialName));
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    return mesh;
  }

  public addToScene(object: THREE.Object3D): void {
    this.scene.add(object);
  }

  public removeFromScene(object: THREE.Object3D): void {
    this.scene.remove(object);
  }
}
