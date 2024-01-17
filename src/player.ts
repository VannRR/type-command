import { drawWord, CHAR_PIXEL_HEIGHT } from "./drawWord";
import {
  WIDTH,
  HEIGHT,
  PIXEL_SIZE,
  PIXEL_SIZE_SMALL,
  WIDTH_MIDDLE,
} from "./main";
import { Missiles } from "./missiles";
import { HexColor, Layer } from "./types";

const MAX_INPUT_LENGTH = 12;

export default class Player {
  private prevInput: string | null;
  private currentInput: string;
  private submittedInput: string | null;
  private inputY: number;
  constructor(appDiv: HTMLDivElement) {
    this.inputY =
      HEIGHT - PIXEL_SIZE * 5 - PIXEL_SIZE_SMALL * CHAR_PIXEL_HEIGHT;
    this.prevInput = null;
    this.currentInput = "";
    this.submittedInput = null;
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
        this.inputY - PIXEL_SIZE_SMALL * 2,
        WIDTH,
        12 * PIXEL_SIZE_SMALL
      );
      drawWord(
        layer,
        backgroundColor,
        textColor,
        WIDTH_MIDDLE,
        this.inputY,
        PIXEL_SIZE_SMALL,
        this.currentInput
      );
      this.prevInput = this.currentInput;
    }
  }

  match(missiles: Missiles): number | null {
    if (this.submittedInput === null) {
      return null;
    }
    const all = missiles.getAll();
    for (let i = 0; i < all.length; i++) {
      const missileWord = all[i].getWord();
      if (missileWord === this.submittedInput) {
        missiles.remove(i);
        this.submittedInput = null;
        return missileWord.length;
      }
    }
    this.submittedInput = null;
    return null;
  }
}
