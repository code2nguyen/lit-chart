import { scaleBand } from "d3-scale";
import { Scale, ScaleProvider, Tick } from "./scale";

export interface DicreteScaleAesthetics {
  labelFunction?: (label: string) => string;
  divisionMode?: "betweenLabels" | "crossLabels";
}

export function dicreteScale(
  aes: DicreteScaleAesthetics,
  domain: string[],
  range: number[]
): Scale<string> {
  const scale = scaleBand().range(range).domain(domain);

  const scaleFn: Scale<string> = (value: string) => {
    return scale(value) || 0;
  };
  scaleFn.bandwidth = scale.bandwidth();

  scaleFn.ticks = domain.map((d) => {
    const tick: Tick = {
      tickCoordinate: scaleFn(d),
      label: aes.labelFunction ? aes.labelFunction(d) : d,
    };
    if (aes.divisionMode === "betweenLabels") {
      tick.labelCoordinate = tick.tickCoordinate + scaleFn.bandwidth! / 2;
    }
    return tick;
  });
  return scaleFn;
}

export function dicreteScaleProvider(
  aes: DicreteScaleAesthetics
): ScaleProvider<string> {
  return (domain: string[], range: number[]) => {
    return dicreteScale(aes, domain, range);
  };
}
