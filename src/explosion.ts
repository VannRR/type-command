import { RenderConstants } from "./main.ts";
import { Bound, HexColor, Layer, PixelGrid, Vector } from "./types.ts";
import { drawGrid } from "./utility.ts";

enum ExplosionConstants {
  PIXEL_WIDTH = 11,
  PIXEL_HEIGHT = 11,
}

const EXPLOSION_SIZES: number[] = [3, 5, 8, 9, 11];

const EXPLOSION_FRAMES: PixelGrid[] = [
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0],
  ],
];

export class Explosion {
  private readonly coords: Vector;
  private readonly bounds: Bound[];
  private readonly width: number =
    ExplosionConstants.PIXEL_WIDTH * RenderConstants.PIXEL_SIZE;
  private readonly height: number =
    ExplosionConstants.PIXEL_HEIGHT * RenderConstants.PIXEL_SIZE;
  private frame: number = 0;

  constructor(coords: Vector) {
    this.coords = coords;
    this.bounds = [];
    for (const size of EXPLOSION_SIZES) {
      const half = Math.ceil(size * 0.5);
      const double = half * 2;
      this.bounds.push({
        x: coords.x - RenderConstants.PIXEL_SIZE * half,
        y: coords.y - RenderConstants.PIXEL_SIZE * half,
        width: RenderConstants.PIXEL_SIZE * double,
        height: RenderConstants.PIXEL_SIZE * double,
      });
    }
  }

  advance(): void {
    if (this.frame < EXPLOSION_FRAMES.length - 1) {
      this.frame += 1;
    }
  }

  isDone(): boolean {
    return this.frame === EXPLOSION_FRAMES.length - 1;
  }

  getBounds(): Bound[] {
    return this.bounds;
  }

  draw(
    layer: Layer,
    mushroomCloudColor: HexColor,
    missileHeadColor: HexColor
  ): void {
    if (this.frame >= EXPLOSION_FRAMES.length) {
      return;
    }

    const centeredCoords = {
      x: this.coords.x - Math.floor(this.width * 0.5),
      y: this.coords.y - Math.floor(this.height * 0.5),
    };

    layer.fillStyle =
      this.frame % 2 === 0 ? mushroomCloudColor : missileHeadColor;

    drawGrid(
      layer,
      centeredCoords,
      RenderConstants.PIXEL_SIZE,
      EXPLOSION_FRAMES[this.frame]
    );
  }
  setCollision(): void {}
}

export class Explosions {
  private all: Explosion[] = [];

  constructor() {}

  spawn(coords: Vector) {
    const explosion = new Explosion(coords);
    this.all.push(explosion);
  }

  advance(): void {
    for (let i = 0; i < this.all.length; i++) {
      if (this.all[i].isDone() === true) {
        this.all.splice(i, 1);
      } else {
        this.all[i].advance();
      }
    }
  }

  forEach(func: (explosion: Explosion) => void): void {
    for (const explosion of this.all) {
      func(explosion);
    }
  }

  draw(
    layer: Layer,
    mushroomCloudColor: HexColor,
    missileHeadColor: HexColor
  ): void {
    for (let i = 0; i < this.all.length; i++) {
      this.all[i].draw(layer, mushroomCloudColor, missileHeadColor);
    }
  }
}
