import {FC} from 'react';
import {Navigate, useHref, useLocation, useSearchParams} from 'react-router';
import {useHydrated} from '@components';
import {maybe} from '@ryandur/sand';

export const ToSavedTab: FC<{addressOf: (tab?: string) => string}> = ({addressOf}) => {
  const [params] = useSearchParams();
  const {hash} = useLocation();
  const first = useHref(addressOf());
  const hydrated = useHydrated();
  const dials = new URLSearchParams(params);
  dials.delete('tab');
  const savedTab = {pathname: addressOf(maybe(params.get('tab')).orElse('')), search: dials.toString(), hash};
  return <>
    <noscript><meta httpEquiv="refresh" content={`0; url=${first}`}/></noscript>
    {hydrated && <Navigate replace to={savedTab}/>}
  </>;
};
