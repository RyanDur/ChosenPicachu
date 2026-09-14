import {FC, PropsWithChildren, useCallback, useMemo, useState} from 'react';
import {AllArt, Art, Pagination} from '@components/art-gallery/museums/art';
import {Context, GalleryContextState} from '@components/art-gallery/Art/Context/useGallery';

const useGalleryContext = (): GalleryContextState => {
  const [pagination, updatePagination] = useState<Pagination>();
  const [pieces, updatePieces] = useState<Art[]>();
  const updateArt = useCallback((art: AllArt) => {
    updatePagination(art.pagination);
    updatePieces(art.pieces);
  }, []);
  const reset = useCallback(() => updatePieces(undefined), []);
  return useMemo(() => ({pagination, pieces, updateArt, reset}), [pagination, pieces, updateArt, reset]);
};

export const GalleryContext: FC<PropsWithChildren> = ({children}) =>
  <Context.Provider value={useGalleryContext()}>
    {children}
  </Context.Provider>;
