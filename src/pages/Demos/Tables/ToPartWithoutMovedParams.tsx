import {FC} from 'react';
import {Navigate, useLocation, useSearchParams} from 'react-router';
import {useHydrated} from '@components';
import {movedParams} from './moved-params';

export const ToPartWithoutMovedParams: FC = () => {
  const [params] = useSearchParams();
  const {pathname, hash} = useLocation();
  const hydrated = useHydrated();
  return hydrated && movedParams.namedIn(params) &&
    <Navigate replace to={{pathname, search: movedParams.droppedFrom(params).toString(), hash}}/>;
};
