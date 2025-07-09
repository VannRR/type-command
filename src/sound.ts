import { Option, SoundFX } from "./types";

const CHANNELS = 8;

const FX_DIRECTORY = "/fx/";
const FX_EXTENSION = ".ogg";

export default class Sound {
  private readonly audioCtx = new window.AudioContext();
  private readonly bufferSourceNodes: Option<AudioBufferSourceNode>[] = [];
  private allSoundFX: Map<SoundFX, AudioBuffer> = new Map();

  constructor() {
    for (let i = 0; i < CHANNELS; i++) {
      this.bufferSourceNodes.push(null);
    }
  }

  private async loadSoundFXToBuffer(soundFX: SoundFX): Promise<void> {
    const path = `${FX_DIRECTORY}${soundFX}${FX_EXTENSION}`;
    try {
      const response = await fetch(path);
      const arrayBuffer = await response.arrayBuffer();
      this.allSoundFX.set(
        soundFX,
        await this.audioCtx.decodeAudioData(arrayBuffer)
      );
    } catch (error) {
      console.error(`Failed to load sound fx file at path: ${path}`, error);
    }
  }

  private getAvailableChannel(): Option<number> {
    for (let channel = 0; channel < CHANNELS; channel++) {
      if (this.bufferSourceNodes[channel] === null) {
        return channel;
      }
    }
    return null;
  }

  private startChannel(channel: number, buffer: AudioBuffer): void {
    const source = this.audioCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioCtx.destination);
    source.start();
    this.bufferSourceNodes[channel] = source;
    source.addEventListener("ended", () => {
      this.stopChannel(channel);
    });
  }

  private stopChannel(channel: number): void {
    const source = this.bufferSourceNodes[channel];
    if (source === null) {
      return;
    }
    source.disconnect();
    this.bufferSourceNodes[channel] = null;
  }

  public async init(): Promise<void> {
    await Promise.all([
      this.loadSoundFXToBuffer("backspace"),
      this.loadSoundFXToBuffer("collapse"),
      this.loadSoundFXToBuffer("collision"),
      this.loadSoundFXToBuffer("explosion"),
      this.loadSoundFXToBuffer("game-over"),
      this.loadSoundFXToBuffer("game-start"),
      this.loadSoundFXToBuffer("max-score"),
      this.loadSoundFXToBuffer("no-match"),
      this.loadSoundFXToBuffer("typing"),
    ]);
  }

  public reset(): void {
    for (let channel = 0; channel < CHANNELS; channel++) {
      this.stopChannel(channel);
    }
  }

  public playSoundFX(soundFX: SoundFX): void {
    const channel = this.getAvailableChannel();
    const buffer = this.allSoundFX.get(soundFX);
    if (channel === null || buffer === undefined) {
      // console.log({channel, soundFX, status: "null/undefined"});
      return;
    }
    this.startChannel(channel, buffer);
    // console.log({channel, soundFX, status: "good"});
  }
}
