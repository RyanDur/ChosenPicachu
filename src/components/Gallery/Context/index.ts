import {createContext, useContext, useMemo, useState} from 'react';
import {Consumer} from '@ryandur/sand';
import {AllArt} from '../resource/types/response';

export interface GalleryContextState {
  art?: AllArt;
  updateArt: Consumer<AllArt>;
  reset: Consumer<void>;
}

export const artInitialState: AllArt = {} as AllArt;

export const GalleryContext = createContext<GalleryContextState>({
  art: artInitialState,
  updateArt: (art: AllArt) => void art,
  reset: () => void 0
});
export const useGallery = () => useContext(GalleryContext);
export const useGalleryContext = (defaultArt?: AllArt): GalleryContextState => {
  const [art, updateArt] = useState<AllArt | undefined>(defaultArt);
  return useMemo(() => ({art, updateArt, reset: () => updateArt(undefined)}), [art]);
};
