import {FC} from 'react';
import {Header, Page, PageError} from '@page';
import {RecordPage} from './RecordPage';
import {listing} from './listing';
import {moments} from './calendar';

const header = <Header title="The record" listed={listing.ofRecord(moments.inOrder.length)}/>;

export const ErrorBoundary: FC = () => <Page header={header}><PageError/></Page>;

export const Room: FC = () => <Page header={header}><RecordPage/></Page>;
