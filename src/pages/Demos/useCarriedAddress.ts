import {empty, maybe} from '@ryandur/sand';
import {useLocation} from 'react-router';
import {useSearchParamsOnceHydrated} from '@navigation/search-params';
import {readerSettings} from './ReaderSettings';

export type Place = {
  to: string;
  heading?: string;
};

export const useCarriedAddress = (): ((to: string, heading?: string) => string) => {
  const [shown] = useSearchParamsOnceHydrated();
  const {pathname} = useLocation();
  const searchOf = (params: URLSearchParams): string => empty(params.toString()) ? '' : `?${params}`;
  const settings = searchOf(readerSettings.keptFrom(shown));
  const searchFor = (to: string): string => to === pathname ? searchOf(shown) : settings;
  return (to, heading) => `${to}${searchFor(to)}${maybe(heading).map(id => `#${id}`).orElse('')}`;
};
