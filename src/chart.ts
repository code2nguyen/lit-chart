import { of, Observable, isObservable, combineLatest } from "rxjs";
import { mergeMap, map } from "rxjs/operators";
import { Aesthetics } from "./data/aes";
import { DataSource } from "./data/data-source";
import { rowToColumn } from "./data/row-to-column";
import { Template, template } from "./template";
import { Context, Size } from "./data/context";
import { fromResize } from "./utils/from-resize";
import { data } from "../demo/data";

export function createChart(
  container: HTMLElement,
  dataSource: DataSource | Observable<DataSource>,
  aes: Aesthetics = {}
): Observable<Context> {
  const dataSource$ = isObservable(dataSource) ? dataSource : of(dataSource);
  return combineLatest([
    dataSource$.pipe(map((data) => rowToColumn(data))),
    fromResize(container),
  ]).pipe(
    mergeMap(([columnData, containerSize]) => {
      return of(
        new Context(
          container,
          columnData,
          containerSize,
          aes,
          chartTemplate(containerSize)
        )
      );
    })
  );
}

export function chartTemplate(size: Size): Template {
  return template`<svg
        width=${size.width}
        height=${size.height}
        viewBox="0 0 ${size.width} ${size.height}"
        version="1.1"><!--...children--></svg>`;
}
