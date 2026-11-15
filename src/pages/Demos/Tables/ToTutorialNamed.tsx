import {FC} from 'react';
import {Navigate, useLocation, useSearchParams} from 'react-router';
import {maybe} from '@ryandur/sand';
import {useHydrated} from '@components';
import {tableTutorials} from './tutorial-pages';

export const ToTutorialNamed: FC = () => {
  const [params] = useSearchParams();
  const {hash} = useLocation();
  const hydrated = useHydrated();
  const dials = new URLSearchParams(params);
  dials.delete('tut');
  return maybe(tableTutorials.all().find(tutorial => tutorial === params.get('tut')))
    .either(
      tutorial => hydrated &&
        <Navigate replace to={{pathname: tableTutorials.addressOf(tutorial), search: dials.toString(), hash}}/>,
      () => null);
};
