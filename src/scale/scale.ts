export interface Tick {
  tickCoordinate: number;
  labelCoordinate?: number;
  label?: string;
}
export type Scale<Domain = string | number> = {
  (value: Domain): number;
  ticks?: Tick[];
  bandwidth?: number;
};

export type ScaleProvider<Domain = string | number> = (
  domain: Domain[],
  range: number[]
) => Scale<Domain>;
