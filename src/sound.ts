import { Option } from "./types";

const CHANNELS = 8;

const BACKSPACE_FX_PATH = "/fx/arrow_x.wav";
const COLLAPSE_FX_PATH = "/fx/collapse.ogg";
const COLLISION_FX_PATH = "/fx/collision.ogg";
const EXPLOSION_FX_PATH = "/fx/explosion.ogg";
const NOMATCH_FX_PATH = "/fx/no-match.ogg";
const TYPING_FX_PATH = "/fx/arrow_x.wav";

export default class Sound {
  private readonly audioCtx = new window.AudioContext();
  private readonly bufferSourceNodes: Option<AudioBufferSourceNode>[] = [];
  private explosionFX: Option<AudioBuffer> = null;
  private typingFX: Option<AudioBuffer> = null;
  private backspaceFX: Option<AudioBuffer> = null;
  private noMatchFX: Option<AudioBuffer> = null;

  constructor() {
    for (let i = 0; i < CHANNELS; i++) {
      this.bufferSourceNodes.push(null);
    }
  }

  private async loadFileToBuffer(path: string): Promise<AudioBuffer> {
    const response = await fetch(path);
    const arrayBuffer = await response.arrayBuffer();
    return await this.audioCtx.decodeAudioData(arrayBuffer);
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

  private playFX(buffer: Option<AudioBuffer>): void {
    const channel = this.getAvailableChannel();
    if (channel === null || buffer === null) {
      return;
    }
    this.startChannel(channel, buffer);
  }

  public async init(): Promise<void> {
    this.explosionFX = await this.loadFileToBuffer(EXPLOSION_FX_PATH);
    this.typingFX = await this.loadFileToBuffer(TYPING_FX_PATH);
    this.backspaceFX = await this.loadFileToBuffer(BACKSPACE_FX_PATH);
    this.noMatchFX = await this.loadFileToBuffer(NOMATCH_FX_PATH);
  }

  public reset(): void {
    for (let channel = 0; channel < CHANNELS; channel++) {
      this.stopChannel(channel);
    }
  }

  public playExplosionFX(): void {
    this.playFX(this.explosionFX);
  }

  public playTypingFX(): void {
    this.playFX(this.typingFX);
  }

  public playBackspaceFX(): void {
    this.playFX(this.backspaceFX);
  }

  public playNoMatchFX(): void {
    this.playFX(this.noMatchFX);
  }
}
