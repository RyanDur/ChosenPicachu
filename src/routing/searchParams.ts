import {useSearchParams} from 'react-router-dom';
import {toQueryString} from '@transport/url';
import {has} from '@ryandur/sand';

const filterEmpty = (obj: { [p: string]: string | number }) =>
  Object.entries(obj).reduce((acc, [key, value]) => has(value) ? {...acc, [key]: value} : acc, {});

type SearchParamsObject<T extends { [key: string]: unknown }> = T & {
  updateSearchParams: (params: Partial<T>) => void,
  removeSearchParams: (...params: string[]) => void,
  createSearchParams: (params: Partial<T>) => string,
};
export const useSearchParamsObject = <T extends { [p: string]: string | number }>(defaults?: Partial<T>): SearchParamsObject<T> => {
  const [searchParams, setSearchParams] = useSearchParams();

  const createSearchParams = (params = {}): string =>
    toQueryString({...Object.fromEntries(searchParams.entries()), ...filterEmpty(params)});

  const removeSearchParams = (...params: string[]) =>
    setSearchParams(Array.from(searchParams.entries())
      .filter(([key]) => !params.includes(key)));

  const updateSearchParams = (params = {}) =>
    setSearchParams({...Object.fromEntries(searchParams.entries()), ...filterEmpty(params)});

  return {
    ...defaults,
    ...(Object.fromEntries(searchParams.entries()) as T),
    updateSearchParams,
    createSearchParams,
    removeSearchParams
  };
};
