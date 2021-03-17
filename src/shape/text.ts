import { Template, template } from "../template";

export interface TextProps {
  value: string;
  x: number;
  y: number;
  className: string;
  textAnchor?: "middle" | "start" | "end";
  dominantBaseline?: "auto" | "middle" | "hanging";
}
export function text({
  x,
  y,
  value,
  className,
  dominantBaseline = "hanging",
  textAnchor = "middle",
}: TextProps): Template {
  return template`<text x=${x} y=${y} class=${className} text-anchor=${textAnchor} dominant-baseline=${dominantBaseline}>${value}</text>`;
}
