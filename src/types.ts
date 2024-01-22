import { City } from "./cities";
import { Explosion } from "./explosion";
import Ground from "./ground";
import Hill from "./hill";

export type Option<T> = T | null;

export type Layer = CanvasRenderingContext2D;

export type HexColor = `#${string}`;

export type PixelGrid = number[][];

export type CollisionObject = Ground | Hill | City | Explosion;

export interface Bound {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Vector {
  x: number;
  y: number;
}

export interface Palette {
  background: HexColor;
  ground: HexColor;
  city: HexColor;
  mushroomCloud: HexColor;
  missileTrail: HexColor;
  missileHead: HexColor;
  text: HexColor;
}

export interface Layers {
  background: Layer;
  middleground: Layer;
  foreground: Layer;
  debug: Option<Layer>;
}

export interface GameState {
  round: number;
  frame: number;
  difficulty: number;
  currentPalette: number;
  missileSpeed: number;
  spawnRate: number;
  score: number;
  gameOver: boolean;
  messageShown: boolean;
}
