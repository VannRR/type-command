import { PixelGrid, Layer, Vector } from "./types";

export function drawGrid(
  layer: Layer,
  coords: Vector,
  pixelSize: number,
  pixelGrid: PixelGrid
) {
  pixelGrid.forEach((row, j) => {
    row.forEach((cell, i) => {
      if (cell === 1) {
        layer.fillRect(
          i * pixelSize + coords.x,
          j * pixelSize + coords.y,
          pixelSize,
          pixelSize
        );
      }
    });
  });
}
