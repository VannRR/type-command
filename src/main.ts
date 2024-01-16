import "./style.css";
import Ground from "./ground.ts";
import { Cities } from "./cities.ts";
import Hill from "./hill.ts";
import { Missiles } from "./missiles.ts";
import initLayers from "./initLayers.ts";
import GameState from "./gameState.ts";
import Clock from "./clock.ts";

// Render Constants
export const HEIGHT = window.innerHeight > 360 ? window.innerHeight : 360;
export const WIDTH = Math.floor(HEIGHT * 1.4556);
export const WIDTH_MIDDLE = Math.floor(WIDTH * 0.5);
export const HEIGHT_MIDDLE = Math.floor(HEIGHT * 0.5);
export const PIXEL_SIZE = Math.floor(HEIGHT * 0.00836);
export const PIXEL_SIZE_SMALL = Math.floor(PIXEL_SIZE * 0.75);
export const PIXEL_WIDTH = Math.floor(WIDTH / PIXEL_SIZE);
export const PIXEL_HEIGHT = Math.floor(HEIGHT / PIXEL_SIZE);
export const FPS = 60;
export const MESSAGE_LENGTH = Math.floor(FPS * 8);
export const ANIMATION_SPEED = Math.floor(FPS * 0.25);
export const DEBUG = true;

// Game play Constants
export const MAX_SCORE = 9999999;
export const START_ROUND = 1;
export const ROUND_LENGTH = 15 * FPS;
export const MAX_ROUND = 99999;
export const MIN_DIFFICULTY = 1;
export const MAX_DIFFICULTY = 20;
export const SLOWEST_SPAWN_RATE = 8 * FPS;
export const FASTEST_SPAWN_RATE = Math.floor(1 * FPS);
export const SLOWEST_MISSILE_SPEED = Math.floor(FPS * 0.25);
export const FASTEST_MISSILE_SPEED = Math.floor(FPS * 0.067);

// Calculate increments based on the difference between slowest and fastest rates/speeds
export const SPAWN_INCREMENT =
  (SLOWEST_SPAWN_RATE - FASTEST_SPAWN_RATE) / (MAX_DIFFICULTY - 1);
export const SPEED_INCREMENT =
  (SLOWEST_MISSILE_SPEED - FASTEST_MISSILE_SPEED) / (MAX_DIFFICULTY - 1);

// Canvas layers
const layers = initLayers();

const gameState = new GameState();

// Game objects
const ground = new Ground();
const hill = new Hill();
const cities = new Cities();
const missiles = new Missiles();

// Game loop
const clock = new Clock(() => {
  gameState.advanceFrame(layers, ground, hill, cities, missiles);
}, FPS);
clock.toggle();
