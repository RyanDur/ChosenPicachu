import {FC} from 'react';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {Page} from '@pages/BasePage/Page';
import names from '@pages/names.json';

export const gamesHeader = <Header title="Play Games" listed={names.games}/>;

export const GamesError: FC = () => <Page header={gamesHeader} inView={false}><PageError/></Page>;
