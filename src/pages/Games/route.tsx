import {FC} from 'react';
import {Header, Page, PageError} from '@page';
import names from '@navigation/names.json';
import {GamesPage} from './GamesPage';

const header = <Header title="Play Games" listed={names.games}/>;

export const ErrorBoundary: FC = () => <Page header={header} inView={false}><PageError/></Page>;

export const Room: FC = () => <Page header={header}><GamesPage/></Page>;
