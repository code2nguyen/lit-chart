import { flatTemplate, Template } from "../template";
import { group } from "./group";
import { line } from "./line";
import { text } from "./text";

interface YAxisProps {
  className?: string;
  height: number;
  x: number;
  y: number;
  ticks?: number[];
  tickWidth?: number;
  renderTick?: boolean;
  tickPosition?: "center" | "left" | "right";
  labels?: string[];
  labelPadding?: number;
}

export function yAxis({
  className = "axis-y",
  height,
  x,
  y,
  ticks = [],
  tickWidth = 7,
  renderTick = true,
  tickPosition = "left",
  labels = [],
  labelPadding = 10,
}: YAxisProps): Template {
  const root = group({ className });
  root.children = [];
  const axis = line({
    x,
    y,
    length: height,
    orientation: "vertical",
    className: className + "-line",
  });
  root.children.push(axis);

  const tickX =
    tickPosition == "center"
      ? x - tickWidth / 2
      : tickPosition === "left"
      ? x - tickWidth
      : x;
  if (renderTick) {
    for (const tick of ticks) {
      const tickY = y + tick;
      root.children.push(
        line({
          x: tickX,
          y: tickY,
          className: className + "-tick",
          length: tickWidth,
          orientation: "horizontal",
        })
      );
    }
  }
  const labelX = x - labelPadding;
  for (let i = 0; i < labels.length; i++) {
    const labelY = y + ticks[i];
    root.children.push(
      text({
        x: labelX,
        y: labelY,
        className: className + "-label",
        value: labels[i],
        textAnchor: "end",
        dominantBaseline: "middle",
      })
    );
  }

  return flatTemplate(root);
}
