import { City } from "./cities.ts";
import Ground from "./ground.ts";
import Hill from "./hill.ts";
import { drawWord } from "./drawWord.ts";
import {
  HEIGHT,
  PIXEL_SIZE,
  PIXEL_SIZE_SMALL,
  PIXEL_WIDTH,
  WIDTH,
} from "./main.ts";
import WORDS from "./words.json";
import { HexColor, Layer, Vector } from "./types.ts";

const INITIAL_Y = 14;
const PIXEL_GAP_MISSLE_TO_WORD = 18;
const PIXEL_GAP_MISSLE_TO_TRAIL = 3;
const ANGLED_MISSILE_ABS_COS = 0.23;

function generateRandomVector(x: number): Vector {
  const angle = (Math.random() * Math.PI) / 2 - Math.PI / 4 - 0.5 * Math.PI;
  const vecY = -Math.sin(angle);
  let vecX = Math.cos(angle);

  if (
    vecX * 25 * PIXEL_SIZE + x > PIXEL_WIDTH ||
    vecX * 25 * PIXEL_SIZE + x < 0
  ) {
    vecX = -vecX;
  }
  return {
    x: Math.abs(vecX) >= 0.01 ? vecX : 0,
    y: Math.abs(vecY) >= 0.01 ? vecY : 0,
  };
}

function getRandomWord(difficulty: number): string {
  let charCount = difficulty - 1;
  for (let i = charCount; i >= 0; i--) {
    if (Math.random() > 0.5) {
      break;
    }
    charCount = i;
  }
  if (charCount > WORDS.length - 1) {
    charCount = WORDS.length - 1;
  }
  const currentWords = WORDS[charCount];
  const randomWordIndex = Math.floor(Math.random() * currentWords.length);
  return currentWords[randomWordIndex].toUpperCase();
}

export default class Missile {
  private movementVector: Vector;
  private coords: Vector;
  private trail: Vector[];
  private word: string;
  width: number;
  height: number;
  movementBuffer: Vector;

  constructor(
    x: number,
    y: number,
    movementVector: Vector,
    difficulty: number
  ) {
    this.coords = {
      x: x * PIXEL_SIZE,
      y: y * PIXEL_SIZE,
    };
    this.width = PIXEL_SIZE;
    this.height = PIXEL_SIZE;
    this.movementBuffer = { x: 0, y: 0 };
    this.movementVector = movementVector;
    this.trail = [];
    this.word = getRandomWord(difficulty);
  }

  getWord(): string {
    return this.word;
  }

  move(): void {
    this.movementBuffer.x += this.movementVector.x;
    this.movementBuffer.y += this.movementVector.y;
    if (Math.abs(this.movementBuffer.x) >= 1) {
      this.coords.x += this.movementVector.x > 0 ? this.width : -this.width;
      this.movementBuffer.x = 0;
    }
    if (Math.abs(this.movementBuffer.y) >= 1) {
      this.coords.y += this.height;
      this.movementBuffer.y = 0;
    }
  }

  draw(
    layer: Layer,
    missileTrailColor: HexColor,
    missileHeadColor: HexColor,
    textColor: HexColor
  ): void {
    layer.fillStyle = missileTrailColor;
    this.trail.push({ x: this.coords.x, y: this.coords.y });
    for (let i = this.trail.length - PIXEL_GAP_MISSLE_TO_TRAIL; i > 0; i--) {
      const prev = this.trail[i];
      layer.fillRect(prev.x, prev.y, this.width, this.height);
      if (i === this.trail.length - PIXEL_GAP_MISSLE_TO_WORD) {
        drawWord(
          layer,
          null,
          textColor,
          prev.x,
          prev.y,
          PIXEL_SIZE_SMALL,
          this.word
        );
        layer.fillStyle = missileTrailColor;
      }
    }
    layer.fillStyle = missileHeadColor;
    let missileBackX = this.coords.x;
    if (this.movementVector.x <= -ANGLED_MISSILE_ABS_COS) {
      missileBackX += this.width;
    } else if (this.movementVector.x >= ANGLED_MISSILE_ABS_COS) {
      missileBackX -= this.width;
    }
    layer.fillRect(
      missileBackX,
      this.coords.y - this.height,
      this.width,
      this.height
    );
    layer.fillRect(this.coords.x, this.coords.y, this.width, this.height);
  }

  checkCollision(other: Ground | Hill | City): boolean {
    if (this.coords.y > HEIGHT) {
      return true;
    }
    const otherBounds = other.getBounds();
    if (otherBounds === null) {
      return false;
    }
    let collided = false;

    otherBounds.forEach((otherBound) => {
      const isColliding =
        this.coords.x < otherBound.x + otherBound.width &&
        this.coords.x + this.width > otherBound.x &&
        this.coords.y < otherBound.y + otherBound.height &&
        this.coords.y + this.height > otherBound.y;
      if (isColliding) {
        other.setCollision();
        collided = true;
      }
    });

    return collided;
  }
}

export class Missiles {
  private all: Missile[];
  constructor() {
    this.all = [];
  }

  spawn(difficulty: number): void {
    const min = PIXEL_WIDTH * 0.1;
    const max = PIXEL_WIDTH * 0.9;
    const x = Math.floor(Math.random() * (max - min) + min);
    const y = INITIAL_Y;
    const movementVector = generateRandomVector(x);
    this.all.push(new Missile(x, y, movementVector, difficulty));
  }

  move(): void {
    for (const missile of this.all) {
      missile.move();
    }
  }

  getAll(): Missile[] {
    return this.all;
  }

  remove(index: number): void {
    this.all.splice(index, 1);
  }

  reset(): void {
    this.all = [];
  }

  draw(
    layer: Layer,
    missileTrailColor: HexColor,
    missileHeadColor: HexColor,
    textColor: HexColor
  ): void {
    layer.clearRect(0, 0, WIDTH, HEIGHT);
    this.all.forEach((missile) => {
      missile.draw(layer, missileTrailColor, missileHeadColor, textColor);
    });
  }

  checkCollision(other: Ground | Hill | City): void {
    const survivingMissiles: Missile[] = [];
    for (const missile of this.all) {
      if (!missile.checkCollision(other)) {
        survivingMissiles.push(missile);
      }
    }
    this.all = survivingMissiles;
  }
}
