import { GameplayConstants, RenderConstants } from "./main";
import PALETTES from "./palettes";
import { GameState, Layer } from "./types";

const GRID_SIZE = 6;
const GRID_COLOR = "green";
const INFO_BACKGROUND_COLOR = "#00000099";
const INFO_COLOR = "#aaa";

export function drawDebugGrid(layer: Layer) {
  layer.strokeStyle = GRID_COLOR;
  for (let j = 0; j < RenderConstants.PIXEL_HEIGHT; j++) {
    for (let i = 0; i < RenderConstants.PIXEL_WIDTH; i++) {
      layer.strokeRect(
        RenderConstants.PIXEL_SIZE * GRID_SIZE * i - 3,
        RenderConstants.PIXEL_SIZE * GRID_SIZE * j + 1,
        RenderConstants.PIXEL_SIZE * GRID_SIZE - 1,
        RenderConstants.PIXEL_SIZE * GRID_SIZE - 1
      );
    }
  }
}

export function drawDebugText(layer: Layer, gameState: GameState): void {
  const debugInfo = [
    `round: ${gameState.round} / ${GameplayConstants.MAX_ROUND}`,
    `frame: ${gameState.frame} / ${GameplayConstants.ROUND_LENGTH}`,
    `difficulty: ${gameState.difficulty} / ${GameplayConstants.MAX_DIFFICULTY}`,
    `currentPalette: ${gameState.currentPalette} / ${PALETTES.length - 1}`,
    `missileSpeed: ${gameState.missileSpeed} / ${GameplayConstants.FASTEST_MISSILE_SPEED}`,
    `spawnRate: ${gameState.spawnRate} / ${GameplayConstants.FASTEST_SPAWN_RATE}`,
    `score: ${gameState.score} / ${GameplayConstants.MAX_SCORE}`,
  ];

  const fontSize = RenderConstants.PIXEL_SIZE * 4;
  layer.font = `${fontSize}px monospace`;
  for (let i = 0; i < debugInfo.length; i++) {
    layer.fillStyle = INFO_BACKGROUND_COLOR;
    layer.fillRect(
      RenderConstants.PIXEL_SIZE,
      fontSize * i,
      debugInfo[i].length * Math.floor(fontSize * 0.6),
      fontSize
    );
    layer.fillStyle = INFO_COLOR;
    layer.fillText(
      debugInfo[i],
      RenderConstants.PIXEL_SIZE,
      fontSize * i + fontSize
    );
  }
}
