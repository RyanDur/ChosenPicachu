import {useLocation, useNavigate} from 'react-router-dom';
import {useEffect} from "react";
import {toQueryObj, toQueryString} from "../../util/URL";
import {has} from "@ryandur/sand";

const filterEmpty = (obj: { [p: string]: string | number }) =>
  Object.entries(obj).reduce((acc, [key, value]) => has(value) ? {...acc, [key]: value} : acc, {});

type SearchParamsObject<T extends { [key: string]: unknown }> = T & {
  updateSearchParams: (params: Partial<T>) => void,
  removeSearchParams: (...params: string[]) => void,
  createSearchParams: (params: Partial<T>) => string,
};
export const useSearchParamsObject = <T extends { [p: string]: string | number }>(val?: T): SearchParamsObject<T> => {
  const navigate = useNavigate();
  const location = useLocation();

  const createSearchParams = (params = {}): string =>
    toQueryString({...filterEmpty(toQueryObj(location.search)), ...filterEmpty(params)});

  const removeSearchParams = (...params: string[]) => {
    const newSearch = Object.entries(toQueryObj(location.search))
      .reduce((acc, [key, value]) => params.includes(key)
          ? acc
          : {...acc, [key]: value},
        {});

    navigate({search: toQueryString(newSearch)});
  };

  const updateSearchParams = (params = {}) =>
    navigate({search: createSearchParams(params)});

  useEffect(() => {
    has(val) && updateSearchParams(val);
  }, []);

  return {
    ...(toQueryObj(location.search) as T),
    updateSearchParams,
    createSearchParams,
    removeSearchParams
  };
};
