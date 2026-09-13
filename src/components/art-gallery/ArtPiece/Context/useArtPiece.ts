import {Art} from '@components/art-gallery/museums/types/response';
import {Consumer, Maybe, nothing} from '@ryandur/sand';
import {createContext, useContext} from 'react';

export type PieceContext = {
  piece: Maybe<Art>;
  updatePiece: Consumer<Art>;
  reset: Consumer<void>;
}

export const Context = createContext<PieceContext>({
  piece: nothing(),
  updatePiece: (piece: Art) => void piece,
  reset: () => void 0
});
export const useArtPiece = () => useContext(Context);
