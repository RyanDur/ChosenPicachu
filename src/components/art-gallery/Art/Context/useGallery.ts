import {AllArt} from '@components/art-gallery/museums/types/response';
import {createContext, useContext} from 'react';
import {GalleryContextState} from '@components/art-gallery/Art/Context/GalleryContext';

export const artInitialState: AllArt = {} as AllArt;
export const Context = createContext<GalleryContextState>({
  art: artInitialState,
  updateArt: (art: AllArt) => void art,
  reset: () => void 0
});
export const useGallery = () => useContext(Context);
