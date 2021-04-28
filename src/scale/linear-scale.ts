import { scaleLinear } from "d3-scale";
import { ScaleProvider, Scale, Tick } from "./scale";

export interface LinearScaleAesthetics {
  tickInterval?: number;

  // startAxisValue = minDataValue - (maxDataValue - minDataValue) * minValueMargin
  // endAxisValue = maxDataValue + (maxDataValue - minDataValue) * maxValueMargin
  minValueMargin?: number;
  maxValueMargin?: number;

  // default is 70
  axisDivisionFactor?: number;

  labelFunction?: (value: number) => string;
  vertical?: boolean;
}

export function linearScale(
  aes: LinearScaleAesthetics,
  domain: number[],
  range: number[]
): Scale<number> {
  const startDomain = domain[0] > 0 ? 0 : domain[0];
  const domainLength = domain[1] - startDomain;
  const rangeLength = range[1] - range[0];
  const ajustedDomain = [
    startDomain - domainLength * (aes.minValueMargin || 0),
    domain[1] + domainLength * (aes.maxValueMargin || 0),
  ];
  const scale = scaleLinear()
    .range(range.reverse())
    .domain(ajustedDomain)
    .nice();
  const scaleFn: Scale<number> = (value: number) => {
    return scale(value) || 0;
  };

  let tickCount = 10;
  if (aes.tickInterval) {
    tickCount = (ajustedDomain[1] - ajustedDomain[0]) / aes.tickInterval;
  } else {
    tickCount = Math.ceil(rangeLength / (aes.axisDivisionFactor || 70));
  }

  const ticks = scale.ticks(tickCount);

  scaleFn.ticks = ticks.map((tickValue) => {
    const tick: Tick = {
      tickCoordinate: scaleFn(tickValue),
      label: aes.labelFunction
        ? aes.labelFunction(tickValue)
        : tickValue.toString(),
    };
    return tick;
  });
  return scaleFn;
}

export function linearScaleProvider(
  aes: LinearScaleAesthetics
): ScaleProvider<number> {
  return (domain: number[], range: number[]) => {
    return linearScale(aes, domain, range);
  };
}
