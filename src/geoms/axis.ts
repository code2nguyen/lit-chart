import { render, removeNodes } from "lit-html";
import { Observable, of } from "rxjs";
import { mergeMap } from "rxjs/operators";

import { Aesthetics } from "../data/aes";
import { Context } from "../data/context";
import { xAxis } from "../shape/x-axis";
import { cloneTemplate, createTemplateResult, flatTemplate } from "../template";

export interface AxisAestiques extends Aesthetics {
  hideAxisY?: boolean;
}
export interface AxisProps {
  aes?: AxisAestiques;
}

export function axis(props?: AxisProps) {
  return (source: Observable<Context>) => {
    return source.pipe(
      mergeMap((ctx) => {
        ctx.updateAesthetics(props?.aes);
        ctx.template.children = ctx.template.children || [];
        ctx.template.children.push(createXAxis(ctx));
        return of(ctx);
      })
    );
  };
}

function createXAxis(ctx: Context) {
  const xDomain = ctx.xDomain;
  const xScale = ctx.xScale;
  const maxLabelHeight = getMaxLabelHeight(ctx);
  const xAxisTpl = xAxis({
    x: ctx.viewBox.x,
    y: ctx.viewBox.y + ctx.viewBox.height - maxLabelHeight,
    width: ctx.width,
    ticks: xDomain.map((x) => xScale(x) || 0),
    labels: xDomain,
  });
  ctx.viewBox.height = ctx.viewBox.height - maxLabelHeight;
  return xAxisTpl;
}

// function createYAxis(ctx: Context) {
//   const xDomain = ctx.yDomain;
//   const yScale = ctx.dicreteScale;
//   const maxLabelHeight = getMaxLabelHeight(ctx);
//   const xAxisTpl = xAxis({
//     x: ctx.viewBox.x,
//     y: ctx.viewBox.y + ctx.viewBox.height - maxLabelHeight,
//     width: ctx.width,
//     ticks: xDomain.map((x) => xScale(x) || 0),
//     labels: xDomain,
//   });
//   ctx.viewBox.height = ctx.viewBox.height - maxLabelHeight;
//   return xAxisTpl;
// }

function getMaxLabelHeight(ctx: Context) {
  const xDomain = ctx.xDomain;

  const maxLengthLabelItem = xDomain.reduce((max, label) => {
    return max.length < label.length ? label : max;
  }, "");
  const templateChart = cloneTemplate(ctx.template);
  templateChart.children = [
    xAxis({
      x: 0,
      y: ctx.height,
      width: ctx.width,
      ticks: [0],
      labels: [maxLengthLabelItem],
    }),
  ];
  const tmpContainer = ctx.createTmpContainer();
  render(createTemplateResult(flatTemplate(templateChart)), tmpContainer);
  const textItem = tmpContainer.querySelector("svg text") as SVGTextElement;
  const height = textItem.getBBox().height;
  tmpContainer.remove();
  return height;
}

// function getOptimalAngle(boxes, labelOpt) {
//   const angle = _math.asin((boxes[0].height + labelOpt.minSpacing) / (boxes[1].x - boxes[0].x)) * 180 / _math.PI;
//   return angle < 45 ? -45 : -90;
// }
