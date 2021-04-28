import { Tick } from "../scale/scale";
import { flatTemplate, Template } from "../template";
import { group } from "./group";
import { line } from "./line";
import { text } from "./text";

interface XAxisProps {
  className?: string;
  width: number;
  x: number;
  y: number;

  ticks?: Tick[];

  tickHeight?: number;
  renderTick?: boolean;
  tickPosition?: "center" | "top" | "bottom";

  renderLabel?: boolean;
  labelPadding?: number;
  id?: string;
}

export function xAxis({
  id,
  className = "axis-x",
  width,
  x,
  y,
  ticks = [],
  tickHeight = 7,
  renderTick = true,
  tickPosition = "bottom",
  renderLabel = true,
  labelPadding = 10,
}: XAxisProps): Template {
  const root = group({ id, className });
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
      const tickX = tick.tickCoordinate;
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
  if (renderLabel) {
    const labelY = tickY + labelPadding;
    for (const tick of ticks) {
      // TODO, depend on tick position, need to change label position
      const labelX = tick.labelCoordinate || tick.tickCoordinate;
      root.children.push(
        text({
          x: labelX,
          y: labelY,
          className: className + "-label",
          value: tick.label || "",
        })
      );
    }
  }

  return flatTemplate(root);
}
