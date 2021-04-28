import { ScaleProvider } from "../scale/scale";

export interface Margin {
  top: number;
  left: number;
  right: number;
  bottom: number;
}
export interface Aesthetics {
  xField: string;
  yFields: string[];
  xScaleProvider?: ScaleProvider<string> | ScaleProvider<number>;
  yScaleProvider?: ScaleProvider<number>;
  margin?: Partial<Margin>;
}
