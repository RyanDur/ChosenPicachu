import {FC, PropsWithChildren, useCallback, useMemo, useState} from 'react';
import {Art} from '@components/art-gallery/museums/types/response';
import {Context, PieceContext} from '@components/art-gallery/ArtPiece/Context/useArtPiece';

const useArtPieceContext = (): PieceContext => {
  const [piece, updatePiece] = useState<Partial<Art>>({});
  const reset = useCallback(() => updatePiece({}), []);
  return useMemo(() => ({piece, updatePiece, reset}), [piece, reset]);
};

export const ArtPieceContext: FC<PropsWithChildren> = ({children}) =>
  <Context.Provider value={useArtPieceContext()}>
    {children}
  </Context.Provider>;
