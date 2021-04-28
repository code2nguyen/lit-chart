import { Aesthetics, Margin } from "./aes";
import { ColumnData } from "./data-source";
import { createTemplateResult, flatTemplate, Template } from "../template";
import { Scale, ScaleProvider } from "../scale/scale";
import { dicreteScaleProvider } from "../scale/dicrete-scale";
import { linearScaleProvider } from "../scale/linear-scale";

export interface Size {
  width: number;
  height: number;
}

export interface ViewBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

const defaultPanelMargin: Margin = {
  top: 15,
  left: 10,
  right: 10,
  bottom: 15,
};

export class Context {
  private _viewBox: ViewBox;

  public get viewBox(): ViewBox {
    return this._viewBox;
  }
  public set viewBox(value: ViewBox) {
    this._viewBox = value;
    this.clearScale();
  }

  panelMargin: Margin = defaultPanelMargin;

  private _axisMagins: Margin = { top: 0, left: 0, right: 0, bottom: 0 };

  public get axisMagins(): Margin {
    return this._axisMagins;
  }

  public set axisMagins(value: Margin) {
    if (
      value &&
      this._axisMagins &&
      value.top === this._axisMagins.top &&
      value.left === this._axisMagins.left &&
      value.right === this._axisMagins.right &&
      value.bottom === this._axisMagins.bottom
    ) {
      return;
    }
    this._axisMagins = value;
    this.clearScale();
  }

  private _xScale?: Scale<string | number>;
  private _yScale?: Scale<number>;

  constructor(
    public container: HTMLElement,
    public data: ColumnData,
    public containerSize: Size,
    public aes: Aesthetics,
    public template: Template
  ) {
    console.log("vvv");
    this.panelMargin = this.aes.margin
      ? { ...defaultPanelMargin, ...this.aes.margin }
      : { ...defaultPanelMargin };

    this._viewBox = {
      x: 0,
      y: 0,
      width: containerSize.width,
      height: containerSize.height,
    };
  }

  private clearScale() {
    this._xScale = undefined;
    this._yScale = undefined;
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

  get xScale(): Scale<string | number> {
    if (!this._xScale) {
      const scaleProvider: ScaleProvider<any> =
        this.aes.xScaleProvider || dicreteScaleProvider({});

      this._xScale = scaleProvider(getValues(this.data, [this.aes.xField!]), [
        this.innerViewBoxLeft,
        this.innerViewBoxLeft + this.innerViewBoxWidth,
      ]);
    }
    return this._xScale;
  }

  get innerViewBoxWidth() {
    return (
      this.viewBox.width -
      this.panelMargin.left -
      this.panelMargin.right -
      this.axisMagins.left -
      this.axisMagins.right
    );
  }

  get innerViewBoxHeight() {
    return (
      this.viewBox.height -
      this.panelMargin.top -
      this.panelMargin.bottom -
      this.axisMagins.top -
      this.axisMagins.bottom
    );
  }

  get innerViewBoxLeft() {
    return this.viewBox.x + this.panelMargin.left + this.axisMagins.left;
  }

  get innerViewBoxTop() {
    return this.viewBox.y + this.panelMargin.top + this.axisMagins.top;
  }

  get yScale(): Scale<number> {
    if (!this._yScale) {
      const scaleProvider: ScaleProvider<number> =
        this.aes.yScaleProvider || linearScaleProvider({ vertical: true });
      const yValues = getValues<number>(this.data, this.aes.yFields || []);
      let min = Math.min(...yValues);
      let max = Math.max(...yValues);
      this._yScale = scaleProvider(
        [min, max],
        [this.innerViewBoxTop, this.innerViewBoxTop + this.innerViewBoxHeight]
      );
    }
    return this._yScale;
  }

  get litTemplate() {
    return createTemplateResult(flatTemplate(this.template));
  }

  _xValues: string[] | number[] = [];

  getXValues(): string[] | number[] {
    if (this._xValues.length == 0) {
      this._xValues = getValues<any>(this.data, [this.aes.xField!]);
    }
    return this._xValues;
  }

  _yValues: { [field: string]: number[] } = {};
  getYValues(field: string): number[] {
    if (!this._yValues[field]) {
      console.log("getYValues", field);
      this._yValues[field] = getValues<number>(this.data, [field]);
    }

    return this._yValues[field];
  }
}

function getValues<T>(data: ColumnData, fields: string[]): T[] {
  let values: T[] = [];

  for (const field of fields) {
    const index = data.columns.findIndex((columnName) => columnName === field);
    if (index < 0) {
      console.error(`Don\'t find ${field} property in data source`);
    }
    values.push(...data.values.map((v) => (v[index] as unknown) as T));
  }
  return values;
}
