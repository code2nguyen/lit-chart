import { Observable } from "rxjs";
export interface ElementSize {
  width: number;
  height: number;
}

export function fromResize(target: Element): Observable<ElementSize> {
  return new Observable(function (observer) {
    const resizeObserver = new ResizeObserver((entries) => {
      const contentBox = entries[0].contentBoxSize[0];
      observer.next({
        width: contentBox.inlineSize,
        height: contentBox.blockSize,
      });
    });

    resizeObserver.observe(target);

    return () => resizeObserver.disconnect();
  });
}
