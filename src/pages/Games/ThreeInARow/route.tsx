import {FC} from 'react';
import {Page} from '@pages/BasePage/Page';
import {ThreeInARow} from './ThreeInARow';
import {gamesHeader, GamesError} from '../frame';

export const ErrorBoundary = GamesError;

const Room: FC = () => <Page header={gamesHeader} inView={false}><ThreeInARow/></Page>;

export default Room;
