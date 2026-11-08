import {Maybe, maybe} from '@ryandur/sand';

export type SlideStarts = Readonly<Record<string, number>>;

const afterCrossing = (item: string, homeward: boolean): SlideStarts =>
  ({[item]: homeward ? -1 : 1});

const afterKeyboardStep = (order: readonly string[], walker: string, step: 1 | -1): SlideStarts => {
  const neighbour = order[order.indexOf(walker) + step];
  return {[walker]: -step, [neighbour]: step};
};

const afterSettle = (before: readonly string[], after: readonly string[]): SlideStarts =>
  Object.fromEntries(after
    .filter((item, at) => before.indexOf(item) !== at)
    .map(item => [item, before.indexOf(item) - after.indexOf(item)]));

const of = (starts: SlideStarts, item: string): Maybe<number> => maybe(starts[item]);

type SlideStartsModule = {
  of: (starts: SlideStarts, item: string) => Maybe<number>;
  afterCrossing: (item: string, homeward: boolean) => SlideStarts;
  afterKeyboardStep: (order: readonly string[], walker: string, step: 1 | -1) => SlideStarts;
  afterSettle: (before: readonly string[], after: readonly string[]) => SlideStarts;
};

export const slideStarts: SlideStartsModule = {of, afterCrossing, afterKeyboardStep, afterSettle};
