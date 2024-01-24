import { Option } from "./types";

const CHANNELS = 8;

const BACKSPACE_FX_PATH = "/fx/backspace.wav";
const COLLAPSE_FX_PATH = "/fx/collapse.ogg";
const COLLISION_FX_PATH = "/fx/collision.ogg";
const EXPLOSION_FX_PATH = "/fx/explosion.ogg";
const GAME_OVER_FX_PATH = "/fx/game-over.wav";
const GAME_START_FX_PATH = "/fx/game-start.wav";
const MAX_SCORE_FX_PATH = "/fx/max-score.wav";
const NOMATCH_FX_PATH = "/fx/no-match.ogg";
const TYPING_FX_PATH = "/fx/typing.wav";

export default class Sound {
  private readonly audioCtx = new window.AudioContext();
  private readonly bufferSourceNodes: Option<AudioBufferSourceNode>[] = [];
  private backspaceFX: Option<AudioBuffer> = null;
  private collapseFX: Option<AudioBuffer> = null;
  private collisionFX: Option<AudioBuffer> = null;
  private explosionFX: Option<AudioBuffer> = null;
  private gameOverFX: Option<AudioBuffer> = null;
  private gameStartFX: Option<AudioBuffer> = null;
  private maxScoreFX: Option<AudioBuffer> = null;
  private noMatchFX: Option<AudioBuffer> = null;
  private typingFX: Option<AudioBuffer> = null;

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
    this.backspaceFX = await this.loadFileToBuffer(BACKSPACE_FX_PATH);
    this.collapseFX = await this.loadFileToBuffer(COLLAPSE_FX_PATH);
    this.collisionFX = await this.loadFileToBuffer(COLLISION_FX_PATH);
    this.explosionFX = await this.loadFileToBuffer(EXPLOSION_FX_PATH);
    this.gameOverFX = await this.loadFileToBuffer(GAME_OVER_FX_PATH);
    this.gameStartFX = await this.loadFileToBuffer(GAME_START_FX_PATH);
    this.maxScoreFX = await this.loadFileToBuffer(MAX_SCORE_FX_PATH);
    this.noMatchFX = await this.loadFileToBuffer(NOMATCH_FX_PATH);
    this.typingFX = await this.loadFileToBuffer(TYPING_FX_PATH);
  }

  public reset(): void {
    for (let channel = 0; channel < CHANNELS; channel++) {
      this.stopChannel(channel);
    }
  }

  public playBackspaceFX(): void {
    this.playFX(this.backspaceFX);
    console.log("backspaceFX");
  }

  public playCollapseFX(): void {
    this.playFX(this.collapseFX);
    console.log("collapseFX");
  }

  public playCollisionFX(): void {
    this.playFX(this.collisionFX);
    console.log("collisionFX");
  }

  public playExplosionFX(): void {
    this.playFX(this.explosionFX);
    console.log("explosionFX");
  }

  public playGameOverFX(): void {
    this.playFX(this.gameOverFX);
    console.log("gameOverFX");
  }

  public playGameStartFX(): void {
    this.playFX(this.gameStartFX);
    console.log("gameStartFX");
  }

  public playMaxScoreFX(): void {
    this.playFX(this.maxScoreFX);
    console.log("maxScoreFX");
  }

  public playNoMatchFX(): void {
    this.playFX(this.noMatchFX);
    console.log("noMatchFX");
  }

  public playTypingFX(): void {
    this.playFX(this.typingFX);
    console.log("typingFX");
  }
}
