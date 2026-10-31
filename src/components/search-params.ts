import {SetURLSearchParams, useSearchParams} from 'react-router';
import {toQueryString} from '@transport/url';
import {has, maybe} from '@ryandur/sand';
import * as schema from 'schemawax';
import {useHydrated} from '@components/hydrated';

const filterEmpty = (obj: {[p: string]: string | number}) =>
  Object.entries(obj).reduce((acc, [key, value]) => has(value) ? {...acc, [key]: value} : acc, {});

export const numberParam: schema.Decoder<number> = schema.regex(/^-?\d+$/).andThen(Number);

const noSearch = new URLSearchParams();

// a page drawn at build time holds no search, so the dials apply once the script has taken the page over
export const useSearchParamsOnceHydrated = (): [URLSearchParams, SetURLSearchParams] => {
  const [searchParams, setSearchParams] = useSearchParams();
  return [useHydrated() ? searchParams : noSearch, setSearchParams];
};

type ParamDecoders<T> = {[K in keyof T]: schema.Decoder<T[K]>};

const decodeParams = <T>(decoders: ParamDecoders<T>, raw: Record<string, unknown>): Partial<T> => {
  const decoded: Partial<T> = {};
  for (const key in decoders) {
    maybe(decoders[key].decode(raw[key])).map(value => {
      decoded[key] = value;
    });
  }
  return decoded;
};

type Given<T, D> = Partial<T> & Required<Pick<T, keyof D & keyof T>>;

type SearchParamsObject<T extends {[key: string]: unknown}, D> = Given<T, D> & {
  updateSearchParams: (params: Partial<T>, options?: {replace?: boolean}) => void;
  removeSearchParams: (...params: string[]) => void;
  searchFromShown: (params: Partial<T>) => string;
  searchFromAddress: (params: Partial<T>) => string;
};
type Params = {[p: string]: string | number};

export function useSearchParamsObject<T extends Params>(decoders: ParamDecoders<T>): SearchParamsObject<T, Record<never, never>>;
export function useSearchParamsObject<T extends Params, D extends Partial<NoInfer<T>>>(decoders: ParamDecoders<T>, defaults: D): SearchParamsObject<T, D>;
export function useSearchParamsObject<T extends Params>(decoders: ParamDecoders<T>, defaults: Partial<T> = {}): SearchParamsObject<T, Record<never, never>> {
  const [searchParams, setSearchParams] = useSearchParams();
  const [shown] = useSearchParamsOnceHydrated();
  const given: Partial<T> = {...defaults, ...decodeParams(decoders, Object.fromEntries(shown.entries()))};

  const searchFromShown = (params = {}): string =>
    toQueryString({...Object.fromEntries(shown.entries()), ...filterEmpty(params)});

  const searchFromAddress = (params = {}): string =>
    toQueryString({...Object.fromEntries(searchParams.entries()), ...filterEmpty(params)});

  const removeSearchParams = (...params: string[]) =>
    setSearchParams(Array.from(searchParams.entries())
      .filter(([key]) => !params.includes(key)));

  const updateSearchParams = (params = {}, options?: {replace?: boolean}) =>
    setSearchParams({...Object.fromEntries(searchParams.entries()), ...filterEmpty(params)}, options);

  return {
    ...given,
    updateSearchParams,
    searchFromShown,
    searchFromAddress,
    removeSearchParams
  };
}
