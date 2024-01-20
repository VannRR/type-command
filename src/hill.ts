import { RenderConstants } from "./main.ts";
import { Bound, HexColor, Layer } from "./types.ts";

enum HillConstants {
  BASE_PIXEL_WIDTH = 27,
  BASE_PIXEL_HEIGHT = 2,
  BASE_PIXEL_Y = 17,
}

export default class Hill {
  private readonly bounds: Bound[] = [];

  constructor() {
    for (
      let i = 1, j = HillConstants.BASE_PIXEL_Y;
      i >= 0;
      i -= 0.33, j += HillConstants.BASE_PIXEL_HEIGHT
    ) {
      const width =
        RenderConstants.PIXEL_SIZE *
        Math.floor(HillConstants.BASE_PIXEL_WIDTH * i);
      this.bounds.push({
        x: Math.floor(RenderConstants.WIDTH_MIDDLE - width * 0.5),
        y: RenderConstants.HEIGHT - RenderConstants.PIXEL_SIZE * j,
        width,
        height: HillConstants.BASE_PIXEL_HEIGHT * RenderConstants.PIXEL_SIZE,
      });
    }
  }

  public draw(layer: Layer, groundColor: HexColor): void {
    layer.fillStyle = groundColor;
    this.bounds.forEach((bound) => {
      layer.fillRect(bound.x, bound.y, bound.width, bound.height);
    });
  }

  public getBounds(): Bound[] {
    return this.bounds;
  }

  public setCollision(): void {}
}
