import {maybe} from '@ryandur/sand';
import {useSearchParamsObject} from '@navigation/search-params';

export const useCarriedAddress = (): ((to: string, heading?: string, search?: Record<string, string>) => string) => {
  const {searchFromShown} = useSearchParamsObject({});
  return (to, heading, search) =>
    `${to}${searchFromShown(maybe(search).orElse({}))}${maybe(heading).map(id => `#${id}`).orElse('')}`;
};
