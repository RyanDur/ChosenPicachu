import {Outlet} from 'react-router';
import {Paths} from '@pages/Paths';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {ThreeInARow} from './ThreeInARow';
import {GamesPage} from './GamesPage';
import {GamePaths} from './GamePaths';

const GamesHeader = () => <Header title="Play Games"/>;

const ColorGame = {
  path: GamePaths.colorGame,
  element: <ThreeInARow/>
};

export const Games = {
  path: Paths.games,
  errorElement: <PageError/>,
  handle: {header: GamesHeader},
  element: <Outlet/>,
  children: [{index: true, element: <GamesPage/>}, ColorGame]
};
