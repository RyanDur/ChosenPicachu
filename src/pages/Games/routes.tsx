import {Outlet} from 'react-router';
import {Paths} from '@pages/Paths';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {lazy} from 'react';

const ThreeInARow = lazy(() => import('./ThreeInARow').then(m => ({default: m.ThreeInARow})));

export enum GamePaths {
  colorGame = 'colorGame',
}

const GamesHeader = () => <Header title="Play Games"/>;

export const Games = {
  path: `${Paths.games}/*`,
  errorElement: <PageError/>,
  handle: {header: GamesHeader},
  element: <Outlet/>,
  children: [
    {
      path: GamePaths.colorGame,
      element: <ThreeInARow/>
    }
  ]
};
