import {Maybe, maybe, not, nothing, some} from '@ryandur/sand';

export type Places = Readonly<Record<string, number>>;

export type Slide = {readonly places: number; readonly again: boolean; readonly running: boolean};

export type SlideStarts = Readonly<Record<string, Slide>>;

const afterCrossing = (item: string, homeward: boolean): Places =>
  ({[item]: homeward ? -1 : 1});

const afterKeyboardStep = (order: readonly string[], walker: string, step: 1 | -1): Places => {
  const neighbor = order[order.indexOf(walker) + step];
  return {[walker]: -step, [neighbor]: step};
};

const afterSettle = (before: readonly string[], after: readonly string[]): Places =>
  Object.fromEntries(after
    .filter((item, at) => before.indexOf(item) !== at)
    .map(item => [item, before.indexOf(item) - after.indexOf(item)]));

const begun = (starts: SlideStarts, places: Places): SlideStarts => ({
  ...starts,
  ...Object.fromEntries(Object.entries(places).map(([item, from]) =>
    [item, {places: from, again: maybe(starts[item]).map(({again}) => not(again)).orElse(false), running: true}]))
});

const of = (starts: SlideStarts, item: string): Maybe<Slide> =>
  maybe(starts[item]).mBind(slide => slide.running ? some(slide) : nothing());

const ended = (starts: SlideStarts, item: string): SlideStarts =>
  maybe(starts[item]).map(slide => ({...starts, [item]: {...slide, running: false}})).orElse(starts);

type SlideStartsModule = {
  of: (starts: SlideStarts, item: string) => Maybe<Slide>;
  afterCrossing: (item: string, homeward: boolean) => Places;
  afterKeyboardStep: (order: readonly string[], walker: string, step: 1 | -1) => Places;
  afterSettle: (before: readonly string[], after: readonly string[]) => Places;
  begun: (starts: SlideStarts, places: Places) => SlideStarts;
  ended: (starts: SlideStarts, item: string) => SlideStarts;
};

export const slideStarts: SlideStartsModule = {of, afterCrossing, afterKeyboardStep, afterSettle, begun, ended};
