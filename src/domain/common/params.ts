export type RemovePropertyParam = {
  readonly op: "remove";
};

export type ReplacePropertyParam<T> = {
  readonly op: "replace";
  readonly value: T;
};
