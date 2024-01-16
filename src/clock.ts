export default class Clock {
  private func: () => void;
  private lag: number;
  private on: boolean;
  private fpsInterval: number;
  private now: null | number;
  private then: null | number;
  private elapsed: null | number;
  private verb: boolean;
  constructor(func: () => void, fps: number, lag = 12) {
    this.func = func;
    this.lag = lag;
    this.on = false;
    this.fpsInterval = 1000 / fps;
    this.now = null;
    this.then = null;
    this.elapsed = null;
    this.verb = false;
  }

  private init(): void {
    this.then = Date.now();
  }

  private step(): void {
    if (this.then === null) {
      return;
    }
    this.now = Date.now();
    this.elapsed = this.now - this.then;
    if (this.elapsed + this.lag > this.fpsInterval || this.on === false) {
      this.func();
      this.then = this.now;
      if (this.verb === true) {
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

  toggle(): void {
    if (this.on === true) {
      this.on = false;
    } else {
      this.on = true;
      this.init();
      this.step();
    }
  }

  debug(): void {
    this.verb = !this.verb;
  }
}
