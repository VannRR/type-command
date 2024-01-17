export type Layer = CanvasRenderingContext2D;

export type HexColor = `#${string}`;

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Vector {
  x: number;
  y: number;
}

export interface Palette {
  background: HexColor;
  ground: HexColor;
  city: HexColor;
  mushroomCloud: HexColor;
  missileTrail: HexColor;
  missileHead: HexColor;
  text: HexColor;
}

export interface Layers {
  background: Layer;
  missile: Layer;
  foreground: Layer;
  debug: Layer | null;
}
