export class InputManager {
  private keys: Map<string, boolean> = new Map();
  private mousePosition = { x: 0, y: 0 };
  private mousePressed = false;

  public handleKeyDown(event: KeyboardEvent): void {
    this.keys.set(event.key.toLowerCase(), true);
  }

  public handleKeyUp(event: KeyboardEvent): void {
    this.keys.set(event.key.toLowerCase(), false);
  }

  public handleMouseMove(event: MouseEvent): void {
    this.mousePosition = { x: event.clientX, y: event.clientY };
  }

  public isKeyPressed(key: string): boolean {
    return this.keys.get(key.toLowerCase()) || false;
  }

  public getMovementInput(): { x: number; z: number } {
    let x = 0;
    let z = 0;

    if (this.isKeyPressed('w')) z -= 1;
    if (this.isKeyPressed('s')) z += 1;
    if (this.isKeyPressed('a')) x -= 1;
    if (this.isKeyPressed('d')) x += 1;

    return { x, z };
  }

  public getMousePosition(): { x: number; y: number } {
    return this.mousePosition;
  }

  public update(deltaTime: number): void {
    // Process input events
  }
}
