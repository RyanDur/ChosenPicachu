import * as schema from 'schemawax';
import {maybe} from '@ryandur/sand';
import {Choice} from '@components/PillGlider';
import {useSearchParamsObject} from '@navigation/search-params';

type ExhibitStep<T extends string> = {
  step: T;
  numberedSteps: Choice<T>[];
  choose: (step: T) => void;
  entryFor: (step: T) => Record<string, string>;
};

export const useExhibitStep = <T extends string>(
  addressKey: string, steps: readonly Choice<T>[], unnamed: T
): ExhibitStep<T> => {
  const {[addressKey]: named, updateSearchParams} = useSearchParamsObject({[addressKey]: schema.string});
  return {
    step: maybe(steps.find(({value}) => value === named)).map(({value}) => value).orElse(unnamed),
    numberedSteps: steps.map(({words, value}, place) => ({words: `${place + 1} · ${words}`, value})),
    choose: step => updateSearchParams({[addressKey]: step}),
    entryFor: step => ({[addressKey]: step})
  };
};
