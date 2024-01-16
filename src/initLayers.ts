import { DEBUG, HEIGHT, WIDTH } from "./main.ts";
import { Layer, Layers } from "./types.ts";

function createLayer(appDiv: HTMLDivElement): Layer {
  const cvs = document.createElement("canvas");
  cvs.width = WIDTH;
  cvs.height = HEIGHT;

  const fallbackContent = document.createElement("p");
  fallbackContent.textContent =
    "Canvas is not supported or disabled in your browser. Please enable it to play the game.";
  cvs.appendChild(fallbackContent);

  appDiv.appendChild(cvs);
  const ctx = cvs.getContext("2d");
  if (!ctx) {
    throw new Error("Cannot get 2d context for canvas.");
  }
  return ctx;
}

export default function initLayers(): Layers {
  const appDiv = document.querySelector<HTMLDivElement>("#app");
  if (!appDiv) {
    throw new Error("No div with id 'app' available.");
  }

  return {
    background: createLayer(appDiv),
    city: createLayer(appDiv),
    missile: createLayer(appDiv),
    debug: DEBUG ? createLayer(appDiv) : null,
  };
}
