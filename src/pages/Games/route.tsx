import {FC} from 'react';
import {CenteredMain, Header, Main, PageError} from '@page';
import names from '@navigation/names.json';
import {GamesPage} from './GamesPage';

const header = <Header title="Play Games" listed={names.games}/>;

export const ErrorBoundary: FC = () => <>{header}<CenteredMain><PageError/></CenteredMain></>;

export const Room: FC = () => <>{header}<Main><GamesPage/></Main></>;
