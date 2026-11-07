import {createContext, Dispatch} from 'react';
import {AllArt, MuseumReply, museumReply, ReplyChange} from '@pages/Gallery/museums';

type Wall = {
  wall: MuseumReply<AllArt>;
  dispatch: Dispatch<ReplyChange<AllArt>>;
};

export const Wall = createContext<Wall>({wall: museumReply.initial, dispatch: () => undefined});
