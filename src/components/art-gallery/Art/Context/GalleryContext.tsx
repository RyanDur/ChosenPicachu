import {FC, PropsWithChildren, useCallback, useMemo, useState} from 'react';
import {AllArt} from '@components/art-gallery/museums/art';
import {MuseumReply, standingOf} from '@components/art-gallery/museums/reply';
import {Context, GalleryContextState} from '@components/art-gallery/Art/Context/useGallery';

const useGalleryContext = (): GalleryContextState => {
  const [wall, updateWall] = useState<MuseumReply<AllArt>>({reply: 'unasked'});
  const asked = useCallback(() => updateWall(wall => ({reply: 'asked', standing: standingOf(wall)})), []);
  const answered = useCallback((answer: AllArt) => updateWall({reply: 'answered', answer}), []);
  const refused = useCallback(() => updateWall({reply: 'refused'}), []);
  const abandoned = useCallback(() => updateWall(wall => ({reply: 'unasked', standing: standingOf(wall)})), []);
  return useMemo(() => ({wall, asked, answered, refused, abandoned}), [wall, asked, answered, refused, abandoned]);
};

export const GalleryContext: FC<PropsWithChildren> = ({children}) =>
  <Context.Provider value={useGalleryContext()}>
    {children}
  </Context.Provider>;
