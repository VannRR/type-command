import { RenderConstants } from "./main.ts";
import { Bounds, PixelGrid, HexColor, Layer, Vector, Option } from "./types.ts";
import { drawGrid } from "./utility.ts";

enum CityConstants {
  INITIAL_Y = 21,
  PIXEL_WIDTH = 8,
  PIXEL_HEIGHT = 6,
}

const CITY_FRAMES: PixelGrid[] = [
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
  private readonly coords: Vector;
  private readonly width: number =
    CityConstants.PIXEL_WIDTH * RenderConstants.PIXEL_SIZE;
  private readonly height: number =
    CityConstants.PIXEL_HEIGHT * RenderConstants.PIXEL_SIZE;
  private frame: number = 0;
  private updated: boolean = false;

  constructor(x: number) {
    this.coords = {
      x,
      y:
        RenderConstants.HEIGHT -
        RenderConstants.PIXEL_SIZE * CityConstants.INITIAL_Y,
    };
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
    drawGrid(
      layer,
      this.coords,
      RenderConstants.PIXEL_SIZE,
      CITY_FRAMES[this.frame]
    );
    if (this.frame !== 0) {
      this.advanceFrame();
    }
  }

  getBounds(): Option<Bounds[]> {
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
  private readonly cities: City[];
  constructor() {
    this.cities = [
      new City(Math.floor(RenderConstants.WIDTH * 0.104)),
      new City(Math.floor(RenderConstants.WIDTH * 0.223)),
      new City(Math.floor(RenderConstants.WIDTH * 0.34)),
      new City(Math.floor(RenderConstants.WIDTH * 0.615)),
      new City(Math.floor(RenderConstants.WIDTH * 0.734)),
      new City(Math.floor(RenderConstants.WIDTH * 0.855)),
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

  areStanding(): boolean {
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
