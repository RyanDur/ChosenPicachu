import {useSearchParams} from 'react-router';
import {toQueryString} from '@transport/url';
import {has} from '@ryandur/sand';
import * as D from 'schemawax';

const filterEmpty = (obj: { [p: string]: string | number }) =>
  Object.entries(obj).reduce((acc, [key, value]) => has(value) ? {...acc, [key]: value} : acc, {});

export const numberParam: D.Decoder<number> = D.regex(/^-?\d+$/).andThen(Number);

type ParamDecoders<T> = { [K in keyof T]: D.Decoder<T[K]> };

const decodeParams = <T>(decoders: ParamDecoders<T>, raw: Record<string, unknown>): Partial<T> => {
  const decoded: Partial<T> = {};
  for (const key in decoders) {
    const value = decoders[key].decode(raw[key]);
    if (value !== null) decoded[key] = value;
  }
  return decoded;
};

type SearchParamsObject<T extends { [key: string]: unknown }> = Partial<T> & {
  updateSearchParams: (params: Partial<T>) => void,
  removeSearchParams: (...params: string[]) => void,
  createSearchParams: (params: Partial<T>) => string,
};
export const useSearchParamsObject = <T extends { [p: string]: string | number }>(
  decoders: ParamDecoders<T>,
  defaults?: Partial<NoInfer<T>>
): SearchParamsObject<T> => {
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
    ...decodeParams(decoders, Object.fromEntries(searchParams.entries())),
    updateSearchParams,
    createSearchParams,
    removeSearchParams
  };
};
