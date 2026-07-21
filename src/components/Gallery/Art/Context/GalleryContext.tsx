import {FC, PropsWithChildren, useCallback, useMemo, useState} from 'react';
import {AllArt} from '../../resource/types/response';
import {Consumer} from '@ryandur/sand';
import {Context} from './useGallery';

export interface GalleryContextState {
  art?: AllArt;
  updateArt: Consumer<AllArt>;
  reset: Consumer<void>;
}

const useGalleryContext = (defaultArt?: AllArt): GalleryContextState => {
  const [art, updateArt] = useState<AllArt | undefined>(defaultArt);
  const reset = useCallback(() => updateArt(undefined), []);
  return useMemo(() => ({art, updateArt, reset}), [art, reset]);
};

export const GalleryContext: FC<PropsWithChildren & Partial<{
  galleryState: AllArt
}>> = ({galleryState, children}) =>
  <Context.Provider value={useGalleryContext(galleryState)}>
    {children}
  </Context.Provider>;
