import { flatTemplate, Template } from "../template";
import { group } from "./group";
import { line } from "./line";
import { text } from "./text";

interface XAxisProps {
  className?: string;
  width: number;
  x: number;
  y: number;
  ticks?: number[];
  tickHeight?: number;
  renderTick?: boolean;
  tickPosition?: "center" | "top" | "bottom";
  labels?: string[];
  labelPadding?: number;
}

export function xAxis({
  className = "axis-x",
  width,
  x,
  y,
  ticks = [],
  tickHeight = 7,
  renderTick = true,
  tickPosition = "bottom",
  labels = [],
  labelPadding = 10,
}: XAxisProps): Template {
  const root = group({ className });
  root.children = [];
  const axis = line({
    x,
    y,
    length: width,
    orientation: "horizontal",
    className: className + "-line",
  });
  root.children.push(axis);

  const tickY =
    tickPosition == "center"
      ? y - tickHeight / 2
      : tickPosition === "top"
      ? y - tickHeight
      : y;
  if (renderTick) {
    for (const tick of ticks) {
      const tickX = x + tick;
      root.children.push(
        line({
          x: tickX,
          y: tickY,
          className: className + "-tick",
          length: tickHeight,
          orientation: "vertical",
        })
      );
    }
  }
  const labelY = y + labelPadding;
  for (let i = 0; i < labels.length; i++) {
    const labelX = x + ticks[i];
    root.children.push(
      text({
        x: labelX,
        y: labelY,
        className: className + "-label",
        value: labels[i],
      })
    );
  }

  return flatTemplate(root);
}
