import {FC} from 'react';
import {Header, Main, PageError} from '@page';
import names from '@navigation/names.json';
import {HomePage} from './HomePage';

const header = <Header pageName="The three languages" listed={names.home}/>;

export const ErrorBoundary: FC = () => <>{header}<Main><PageError/></Main></>;

export const Room: FC = () => <>{header}<Main><HomePage/></Main></>;
