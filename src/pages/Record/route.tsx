import {FC, lazy, Suspense} from 'react';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {Page} from '@pages/BasePage/Page';
import names from '@pages/names.json';

const RecordPage = lazy(() => import('./RecordPage').then(({RecordPage}) => ({default: RecordPage})));

const header = <Header title="The record" listed={names.record}/>;

export const ErrorBoundary: FC = () => <Page header={header}><PageError/></Page>;

const Room: FC = () => <Page header={header}><Suspense><RecordPage/></Suspense></Page>;

export default Room;
