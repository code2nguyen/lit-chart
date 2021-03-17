import { template } from "../template";

export interface LineProps {
  className: string;
  x: number;
  y: number;
  length: number;
  orientation: "horizontal" | "vertical";
}
export function line({ x, y, className, length, orientation }: LineProps) {
  const x2 = orientation === "horizontal" ? x + length : x;
  const y2 = orientation === "horizontal" ? y : y + length;
  return template`<line class="${className}" x1=${x} y1=${y} x2=${x2} y2=${y2} style="stroke:rgb(255,0,0);stroke-width:1"   />`;
}
