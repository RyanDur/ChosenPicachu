import {Paths} from '@pages/Paths';
import {lazy} from 'react';

const HomePage = lazy(() => import('./component').then(m => ({default: m.HomePage})));

export const Home = {
  path: Paths.home,
  element: <HomePage/>
};
