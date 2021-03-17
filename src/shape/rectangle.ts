import { SVGPath } from "../data/svg-path";
import { Template } from "../template";
import { path } from "./path";

type RectRadius = [number, number, number, number];

function getRectanglePath(
  x: number,
  y: number,
  width: number,
  height: number,
  radius?: number | RectRadius
): SVGPath {
  const maxRadius = Math.min(Math.abs(width) / 2, Math.abs(height) / 2);
  const startX = width > 0 ? x : x + width;
  const startY = height > 0 ? y : y + height;
  const w = Math.abs(width);
  const h = Math.abs(height);

  let paths: SVGPath = [];

  if (!radius) {
    paths = [
      { c: "M", x: startX, y: startY },
      { c: "h", x: w },
      { c: "v", y: h },
      { c: "h", x: -w },
      { c: "Z" },
    ];
  } else {
    const newRadius: RectRadius = [0, 0, 0, 0];
    if (radius instanceof Array) {
      for (let i = 0, len = 4; i < len; i++) {
        newRadius[i] = radius[i] > maxRadius ? maxRadius : radius[i];
      }
    } else if (radius && radius > 0) {
      for (let i = 0, len = 4; i < len; i++) {
        newRadius[i] = radius;
      }
    }
    paths.push({ c: "M", x: startX, y: startY + newRadius[0] });
    paths.push({
      c: "a",
      rx: newRadius[0],
      ry: newRadius[0],
      angle: 0,
      largeArcFlag: 0,
      sweepFlag: 1,
      x: newRadius[0],
      y: -newRadius[0],
    });

    paths.push({ c: "l", x: w - newRadius[1] - newRadius[0], y: 0 });
    paths.push({
      c: "a",
      rx: newRadius[1],
      ry: newRadius[1],
      angle: 0,
      largeArcFlag: 0,
      sweepFlag: 1,
      x: newRadius[1],
      y: newRadius[1],
    });

    paths.push({ c: "l", x: 0, y: h - newRadius[2] - newRadius[1] });
    paths.push({
      c: "a",
      rx: newRadius[2],
      ry: newRadius[2],
      angle: 0,
      largeArcFlag: 0,
      sweepFlag: 1,
      x: -newRadius[2],
      y: newRadius[2],
    });

    paths.push({ c: "l", x: -(w - newRadius[2] - newRadius[3]), y: 0 });
    paths.push({
      c: "a",
      rx: newRadius[3],
      ry: newRadius[3],
      angle: 0,
      largeArcFlag: 0,
      sweepFlag: 1,
      x: -newRadius[3],
      y: -newRadius[3],
    });
    paths.push({ c: "Z" });
  }
  return paths;
}

interface RectangleProps {
  className?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  radius?: number | RectRadius;
  [others: string]: any;
}

export function rectangle({
  x,
  y,
  width,
  height,
  radius,
  className,
  ...others
}: RectangleProps): Template {
  const paths = getRectanglePath(x, y, width, height, radius);
  return path({ d: paths, className, ...others });
}
