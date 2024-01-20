import "./style.css";
import Ground from "./ground.ts";
import { Cities } from "./cities.ts";
import Hill from "./hill.ts";
import { Missiles } from "./missiles.ts";
import initLayers from "./initLayers.ts";
import GameState from "./gameState.ts";
import Clock from "./clock.ts";
import Player from "./player.ts";
import { Explosions } from "./explosion.ts";

export const DEBUG = false;

export enum RenderConstants {
  HEIGHT = window.innerHeight > 360 ? window.innerHeight : 360,
  WIDTH = Math.floor(HEIGHT * 1.4556),
  WIDTH_MIDDLE = Math.floor(WIDTH * 0.5),
  HEIGHT_MIDDLE = Math.floor(HEIGHT * 0.5),
  PIXEL_SIZE = Math.floor(HEIGHT * 0.00836),
  PIXEL_SIZE_SMALL = Math.floor(PIXEL_SIZE * 0.75),
  PIXEL_WIDTH = Math.floor(WIDTH / PIXEL_SIZE),
  PIXEL_HEIGHT = Math.floor(HEIGHT / PIXEL_SIZE),
  FPS = 60,
  MESSAGE_LENGTH = Math.floor(FPS * 8),
  ANIMATION_SPEED = Math.floor(FPS * 0.25),
}

export enum GameplayConstants {
  MAX_SCORE = 9999999,
  BASE_SCORE_INCREMENT = 100,
  MAX_ROUND = 99999,
  ROUND_LENGTH = 60 * RenderConstants.FPS,
  MIN_DIFFICULTY_AND_ROUND = 1,
  MAX_DIFFICULTY = 20,
  SLOWEST_SPAWN_RATE = 8 * RenderConstants.FPS,
  FASTEST_SPAWN_RATE = Math.floor(1 * RenderConstants.FPS),
  SLOWEST_MISSILE_SPEED = Math.floor(RenderConstants.FPS * 0.25),
  FASTEST_MISSILE_SPEED = Math.floor(RenderConstants.FPS * 0.067),
  SPAWN_INCREMENT = (SLOWEST_SPAWN_RATE - FASTEST_SPAWN_RATE) /
    (MAX_DIFFICULTY - 1),
  SPEED_INCREMENT = (SLOWEST_MISSILE_SPEED - FASTEST_MISSILE_SPEED) /
    (MAX_DIFFICULTY - 1),
}

const appDiv = document.querySelector<HTMLDivElement>("#app");
if (!appDiv) {
  throw new Error("No div with id 'app' available.");
}
appDiv.focus();

const layers = initLayers(appDiv);

const gameState = new GameState();

// Game objects
const player = new Player(appDiv);
const ground = new Ground();
const hill = new Hill();
const cities = new Cities();
const missiles = new Missiles();
const explosions = new Explosions();

// Game loop
const clock = new Clock(() => {
  gameState.advanceFrame(
    layers,
    player,
    ground,
    hill,
    cities,
    missiles,
    explosions,
  );
}, RenderConstants.FPS);
clock.start();
