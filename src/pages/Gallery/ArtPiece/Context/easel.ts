import {createContext, Dispatch} from 'react';
import {Art, MuseumReply, museumReply, ReplyChange} from '@pages/Gallery/museums';

type Easel = {
  easel: MuseumReply<Art>;
  dispatch: Dispatch<ReplyChange<Art>>;
};

export const Easel = createContext<Easel>({easel: museumReply.initial, dispatch: () => undefined});
