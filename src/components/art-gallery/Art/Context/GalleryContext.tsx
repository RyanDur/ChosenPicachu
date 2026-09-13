import {FC, PropsWithChildren, useCallback, useMemo, useState} from 'react';
import {AllArt} from '@components/art-gallery/museums/art';
import {maybe} from '@ryandur/sand';
import {Context, GalleryContextState} from '@components/art-gallery/Art/Context/useGallery';

const useGalleryContext = (): GalleryContextState => {
  const [art, updateArt] = useState<AllArt>();
  const reset = useCallback(() => updateArt(shown =>
    maybe(shown).map(({pagination}): AllArt => ({pagination, pieces: []})).orElse(undefined)), []);
  return useMemo(() => ({art, updateArt, reset}), [art, reset]);
};

export const GalleryContext: FC<PropsWithChildren> = ({children}) =>
  <Context.Provider value={useGalleryContext()}>
    {children}
  </Context.Provider>;
