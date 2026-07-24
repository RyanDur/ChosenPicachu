import {Paths} from '@pages/Paths';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {lazy} from 'react';

const HomePage = lazy(() => import('./component').then(m => ({default: m.HomePage})));

const HomeHeader = () => <Header title="Home"/>;

export const Home = {
  path: Paths.home,
  errorElement: <PageError/>,
  handle: {header: HomeHeader},
  element: <HomePage/>
};
