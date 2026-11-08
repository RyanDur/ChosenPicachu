import {FC} from 'react';
import {Page} from '@frame/page';
import {GamesPage} from './GamesPage';
import {gamesHeader, GamesError} from './frame';

export const ErrorBoundary = GamesError;

const Room: FC = () => <Page header={gamesHeader}><GamesPage/></Page>;

export default Room;
