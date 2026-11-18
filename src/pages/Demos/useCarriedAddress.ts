import {maybe} from '@ryandur/sand';
import {useSearchParamsOnceHydrated} from '@navigation/search-params';
import {queryString} from '@transport';
import {movedParams} from './Tables';

export type Place = {
  to: string;
  heading?: string;
};

export const useCarriedAddress = (): ((to: string, heading?: string) => string) => {
  const [shown] = useSearchParamsOnceHydrated();
  const search = queryString.from(Object.fromEntries(movedParams.droppedFrom(shown).entries()));
  return (to, heading) =>
    `${to}${search}${maybe(heading).map(id => `#${id}`).orElse('')}`;
};
