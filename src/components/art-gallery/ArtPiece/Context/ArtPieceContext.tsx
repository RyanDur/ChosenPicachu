import {FC, PropsWithChildren, useCallback, useMemo, useState} from 'react';
import {Art} from '@components/art-gallery/museums/art';
import {MuseumReply} from '@components/art-gallery/museums/reply';
import {Context, PieceContext} from '@components/art-gallery/ArtPiece/Context/useArtPiece';

const useArtPieceContext = (): PieceContext => {
  const [piece, hold] = useState<MuseumReply<Art>>({reply: 'unasked'});
  const asked = useCallback(() => hold({reply: 'asked'}), []);
  const answered = useCallback((found: Art) => hold({reply: 'answered', answer: found}), []);
  const refused = useCallback(() => hold({reply: 'refused'}), []);
  const reset = useCallback(() => hold({reply: 'unasked'}), []);
  return useMemo(() => ({piece, asked, answered, refused, reset}), [piece, asked, answered, refused, reset]);
};

export const ArtPieceContext: FC<PropsWithChildren> = ({children}) =>
  <Context.Provider value={useArtPieceContext()}>
    {children}
  </Context.Provider>;
