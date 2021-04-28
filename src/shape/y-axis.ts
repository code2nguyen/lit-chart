import { Tick } from "../scale/scale";
import { flatTemplate, Template } from "../template";
import { group } from "./group";
import { line } from "./line";
import { text } from "./text";

interface YAxisProps {
  className?: string;
  height: number;
  x: number;
  y: number;
  ticks?: Tick[];
  tickWidth?: number;
  renderTick?: boolean;
  tickPosition?: "center" | "left" | "right";
  renderLabel?: boolean;
  labelPadding?: number;
  id?: string;
}

export function yAxis({
  id,
  className = "axis-y",
  height,
  x,
  y,
  ticks = [],
  tickWidth = 7,
  renderTick = true,
  tickPosition = "left",
  renderLabel = true,
  labelPadding = 10,
}: YAxisProps): Template {
  const root = group({ id, className });
  root.children = [];
  const axis = line({
    x,
    y: y,
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
      const tickY = tick.tickCoordinate;
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
  if (renderLabel) {
    const labelX = x - labelPadding;
    for (const tick of ticks) {
      // TODO, depend on tick position, need to change label position
      const labelY = tick.labelCoordinate || tick.tickCoordinate;
      root.children.push(
        text({
          x: labelX,
          y: labelY,
          className: className + "-label",
          value: tick.label || "",
          textAnchor: "end",
          dominantBaseline: "middle",
        })
      );
    }
  }

  return flatTemplate(root);
}
