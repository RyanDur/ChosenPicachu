import {FC} from 'react';
import {Navigate, useSearchParams} from 'react-router';
import {maybe} from '@ryandur/sand';
import {useHydrated} from '@components';
import {queryString} from '@transport';
import {tableTutorials} from './tutorial-pages';

export const ToTutorialNamed: FC = () => {
  const [params] = useSearchParams();
  const {tut, ...dials} = Object.fromEntries(params);
  const hydrated = useHydrated();
  return maybe(tableTutorials.all().find(tutorial => tutorial === tut))
    .either(
      tutorial => hydrated && <Navigate replace to={`${tableTutorials.addressOf(tutorial)}${queryString.from(dials)}`}/>,
      () => null);
};
