import { drawWord, CharConstants } from "./drawWord";
import { RenderConstants } from "./main";
import { Missiles } from "./missiles";
import { HexColor, Layer, Vector, Option } from "./types";

const MAX_INPUT_LENGTH = 12;

export default class Player {
  private prevInput: Option<string>;
  private currentInput: string;
  private submittedInput: Option<string>;
  private inputY: number;
  private flash: boolean;
  private turretCoords: Vector;
  constructor(appDiv: HTMLDivElement) {
    this.inputY =
      RenderConstants.HEIGHT -
      RenderConstants.PIXEL_SIZE * 5 -
      RenderConstants.PIXEL_SIZE_SMALL * CharConstants.PIXEL_HEIGHT;
    this.turretCoords = {
      x: Math.floor(
        RenderConstants.WIDTH_MIDDLE - RenderConstants.PIXEL_SIZE * 1.5
      ),
      y: RenderConstants.HEIGHT - RenderConstants.PIXEL_SIZE * 22,
    };
    this.prevInput = null;
    this.currentInput = "";
    this.submittedInput = null;
    this.flash = false;
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

  toggleFlash(): void {
    this.flash = !this.flash;
  }

  queueUpdate(): void {
    this.prevInput = null;
  }

  drawInput(
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
        RenderConstants.WIDTH_MIDDLE,
        this.inputY,
        RenderConstants.PIXEL_SIZE_SMALL,
        this.currentInput
      );
      this.prevInput = this.currentInput;
    }
  }

  findBestMatch(words: string[]): Option<{ word: string; index: number }> {
    if (this.currentInput.length < 1) {
      return null;
    }
    let maxMatch = 0;
    let bestMatch = { word: "", index: 0 };

    for (let index = 0; index < words.length; index++) {
      const word = words[index];
      const shortest =
        word.length < this.currentInput.length
          ? word.length
          : this.currentInput.length;

      let m = 0;
      for (let i = 0; i < shortest; i++) {
        if (word[i] !== this.currentInput[i]) {
          break;
        }
        m += 1;
      }

      if (m === this.currentInput.length && m === word.length) {
        return { word, index };
      }

      if (m > maxMatch) {
        maxMatch = m;
        bestMatch = { word, index };
      }
    }
    if (maxMatch < 1) {
      return null;
    } else {
      return bestMatch;
    }
  }

  target(missiles: Missiles): Option<number> {
    if (this.submittedInput === null) {
      return null;
    }

    const words = missiles.getWords();
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (word === this.submittedInput) {
        missiles.remove(i);
        this.submittedInput = null;
        return word.length;
      }
    }

    this.submittedInput = null;
    return null;
  }

  drawTurret(
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

  drawCrossHair(
    layer: Layer,
    missiles: Missiles,
    textColor: HexColor,
    missileHeadColor: HexColor
  ): void {
    const bestMatch = this.findBestMatch(missiles.getWords());

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
