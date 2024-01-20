import { Cities } from "./cities";
import { drawDebugGrid, drawDebugText } from "./drawDebugInfo";
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

export default class GameState {
  private round = GameplayConstants.MIN_DIFFICULTY_AND_ROUND;
  private frame = 0;
  private difficulty = GameplayConstants.MIN_DIFFICULTY_AND_ROUND;
  private currentPalette = 0;
  private missileSpeed = GameplayConstants.SLOWEST_MISSILE_SPEED;
  private spawnRate = GameplayConstants.SLOWEST_SPAWN_RATE;
  private score = 0;
  private gameOver = false;
  private messageShown = false;

  private getCurrentPalette(): Palette {
    return PALETTES[this.currentPalette];
  }

  private resetGame(layers: Layers, cities: Cities, missiles: Missiles): void {
    this.round = GameplayConstants.MIN_DIFFICULTY_AND_ROUND;
    this.frame = 0;
    this.difficulty = GameplayConstants.MIN_DIFFICULTY_AND_ROUND;
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

  private advanceRound(player: Player, cities: Cities): void {
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

  private drawBackground(
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

  private spawnMissiles(missiles: Missiles): void {
    if (this.frame % this.spawnRate === 0) {
      missiles.spawn(this.difficulty);
    }
  }

  private drawMiddleground(
    layer: Layer,
    ground: Ground,
    hill: Hill,
    player: Player,
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
      player.drawTurret(layer, palette.text, palette.missileHead);
      player.drawCrossHair(layer, missiles, palette.text, palette.missileHead);
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

  private drawForeground(
    layer: Layer,
    player: Player,
    cities: Cities,
    explosions: Explosions,
    palette: Palette
  ): void {
    player.drawInput(layer, palette.background, palette.text);
    if (this.frame % RenderConstants.ANIMATION_SPEED === 0) {
      player.advance();
      cities.draw(layer, palette.city, palette.mushroomCloud);
      explosions.draw(layer, palette.mushroomCloud, palette.missileHead);
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

  private drawDebug(layer: Option<Layer>) {
    if (layer === null) {
      return;
    }
    if (this.frame % RenderConstants.ANIMATION_SPEED === 0) {
      layer.clearRect(0, 0, RenderConstants.WIDTH, RenderConstants.HEIGHT);
      drawDebugGrid(layer);
      drawDebugText(layer, {
        round: this.round,
        frame: this.frame,
        difficulty: this.difficulty,
        currentPalette: this.currentPalette,
        missileSpeed: this.missileSpeed,
        spawnRate: this.spawnRate,
        score: this.score,
      });
    }
  }

  private increaseScore(multiplier: Option<number>): void {
    if (multiplier === null || this.score === GameplayConstants.MAX_SCORE) {
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

  private checkGameOver(cities: Cities): void {
    if (
      cities.areStanding() === false ||
      this.score >= GameplayConstants.MAX_SCORE
    ) {
      this.gameOver = true;
    }
  }

  public advanceFrame(
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
    this.drawMiddleground(
      layers.middleground,
      ground,
      hill,
      player,
      cities,
      missiles,
      explosions,
      palette
    );
    this.drawForeground(layers.foreground, player, cities, explosions, palette);
    this.drawDebug(layers.debug);
    const multiplier = player.target(missiles, explosions);
    this.increaseScore(multiplier);
    this.checkGameOver(cities);
    this.frame += 1;
  }
}
