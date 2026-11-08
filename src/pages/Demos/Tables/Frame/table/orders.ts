const differ = <T>(before: readonly T[], after: readonly T[]): boolean =>
  before.length !== after.length || after.some((at, position) => before[position] !== at);

export const orders = {
  differ
};
