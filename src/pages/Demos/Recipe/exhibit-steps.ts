import {Choice} from '@components/PillGlider';

const numbered = <T extends string>(steps: readonly Choice<T>[]): Choice<T>[] =>
  steps.map(({words, value}, place) => ({words: `${place + 1} · ${words}`, value}));

type ExhibitSteps = {numbered: typeof numbered};

export const exhibitSteps: ExhibitSteps = {numbered};
