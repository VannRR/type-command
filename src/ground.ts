import { RenderConstants } from "./main.ts";
import { Bound, HexColor, Layer } from "./types.ts";

export default class Ground {
  private readonly bounds: Bound[];

  constructor() {
    this.bounds = [
      {
        x: 0,
        y: RenderConstants.HEIGHT - 15 * RenderConstants.PIXEL_SIZE,
        width: RenderConstants.WIDTH,
        height: 15 * RenderConstants.PIXEL_SIZE,
      },
      {
        x: 0,
        y: RenderConstants.HEIGHT - 20 * RenderConstants.PIXEL_SIZE,
        width: 9 * RenderConstants.PIXEL_SIZE,
        height: 5 * RenderConstants.PIXEL_SIZE,
      },
      {
        x: RenderConstants.WIDTH - 9 * RenderConstants.PIXEL_SIZE,
        y: RenderConstants.HEIGHT - 20 * RenderConstants.PIXEL_SIZE,
        width: 9 * RenderConstants.PIXEL_SIZE,
        height: 5 * RenderConstants.PIXEL_SIZE,
      },
    ];
  }

  draw(layer: Layer, groundColor: HexColor): void {
    layer.fillStyle = groundColor;
    this.bounds.forEach((bound: Bound) => {
      layer.fillRect(bound.x, bound.y, bound.width, bound.height);
    });
  }

  getBounds(): Bound[] {
    return this.bounds;
  }

  setCollision(): void {}
}
