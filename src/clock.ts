export default class Clock {
  private readonly func: () => void;
  private readonly lag: number;
  private readonly fpsInterval: number;
  private on: boolean = false;
  private now: number = 0;
  private then: number = 0;
  private elapsed: number = 0;
  private debugMode: boolean = false;

  constructor(func: () => void, fps: number, lag: number = 12) {
    this.func = func;
    this.lag = lag;
    this.fpsInterval = 1000 / fps;
  }

  private init(): void {
    this.then = Date.now();
  }

  private step(): void {
    if (this.then === 0) {
      return;
    }
    this.now = Date.now();
    this.elapsed = this.now - this.then;
    if (this.elapsed + this.lag > this.fpsInterval || this.on === false) {
      this.func();
      this.then = this.now;
      if (this.debugMode === true) {
        console.log(
          "Clock debug:\n" +
            `lag = ${this.lag}\n` +
            `on = ${this.on}\n` +
            `fpsInterval = ${this.fpsInterval}ms\n` +
            `elapsed = ${this.elapsed}ms`
        );
      }
    }
    if (this.on === true) {
      requestAnimationFrame(() => this.step());
    }
  }

  public start(): void {
    if (this.on === false) {
      this.on = true;
      this.init();
      this.step();
    }
  }

  public stop(): void {
    if (this.on === true) {
      this.on = false;
    }
  }

  public toggleDebugMode(): void {
    this.debugMode = !this.debugMode;
  }
}
