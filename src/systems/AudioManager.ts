export class AudioManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();

  constructor() {
    if (typeof window !== 'undefined' && window.AudioContext) {
      this.audioContext = new (window.AudioContext as any)();
    }
  }

  public async loadSound(name: string, url: string): Promise<void> {
    if (!this.audioContext) return;

    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    this.sounds.set(name, audioBuffer);
  }

  public playSound(name: string, volume: number = 1): void {
    if (!this.audioContext) return;

    const audioBuffer = this.sounds.get(name);
    if (!audioBuffer) return;

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();

    source.buffer = audioBuffer;
    gainNode.gain.value = volume;

    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    source.start(0);
  }
}
