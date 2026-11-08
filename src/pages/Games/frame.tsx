import {FC} from 'react';
import {Header, Page, PageError} from '@page';
import names from '@navigation/names.json';

export const gamesHeader = <Header title="Play Games" listed={names.games}/>;

export const GamesError: FC = () => <Page header={gamesHeader} inView={false}><PageError/></Page>;
