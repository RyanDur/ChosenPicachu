import {FC} from 'react';
import {Page} from '@page';
import {GamesPage} from './GamesPage';
import {gamesHeader, GamesError} from './frame';

export const ErrorBoundary = GamesError;

export const Room: FC = () => <Page header={gamesHeader}><GamesPage/></Page>;
