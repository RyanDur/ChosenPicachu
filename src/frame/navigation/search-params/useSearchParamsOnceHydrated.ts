import {SetURLSearchParams, useSearchParams} from 'react-router';
import {useHydrated} from '@components';

const noSearch = new URLSearchParams();

// a page drawn at build time holds no search, so the dials apply once the script has taken the page over
export const useSearchParamsOnceHydrated = (): [URLSearchParams, SetURLSearchParams] => {
  const [searchParams, setSearchParams] = useSearchParams();
  return [useHydrated() ? searchParams : noSearch, setSearchParams];
};
