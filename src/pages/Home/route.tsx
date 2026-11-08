import {FC} from 'react';
import {Header, Page, PageError} from '@page';
import names from '@navigation/names.json';
import {HomePage} from './HomePage';

const header = <Header title="The three languages" listed={names.home}/>;

export const ErrorBoundary: FC = () => <Page header={header}><PageError/></Page>;

export const Room: FC = () => <Page header={header}><HomePage/></Page>;
