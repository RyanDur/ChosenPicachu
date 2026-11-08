import {FC} from 'react';
import {Navigate, useHref, useSearchParams} from 'react-router';
import {useHydrated} from '@frame/state';
import {toQueryString} from '@transport';

export const ToSavedTab: FC<{addressOf: (tab?: string) => string}> = ({addressOf}) => {
  const [params] = useSearchParams();
  const {tab, ...dials} = Object.fromEntries(params);
  const first = useHref(addressOf());
  const hydrated = useHydrated();
  return <>
    <noscript><meta httpEquiv="refresh" content={`0; url=${first}`}/></noscript>
    {hydrated && <Navigate replace to={`${addressOf(tab)}${toQueryString(dials)}`}/>}
  </>;
};
