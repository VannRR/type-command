import { RenderConstants } from "./main.ts";
import { Bound, PixelGrid, HexColor, Layer, Vector, Option } from "./types.ts";
import { drawGrid } from "./utility.ts";

enum CityConstants {
  INITIAL_Y = 21,
  GRID_WIDTH = 8,
  GRID_HEIGHT = 6,
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
    CityConstants.GRID_WIDTH * RenderConstants.PIXEL_SIZE;
  private readonly height: number =
    CityConstants.GRID_HEIGHT * RenderConstants.PIXEL_SIZE;
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

  private advance(): void {
    if (this.frame < CITY_FRAMES.length - 1) {
      this.frame++;
      this.updated = false;
    }
  }

  public reset(): void {
    this.frame = 0;
    this.updated = false;
  }

  public queueUpdate(): void {
    this.updated = false;
  }

  public isAlive(): boolean {
    return this.frame === 0;
  }

  public draw(
    layer: Layer,
    cityColor: HexColor,
    mushroomCloudColor: HexColor
  ): void {
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
      this.advance();
    }
  }

  public getBounds(): Option<Bound[]> {
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

  public setCollision(): void {
    if (this.frame === 0) {
      this.advance();
    }
  }
}

export class Cities {
  private readonly all: City[] = [
    new City(Math.floor(RenderConstants.WIDTH * 0.104)),
    new City(Math.floor(RenderConstants.WIDTH * 0.223)),
    new City(Math.floor(RenderConstants.WIDTH * 0.34)),
    new City(Math.floor(RenderConstants.WIDTH * 0.615)),
    new City(Math.floor(RenderConstants.WIDTH * 0.734)),
    new City(Math.floor(RenderConstants.WIDTH * 0.855)),
  ];

  public draw(
    layer: Layer,
    cityColor: HexColor,
    mushroomCloudColor: HexColor
  ): void {
    this.all.forEach((city) => {
      city.draw(layer, cityColor, mushroomCloudColor);
    });
  }

  public forEach(func: (city: City) => void): void {
    for (const city of this.all) {
      func(city);
    }
  }

  public areStanding(): boolean {
    for (const city of this.all) {
      if (city.isAlive()) {
        return true;
      }
    }
    return false;
  }

  public reset(): void {
    for (const city of this.all) {
      city.reset();
    }
  }

  public queueUpdate(): void {
    for (const city of this.all) {
      city.queueUpdate();
    }
  }
}
