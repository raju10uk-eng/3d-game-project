import * as CANNON from 'cannon-es';

export class PhysicsEngine {
  private world: CANNON.World;
  private bodies: Map<string, CANNON.Body> = new Map();

  constructor() {
    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.82, 0);
    this.world.broadphase = new CANNON.NaiveBroadphase();
    this.world.solver.iterations = 10;
  }

  public update(deltaTime: number): void {
    this.world.step(1 / 60, deltaTime, 3);
  }

  public addBody(id: string, body: CANNON.Body): void {
    this.world.addBody(body);
    this.bodies.set(id, body);
  }

  public removeBody(id: string): void {
    const body = this.bodies.get(id);
    if (body) {
      this.world.removeBody(body);
      this.bodies.delete(id);
    }
  }

  public getBody(id: string): CANNON.Body | undefined {
    return this.bodies.get(id);
  }

  public createRigidbody(
    mass: number,
    shape: CANNON.Shape,
    position: [number, number, number],
    options?: { restitution?: number; friction?: number }
  ): CANNON.Body {
    const body = new CANNON.Body({
      mass,
      shape,
      restitution: options?.restitution || 0.3,
      friction: options?.friction || 0.4
    });
    body.position.set(...position);
    return body;
  }

  public rayCast(
    from: CANNON.Vec3,
    to: CANNON.Vec3
  ): CANNON.RaycastResult {
    const result = new CANNON.RaycastResult();
    this.world.raycastClosest(from, to, {}, result);
    return result;
  }
}
