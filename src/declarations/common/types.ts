export type ListOf<T, K = string> = {
  readonly next: K;
  readonly items: T[];
};
