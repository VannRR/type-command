import { GameplayConstants, RenderConstants } from "./main.ts";
import { Bound, HexColor, Layer, PixelGrid, Vector, Option } from "./types.ts";
import { drawGrid } from "./utility.ts";
import Sound from "./sound.ts";

const EXPLOSION_GRID_SIZE = 11;

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
  private readonly bounds: Bound[] = [];
  private readonly width: number =
    EXPLOSION_GRID_SIZE * RenderConstants.PIXEL_SIZE;
  private readonly height: number =
    EXPLOSION_GRID_SIZE * RenderConstants.PIXEL_SIZE;
  private frame: number = 0;

  constructor(coords: Vector) {
    this.coords = coords;
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

  public isDone(): boolean {
    return this.frame >= EXPLOSION_FRAMES.length + 1;
  }

  public getBounds(): Bound[] {
    return this.bounds;
  }

  public draw(
    layer: Layer,
    mushroomCloudColor: HexColor,
    missileHeadColor: HexColor
  ): void {
    const centeredCoords = {
      x: this.coords.x - Math.floor(this.width * 0.5),
      y: this.coords.y - Math.floor(this.height * 0.5),
    };

    if (this.frame === EXPLOSION_FRAMES.length) {
      const clearSize = RenderConstants.PIXEL_SIZE * EXPLOSION_GRID_SIZE;
      layer.clearRect(centeredCoords.x, centeredCoords.y, clearSize, clearSize);
    } else {
      layer.fillStyle =
        this.frame % 2 === 0 ? mushroomCloudColor : missileHeadColor;

      drawGrid(
        layer,
        centeredCoords,
        RenderConstants.PIXEL_SIZE,
        EXPLOSION_FRAMES[this.frame]
      );
    }

    this.frame += 1;
  }
  setCollision(): void {}
}

export class Explosions {
  private readonly all: Explosion[] = [];
  private readonly sound: Sound;

  constructor(sound: Sound) {
    this.sound = sound;
  }

  public spawn(coords: Option<Vector>) {
    if (
      coords === null ||
      this.all.length >= GameplayConstants.MAX_MISSILES_AND_EXPLOSIONS
    ) {
      return;
    }
    const explosion = new Explosion(coords);
    this.all.push(explosion);
    this.sound.playSoundFX("explosion");
  }

  public forEach(func: (explosion: Explosion) => void): void {
    for (const explosion of this.all) {
      func(explosion);
    }
  }

  public draw(
    layer: Layer,
    mushroomCloudColor: HexColor,
    missileHeadColor: HexColor
  ): void {
    for (let i = 0; i < this.all.length; i++) {
      if (this.all[i].isDone() === false) {
        this.all[i].draw(layer, mushroomCloudColor, missileHeadColor);
      } else {
        this.all.splice(i, 1);
      }
    }
  }
}
