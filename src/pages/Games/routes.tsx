import {Paths} from '@pages/Paths';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {Page} from '@pages/BasePage/Page';
import {ThreeInARow} from './ThreeInARow';
import {GamesPage} from './GamesPage';
import {GamePaths} from './GamePaths';
import names from '@pages/names.json';

const header = <Header title="Play Games" listed={names.games}/>;

const gamesError = <Page header={header} inView={false}><PageError/></Page>;

export const Games = [
  {path: Paths.games, errorElement: gamesError, element: <Page header={header}><GamesPage/></Page>},
  {path: `${Paths.games}${GamePaths.colorGame}`, errorElement: gamesError, element: <Page header={header} inView={false}><ThreeInARow/></Page>}
];
