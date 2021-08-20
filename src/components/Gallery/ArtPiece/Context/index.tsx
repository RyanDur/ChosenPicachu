import {Piece} from '../../../../data/types';
import {Consumer} from '../../../UserInfo/types';
import {createContext, useContext, useMemo, useState} from 'react';

interface PieceContext {
    piece: Partial<Piece>;
    updatePiece: Consumer<Piece>;
    reset: Consumer<void>;
}

export const ArtPieceContext = createContext<PieceContext>({
    piece: {},
    updatePiece: (piece: Piece = {} as Piece) => void piece,
    reset: () => void 0
});
export const useArtPiece = () => useContext(ArtPieceContext);
export const useArtPieceContext = (): PieceContext => {
    const [piece, updatePiece] = useState<Partial<Piece>>({});
    return useMemo(() => ({
        piece,
        updatePiece,
        reset: () => updatePiece({})
    }), [piece]);
};