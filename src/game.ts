import { Cities } from "./cities";
import { drawDebugGrid, drawDebugText } from "./drawDebugInfo";
import drawScore from "./drawScore";
import { drawWord } from "./drawWord";
import { Explosions } from "./explosion";
import Ground from "./ground";
import Hill from "./hill";
import initLayers from "./initLayers";
import { RenderConstants, GameplayConstants } from "./main";
import { Missiles } from "./missiles";
import PALETTES from "./palettes";
import Player from "./player";
import { Layers, Palette, Option, GameState } from "./types";

export default class Game {
  private ground = new Ground();
  private hill = new Hill();
  private cities = new Cities();
  private missiles = new Missiles();
  private explosions = new Explosions();
  private layers: Layers;
  private player: Player;

  public readonly state: GameState = {
    round: GameplayConstants.MIN_DIFFICULTY_AND_ROUND,
    frame: 0,
    difficulty: GameplayConstants.MIN_DIFFICULTY_AND_ROUND,
    currentPalette: 0,
    missileSpeed: GameplayConstants.SLOWEST_MISSILE_SPEED,
    spawnRate: GameplayConstants.SLOWEST_SPAWN_RATE,
    score: 0,
    gameOver: false,
    messageShown: false,
  };

  constructor(appDiv: HTMLDivElement) {
    this.layers = initLayers(appDiv);
    this.player = new Player(appDiv);
  }

  private getCurrentPalette(): Palette {
    return PALETTES[this.state.currentPalette];
  }

  public resetGame(): void {
    this.state.round = GameplayConstants.MIN_DIFFICULTY_AND_ROUND;
    this.state.frame = 0;
    this.state.difficulty = GameplayConstants.MIN_DIFFICULTY_AND_ROUND;
    this.state.currentPalette = 0;
    this.state.missileSpeed = GameplayConstants.SLOWEST_MISSILE_SPEED;
    this.state.spawnRate = GameplayConstants.SLOWEST_SPAWN_RATE;
    this.state.score = 0;
    this.state.gameOver = false;
    this.state.messageShown = false;
    this.layers.foreground.clearRect(
      0,
      0,
      RenderConstants.WIDTH,
      RenderConstants.HEIGHT
    );
    this.cities.reset();
    this.missiles.reset();
  }

  private advanceRound(): void {
    if (this.state.round >= GameplayConstants.MAX_ROUND) {
      return;
    }
    this.state.round += 1;
    if ((this.state.round - 1) % 2 == 0) {
      if (this.state.currentPalette < PALETTES.length - 1) {
        this.state.currentPalette += 1;
      } else {
        this.state.currentPalette = 0;
      }
    }
    this.player.queueUpdate();
    this.cities.queueUpdate();
    if (this.state.difficulty < GameplayConstants.MAX_DIFFICULTY) {
      this.state.difficulty += 1;
      this.state.spawnRate = Math.round(
        GameplayConstants.SLOWEST_SPAWN_RATE -
          GameplayConstants.SPAWN_INCREMENT * (this.state.difficulty - 1)
      );
      this.state.missileSpeed = Math.round(
        GameplayConstants.SLOWEST_MISSILE_SPEED -
          GameplayConstants.SPEED_INCREMENT * (this.state.difficulty - 1)
      );
    }
  }

  private setDifficulty() {
    const difficulty = this.player.getDifficulty();
    if (difficulty === null) {
      return;
    }

    this.resetGame();
    for (let i = 0; i < difficulty; i++) {
      this.advanceRound();
    }
  }

  private drawBackground(palette: Palette): void {
    if (this.state.frame === 0) {
      this.layers.background.fillStyle = palette.background;
      this.layers.background.fillRect(
        0,
        0,
        RenderConstants.WIDTH,
        RenderConstants.HEIGHT
      );
      this.ground.draw(this.layers.background, palette.ground);
      this.hill.draw(this.layers.background, palette.ground);
    }
  }

  private spawnMissiles(): void {
    if (this.state.frame % this.state.spawnRate === 0) {
      this.missiles.spawn(this.state.difficulty);
    }
  }

