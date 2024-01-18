import { Cities } from "./cities";
import drawScore from "./drawScore";
import { drawWord } from "./drawWord";
import { Explosions } from "./explosion";
import Ground from "./ground";
import Hill from "./hill";
import { RenderConstants, GameplayConstants } from "./main";
import { Missiles } from "./missiles";
import PALETTES from "./palettes";
import Player from "./player";
import { Layer, Layers, Palette, Option } from "./types";

const GRID_SIZE = 6;
const GRID_COLOR = "green";
const INFO_BACKGROUND_COLOR = "#00000099";
const INFO_COLOR = "#aaa";

export default class GameState {
  private round: number = GameplayConstants.START_ROUND;
  private frame: number = 0;
  private difficulty: number = GameplayConstants.MIN_DIFFICULTY;
  private currentPalette: number = 0;
  private missileSpeed: number = GameplayConstants.SLOWEST_MISSILE_SPEED;
  private spawnRate: number = GameplayConstants.SLOWEST_SPAWN_RATE;
  private score: number = 0;
  private gameOver: boolean = false;
  private messageShown: boolean = false;

  constructor() {}

  getCurrentPalette(): Palette {
    return PALETTES[this.currentPalette];
  }

  resetGame(layers: Layers, cities: Cities, missiles: Missiles): void {
    this.round = GameplayConstants.START_ROUND;
    this.frame = 0;
    this.difficulty = GameplayConstants.MIN_DIFFICULTY;
    this.currentPalette = 0;
    this.missileSpeed = GameplayConstants.SLOWEST_MISSILE_SPEED;
    this.spawnRate = GameplayConstants.SLOWEST_SPAWN_RATE;
    this.score = 0;
    this.gameOver = false;
    this.messageShown = false;
    layers.foreground.clearRect(
      0,
      0,
      RenderConstants.WIDTH,
      RenderConstants.HEIGHT
    );
    cities.reset();
    missiles.reset();
  }

  advanceRound(player: Player, cities: Cities): void {
    if (this.round >= GameplayConstants.MAX_ROUND) {
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
    if (this.difficulty < GameplayConstants.MAX_DIFFICULTY) {
      this.difficulty += 1;
      this.spawnRate = Math.round(
        GameplayConstants.SLOWEST_SPAWN_RATE -
          GameplayConstants.SPAWN_INCREMENT * (this.difficulty - 1)
      );
      this.missileSpeed = Math.round(
        GameplayConstants.SLOWEST_MISSILE_SPEED -
          GameplayConstants.SPEED_INCREMENT * (this.difficulty - 1)
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
      layer.fillRect(0, 0, RenderConstants.WIDTH, RenderConstants.HEIGHT);
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
    explosions: Explosions,
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
      explosions.forEach((explosion) => {
        missiles.checkCollision(explosion);
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
    if (this.frame % RenderConstants.ANIMATION_SPEED === 0) {
      cities.draw(layer, palette.city, palette.mushroomCloud);
      drawScore(layer, palette.text, this.score);
    }
    if (this.gameOver && this.messageShown === false) {
      const message =
        this.score >= GameplayConstants.MAX_SCORE ? "MAX SCORE" : "GAME OVER";
      drawWord(
        layer,
        null,
        palette.text,
        { x: RenderConstants.WIDTH_MIDDLE, y: RenderConstants.HEIGHT_MIDDLE },
        RenderConstants.PIXEL_SIZE,
        message
      );
      this.messageShown = true;
    }
  }

  increaseScore(multiplier: number): void {
    if (this.score === GameplayConstants.MAX_SCORE) {
      return;
    }
    const pendingScore =
      this.score + GameplayConstants.BASE_SCORE_INCREMENT * multiplier;
    if (pendingScore < GameplayConstants.MAX_SCORE) {
      this.score = pendingScore;
    } else {
      this.score = GameplayConstants.MAX_SCORE;
    }
  }

  drawAndTargetPlayer(
    layers: Layers,
    player: Player,
    missiles: Missiles,
    explosions: Explosions,
    palette: Palette
  ): void {
    if (this.frame % this.missileSpeed === 0) {
      player.drawCrossHair(
        layers.missile,
        missiles,
        palette.text,
        palette.missileHead
      );
      explosions.draw(
        layers.missile,
        palette.mushroomCloud,
        palette.missileHead
      );
    }
    if (this.frame % RenderConstants.ANIMATION_SPEED === 0) {
      player.drawTurret(layers.foreground, palette.text, palette.missileHead);
      player.advance();
      explosions.advance();
    }
    const multiplier = player.target(missiles, explosions);
    if (multiplier !== null) {
      this.increaseScore(multiplier);
    }
  }

  drawDebugInfo(layer: Option<Layer>): void {
    if (layer === null) {
      return;
    }
    if (this.frame % RenderConstants.ANIMATION_SPEED === 0) {
      const debugInfo = [
        `round: ${this.round} / ${GameplayConstants.MAX_ROUND}`,
        `frame: ${this.frame} / ${GameplayConstants.ROUND_LENGTH}`,
        `difficulty: ${this.difficulty} / ${GameplayConstants.MAX_DIFFICULTY}`,
        `currentPalette: ${this.currentPalette} / ${PALETTES.length - 1}`,
        `missileSpeed: ${this.missileSpeed} / ${GameplayConstants.FASTEST_MISSILE_SPEED}`,
        `spawnRate: ${this.spawnRate} / ${GameplayConstants.FASTEST_SPAWN_RATE}`,
        `score: ${this.score} / ${GameplayConstants.MAX_SCORE}`,
      ];
      layer.clearRect(0, 0, RenderConstants.WIDTH, RenderConstants.HEIGHT);
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
  }

  checkGameOver(cities: Cities): void {
    if (
      cities.areStanding() === false ||
      this.score >= GameplayConstants.MAX_SCORE
    ) {
      this.gameOver = true;
    }
  }

  advanceFrame(
    layers: Layers,
    player: Player,
    ground: Ground,
    hill: Hill,
    cities: Cities,
    missiles: Missiles,
    explosions: Explosions
  ): void {
    if (this.gameOver) {
      if (this.frame % RenderConstants.MESSAGE_LENGTH === 0) {
        this.resetGame(layers, cities, missiles);
      }
    } else if (this.frame === GameplayConstants.ROUND_LENGTH) {
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
      explosions,
      palette
    );
    this.drawForeground(layers.foreground, player, cities, palette);
    this.drawAndTargetPlayer(layers, player, missiles, explosions, palette);
    this.drawDebugInfo(layers.debug);
    this.checkGameOver(cities);
    this.frame += 1;
  }
}
