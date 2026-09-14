import {FC, PropsWithChildren, useCallback, useMemo, useState} from 'react';
import {AllArt, Art, Pagination} from '@components/art-gallery/museums/art';
import {MuseumReply} from '@components/art-gallery/museums/reply';
import {Context, GalleryContextState} from '@components/art-gallery/Art/Context/useGallery';

const useGalleryContext = (): GalleryContextState => {
  const [wall, updateWall] = useState<MuseumReply<Art[]>>({reply: 'unasked'});
  const [pagination, updatePagination] = useState<Pagination>();
  const asked = useCallback(() => updateWall({reply: 'asked'}), []);
  const answered = useCallback(({pagination, pieces}: AllArt) => {
    updatePagination(pagination);
    updateWall({reply: 'answered', answer: pieces});
  }, []);
  const refused = useCallback(() => updateWall({reply: 'refused'}), []);
  const reset = useCallback(() => updateWall({reply: 'unasked'}), []);
  return useMemo(() => ({wall, pagination, asked, answered, refused, reset}),
    [wall, pagination, asked, answered, refused, reset]);
};

export const GalleryContext: FC<PropsWithChildren> = ({children}) =>
  <Context.Provider value={useGalleryContext()}>
    {children}
  </Context.Provider>;
