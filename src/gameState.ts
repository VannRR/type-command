import { Cities } from "./cities";
import drawScore from "./drawScore";
import drawWord from "./drawWord";
import Ground from "./ground";
import Hill from "./hill";
import {
  ANIMATION_SPEED,
  FASTEST_MISSILE_SPEED,
  FASTEST_SPAWN_RATE,
  HEIGHT,
  MAX_DIFFICULTY,
  MAX_ROUND,
  MAX_SCORE,
  WIDTH_MIDDLE,
  MIN_DIFFICULTY,
  PIXEL_HEIGHT,
  PIXEL_SIZE,
  PIXEL_WIDTH,
  ROUND_LENGTH,
  SLOWEST_MISSILE_SPEED,
  SLOWEST_SPAWN_RATE,
  SPAWN_INCREMENT,
  SPEED_INCREMENT,
  START_ROUND,
  WIDTH,
  HEIGHT_MIDDLE,
  MESSAGE_LENGTH,
} from "./main";
import { Missiles } from "./missiles";
import PALETTES from "./palettes";
import { Layer, Layers, Palette } from "./types";

const GRID_SIZE = 6;
const GRID_COLOR = "green";
const INFO_BACKGROUND_COLOR = "black";
const INFO_COLOR = "#aaa";

export default class GameState {
  private round: number;
  private frame: number;
  private difficulty: number;
  private currentPalette: number;
  private backgroundLayerIsDrawn: boolean;
  private missileSpeed: number;
  private spawnRate: number;
  private score: number;
  private gameOver: boolean;
  constructor() {
    this.round = START_ROUND;
    this.frame = 0;
    this.difficulty = MIN_DIFFICULTY;
    this.currentPalette = 0;
    this.backgroundLayerIsDrawn = false;
    this.missileSpeed = SLOWEST_MISSILE_SPEED;
    this.spawnRate = SLOWEST_SPAWN_RATE;
    this.score = 0;
    this.gameOver = false;
  }

  reset(): void {
    this.round = START_ROUND;
    this.frame = 0;
    this.difficulty = MIN_DIFFICULTY;
    this.currentPalette = 0;
    this.backgroundLayerIsDrawn = false;
    this.missileSpeed = SLOWEST_MISSILE_SPEED;
    this.spawnRate = SLOWEST_SPAWN_RATE;
    this.score = 0;
    this.gameOver = false;
  }

  advanceFrame(
    layers: Layers,
    ground: Ground,
    hill: Hill,
    cities: Cities,
    missiles: Missiles
  ): void {
    const palette = this.getCurrentPalette();

    if (this.gameOver) {
      if (this.frame % MESSAGE_LENGTH === 0) {
        this.resetGame(cities, missiles);
      }
    } else if (this.frame === ROUND_LENGTH) {
      this.advanceRound(cities);
      this.frame = 0;
    }
    this.drawBackground(layers.background, ground, hill, palette);
    this.spawnMissiles(missiles);
    this.drawAndMoveMissiles(
      layers.missile,
      ground,
      hill,
      cities,
      missiles,
      palette
    );
    this.drawForeground(layers.city, cities, palette);
    this.drawDebugInfo(layers.debug);
    this.checkGameOver(cities);
    this.increaseScore(10);
    this.frame += 1;
  }

  getCurrentPalette() {
    return PALETTES[this.currentPalette];
  }

  resetGame(cities: Cities, missiles: Missiles) {
    this.reset();
    cities.reset();
    missiles.reset();
  }

  drawBackground(layer: Layer, ground: Ground, hill: Hill, palette: Palette) {
    if (!this.backgroundLayerIsDrawn) {
      layer.fillStyle = palette.background;
      layer.fillRect(0, 0, WIDTH, HEIGHT);
      ground.draw(layer, palette.ground);
      hill.draw(layer, palette.ground);
      this.backgroundLayerIsDrawn = true;
    }
  }

  spawnMissiles(missiles: Missiles) {
    if (this.frame % this.spawnRate === 0) {
      missiles.spawn(this.difficulty);
    }
  }

