import { scaleTime, scaleLinear} from "d3-scale";
import { Scale } from './scale';

export function timeScale(domain: number[], range: number[]): Scale<number> {
  const scale = scaleTime().range(range).domain(domain);
  return (value: number | Date) => {
    return scale(value) || 0;
  };
}

export interface DateInterval {
  day?: number;
  hour?: number;
  minute?: number;
  month?: number;
  quarter?: number;
  second?: number;
  week?: number;
  year?: number;
}
