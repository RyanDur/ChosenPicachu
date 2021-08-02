import {Piece} from '../../../../data/types';
import {Consumer} from '../../../UserInfo/types';
import {createContext, useContext, useMemo, useState} from 'react';

interface PieceContext {
    piece: Partial<Piece>;
    updatePiece: Consumer<Partial<Piece>>;
}

export const ArtPieceContext = createContext<PieceContext>({
    piece: {},
    updatePiece: (piece: Partial<Piece> = {}) => void piece
});
export const useArtPiece = () => useContext(ArtPieceContext);
export const useArtPieceContext = (): PieceContext => {
    const [piece, updatePiece] = useState<Partial<Piece>>({});
    return useMemo(() => ({piece, updatePiece}), [piece]);
};