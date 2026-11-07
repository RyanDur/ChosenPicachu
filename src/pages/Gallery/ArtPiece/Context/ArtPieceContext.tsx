import {FC, PropsWithChildren, useCallback, useMemo, useState} from 'react';
import {nothing} from '@ryandur/sand';
import {Art} from '@pages/Gallery/museums/art';
import {MuseumReply} from '@pages/Gallery/museums/reply';
import {Context, PieceContext} from '@pages/Gallery/ArtPiece/Context/useArtPiece';

const useArtPieceContext = (): PieceContext => {
  const [easel, hold] = useState<MuseumReply<Art>>({reply: 'unasked', standing: nothing()});
  const asked = useCallback(() => hold({reply: 'asked', standing: nothing()}), []);
  const answered = useCallback((found: Art) => hold({reply: 'answered', answer: found}), []);
  const refused = useCallback(() => hold({reply: 'refused'}), []);
  const abandoned = useCallback(() => hold({reply: 'unasked', standing: nothing()}), []);
  return useMemo(() => ({easel, asked, answered, refused, abandoned}), [easel, asked, answered, refused, abandoned]);
};

export const ArtPieceContext: FC<PropsWithChildren> = ({children}) =>
  <Context.Provider value={useArtPieceContext()}>
    {children}
  </Context.Provider>;
