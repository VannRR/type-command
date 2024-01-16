import { PIXEL_SIZE, HEIGHT, WIDTH_MIDDLE } from "./main.ts";
import { Bounds, HexColor, Layer } from "./types.ts";

export default class Hill {
  private bounds: Bounds[];

  constructor() {
    this.bounds = [
      {
        x: Math.floor(WIDTH_MIDDLE - PIXEL_SIZE * 13.5),
        y: HEIGHT - PIXEL_SIZE * 17,
        width: PIXEL_SIZE * 27,
        height: 2 * PIXEL_SIZE,
      },
      {
        x: Math.floor(WIDTH_MIDDLE - PIXEL_SIZE * 8.5),
        y: HEIGHT - PIXEL_SIZE * 19,
        width: PIXEL_SIZE * 17,
        height: 2 * PIXEL_SIZE,
      },
      {
        x: Math.floor(WIDTH_MIDDLE - PIXEL_SIZE * 3.5),
        y: HEIGHT - PIXEL_SIZE * 21,
        width: PIXEL_SIZE * 7,
        height: 2 * PIXEL_SIZE,
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
