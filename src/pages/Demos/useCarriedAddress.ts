import {maybe} from '@ryandur/sand';
import {useSearchParamsObject} from '@navigation/search-params';

export type Place = {
  to: string;
  heading?: string;
};

export const useCarriedAddress = (): ((to: string, heading?: string) => string) => {
  const {searchFromShown} = useSearchParamsObject({});
  return (to, heading) =>
    `${to}${searchFromShown({})}${maybe(heading).map(id => `#${id}`).orElse('')}`;
};
