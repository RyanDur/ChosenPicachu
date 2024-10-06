import {useSearchParams} from 'react-router-dom';
import {useEffect} from "react";
import {toQueryString} from "../../util/URL";
import {has} from "@ryandur/sand";

const filterEmpty = (obj: { [p: string]: string | number }) =>
  Object.entries(obj).reduce((acc, [key, value]) => has(value) ? {...acc, [key]: value} : acc, {});

type SearchParamsObject<T extends { [key: string]: unknown }> = T & {
  updateSearchParams: (params: Partial<T>) => void,
  removeSearchParams: (...params: string[]) => void,
  createSearchParams: (params: Partial<T>) => string,
};
export const useSearchParamsObject = <T extends { [p: string]: string | number }>(val?: T): SearchParamsObject<T> => {
  const [searchParams, setSearchParams] = useSearchParams();

  const createSearchParams = (params = {}): string =>
    toQueryString({...Object.fromEntries(searchParams.entries()), ...filterEmpty(params)});

  const removeSearchParams = (...params: string[]) => {
    for (const [key] of searchParams.entries()) {
      if (params.includes(key)) searchParams.delete(key);
    }
    setSearchParams(searchParams);
  };

  const updateSearchParams = (params = {}) =>
    setSearchParams({...Object.fromEntries(searchParams.entries()), ...filterEmpty(params)});

  useEffect(() => {
    has(val) && updateSearchParams(val);
  }, []);

  return {
    ...(Object.fromEntries(searchParams.entries()) as T),
    updateSearchParams,
    createSearchParams,
    removeSearchParams
  };
};
