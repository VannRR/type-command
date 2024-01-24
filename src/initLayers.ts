import { RenderConstants, DEBUG } from "./main.ts";
import { Layer, Layers } from "./types.ts";

function createLayer(gameContainer: HTMLDivElement): Layer {
  const cvs = document.createElement("canvas");
  cvs.className = "game-layer-17c04965";
  cvs.width = RenderConstants.WIDTH;
  cvs.height = RenderConstants.HEIGHT;

  const fallbackContent = document.createElement("p");
  fallbackContent.textContent =
    "Canvas is not supported or disabled in your browser. Please enable it to play the game.";
  cvs.appendChild(fallbackContent);

  gameContainer.appendChild(cvs);
  const ctx = cvs.getContext("2d");
  if (!ctx) {
    throw new Error("Cannot get 2d context for canvas.");
  }
  return ctx;
}

export default function initLayers(gameContainer: HTMLDivElement): Layers {
  return {
    background: createLayer(gameContainer),
    middleground: createLayer(gameContainer),
    foreground: createLayer(gameContainer),
    debug: DEBUG ? createLayer(gameContainer) : null,
  };
}
