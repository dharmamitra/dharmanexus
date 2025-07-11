type AtLeastOne<T> = [T, ...T[]];

// https://github.com/microsoft/TypeScript/issues/53171
// https://stackoverflow.com/a/55266531/7794529
export const exhaustiveStringTuple =
  <T extends string>() =>
  <L extends AtLeastOne<T>>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...x: L extends any
      ? Exclude<T, L[number]> extends never
        ? L
        : Exclude<T, L[number]>[]
      : never
  ) =>
    x;

export const setLogoModeFilter = (mode = "light") => {
  return mode === "dark"
    ? "brightness(0.3) invert(0.9) hue-rotate(180deg)"
    : "";
};
