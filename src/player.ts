import { drawWord, CHAR_GRID_SIZE } from "./drawWord";
import { Explosions } from "./explosion";
import { RenderConstants } from "./main";
import { Missiles } from "./missiles";
import { HexColor, Layer, Vector, Option } from "./types";

const MIN_INPUT_LENGTH = 1;
const MAX_INPUT_LENGTH = 12;

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
        /^[a-zA-Z]$/.test(event.key)
      ) {
        this.currentInput += event.key.toUpperCase();
      }
    });
  }

  private findCurrentMatch(
    words: string[]
  ): Option<{ word: string; index: number }> {
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
        return { word, index };
      } else if (
        match === shortest &&
        this.currentInput.length <= word.length
      ) {
        return { word, index };
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

  public target(missiles: Missiles, explosions: Explosions): Option<number> {
    if (this.submittedInput === null) {
      return null;
    }

    const words = missiles.getWords();
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (word === this.submittedInput) {
        const missileCoords = missiles.getCoordsByIndex(i);
        explosions.spawn(missileCoords);
        this.submittedInput = null;
        return word.length;
      }
    }

    this.submittedInput = null;
    return null;
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
    missiles: Missiles,
    textColor: HexColor,
    missileHeadColor: HexColor
  ): void {
    const bestMatch = this.findCurrentMatch(missiles.getWords());

    if (bestMatch === null) {
      return;
    }

    const missileCoords = missiles.getCoordsByIndex(bestMatch.index);

    layer.fillStyle = this.flash ? missileHeadColor : textColor;
    layer.fillRect(
      missileCoords.x - RenderConstants.PIXEL_SIZE,
      missileCoords.y,
      RenderConstants.PIXEL_SIZE * 3,
      RenderConstants.PIXEL_SIZE
    );
    layer.fillRect(
      missileCoords.x,
      missileCoords.y - RenderConstants.PIXEL_SIZE,
      RenderConstants.PIXEL_SIZE,
      RenderConstants.PIXEL_SIZE * 3
    );
  }
}
