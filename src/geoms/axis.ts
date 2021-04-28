import { render } from "lit";
import { Observable, of } from "rxjs";
import { filter, mergeMap } from "rxjs/operators";

import { Aesthetics } from "../data/aes";
import { Context } from "../data/context";
import { xAxis } from "../shape/x-axis";
import { yAxis } from "../shape/y-axis";

import { cloneTemplate, createTemplateResult, flatTemplate } from "../template";

export interface AxisAestiques {
  hideAxisY?: boolean;
  rotationAngle?: number;
}

export function axis(props?: AxisAestiques) {
  return (source: Observable<Context>) => {
    return source.pipe(
      mergeMap((ctx) => {
        let maxLabelWidth = 0;
        if (!props?.hideAxisY) {
          maxLabelWidth = getYMargin(ctx);
        }
        const maxLabelHeight = getXMargin(ctx);

        ctx.axisMagins = {
          bottom: maxLabelHeight,
          left: maxLabelWidth,
          right: 0,
          top: 0,
        };

        ctx.template.children.push(createXAxis(ctx));
        ctx.template.children.push(createYAxis(ctx));
        return of(ctx);
      })
    );
  };
}

function createXAxis(ctx: Context) {
  const xScale = ctx.xScale;
  const xAxisTpl = xAxis({
    x: ctx.innerViewBoxLeft,
    y: ctx.innerViewBoxTop + ctx.innerViewBoxHeight,
    width: ctx.innerViewBoxWidth,
    ticks: xScale.ticks,
  });
  return xAxisTpl;
}

function createYAxis(ctx: Context) {
  const yScale = ctx.yScale;
  const yAxisTpl = yAxis({
    x: ctx.innerViewBoxLeft,
    y: ctx.innerViewBoxTop,
    height: ctx.innerViewBoxHeight,
    ticks: yScale.ticks?.reverse(),
  });
  return yAxisTpl;
}

function getXMargin(ctx: Context) {
  const templateChart = cloneTemplate(ctx.template);
  templateChart.children = [
    xAxis({
      id: "tmp-x",
      x: ctx.viewBox.x,
      y: ctx.viewBox.y + ctx.viewBox.height,
      width: ctx.width,
      ticks: ctx.xScale.ticks,
    }),
  ];
  const tmpContainer = ctx.createTmpContainer();
  render(createTemplateResult(flatTemplate(templateChart)), tmpContainer);
  const axisX = tmpContainer.querySelector<SVGGraphicsElement>("#tmp-x");
  const height = axisX!.getBBox().height || 0;
  tmpContainer.remove();
  return Math.floor(height);
}

function getYMargin(ctx: Context) {
  const templateChart = cloneTemplate(ctx.template);
  templateChart.children = [
    yAxis({
      id: "tmp-y",
      x: ctx.viewBox.x,
      y: ctx.viewBox.y,
      height: ctx.height,
      ticks: ctx.yScale.ticks,
    }),
  ];
  const tmpContainer = ctx.createTmpContainer();
  render(createTemplateResult(flatTemplate(templateChart)), tmpContainer);
  const axisX = tmpContainer.querySelector("#tmp-y") as SVGGraphicsElement;
  const width = axisX.getBBox().width;
  tmpContainer.remove();
  return Math.floor(width);
}

// function getOptimalAngle(boxes, labelOpt) {
//   const angle = _math.asin((boxes[0].height + labelOpt.minSpacing) / (boxes[1].x - boxes[0].x)) * 180 / _math.PI;
//   return angle < 45 ? -45 : -90;
// }
