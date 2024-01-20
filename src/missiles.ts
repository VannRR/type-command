import { drawWord } from "./drawWord.ts";
import { RenderConstants } from "./main.ts";
import { CollisionObject, HexColor, Layer, Vector } from "./types.ts";
import { generateRandomVector, getRandomWord } from "./utility.ts";

enum MissileConstants {
  INITIAL_Y = 14,
  PIXEL_GAP_TO_WORD = 18,
  PIXEL_GAP_TO_TRAIL = 3,
  ANGLED_ABS_COS = 0.23,
}

export default class Missile {
  private readonly width: number = RenderConstants.PIXEL_SIZE;
  private readonly height: number = RenderConstants.PIXEL_SIZE;
  private readonly trail: Vector[] = [];
  private movementBuffer: Vector = { x: 0, y: 0 };
  private movementVector: Vector;
  private coords: Vector;
  private word: string;

  constructor(
    x: number,
    y: number,
    movementVector: Vector,
    difficulty: number
  ) {
    this.coords = {
      x: x * RenderConstants.PIXEL_SIZE,
      y: y * RenderConstants.PIXEL_SIZE,
    };
    this.movementVector = movementVector;
    this.word = getRandomWord(difficulty);
  }

  public getCoords(): Vector {
    return this.coords;
  }

  public getWord(): string {
    return this.word;
  }

  public move(): void {
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

  public draw(
    layer: Layer,
    missileTrailColor: HexColor,
    missileHeadColor: HexColor,
    textColor: HexColor
  ): void {
    layer.fillStyle = missileTrailColor;
    this.trail.push({ x: this.coords.x, y: this.coords.y });
    for (
      let i = this.trail.length - MissileConstants.PIXEL_GAP_TO_TRAIL;
      i > 0;
      i--
    ) {
      const prev = this.trail[i];
      layer.fillRect(prev.x, prev.y, this.width, this.height);
    }
    const wordCoords =
      this.trail[this.trail.length - MissileConstants.PIXEL_GAP_TO_WORD];
    if (wordCoords) {
      drawWord(
        layer,
        null,
        textColor,
        wordCoords,
        RenderConstants.PIXEL_SIZE_SMALL,
        this.word
      );
    }
    layer.fillStyle = missileHeadColor;
    let missileBackX = this.coords.x;
    if (this.movementVector.x <= -MissileConstants.ANGLED_ABS_COS) {
      missileBackX += this.width;
    } else if (this.movementVector.x >= MissileConstants.ANGLED_ABS_COS) {
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

  public checkCollision(other: CollisionObject): boolean {
    if (this.coords.y > RenderConstants.HEIGHT) {
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
  private all: Missile[] = [];

  public spawn(difficulty: number): void {
    const min = RenderConstants.PIXEL_WIDTH * 0.1;
    const max = RenderConstants.PIXEL_WIDTH * 0.9;
    const x = Math.floor(Math.random() * (max - min) + min);
    const y = MissileConstants.INITIAL_Y;
    const movementVector = generateRandomVector({ x, y });
    this.all.push(new Missile(x, y, movementVector, difficulty));
  }

  public move(): void {
    for (const missile of this.all) {
      missile.move();
    }
  }

  public getCoordsByIndex(index: number): Vector {
    return this.all[index].getCoords();
  }

  public getWords(): string[] {
    const words = [];
    for (const missile of this.all) {
      words.push(missile.getWord());
    }
    return words;
  }

  public reset(): void {
    this.all = [];
  }

  public draw(
    layer: Layer,
    missileTrailColor: HexColor,
    missileHeadColor: HexColor,
    textColor: HexColor
  ): void {
    layer.clearRect(0, 0, RenderConstants.WIDTH, RenderConstants.HEIGHT);
    this.all.forEach((missile) => {
      missile.draw(layer, missileTrailColor, missileHeadColor, textColor);
    });
  }

  public checkCollision(other: CollisionObject): void {
    const survivingMissiles: Missile[] = [];
    for (const missile of this.all) {
      if (!missile.checkCollision(other)) {
        survivingMissiles.push(missile);
      }
    }
    this.all = survivingMissiles;
  }
}
