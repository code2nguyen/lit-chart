import { Observable, of } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { Context } from "../data/context";
import { line } from "../shape/line";
import { Coordinate, polygon } from "../shape/polygon";
import { Template } from "../template";

export interface PathAesthetics {
  padding?: number;
}

export function path({ padding = 10 }: PathAesthetics) {
  return (source: Observable<Context>) => {
    return source.pipe(
      mergeMap((ctx) => {
        const { xScale, yScale } = ctx;
        const xValues = ctx.getXValues();
        const points: Coordinate[] = [];
        for (const series of ctx.aes.yFields!) {
          const yValues = ctx.getYValues(series);
          for (let index = 0; index < xValues.length; index++) {
            const x =
              xScale(xValues[index]) +
              padding +
              (xScale.bandwidth ? (xScale.bandwidth! - padding * 2) / 2 : 0);
            const y = yScale(yValues[index]);
            points.push({ x, y });
          }
        }

        console.log(points);
        const polygonPathTpl = polygon({ points });

        ctx.template.children.push(polygonPathTpl);
        return of(ctx);
      })
    );
  };
}
