import { Observable, of } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { Context } from "../data/context";
import { rectangle } from "../shape/Rectangle";
import { Template } from "../template";

export interface BarAesthetics {
  padding?: number;
}

export function bar({ padding = 10 }: BarAesthetics) {
  return (source: Observable<Context>) => {
    return source.pipe(
      mergeMap((ctx) => {
        const { xScale, yScale } = ctx;
        const xValues = ctx.getXValues();
        for (const series of ctx.aes.yFields!) {
          const yValues = ctx.getYValues(series);
          for (let index = 0; index < xValues.length; index++) {
            const x = xScale(xValues[index]) + padding;
            const y = yScale(yValues[index]);

            const barTpl = rectangle({
              x,
              y,
              width: xScale.bandwidth! - padding * 2,
              height: ctx.innerViewBoxHeight + ctx.innerViewBoxTop - y,
              radius: [5, 5, 0, 0],
            });
            ctx.template.children.push(barTpl);
          }
        }
        return of(ctx);
      })
    );
  };
}
