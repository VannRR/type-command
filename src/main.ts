import "./style.css";
import Game from "./game.ts";
import Clock from "./clock.ts";
import Sound from "./sound.ts";

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
  MAX_MISSILES_AND_EXPLOSIONS = 99,
  MAX_SCORE = 9999999,
  BASE_SCORE_INCREMENT = 100,
  MAX_ROUND = 99999,
  ROUND_LENGTH = 60 * RenderConstants.FPS,
  MIN_DIFFICULTY_AND_ROUND = 1,
  MAX_DIFFICULTY = 20,
  SLOWEST_SPAWN_RATE = Math.floor(5.8 * RenderConstants.FPS),
  FASTEST_SPAWN_RATE = Math.floor(2.2 * RenderConstants.FPS),
  SLOWEST_MISSILE_SPEED = Math.floor(RenderConstants.FPS * 0.25),
  FASTEST_MISSILE_SPEED = Math.floor(RenderConstants.FPS * 0.06),
  SPAWN_INCREMENT = (SLOWEST_SPAWN_RATE - FASTEST_SPAWN_RATE) /
    (MAX_DIFFICULTY - 1),
  SPEED_INCREMENT = (SLOWEST_MISSILE_SPEED - FASTEST_MISSILE_SPEED) /
    (MAX_DIFFICULTY - 1),
}

const gameContainer = document.querySelector<HTMLDivElement>(
  "#game-container-f5a43037"
);
if (!gameContainer) {
  throw new Error("No div with id 'game-container-f5a43037' available.");
}
gameContainer.style.width = `${RenderConstants.WIDTH}px`;
gameContainer.style.height = `${RenderConstants.HEIGHT}px`;

const startButton = document.createElement("button");
startButton.innerText = "Start Game";
startButton.id = "start-button-946738bc";
gameContainer.appendChild(startButton);

startButton.onclick = async () => {
  gameContainer.focus();
  gameContainer.removeChild(startButton);

  const sound = new Sound();
  await sound.init();

  const game = new Game(gameContainer, sound);
  game.resetGame();

  const clock = new Clock(() => {
    game.advanceFrame();
  }, RenderConstants.FPS);
  clock.start();
};
