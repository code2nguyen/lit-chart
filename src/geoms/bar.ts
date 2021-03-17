import { Observable, of } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { Context } from "../data/context";
import { rectangle } from "../shape/Rectangle";
import { Template } from "../template";

export function bar() {
  return (source: Observable<Context>) => {
    return source.pipe(
      mergeMap((ctx) => {
        // const barTemplate: Template = template`<path fill="#8884d8" width="16" height="20.849999999999998" x="67" y="14.150000000000002" radius="0" class="recharts-rectangle" d="M 67,14.150000000000002 h 16 v 20.849999999999998 h -16 Z"></path>`;
        const barTemplate: Template = rectangle({
          x: 10,
          y: 10,
          width: 50,
          height: 50,
          radius: 10,
        });
        const barTemplate1: Template = rectangle({
          x: 110,
          y: 10,
          width: 50,
          height: 50,
        });
        const barTemplate2: Template = rectangle({
          x: 110,
          y: 110,
          width: -50,
          height: 50,
          radius: 10,
        });

        const barTemplate3: Template = rectangle({
          x: 200,
          y: 210,
          width: -50,
          height: -50,
          radius: 10,
        });

        const barTemplate4: Template = rectangle({
          x: 100,
          y: 310,
          width: 50,
          height: -50,
          radius: 10,
        });

        ctx.template.children = ctx.template.children || [];
        ctx.template.children.push(
          barTemplate,
          barTemplate1,
          barTemplate2,
          barTemplate3,
          barTemplate4
        );
        return of(ctx);
      })
    );
  };
}

// export function getXScale(xDomain: string[], {}): any {
//   this.xDomain = this.getXDomain();
//   const spacing = this.xDomain.length / (this.dims.width / this.barPadding + 1);
//   return scaleBand().range([0, this.dims.width]).paddingInner(spacing).domain(this.xDomain);
// }

// getYScale(): any {
//   this.yDomain = this.getYDomain();
//   const scale = scaleLinear().range([this.dims.height, 0]).domain(this.yDomain);
//   return this.roundDomains ? scale.nice() : scale;
// }
// export class BarChartOperator<T, R> implements Operator<T, R> {
//   templateResult: TemplateResult;

//   constructor(data: ChartModel) {
//     this.templateResult = data.templateResult;
//   }

//   call(observer: Subscriber<R>, source: any): any {
//     return source;
//   }

//   getSvgContentIndex(): number {
//     return this.templateResult.strings.indexOf('</svg>');
//   }

//   barElement() {
//     return template`<path fill="#8884d8" width="16" height="20.849999999999998" x="67" y="14.150000000000002" radius="0" class="recharts-rectangle" d="M 67,14.150000000000002 h 16 v 20.849999999999998 h -16 Z"></path>`;
//   }
// }
