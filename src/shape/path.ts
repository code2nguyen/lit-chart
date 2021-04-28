import { SVGPath, toPath } from "./svg-path";
import { template } from "../template";

export interface PathProps {
  d: SVGPath;
  className?: string;
  [other: string]: any;
}

export function path({ d, className = "fds-path", ...others }: PathProps) {
  return template`<path ...=${others} fill="transparent" stroke="black" class="${className}" d=${toPath(
    d
  )} />`;
}
