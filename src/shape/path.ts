import { SVGPath, toPath } from "../data/svg-path";
import { template } from "../template";

export interface PathProps {
  d: SVGPath;
  className?: string;
  [other: string]: any;
}

export function path({ d, className = "fds-path", ...others }: PathProps) {
  return template`<path ...=${others} class="${className}" d=${toPath(d)} />`;
}
