import {FC} from 'react';
import {Navigate, useHref, useLocation, useSearchParams} from 'react-router';
import {useHydrated} from '@components';

export const ToSavedTab: FC<{addressOf: (tab?: string) => string}> = ({addressOf}) => {
  const [params] = useSearchParams();
  const {hash} = useLocation();
  const first = useHref(addressOf());
  const hydrated = useHydrated();
  const dials = new URLSearchParams(params);
  dials.delete('tab');
  return <>
    <noscript><meta httpEquiv="refresh" content={`0; url=${first}`}/></noscript>
    {hydrated && <Navigate replace to={{pathname: addressOf(params.get('tab') ?? undefined), search: dials.toString(), hash}}/>}
  </>;
};
