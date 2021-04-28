import { Observable, Operator, OperatorFunction, Subscriber } from "rxjs";
import { Context } from "../data/context";
import { timer, timeout, Timer } from "d3-timer";
import { ColumnData } from "../data/data-source";
import { cubic } from "./cubic";

export interface AnimationOptions {
  firstAnimation?: boolean;
  duration?: number;
  delay?: number;
  timingFunction?: (position: number) => number;
  initialValue?: number;
}

export function animation(
  ops: AnimationOptions
): OperatorFunction<Context, Context> {
  return (source: Observable<Context>) =>
    source.lift(new AnimationOperator(ops));
}

class AnimationOperator implements Operator<Context, Context> {
  constructor(private options: AnimationOptions) {}

  call(subscriber: Subscriber<Context>, source: any): any {
    return source.subscribe(new AnimationSubscriber(this.options, subscriber));
  }
}

export function getDiff(
  prevData: ColumnData | undefined,
  currentData: ColumnData,
  xField: string,
  yField: string
) {
  return currentData.values;
}

export function transformNumberArray(
  oldArr: number[],
  newArr: number[],
  progress: number
): number[] {
  return oldArr.map((item, index) => item + (newArr[index] - item) * progress);
}

export function calcAnimationData(
  factor: number,
  prevData: ColumnData,
  diff: number[][]
) {
  const animationData = prevData;
  for (let col = 0; col < prevData.columns.length; col++) {
    for (let row = 0; row < prevData.values.length; row++) {
      const value = prevData.values[col][row];
      if (typeof value === "number") {
        animationData.values[col][row] = value + diff[col][row] * factor;
      }
    }
  }
}

export class AnimationSubscriber extends Subscriber<Context> {
  private prevContext?: {
    columns: string[];
    xField: string;
    yFields: string[];
    xValues: string[] | number[];
    yValues: { [field: string]: number[] };
  };

  private currentContextData?: {
    xValues: string[] | number[];
    yValues: { [field: string]: number[] };
  };
  private state?:
    | "ENDING"
    | "ENDED"
    | "RUNNING"
    | "STARTED"
    | "SCHEDULED"
    | "STARTING";
  private timer!: Timer;
  private time?: number;

  private delay: number;
  private duration: number;
  private timingFunction: (position: number) => number;
  private context?: Context;
  constructor(
    private options: AnimationOptions,
    protected destination: Subscriber<Context>
  ) {
    super(destination);
    this.duration = options.duration ?? 400;
    this.delay = options.delay ?? 0;
    this.timingFunction = options.timingFunction ?? cubic;
  }

  _calcProgress = (elapsed: number) => {
    return Math.min(1, elapsed / this.duration);
  };

  _next(ctx: Context): void {
    this.extractPrevContext(ctx);
    this.context = ctx;
    if (this.prevContext) {
      // Initialize the self timer when the transition is created.
      // Note the actual delay is not known until the first callback!
      this.timer = timer(this.schedule, 0, this.time);
    } else {
      this.destination.next(this.context);
    }
  }

  schedule = (elapsed: number) => {
    if (!this.prevContext || !this.context) {
      return;
    }
    this.state = "SCHEDULED";
    this.currentContextData = {
      xValues: this.context.getXValues(),
      yValues: this.context.aes.yFields.reduce((result: any, field) => {
        result[field] = this.context?.getYValues(field);
        return result;
      }, {}),
    };
    this.prevContext.xValues.length = this.currentContextData.xValues.length;

    // Make two array have a same size
    for (const yField of this.context.aes.yFields) {
      if (!this.prevContext.yValues[yField]) {
        this.prevContext.yValues[yField] = Array(
          this.context.data.values.length
        ).fill(this.options.initialValue || 0);
      }
      this.prevContext.yValues[yField].length = this.currentContextData.yValues[
        yField
      ].length;
    }

    this.timer.restart(this.start, this.delay, this.time);
    // If the elapsed delay is less than our first sleep, start immediately.
    if (this.delay <= elapsed) this.start(elapsed - this.delay);
  };

  start = (elapsed: number) => {
    if (!this.prevContext) {
      this.stop();
      return this.destination.next(this.context);
    }
    if (!this.context || !this.currentContextData) {
      return this.stop();
    }

    this.state = "STARTED";
    let factor = 1;
    if (elapsed < this.duration) {
      factor = this.timingFunction(this._calcProgress(elapsed));
    } else {
      return this.timer.restart(this.stop);
    }

    // TODO: Change context data here !!!!!
    this.context.template.children = [];
    if (
      this.context._xValues[0] &&
      typeof this.context._xValues[0] === "number"
    ) {
      this.context._xValues = transformNumberArray(
        this.prevContext.xValues as number[],
        this.currentContextData.xValues as number[],
        factor
      );
    }
    this.context._yValues = {};
    for (const yField of this.context.aes.yFields) {
      this.context._yValues[yField] = transformNumberArray(
        this.prevContext.yValues[yField],
        this.currentContextData.yValues[yField],
        factor
      );
    }
    this.destination.next(this.context);
  };

  // tick = (factor: number) => {};

  stop = () => {
    this._stop();
  };

  _stop = (unsubscribe?: boolean) => {
    this.state = "ENDED";
    if (!unsubscribe && this.context) {
      this.context._yValues = {};
      this.context._xValues = [];
      this.destination.next(this.context);
    }
    this.timer.stop();
  };

  private extractPrevContext(ctx: Context) {
    if (this.context) {
      this.prevContext = {
        columns: [...this.context.data.columns],
        xField: this.context.aes.xField,
        yFields: [...this.context.aes.yFields],
        xValues: [...this.context._xValues] as any[],
        yValues: { ...this.context._yValues },
      };
    } else if (!this.options.firstAnimation) {
      this.prevContext = {
        columns: [...ctx.data.columns],
        xField: ctx.aes.xField,
        yFields: [...ctx.aes.yFields],
        xValues: [...ctx.getXValues()] as any[],
        yValues: ctx.aes.yFields.reduce((result: any, field) => {
          result[field] = Array(ctx.data.values.length).fill(
            this.options.initialValue || 0
          );
          return result;
        }, {}),
      };
    }
  }

  unsubscribe() {
    if (this.state !== "ENDED") {
      this._stop(true);
    }
    super.unsubscribe();
  }
  // tick = (elapsed: number) => {
  // var t =
  //     elapsed < self.duration
  //       ? self.ease.call(null, elapsed / self.duration)
  //       : (self.timer.restart(stop), (self.state = ENDING), 1),
  //   i = -1,
  //   n = tween.length;
  // while (++i < n) {
  //   tween[i].call(node, t);
  // }
  // // Dispatch the end event.
  // if (self.state === ENDING) {
  //   self.on.call("end", node, node.__data__, self.index, self.group);
  //   stop();
  // }
  // };
}
