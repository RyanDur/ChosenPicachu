import {FC} from 'react';
import {Header, Main, PageError} from '@page';
import {RecordPage} from './RecordPage';
import {listing} from './listing';
import {moments} from './calendar';

const header = <Header pageName="The record" listed={listing.ofRecord(moments.inOrder.length)}/>;

export const ErrorBoundary: FC = () => <>{header}<Main><PageError/></Main></>;

export const Room: FC = () => <>{header}<Main><RecordPage/></Main></>;
