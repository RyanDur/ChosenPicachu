import {lazy, Suspense} from 'react';
import {Paths} from '@pages/Paths';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {Page} from '@pages/BasePage/Page';
import names from '@pages/names.json';

const HomePage = lazy(() => import('./HomePage').then(({HomePage}) => ({default: HomePage})));

const header = <Header title="The three languages" listed={names.home}/>;

export const Home = {
  path: Paths.home,
  errorElement: <Page header={header}><PageError/></Page>,
  element: <Page header={header}><Suspense><HomePage/></Suspense></Page>
};
