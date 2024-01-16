import { PIXEL_SIZE, WIDTH, HEIGHT } from "./main.ts";
import { Bounds, HexColor, Layer } from "./types.ts";

export default class Ground {
  private bounds: Bounds[];

  constructor() {
    this.bounds = [
      {
        x: 0,
        y: HEIGHT - 15 * PIXEL_SIZE,
        width: WIDTH,
        height: 15 * PIXEL_SIZE,
      },
      {
        x: 0,
        y: HEIGHT - 20 * PIXEL_SIZE,
        width: 9 * PIXEL_SIZE,
        height: 5 * PIXEL_SIZE,
      },
      {
        x: WIDTH - 9 * PIXEL_SIZE,
        y: HEIGHT - 20 * PIXEL_SIZE,
        width: 9 * PIXEL_SIZE,
        height: 5 * PIXEL_SIZE,
      },
    ];
  }

  draw(layer: Layer, groundColor: HexColor): void {
    layer.fillStyle = groundColor;
    this.bounds.forEach((bound) => {
      layer.fillRect(bound.x, bound.y, bound.width, bound.height);
    });
  }

  getBounds(): Bounds[] {
    return this.bounds;
  }

  setCollision(): void {}
}
