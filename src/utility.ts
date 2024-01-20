import { RenderConstants } from "./main";
import { PixelGrid, Layer, Vector } from "./types";
import WORDS from "./words.json";

const RANDOM_WORD_THRESHOLD = 0.5;
const VECTOR_COLLISION_THRESHOLD = 1.3;

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

export function generateRandomVector(coords: Vector): Vector {
  const angle = (Math.random() * Math.PI) / 2 - Math.PI / 4 - 0.5 * Math.PI;
  const vector = {
    x: Math.cos(angle),
    y: -Math.sin(angle),
  };

  const futureX =
    coords.x +
    vector.x *
      (RenderConstants.PIXEL_HEIGHT * VECTOR_COLLISION_THRESHOLD - coords.y);

  if (futureX >= RenderConstants.PIXEL_WIDTH) {
    vector.x = Math.random() * -0.33;
  } else if (futureX <= 0) {
    vector.x = Math.random() * 0.33;
  }

  return vector;
}

export function getRandomWord(difficulty: number): string {
  if (!WORDS || WORDS.length === 0) {
    throw new Error("WORDS array is empty or not defined");
  }

  let charCount = difficulty - 1;
  for (let i = charCount; i >= 0; i--) {
    if (Math.random() > RANDOM_WORD_THRESHOLD) {
      break;
    }
    charCount = i;
  }

  charCount = Math.min(charCount, WORDS.length - 1);
  const currentWords = WORDS[charCount];
  const randomWordIndex = Math.floor(Math.random() * currentWords.length);

  return currentWords[randomWordIndex].toUpperCase();
}
