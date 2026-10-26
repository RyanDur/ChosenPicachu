import {lazy, Suspense} from 'react';
import {Paths} from '@pages/Paths';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {Page} from '@pages/BasePage/Page';
import names from '@pages/names.json';

const RecordPage = lazy(() => import('./RecordPage').then(({RecordPage}) => ({default: RecordPage})));

const header = <Header title="The record" listed={names.record}/>;

export const TheRecord = {
  path: Paths.record,
  errorElement: <Page header={header}><PageError/></Page>,
  element: <Page header={header}><Suspense><RecordPage/></Suspense></Page>
};
