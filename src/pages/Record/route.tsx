import {FC} from 'react';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {Page} from '@pages/BasePage/Page';
import {RecordPage} from './RecordPage';
import {recordListing} from './listing';
import {inOrder} from './moments/moments';

const header = <Header title="The record" listed={recordListing(inOrder.length)}/>;

export const ErrorBoundary: FC = () => <Page header={header}><PageError/></Page>;

const Room: FC = () => <Page header={header}><RecordPage/></Page>;

export default Room;
