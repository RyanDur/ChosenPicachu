import {createContext, Dispatch} from 'react';
import {AllArt, MuseumReply, ReplyChange, replies} from '@pages/Gallery/museums';

type Walls = {
  wall: MuseumReply<AllArt>;
  dispatch: Dispatch<ReplyChange<AllArt>>;
};

export const Walls = createContext<Walls>({wall: replies<AllArt>().initial, dispatch: () => undefined});
