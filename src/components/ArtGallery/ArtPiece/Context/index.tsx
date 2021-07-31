import {createContext, useContext, useMemo, useState} from 'react';
import {Piece} from '../../../../data/types';
import {Consumer} from '../../../UserInfo/types';

interface ArtContext {
    piece: Partial<Piece>;
    updatePiece: Consumer<Partial<Piece>>;
}

export const ArtPieceContext = createContext<ArtContext>({
    piece: {},
    updatePiece: (piece: Partial<Piece> = {}) => void piece
});
export const useArtPiece = () => useContext(ArtPieceContext);
export const useArtPieceContext = (): ArtContext => {
    const [piece, updatePiece] = useState<Partial<Piece>>({});
    return useMemo(() => ({piece, updatePiece}), [piece]);
};