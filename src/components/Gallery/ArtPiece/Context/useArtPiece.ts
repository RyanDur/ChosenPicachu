import {Art} from '../../resource/types/response';
import {Consumer} from '@ryandur/sand';
import {createContext, useContext} from 'react';

export interface PieceContext {
  piece: Partial<Art>;
  updatePiece: Consumer<Art>;
  reset: Consumer<void>;
}

export const Context = createContext<PieceContext>({
  piece: {},
  updatePiece: (piece: Art = {} as Art) => void piece,
  reset: () => void 0
});
export const useArtPiece = () => useContext(Context);

