import {Paths} from '@libraries/routing/Paths';
import {ThreeInARow} from './ThreeInARow';
import {GamesPage} from './GamesPage';

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