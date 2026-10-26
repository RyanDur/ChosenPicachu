import {FC, lazy, Suspense} from 'react';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {Page} from '@pages/BasePage/Page';
import names from '@pages/names.json';

const HomePage = lazy(() => import('./HomePage').then(({HomePage}) => ({default: HomePage})));

const header = <Header title="The three languages" listed={names.home}/>;

export const ErrorBoundary: FC = () => <Page header={header}><PageError/></Page>;

const Room: FC = () => <Page header={header}><Suspense><HomePage/></Suspense></Page>;

export default Room;
