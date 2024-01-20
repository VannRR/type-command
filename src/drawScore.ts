import { RenderConstants } from "./main.ts";
import { drawGrid } from "./utility.ts";
import { HexColor, Layer, PixelGrid } from "./types.ts";

const DIGIT_GRID_SIZE = 7;

const DIGITS: PixelGrid[] = [
  [
    [0, 1, 1, 1, 1, 1, 0],
    [1, 1, 0, 0, 0, 1, 1],
    [1, 1, 0, 0, 1, 1, 1],
    [1, 1, 0, 1, 0, 1, 1],
    [1, 1, 1, 0, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 1],
    [0, 1, 1, 1, 1, 1, 0],
  ],
  [
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1],
  ],
  [
    [0, 0, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 1, 1],
    [0, 0, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 0, 0, 0],
    [0, 1, 1, 0, 0, 1, 1],
    [0, 1, 1, 1, 1, 1, 1],
  ],
  [
    [0, 0, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 1, 1],
    [0, 1, 1, 0, 0, 1, 1],
    [0, 0, 1, 1, 1, 1, 0],
  ],
  [
    [0, 0, 0, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 1, 1, 0],
    [1, 1, 0, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 1, 1, 1, 1],
  ],
  [
    [0, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 0, 0, 0, 1],
    [0, 1, 1, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 1, 1],
    [0, 1, 1, 0, 0, 1, 1],
    [0, 0, 1, 1, 1, 1, 0],
  ],
  [
    [0, 0, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 0, 1, 1],
    [0, 1, 1, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 0, 1, 1],
    [0, 1, 1, 0, 0, 1, 1],
    [0, 0, 1, 1, 1, 1, 0],
  ],
  [
    [0, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 0, 0, 1, 1],
    [0, 0, 0, 0, 0, 1, 1],
    [0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 0, 0],
  ],
  [
    [0, 0, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 0, 1, 1],
    [0, 1, 1, 0, 0, 1, 1],
    [0, 0, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 0, 1, 1],
    [0, 1, 1, 0, 0, 1, 1],
    [0, 0, 1, 1, 1, 1, 0],
  ],
  [
    [0, 0, 1, 1, 1, 1, 0],
    [0, 1, 1, 0, 0, 1, 1],
    [0, 1, 1, 0, 0, 1, 1],
    [0, 0, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 1, 1],
    [0, 1, 1, 0, 0, 1, 1],
    [0, 0, 1, 1, 1, 1, 0],
  ],
];

const SCORE_MIDDLE_FACTOR = 0.55;

export default function drawScore(
  layer: Layer,
  textColor: HexColor,
  score: number
): void {
  if (typeof score !== "number") {
    throw new Error("Score must be a number");
  }

  const digitWidth = DIGIT_GRID_SIZE * RenderConstants.PIXEL_SIZE;
  const digitHeight = DIGIT_GRID_SIZE * RenderConstants.PIXEL_SIZE;
  const scoreString = score.toString();
  const scoreMiddle =
    RenderConstants.WIDTH_MIDDLE -
    scoreString.length * SCORE_MIDDLE_FACTOR * digitWidth -
    RenderConstants.PIXEL_SIZE;
  layer.fillStyle = textColor;
  layer.clearRect(
    0,
    RenderConstants.PIXEL_SIZE,
    RenderConstants.WIDTH,
    digitHeight + RenderConstants.PIXEL_SIZE
  );

  for (let d = 0; d < scoreString.length; d++) {
    const digit = Number(scoreString[d]);
    drawGrid(
      layer,
      {
        x:
          RenderConstants.PIXEL_SIZE +
          d * digitWidth +
          d * RenderConstants.PIXEL_SIZE +
          scoreMiddle,
        y: RenderConstants.PIXEL_SIZE + RenderConstants.PIXEL_SIZE,
      },
      RenderConstants.PIXEL_SIZE,
      DIGITS[digit]
    );
  }
}
