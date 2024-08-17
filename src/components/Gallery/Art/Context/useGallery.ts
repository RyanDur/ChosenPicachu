import {AllArt} from '../../resource/types/response';
import {createContext, useContext} from 'react';
import {GalleryContextState} from './GalleryContext';

export const artInitialState: AllArt = {} as AllArt;
export const Context = createContext<GalleryContextState>({
  art: artInitialState,
  updateArt: (art: AllArt) => void art,
  reset: () => void 0
});
export const useGallery = () => useContext(Context);
