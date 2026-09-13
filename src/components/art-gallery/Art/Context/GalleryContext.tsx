import {FC, PropsWithChildren, useCallback, useMemo, useState} from 'react';
import {AllArt} from '@components/art-gallery/museums/types/response';
import {Consumer} from '@ryandur/sand';
import {Context} from '@components/art-gallery/Art/Context/useGallery';

export type GalleryContextState = {
  art?: AllArt;
  updateArt: Consumer<AllArt>;
  reset: Consumer<void>;
}

const useGalleryContext = (): GalleryContextState => {
  const [art, updateArt] = useState<AllArt>();
  const reset = useCallback(() => updateArt(undefined), []);
  return useMemo(() => ({art, updateArt, reset}), [art, reset]);
};

export const GalleryContext: FC<PropsWithChildren> = ({children}) =>
  <Context.Provider value={useGalleryContext()}>
    {children}
  </Context.Provider>;
