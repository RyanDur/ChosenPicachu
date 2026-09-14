import {Art} from '@components/art-gallery/museums/art';
import {MuseumReply} from '@components/art-gallery/museums/reply';
import {Consumer} from '@ryandur/sand';
import {createContext, useContext} from 'react';

export type PieceContext = {
  piece: MuseumReply<Art>;
  asked: Consumer<void>;
  answered: Consumer<Art>;
  refused: Consumer<void>;
  reset: Consumer<void>;
}

export const Context = createContext<PieceContext>({
  piece: {reply: 'unasked'},
  asked: () => void 0,
  answered: (piece: Art) => void piece,
  refused: () => void 0,
  reset: () => void 0
});
export const useArtPiece = () => useContext(Context);