  private drawMiddleground(palette: Palette): void {
    if (this.state.frame % this.state.missileSpeed === 0) {
      this.missiles.draw(
        this.layers.middleground,
        palette.missileTrail,
        palette.missileHead,
        palette.text
      );
      this.player.drawTurret(
        this.layers.middleground,
        palette.text,
        palette.missileHead
      );

      const words = this.missiles.getWords();
      const matchIndex = this.player.getCurrentMatch(words);
      const coords = this.missiles.getCoordsByIndex(matchIndex);
      this.player.drawCrossHair(
        this.layers.middleground,
        coords,
        palette.text,
        palette.missileHead
      );

      this.missiles.checkCollision(this.ground);
      this.missiles.checkCollision(this.hill);
      this.cities.forEach((city) => {
        this.missiles.checkCollision(city);
      });
      this.explosions.forEach((explosion) => {
        this.missiles.checkCollision(explosion);
      });
      this.missiles.move();
    }
  }

  private drawForeground(palette: Palette): void {
    this.player.drawInput(
      this.layers.foreground,
      palette.background,
      palette.text
    );
    if (this.state.frame % RenderConstants.ANIMATION_SPEED === 0) {
      this.player.advance();
      this.cities.draw(
        this.layers.foreground,
        palette.city,
        palette.mushroomCloud
      );
      this.explosions.draw(
        this.layers.foreground,
        palette.mushroomCloud,
        palette.missileHead
      );
      drawScore(this.layers.foreground, palette.text, this.state.score);
    }
    if (this.state.gameOver && this.state.messageShown === false) {
      const message =
        this.state.score >= GameplayConstants.MAX_SCORE
          ? "MAX SCORE"
          : "GAME OVER";
      drawWord(
        this.layers.foreground,
        null,
        palette.text,
        { x: RenderConstants.WIDTH_MIDDLE, y: RenderConstants.HEIGHT_MIDDLE },
        RenderConstants.PIXEL_SIZE,
        message
      );
      this.state.messageShown = true;
    }
  }

  private drawDebug() {
    if (this.layers.debug === null) {
      return;
    }
    if (this.state.frame % RenderConstants.ANIMATION_SPEED === 0) {
      this.layers.debug.clearRect(
        0,
        0,
        RenderConstants.WIDTH,
        RenderConstants.HEIGHT
      );
      drawDebugGrid(this.layers.debug);
      drawDebugText(this.layers.debug, this.state);
    }
  }

  private increaseScore(multiplier: Option<number>): void {
    if (
      multiplier === null ||
      this.state.score === GameplayConstants.MAX_SCORE
    ) {
      return;
    }
    const pendingScore =
      this.state.score + GameplayConstants.BASE_SCORE_INCREMENT * multiplier;
    if (pendingScore < GameplayConstants.MAX_SCORE) {
      this.state.score = pendingScore;
    } else {
      this.state.score = GameplayConstants.MAX_SCORE;
    }
  }

  private checkGameOver(): void {
    if (
      this.cities.areStanding() === false ||
      this.state.score >= GameplayConstants.MAX_SCORE
    ) {
      this.state.gameOver = true;
    }
  }

  public advanceFrame(): void {
    if (this.state.gameOver === true) {
      if (this.state.frame % RenderConstants.MESSAGE_LENGTH === 0) {
        this.resetGame();
      }
    } else if (this.state.frame === GameplayConstants.ROUND_LENGTH) {
      this.advanceRound();
      this.state.frame = 0;
    }

    this.setDifficulty();

    const palette = this.getCurrentPalette();

    this.spawnMissiles();

    this.drawBackground(palette);
    this.drawMiddleground(palette);
    this.drawForeground(palette);
    this.drawDebug();

    const submittedInput = this.player.getSubmittedInput();
    const { coords, multiplier } = this.missiles.destroy(submittedInput);
    this.explosions.spawn(coords);
    this.increaseScore(multiplier);

    this.checkGameOver();
    this.state.frame += 1;
  }
}
