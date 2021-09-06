import {createContext, useContext, useMemo, useState} from 'react';
import {Art} from '../../../../data/artGallery/types';
import {Consumer} from '../../../../data/types';

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