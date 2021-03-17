import { memoize } from "decko/src/decko";
import { ScaleBand, scaleBand, scaleLinear, ScaleLinear } from "d3-scale";
import { Aesthetics } from "./aes";
import { ColumnData } from "./data-source";
import { createTemplateResult, flatTemplate, Template } from "../template";

export interface Size {
  width: number;
  height: number;
}

export interface YDomain {
  min: number;
  max: number;
}
export interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type Scale = ((value: string) => number) | ((order: number) => number);

//Idea => export options to function callback
export class Context {
  viewBox: ViewBox;
  constructor(
    public container: HTMLElement,
    public data: ColumnData,
    public containerSize: Size,
    public aes: Aesthetics,
    public template: Template
  ) {
    this.viewBox = { x: 0, y: 0, ...containerSize };
  }

  createTmpContainer(): HTMLElement {
    const tmpContainer = this.container.cloneNode() as HTMLElement;
    tmpContainer.style.visibility = "hidden";
    tmpContainer.style.width = "0px";
    tmpContainer.style.height = "0px";
    this.container.parentNode?.appendChild(tmpContainer);

    return tmpContainer;
  }

  get width() {
    return this.viewBox.width;
  }

  get height() {
    return this.viewBox.height;
  }

  get xDomain() {
    if (this.aes.xField) return this.getXDomain(this.data, this.aes.xField);
    return [];
  }

  get yDomain(): YDomain {
    if (this.aes.yField)
      return this.getYDomain(
        this.data,
        this.aes.yField,
        this.aes.yRangeMin,
        this.aes.yRangeMax
      );
    return { min: 0, max: 0 };
  }

  get xScale(): Scale {
    return this.getDicreteScale(this.xDomain, this.width);
  }

  get yScale(): Scale {
    return this.getNumberScale(this.yDomain.min, this.yDomain.max, this.height);
  }

  get litTemplate() {
    return createTemplateResult(flatTemplate(this.template));
  }

  updateAesthetics(aes?: Aesthetics) {
    if (aes) {
      this.aes = { ...this.aes, ...aes };
    }
  }

  @memoize
  private getXDomain(data: ColumnData, xField: string): string[] {
    const xIndex = data.columns.findIndex(
      (columnName) => columnName === xField
    );
    if (xIndex < 0) {
      console.error(`Don\'t find ${xField} property in data source`);
    }
    return data.values.map((v) => v[xIndex].toString());
  }

  @memoize
  private getYDomain(
    data: ColumnData,
    yField: string,
    yRangeMin?: number,
    yRangeMax?: number
  ): YDomain {
    const yIndex = data.columns.findIndex(
      (columnName) => columnName === yField
    );

    if (yIndex < 0) {
      console.error(`Don\'t find ${yField} property in data source`);
    }

    const values = data.values.map((v) => +v[yIndex] || 0);
    let min = yRangeMin
      ? Math.min(yRangeMin, ...values)
      : Math.min(0, ...values);
    let max = yRangeMax
      ? Math.max(yRangeMax, ...values)
      : Math.max(0, ...values);
    return { min, max };
  }

  @memoize
  getNumberScale(min: number, max: number, length: number): Scale {
    const scale = scaleLinear().range([0, length]).domain([min, max]);
    return (value: number) => {
      return scale(value) || 0;
    };
  }

  @memoize
  private getDicreteScale(categories: string[], length: number): Scale {
    const scale = scaleBand().range([0, length]).domain(categories);
    return (value: string) => {
      return scale(value) || 0;
    };
  }
}
