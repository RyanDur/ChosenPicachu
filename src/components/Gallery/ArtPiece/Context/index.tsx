import {createContext, useContext, useMemo, useState} from 'react';
import {Consumer} from '@ryandur/sand';
import {Art} from '../../../../data/artGallery/types/response';

interface PieceContext {
    piece: Partial<Art>;
    updatePiece: Consumer<Art>;
    reset: Consumer<void>;
}

export const ArtPieceContext = createContext<PieceContext>({
    piece: {},
    updatePiece: (piece: Art = {} as Art) => void piece,
    reset: () => void 0
});
export const useArtPiece = () => useContext(ArtPieceContext);
export const useArtPieceContext = (): PieceContext => {
    const [piece, updatePiece] = useState<Partial<Art>>({});
    return useMemo(() => ({
        piece,
        updatePiece,
        reset: () => updatePiece({})
    }), [piece]);
};