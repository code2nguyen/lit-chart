export interface MoveTo {
  c: 'M' | 'm';
  x: number;
  y: number;
}

export interface LineTo {
  c: 'L' | 'l';
  x: number;
  y: number;
}

export interface HLineTo {
  c: 'H' | 'h';
  x: number;
}

export interface VLineTo {
  c: 'V' | 'v';
  y: number;
}

export interface Curve {
  c: 'C' | 'c';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x: number;
  y: number;
}

export interface SmoothCurve {
  c: 'C' | 'c';
  x2: number;
  y2: number;
  x: number;
  y: number;
}

export interface QuadraticCurve {
  c: 'Q' | 'q';
  x1: number;
  y1: number;
  x: number;
  y: number;
}

export interface SmoothQuadraticCurve {
  c: 'T' | 't';
  x: number;
  y: number;
}

export interface ArcCurve {
  c: 'A' | 'a';
  rx: number;
  ry: number;
  angle: number;
  largeArcFlag: 0 | 1;
  sweepFlag: 1 | 0;
  x: number;
  y: number;
}

export interface Close {
  c: 'Z';
}

export type PathD =
  | MoveTo
  | LineTo
  | HLineTo
  | VLineTo
  | Curve
  | SmoothCurve
  | QuadraticCurve
  | SmoothQuadraticCurve
  | ArcCurve
  | Close;

export type SVGPath = PathD[];

export function toPath(svgPath: SVGPath): string {
  return svgPath.map(item => Object.values(item).join(' ')).join(' ');
}
