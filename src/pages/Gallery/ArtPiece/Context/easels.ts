import {createContext, Dispatch} from 'react';
import {Art, MuseumReply, ReplyChange, replies} from '@pages/Gallery/museums';

type Easels = {
  easel: MuseumReply<Art>;
  dispatch: Dispatch<ReplyChange<Art>>;
};

export const Easels = createContext<Easels>({easel: replies<Art>().initial, dispatch: () => undefined});
