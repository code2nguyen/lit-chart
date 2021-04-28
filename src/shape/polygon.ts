import { Template, template } from "../template";
import { path } from "./path";
import { SVGPath } from "./svg-path";

export interface Coordinate {
  x: number;
  y: number;
}

function getPolygonPath(points: Coordinate[]): SVGPath {
  const paths: SVGPath = points.map((point: Coordinate, index: number) => {
    return index === 0
      ? { c: "M", x: point.x, y: point.y }
      : { c: "L", x: point.x, y: point.y };
  });
  // paths.push({ c: "Z" });
  return paths;
}

export interface PolygonProps {
  className?: string;
  points?: Coordinate[];
  connectNulls?: boolean;
  [other: string]: any;
}

export function polygon({
  points,
  className = "fds-polygon",
  ...others
}: PolygonProps): Template {
  if (!points || !points.length) {
    return template``;
  }
  const polygonPath = getPolygonPath(points);

  return path({ d: polygonPath, className, ...others });
}
