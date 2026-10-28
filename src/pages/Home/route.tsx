import {FC} from 'react';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {Page} from '@pages/BasePage/Page';
import names from '@pages/names.json';
import {HomePage} from './HomePage';

const header = <Header title="The three languages" listed={names.home}/>;

export const ErrorBoundary: FC = () => <Page header={header}><PageError/></Page>;

const Room: FC = () => <Page header={header}><HomePage/></Page>;

export default Room;
