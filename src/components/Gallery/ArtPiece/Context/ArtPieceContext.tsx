import {FC, PropsWithChildren, useMemo, useState} from 'react';
import {Art} from '../../resource/types/response';
import {Context, PieceContext} from './useArtPiece';

const useArtPieceContext = (pieceState: Partial<Art> = {}): PieceContext => {
  const [piece, updatePiece] = useState<Partial<Art>>(pieceState);
  return useMemo(() => ({
    piece,
    updatePiece,
    reset: () => updatePiece({})
  }), [piece]);
};

export const ArtPieceContext: FC<PropsWithChildren & Partial<{
  pieceState: Partial<Art>
}>> = ({children, pieceState}) =>
  <Context.Provider value={useArtPieceContext(pieceState)}>
    {children}
  </Context.Provider>;
