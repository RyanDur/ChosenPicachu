import {AllArt, Art, Pagination} from '@components/art-gallery/museums/art';
import {Consumer} from '@ryandur/sand';
import {createContext, useContext} from 'react';

export type GalleryContextState = {
  pagination?: Pagination;
  pieces?: Art[];
  updateArt: Consumer<AllArt>;
  reset: Consumer<void>;
}

export const Context = createContext<GalleryContextState>({
  updateArt: (art: AllArt) => void art,
  reset: () => void 0
});
export const useGallery = () => useContext(Context);
