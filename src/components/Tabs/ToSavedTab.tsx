import {FC} from 'react';
import {Navigate, useHref, useSearchParams} from 'react-router';
import {toQueryString} from '@transport/url';

export const ToSavedTab: FC<{addressOf: (tab?: string) => string}> = ({addressOf}) => {
  const [params] = useSearchParams();
  const {tab, ...dials} = Object.fromEntries(params);
  const first = useHref(addressOf());
  return <>
    <noscript><meta httpEquiv="refresh" content={`0; url=${first}`}/></noscript>
    <Navigate replace to={`${addressOf(tab)}${toQueryString(dials)}`}/>
  </>;
};
