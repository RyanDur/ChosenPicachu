import {FC} from 'react';
import {Header, Page, PageError} from '@frame/page';
import names from '@frame/navigation/names.json';
import {HomePage} from './HomePage';

const header = <Header title="The three languages" listed={names.home}/>;

export const ErrorBoundary: FC = () => <Page header={header}><PageError/></Page>;

const Room: FC = () => <Page header={header}><HomePage/></Page>;

export default Room;
