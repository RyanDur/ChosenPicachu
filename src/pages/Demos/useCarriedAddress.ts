import {empty, maybe} from '@ryandur/sand';
import {useSearchParamsOnceHydrated} from '@navigation/search-params';
import {dialParams} from './Controls';

export type Place = {
  to: string;
  heading?: string;
};

export const useCarriedAddress = (): ((to: string, heading?: string) => string) => {
  const [shown] = useSearchParamsOnceHydrated();
  const dials = dialParams.keptFrom(shown).toString();
  const search = empty(dials) ? '' : `?${dials}`;
  return (to, heading) => `${to}${search}${maybe(heading).map(id => `#${id}`).orElse('')}`;
};
