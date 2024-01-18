import { RenderConstants } from "./main.ts";
import { Bound, HexColor, Layer } from "./types.ts";

export default class Hill {
  private readonly bounds: Bound[];

  constructor() {
    this.bounds = [];
    for (let i = 0; i < 3; i++) {
      let width = RenderConstants.PIXEL_SIZE * (27 - 10 * i);
      let x = RenderConstants.WIDTH_MIDDLE - Math.floor(width * 0.5);
      this.bounds.push({
        x,
        y: RenderConstants.HEIGHT - RenderConstants.PIXEL_SIZE * (17 + i * 2),
        width,
        height: 2 * RenderConstants.PIXEL_SIZE,
      });
    }
  }

  draw(layer: Layer, groundColor: HexColor): void {
    layer.fillStyle = groundColor;
    this.bounds.forEach((bound) => {
      layer.fillRect(bound.x, bound.y, bound.width, bound.height);
    });
  }

  getBounds(): Bound[] {
    return this.bounds;
  }

  setCollision(): void {}
}
