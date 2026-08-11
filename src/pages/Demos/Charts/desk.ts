import {allChartKinds, ChartKind, isChartKind} from './kinds';

export const dealt = (charts: string): readonly ChartKind[] => {
  const kinds = charts.split(',').filter(isChartKind)
    .filter((kind, at, all) => all.indexOf(kind) === at);
  return kinds.length > 0 ? kinds : ['price'];
};

export const added = (kind: ChartKind, kinds: readonly ChartKind[]): string =>
  [kind, ...kinds].join(',');

export const without = (at: number, kinds: readonly ChartKind[]): string =>
  kinds.filter((_, seat) => seat !== at).join(',');

export const seated = (from: number, to: number, kinds: readonly ChartKind[]): string => {
  const next = [...kinds];
  const [lifted] = next.splice(from, 1);
  next.splice(to, 0, lifted);
  return next.join(',');
};

export const absent = (kinds: readonly ChartKind[]): readonly ChartKind[] =>
  allChartKinds.filter(kind => !kinds.includes(kind));
