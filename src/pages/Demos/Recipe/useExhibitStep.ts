import * as schema from 'schemawax';
import {maybe} from '@ryandur/sand';
import {Choice} from '@components/PillGlider';
import {useSearchParamsObject} from '@navigation/search-params';
import {exhibitSteps} from './exhibit-steps';

type ExhibitStep<T extends string> = {
  step: T;
  numberedSteps: Choice<T>[];
  choose: (step: T) => void;
};

export const useExhibitStep = <T extends string>(
  addressKey: string, steps: readonly Choice<T>[], unnamed: T
): ExhibitStep<T> => {
  const {[addressKey]: named, updateSearchParams} = useSearchParamsObject({[addressKey]: schema.string});
  return {
    step: maybe(steps.find(({value}) => value === named)).map(({value}) => value).orElse(unnamed),
    numberedSteps: exhibitSteps.numbered(steps),
    choose: step => updateSearchParams({[addressKey]: step})
  };
};
