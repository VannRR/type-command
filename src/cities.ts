import { HEIGHT, PIXEL_SIZE, WIDTH } from "./main.ts";
import { Bounds, HexColor, Layer, Vector } from "./types.ts";

const INITIAL_Y = 21;

const CITY_PIXEL_WIDTH = 8;
const CITY_PIXEL_HEIGHT = 6;
const CITY_FRAMES = [
  [
    [0, 0, 1, 0, 0, 0, 1, 0],
    [0, 0, 1, 1, 0, 1, 1, 0],
    [0, 1, 1, 1, 0, 1, 1, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ],
  [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ],
  [
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 0, 0, 1, 1, 0, 0, 1],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ],
  [
    [0, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ],
  [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 0, 1, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ],
];

export class City {
  private frame: number;
  private updated: boolean;
  private coords: Vector;

  constructor(
    x: number,
    private width = CITY_PIXEL_WIDTH * PIXEL_SIZE,
    private height = CITY_PIXEL_HEIGHT * PIXEL_SIZE
  ) {
    this.coords = { x, y: HEIGHT - PIXEL_SIZE * INITIAL_Y };
    this.frame = 0;
    this.updated = false;
  }

  reset(): void {
    this.frame = 0;
    this.updated = false;
  }

  queueUpdate(): void {
    this.updated = false;
  }

  isAlive(): boolean {
    return this.frame === 0;
  }

  advanceFrame(): void {
    if (this.frame < CITY_FRAMES.length - 1) {
      this.frame++;
      this.updated = false;
    }
  }

  draw(layer: Layer, cityColor: HexColor, mushroomCloudColor: HexColor): void {
    if (this.updated) {
      return;
    }
    this.updated = true;
    layer.fillStyle =
      this.frame === 0 || this.frame === CITY_FRAMES.length - 1
        ? cityColor
        : mushroomCloudColor;
    layer.clearRect(this.coords.x, this.coords.y, this.width, this.height);
    CITY_FRAMES[this.frame].forEach((row, j) => {
      row.forEach((cell, i) => {
        if (cell === 1) {
          layer.fillRect(
            i * PIXEL_SIZE + this.coords.x,
            j * PIXEL_SIZE + this.coords.y,
            PIXEL_SIZE,
            PIXEL_SIZE
          );
        }
      });
    });
    if (this.frame !== 0) {
      this.advanceFrame();
    }
  }

  getBounds(): Bounds[] | null {
    if (this.frame === 0) {
      return [
        {
          x: this.coords.x,
          y: this.coords.y,
          width: this.width,
          height: this.height,
        },
      ];
    } else {
      return null;
    }
  }

  setCollision(): void {
    if (this.frame === 0) {
      this.advanceFrame();
    }
  }
}

export class Cities {
  private cities: City[];
  constructor() {
    this.cities = [
      new City(Math.floor(WIDTH * 0.104)),
      new City(Math.floor(WIDTH * 0.223)),
      new City(Math.floor(WIDTH * 0.34)),
      new City(Math.floor(WIDTH * 0.615)),
      new City(Math.floor(WIDTH * 0.734)),
      new City(Math.floor(WIDTH * 0.855)),
    ];
  }

  draw(layer: Layer, cityColor: HexColor, mushroomCloudColor: HexColor): void {
    this.cities.forEach((city) => {
      city.draw(layer, cityColor, mushroomCloudColor);
    });
  }

  forEach(func: (city: City) => void): void {
    for (const city of this.cities) {
      func(city);
    }
  }

  areAlive(): boolean {
    for (const city of this.cities) {
      if (city.isAlive()) {
        return true;
      }
    }
    return false;
  }

  reset(): void {
    for (const city of this.cities) {
      city.reset();
    }
  }

  queueUpdate(): void {
    for (const city of this.cities) {
      city.queueUpdate();
    }
  }
}
