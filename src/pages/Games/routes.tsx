import {Paths} from '@pages/Paths';
import {lazy} from 'react';

const ThreeInARow = lazy(() => import('./ThreeInARow').then(m => ({default: m.ThreeInARow})));
const GamesPage = lazy(() => import('./GamesPage').then(m => ({default: m.GamesPage})));

export enum GamePaths {
  colorGame = 'colorGame',
}
export const Games = {
  path: `${Paths.games}/*`,
  element: <GamesPage/>,
  children: [
    {
      path: GamePaths.colorGame,
      element: <ThreeInARow/>
    }
  ]
};