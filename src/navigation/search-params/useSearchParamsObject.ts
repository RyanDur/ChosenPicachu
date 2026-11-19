import {NavigateOptions, useSearchParams} from 'react-router';
import {queryString} from '@transport';
import {has, maybe, not} from '@ryandur/sand';
import * as schema from 'schemawax';
import {useSearchParamsOnceHydrated} from './useSearchParamsOnceHydrated';

const filterEmpty = (params: {[key: string]: string | number}) =>
  Object.entries(params).reduce((kept, [key, value]) => has(value) ? {...kept, [key]: value} : kept, {});

const keepingThePlace: NavigateOptions = {preventScrollReset: true};

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
  updateSearchParams: (params: Partial<T>, options?: NavigateOptions) => void;
  removeSearchParams: (params: string[], options?: NavigateOptions) => void;
  searchFromShown: (params: Partial<T>) => string;
  searchFromAddress: (params: Partial<T>) => string;
  searchWithout: (params: string[]) => string;
};
type Params = {[key: string]: string | number};

export function useSearchParamsObject<T extends Params>(
  decoders: ParamDecoders<T>
): SearchParamsObject<T, Record<never, never>>;
export function useSearchParamsObject<T extends Params, D extends Partial<NoInfer<T>>>(
  decoders: ParamDecoders<T>,
  defaults: D
): SearchParamsObject<T, D>;
export function useSearchParamsObject<T extends Params>(
  decoders: ParamDecoders<T>,
  defaults: Partial<T> = {}
): SearchParamsObject<T, Record<never, never>> {
  const [searchParams, setSearchParams] = useSearchParams();
  const [shown] = useSearchParamsOnceHydrated();
  const given: Partial<T> = {...defaults, ...decodeParams(decoders, Object.fromEntries(shown.entries()))};

  const searchFromShown = (params = {}): string =>
    queryString.from({...Object.fromEntries(shown.entries()), ...filterEmpty(params)});

  const searchFromAddress = (params = {}): string =>
    queryString.from({...Object.fromEntries(searchParams.entries()), ...filterEmpty(params)});

  const without = (params: string[]): [string, string][] =>
    Array.from(searchParams.entries()).filter(([key]) => not(params.includes(key)));

  const searchWithout = (params: string[]): string => queryString.from(Object.fromEntries(without(params)));

  const removeSearchParams = (params: string[], options?: NavigateOptions) =>
    setSearchParams(without(params), {...keepingThePlace, ...options});

  const updateSearchParams = (params = {}, options?: NavigateOptions) =>
    setSearchParams({...Object.fromEntries(searchParams.entries()), ...filterEmpty(params)},
      {...keepingThePlace, ...options});

  return {
    ...given,
    updateSearchParams,
    searchFromShown,
    searchFromAddress,
    searchWithout,
    removeSearchParams
  };
}
