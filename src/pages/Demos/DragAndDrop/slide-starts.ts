export type SlideStarts = Readonly<Record<string, number>>;

const afterCrossing = (item: string, homeward: boolean): SlideStarts =>
  ({[item]: homeward ? -1 : 1});

const afterKeyboardStep = (order: readonly string[], walker: string, step: 1 | -1): SlideStarts => {
  const neighbour = order[order.indexOf(walker) + step];
  return {[walker]: -step, [neighbour]: step};
};

type SlideStartsModule = {
  afterCrossing: (item: string, homeward: boolean) => SlideStarts;
  afterKeyboardStep: (order: readonly string[], walker: string, step: 1 | -1) => SlideStarts;
};

export const slideStarts: SlideStartsModule = {afterCrossing, afterKeyboardStep};
