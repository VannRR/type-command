import { drawWord, CHAR_GRID_SIZE } from "./drawWord";
import { RenderConstants } from "./main";
import { HexColor, Layer, Vector, Option } from "./types";

const MIN_INPUT_LENGTH = 1;
const MAX_INPUT_LENGTH = 12;
const DIFFICULTY_SETTINGS = [
  "!ONE",
  "!TWO",
  "!THREE",
  "!FOUR",
  "!FIVE",
  "!SIX",
  "!SEVEN",
  "!EIGHT",
  "!NINE",
  "!TEN",
  "!ELEVEN",
  "!TWELVE",
  "!THIRTEEN",
  "!FOURTEEN",
  "!FIFTEEN",
  "!SIXTEEN",
  "!SEVENTEEN",
  "!EIGHTEEN",
  "!NINETEEN",
  "!TWENTY",
];

export default class Player {
  private prevInput: Option<string> = null;
  private currentInput: string = "";
  private submittedInput: Option<string> = null;
  private flash: boolean = false;
  private inputY: number =
    RenderConstants.HEIGHT -
    RenderConstants.PIXEL_SIZE * 5 -
    RenderConstants.PIXEL_SIZE_SMALL * CHAR_GRID_SIZE;
  private turretCoords: Vector = {
    x: Math.floor(
      RenderConstants.WIDTH_MIDDLE - RenderConstants.PIXEL_SIZE * 1.5
    ),
    y: RenderConstants.HEIGHT - RenderConstants.PIXEL_SIZE * 22,
  };

  constructor(appDiv: HTMLDivElement) {
    appDiv.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        this.submittedInput = this.currentInput;
        this.currentInput = "";
      } else if (event.key === "Backspace" && this.currentInput.length > 0) {
        this.currentInput = this.currentInput.substring(
          0,
          this.currentInput.length - 1
        );
      } else if (
        this.currentInput.length < MAX_INPUT_LENGTH &&
        /^(!|[a-zA-Z])$/.test(event.key)
      ) {
        this.currentInput += event.key.toUpperCase();
      }
    });
  }

  public getCurrentMatch(words: string[]): Option<number> {
    if (this.currentInput.length < MIN_INPUT_LENGTH) {
      return null;
    }

    for (let index = 0; index < words.length; index++) {
      const word = words[index];
      const shortest = Math.min(word.length, this.currentInput.length);

      let match = 0;
      for (let i = 0; i < shortest; i++) {
        if (word[i] !== this.currentInput[i]) {
          break;
        }
        match += 1;
      }

      if (match === this.currentInput.length && match === word.length) {
        return index;
      } else if (
        match === shortest &&
        this.currentInput.length <= word.length
      ) {
        return index;
      }
    }

    return null;
  }

  public advance(): void {
    this.flash = !this.flash;
  }

  public queueUpdate(): void {
    this.prevInput = null;
  }

  public drawInput(
    layer: Layer,
    backgroundColor: HexColor,
    textColor: HexColor
  ): void {
    if (this.prevInput !== this.currentInput) {
      layer.clearRect(
        0,
        this.inputY - RenderConstants.PIXEL_SIZE_SMALL * 2,
        RenderConstants.WIDTH,
        12 * RenderConstants.PIXEL_SIZE_SMALL
      );
      drawWord(
        layer,
        backgroundColor,
        textColor,
        { x: RenderConstants.WIDTH_MIDDLE, y: this.inputY },
        RenderConstants.PIXEL_SIZE_SMALL,
        this.currentInput
      );
      this.prevInput = this.currentInput;
    }
  }

  public getDifficulty(): Option<number> {
    if (this.submittedInput === null || this.submittedInput[0] !== "!") {
      return null;
    }
    const index = DIFFICULTY_SETTINGS.indexOf(this.submittedInput);
    if (index === -1) {
      return null;
    }
    return index + 1;
  }

  public getSubmittedInput(): Option<string> {
    const input = this.submittedInput;
    this.submittedInput = null;
    return input;
  }

  public drawTurret(
    layer: Layer,
    textColor: HexColor,
    missileHeadColor: HexColor
  ): void {
    layer.fillStyle = this.flash ? missileHeadColor : textColor;
    layer.fillRect(
      this.turretCoords.x,
      this.turretCoords.y,
      RenderConstants.PIXEL_SIZE * 3,
      RenderConstants.PIXEL_SIZE
    );
  }

  public drawCrossHair(
    layer: Layer,
    coords: Option<Vector>,
    textColor: HexColor,
    missileHeadColor: HexColor
  ): void {
    if (coords === null) {
      return;
    }

    layer.fillStyle = this.flash ? missileHeadColor : textColor;
    layer.fillRect(
      coords.x - RenderConstants.PIXEL_SIZE,
      coords.y,
      RenderConstants.PIXEL_SIZE * 3,
      RenderConstants.PIXEL_SIZE
    );
    layer.fillRect(
      coords.x,
      coords.y - RenderConstants.PIXEL_SIZE,
      RenderConstants.PIXEL_SIZE,
      RenderConstants.PIXEL_SIZE * 3
    );
  }
}
