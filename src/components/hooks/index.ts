import {useSearchParams} from 'react-router-dom';
import {useEffect} from "react";
import {toQueryString} from "../../util/URL";

type SearchParamsObject<T extends { [key: string]: unknown }> = T & {
  updateSearchParams: (params: Partial<T>) => void,
  createSearchParams: (params: Partial<T>) => string
};
export const useSearchParamsObject = <T extends { [key: string]: unknown }>(val?: T): SearchParamsObject<T> => {
  const [searchQuery, setSearchQuery] = useSearchParams();
  const updateSearchParams = (params: Partial<T>) => {
    const currentParams = Object.fromEntries(searchQuery.entries());
    setSearchQuery({...currentParams, ...params});
  };

  const createSearchParams = (params: Partial<T>): string => {
    const currentParams = Object.fromEntries(searchQuery.entries());
    return toQueryString({...currentParams, ...params});
  };

  useEffect(() => {
    if (val) updateSearchParams(val);
  }, []);

  return {
    ...(Object.fromEntries(searchQuery.entries()) as T),
    updateSearchParams,
    createSearchParams
  };
};
