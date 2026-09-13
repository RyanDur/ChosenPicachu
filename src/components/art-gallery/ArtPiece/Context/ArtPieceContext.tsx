import {FC, PropsWithChildren, useCallback, useMemo, useState} from 'react';
import {Art} from '@components/art-gallery/museums/types/response';
import {Maybe, nothing, some} from '@ryandur/sand';
import {Context, PieceContext} from '@components/art-gallery/ArtPiece/Context/useArtPiece';

const useArtPieceContext = (): PieceContext => {
  const [piece, hold] = useState<Maybe<Art>>(nothing());
  const updatePiece = useCallback((found: Art) => hold(some(found)), []);
  const reset = useCallback(() => hold(nothing()), []);
  return useMemo(() => ({piece, updatePiece, reset}), [piece, updatePiece, reset]);
};

export const ArtPieceContext: FC<PropsWithChildren> = ({children}) =>
  <Context.Provider value={useArtPieceContext()}>
    {children}
  </Context.Provider>;
