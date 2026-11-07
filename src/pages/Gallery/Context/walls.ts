import {createContext, Dispatch} from 'react';
import {AllArt, MuseumReply, ReplyChange, museumReply} from '@pages/Gallery/museums';

type Walls = {
  wall: MuseumReply<AllArt>;
  dispatch: Dispatch<ReplyChange<AllArt>>;
};

export const Walls = createContext<Walls>({wall: museumReply.initial, dispatch: () => undefined});
