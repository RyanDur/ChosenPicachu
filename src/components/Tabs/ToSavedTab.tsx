import {FC} from 'react';
import {Navigate, useSearchParams} from 'react-router';
import {toQueryString} from '@transport/url';

export const ToSavedTab: FC<{addressOf: (tab?: string) => string}> = ({addressOf}) => {
  const [params] = useSearchParams();
  const {tab, ...dials} = Object.fromEntries(params);
  return <Navigate replace to={`${addressOf(tab)}${toQueryString(dials)}`}/>;
};
