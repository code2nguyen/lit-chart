import {
  of,
  Observable,
  isObservable,
  combineLatest,
  OperatorFunction,
  Subscription,
  ReplaySubject,
  Subject,
  from,
} from "rxjs";
import { html, LitElement, ReactiveController, TemplateResult } from "lit";

import { map, mapTo, mergeMap, publish, tap } from "rxjs/operators";
import { Aesthetics } from "./data/aes";
import { DataSource } from "./data/data-source";
import { rowToColumn } from "./data-transform/row-to-column";
import { Template, template } from "./template";
import { Context, Size } from "./data/context";
import { fromResize } from "./utils/from-resize";

export class Chart implements ReactiveController {
  host: LitElement;

  private container: HTMLElement | null = null;

  template: TemplateResult = html``;

  _source$ = new ReplaySubject<Context>(1);

  _draw$: Observable<Context> | null = null;

  _sourceSubscriber = Subscription.EMPTY;
  _drawSubscriber = Subscription.EMPTY;

  constructor(
    host: LitElement,
    private containerId: string,
    private aes: Aesthetics,
    private dataSource?: DataSource | Observable<DataSource>
  ) {
    (this.host = host).addController(this);
  }

  hostConnected(): void {}

  hostUpdate() {
    // this.subscribleChart();
  }

  hostUpdated(): void {
    if (!this.container) {
      this.container = this.host.renderRoot.querySelector(this.containerId);
      if (this.container) {
        this.subscribleSource();
      }
    }
  }

  hostDisconnected(): void {
    this._sourceSubscriber.unsubscribe();
    this._drawSubscriber.unsubscribe();
  }

  setDataSource(ds: DataSource | Observable<DataSource>) {
    if (this.dataSource) {
      console.error("Can not change data source value");
      return;
    }

    this.dataSource = ds;
    this.subscribleSource();
  }

  draw(...operations: OperatorFunction<Context, Context>[]): void {
    if (this._draw$) {
      console.error("Can not call draw function twice");
    }
    this._draw$ = operations.reduce(
      (prev: Observable<Context>, fn: OperatorFunction<Context, Context>) =>
        fn(prev),
      this._source$
    );

    this._drawSubscriber = this._draw$.subscribe((context) => {
      this.template = context.litTemplate;
      this.host.requestUpdate();
    });
  }

  private subscribleSource() {
    if (this.container && this.dataSource) {
      const dataSource$ = isObservable(this.dataSource)
        ? this.dataSource
        : of(this.dataSource);

      this._sourceSubscriber.unsubscribe();
      this._sourceSubscriber = combineLatest([
        dataSource$.pipe(map((data) => rowToColumn(data))),
        fromResize(this.container),
      ])
        .pipe(
          tap(([columnData, containerSize]) => {
            this._source$.next(
              new Context(
                this.container!,
                columnData,
                containerSize,
                this.aes,
                chartTemplate(containerSize)
              )
            );
          })
        )
        .subscribe();
    }
  }
}

//   container: HTMLElement,
//   dataSource: DataSource | Observable<DataSource>,
//   aes: Aesthetics = {}
// ): Observable<Context> {
//   const dataSource$ = isObservable(dataSource) ? dataSource : of(dataSource);

//   return combineLatest([
//     dataSource$.pipe(map((data) => rowToColumn(data))),
//     fromResize(container),
//   ]).pipe(
//     mergeMap(([columnData, containerSize]) => {
//       return of(
//         new Context(
//           container,
//           columnData,
//           containerSize,
//           aes,
//           chartTemplate(containerSize)
//         )
//       );
//     })
//   );
// }

export function chartTemplate(size: Size): Template {
  const chartTpl = template`<svg
        width=${size.width}
        height=${size.height}
        viewBox="0 0 ${size.width} ${size.height}"
        version="1.1"><!--...children--></svg>`;
  chartTpl.children = [];
  return chartTpl;
}
