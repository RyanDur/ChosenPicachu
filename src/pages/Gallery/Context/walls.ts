import {createContext, Dispatch} from 'react';
import {nothing} from '@ryandur/sand';
import {AllArt, MuseumReply} from '@pages/Gallery/museums';

export type Wall = MuseumReply<AllArt>;

export type WallChange =
  | {readonly type: 'asked'}
  | {readonly type: 'answered'; readonly answer: AllArt}
  | {readonly type: 'refused'}
  | {readonly type: 'abandoned'};

type Walls = {
  wall: Wall;
  dispatch: Dispatch<WallChange>;
};

export const Walls = createContext<Walls>({wall: {reply: 'unasked', standing: nothing()}, dispatch: () => undefined});