  drawAndMoveMissiles(
    layer: Layer,
    ground: Ground,
    hill: Hill,
    cities: Cities,
    missiles: Missiles,
    palette: Palette
  ) {
    if (this.frame % this.missileSpeed === 0) {
      missiles.draw(
        layer,
        palette.missileTrail,
        palette.missileHead,
        palette.text
      );
      if (this.gameOver) {
        const message = this.score >= MAX_SCORE ? "MAX SCORE" : "GAME OVER";
        drawWord(
          layer,
          palette.text,
          WIDTH_MIDDLE,
          HEIGHT_MIDDLE,
          PIXEL_SIZE,
          message,
          true
        );
      }
      missiles.checkCollision(ground);
      missiles.checkCollision(hill);
      cities.forEach((city) => {
        missiles.checkCollision(city);
      });
      missiles.move();
    }
  }

  drawForeground(layer: Layer, cities: Cities, palette: Palette) {
    if (this.frame % ANIMATION_SPEED === 0) {
      cities.draw(layer, palette.city, palette.mushroomCloud);
      drawScore(layer, palette.text, this.score);
    }
  }

  checkGameOver(cities: Cities) {
    if (!cities.areAlive() || this.score >= MAX_SCORE) {
      this.gameOver = true;
    }
  }

  increaseScore(value: number) {
    if (this.score < MAX_SCORE) {
      this.score += value;
    } else {
      this.score = MAX_SCORE;
    }
  }

  advanceRound(cities: Cities): void {
    if (this.round >= MAX_ROUND) {
      return;
    }
    this.round += 1;
    if (this.round % 2 == 0) {
      if (this.currentPalette < PALETTES.length - 1) {
        this.currentPalette += 1;
      } else {
        this.currentPalette = 0;
      }
    }
    if (this.difficulty < MAX_DIFFICULTY) {
      cities.queueUpdate();
      this.backgroundLayerIsDrawn = false;
      this.difficulty += 1;
      this.spawnRate = Math.round(
        SLOWEST_SPAWN_RATE - SPAWN_INCREMENT * (this.difficulty - 1)
      );
      this.missileSpeed = Math.round(
        SLOWEST_MISSILE_SPEED - SPEED_INCREMENT * (this.difficulty - 1)
      );
    }
  }

  drawDebugInfo(layer: Layer | null): void {
    if (layer === null) {
      return;
    }
    if (this.frame % ANIMATION_SPEED === 0) {
      const debugInfo = [
        `round: ${this.round} / ${MAX_ROUND}`,
        `frame: ${this.frame} / ${ROUND_LENGTH}`,
        `difficulty: ${this.difficulty} / ${MAX_DIFFICULTY}`,
        `currentPalette: ${this.currentPalette} / ${PALETTES.length - 1}`,
        `backgroundLayerIsDrawn: ${this.backgroundLayerIsDrawn}`,
        `missileSpeed: ${this.missileSpeed} / ${FASTEST_MISSILE_SPEED}`,
        `spawnRate: ${this.spawnRate} / ${FASTEST_SPAWN_RATE}`,
        `score: ${this.score} / ${MAX_SCORE}`,
      ];
      layer.clearRect(0, 0, WIDTH, HEIGHT);
      layer.strokeStyle = GRID_COLOR;
      for (let j = 0; j < PIXEL_HEIGHT; j++) {
        for (let i = 0; i < PIXEL_WIDTH; i++) {
          layer.strokeRect(
            PIXEL_SIZE * GRID_SIZE * i - 3,
            PIXEL_SIZE * GRID_SIZE * j + 1,
            PIXEL_SIZE * GRID_SIZE - 1,
            PIXEL_SIZE * GRID_SIZE - 1
          );
        }
      }
      const fontSize = PIXEL_SIZE * 4;
      layer.font = `${fontSize}px monospace`;
      for (let i = 0; i < debugInfo.length; i++) {
        layer.fillStyle = INFO_BACKGROUND_COLOR;
        layer.fillRect(
          PIXEL_SIZE,
          fontSize * i,
          debugInfo[i].length * Math.floor(fontSize * 0.6),
          fontSize
        );
        layer.fillStyle = INFO_COLOR;
        layer.fillText(debugInfo[i], PIXEL_SIZE, fontSize * i + fontSize);
      }
    }
  }
}
