import {Art} from '@components/art-gallery/museums/art';
import {MuseumReply} from '@components/art-gallery/museums/reply';
import {Consumer, nothing} from '@ryandur/sand';
import {createContext, useContext} from 'react';

export type PieceContext = {
  easel: MuseumReply<Art>;
  asked: Consumer<void>;
  answered: Consumer<Art>;
  refused: Consumer<void>;
  abandoned: Consumer<void>;
};

export const Context = createContext<PieceContext>({
  easel: {reply: 'unasked', standing: nothing()},
  asked: () => void 0,
  answered: (piece: Art) => void piece,
  refused: () => void 0,
  abandoned: () => void 0
});
export const useArtPiece = () => useContext(Context);
