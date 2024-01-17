import { Cities } from "./cities";
import drawScore from "./drawScore";
import { drawWord } from "./drawWord";
import Ground from "./ground";
import Hill from "./hill";
import {
  ANIMATION_SPEED,
  BASE_SCORE_INCREMENT,
  FASTEST_MISSILE_SPEED,
  FASTEST_SPAWN_RATE,
  HEIGHT,
  MAX_DIFFICULTY,
  MAX_ROUND,
  MAX_SCORE,
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
  MESSAGE_LENGTH,
  WIDTH_MIDDLE,
  HEIGHT_MIDDLE,
} from "./main";
import { Missiles } from "./missiles";
import PALETTES from "./palettes";
import Player from "./player";
import { Layer, Layers, Palette } from "./types";

const GRID_SIZE = 6;
const GRID_COLOR = "green";
const INFO_BACKGROUND_COLOR = "#00000099";
const INFO_COLOR = "#aaa";

export default class GameState {
  private round: number;
  private frame: number;
  private difficulty: number;
  private currentPalette: number;
  private missileSpeed: number;
  private spawnRate: number;
  private score: number;
  private gameOver: boolean;
  private messageShown: boolean;
  constructor() {
    this.round = START_ROUND;
    this.frame = 0;
    this.difficulty = MIN_DIFFICULTY;
    this.currentPalette = 0;
    this.missileSpeed = SLOWEST_MISSILE_SPEED;
    this.spawnRate = SLOWEST_SPAWN_RATE;
    this.score = 0;
    this.gameOver = false;
    this.messageShown = false;
  }

  getCurrentPalette(): Palette {
    return PALETTES[this.currentPalette];
  }

  resetGame(layers: Layers, cities: Cities, missiles: Missiles): void {
    this.round = START_ROUND;
    this.frame = 0;
    this.difficulty = MIN_DIFFICULTY;
    this.currentPalette = 0;
    this.missileSpeed = SLOWEST_MISSILE_SPEED;
    this.spawnRate = SLOWEST_SPAWN_RATE;
    this.score = 0;
    this.gameOver = false;
    this.messageShown = false;
    layers.foreground.clearRect(0, 0, WIDTH, HEIGHT);
    cities.reset();
    missiles.reset();
  }

  advanceRound(player: Player, cities: Cities): void {
    if (this.round >= MAX_ROUND) {
      return;
    }
    this.round += 1;
    if ((this.round - 1) % 2 == 0) {
      if (this.currentPalette < PALETTES.length - 1) {
        this.currentPalette += 1;
      } else {
        this.currentPalette = 0;
      }
    }
    player.queueUpdate();
    cities.queueUpdate();
    if (this.difficulty < MAX_DIFFICULTY) {
      this.difficulty += 1;
      this.spawnRate = Math.round(
        SLOWEST_SPAWN_RATE - SPAWN_INCREMENT * (this.difficulty - 1)
      );
      this.missileSpeed = Math.round(
        SLOWEST_MISSILE_SPEED - SPEED_INCREMENT * (this.difficulty - 1)
      );
    }
  }

  drawBackground(
    layer: Layer,
    ground: Ground,
    hill: Hill,
    palette: Palette
  ): void {
    if (this.frame === 0) {
      layer.fillStyle = palette.background;
      layer.fillRect(0, 0, WIDTH, HEIGHT);
      ground.draw(layer, palette.ground);
      hill.draw(layer, palette.ground);
    }
  }

  spawnMissiles(missiles: Missiles): void {
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
  ): void {
    if (this.frame % this.missileSpeed === 0) {
      missiles.draw(
        layer,
        palette.missileTrail,
        palette.missileHead,
        palette.text
      );
      missiles.checkCollision(ground);
      missiles.checkCollision(hill);
      cities.forEach((city) => {
        missiles.checkCollision(city);
      });
      missiles.move();
    }
  }

  drawForeground(
    layer: Layer,
    player: Player,
    cities: Cities,
    palette: Palette
  ): void {
    player.drawInput(layer, palette.background, palette.text);
    if (this.frame % ANIMATION_SPEED === 0) {
      cities.draw(layer, palette.city, palette.mushroomCloud);
      drawScore(layer, palette.text, this.score);
    }
    if (this.gameOver && this.messageShown === false) {
      const message = this.score >= MAX_SCORE ? "MAX SCORE" : "GAME OVER";
      drawWord(
        layer,
        null,
        palette.text,
        WIDTH_MIDDLE,
        HEIGHT_MIDDLE,
        PIXEL_SIZE,
        message
      );
      this.messageShown = true;
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

  checkGameOver(cities: Cities): void {
    if (!cities.areAlive() || this.score >= MAX_SCORE) {
      this.gameOver = true;
    }
  }

  increaseScore(multiplier: number | null): void {
    if (multiplier === null || this.score === MAX_SCORE) {
      return;
    }
    let pendingScore = this.score + (BASE_SCORE_INCREMENT * multiplier);
    if (pendingScore < MAX_SCORE) {
      this.score = pendingScore;
    } else {
      this.score = MAX_SCORE;
    }
  }

  advanceFrame(
    layers: Layers,
    player: Player,
    ground: Ground,
    hill: Hill,
    cities: Cities,
    missiles: Missiles
  ): void {
    if (this.gameOver) {
      if (this.frame % MESSAGE_LENGTH === 0) {
        this.resetGame(layers, cities, missiles);
      }
    } else if (this.frame === ROUND_LENGTH) {
      this.advanceRound(player, cities);
      this.frame = 0;
    }
    const palette = this.getCurrentPalette();

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
    this.drawForeground(layers.foreground, player, cities, palette);
    const multiplier = player.match(missiles);
    this.drawDebugInfo(layers.debug);
    this.checkGameOver(cities);
    this.increaseScore(multiplier);
    this.frame += 1;
  }
}
