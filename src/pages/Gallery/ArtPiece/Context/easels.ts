import {createContext, Dispatch} from 'react';
import {Art, MuseumReply, ReplyChange, museumReply} from '@pages/Gallery/museums';

type Easels = {
  easel: MuseumReply<Art>;
  dispatch: Dispatch<ReplyChange<Art>>;
};

export const Easels = createContext<Easels>({easel: museumReply.initial, dispatch: () => undefined});
