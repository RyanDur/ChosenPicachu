import {Choice, PillGlider} from '@components/PillGlider';

type Props<T extends string> = {
  label: string;
  at: string;
  steps: readonly Choice<T>[];
  chosen: T;
  onChosen: (step: T) => void;
};

export const ExhibitSteps = <T extends string>({label, at, steps, chosen, onChosen}: Props<T>) =>
  <PillGlider label={label} name={at} chosen={chosen} onChosen={onChosen}
    choices={steps.map(({words, value}, place) => ({words: `${place + 1} · ${words}`, value}))}/>;
