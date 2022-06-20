export type PerformanceResult = {
  readonly label: string;
  readonly value: unknown;
  readonly type: "boolean" | "number" | "time" | "duration";
  readonly symbol: string;
};
