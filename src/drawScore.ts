import { WIDTH, PIXEL_SIZE, WIDTH_MIDDLE } from "./main.ts";
import { HexColor, Layer } from "./types.ts";

const DIGITS_PIXEL_WIDTH = 7;
const DIGITS_PIXEL_HEIGHT = 7;
const DIGITS = [
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

export default function drawScore(
  layer: Layer,
  textColor: HexColor,
  score: number
): void {
  const digitWidth = DIGITS_PIXEL_WIDTH * PIXEL_SIZE;
  const digitHeight = DIGITS_PIXEL_HEIGHT * PIXEL_SIZE;
  const scoreString = score.toString();
  const scoreMiddle =
    WIDTH_MIDDLE - scoreString.length * 0.55 * digitWidth - PIXEL_SIZE;
  layer.fillStyle = textColor;
  layer.clearRect(0, PIXEL_SIZE, WIDTH, digitHeight);
  for (let d = 0; d < scoreString.length; d++) {
    const digit = Number(scoreString[d]);
    DIGITS[digit].forEach((row, j) => {
      row.forEach((cell, i) => {
        if (cell === 1) {
          layer.fillRect(
            i * PIXEL_SIZE + d * digitWidth + d * PIXEL_SIZE + scoreMiddle,
            j * PIXEL_SIZE + PIXEL_SIZE,
            PIXEL_SIZE,
            PIXEL_SIZE
          );
        }
      });
    });
  }
}
