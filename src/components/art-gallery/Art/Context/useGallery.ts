import {AllArt, Art, Pagination} from '@components/art-gallery/museums/art';
import {MuseumReply} from '@components/art-gallery/museums/reply';
import {Consumer} from '@ryandur/sand';
import {createContext, useContext} from 'react';

export type GalleryContextState = {
  wall: MuseumReply<Art[]>;
  pagination?: Pagination;
  asked: Consumer<void>;
  answered: Consumer<AllArt>;
  refused: Consumer<void>;
  abandoned: Consumer<void>;
}

export const Context = createContext<GalleryContextState>({
  wall: {reply: 'unasked'},
  asked: () => void 0,
  answered: (art: AllArt) => void art,
  refused: () => void 0,
  abandoned: () => void 0
});
export const useGallery = () => useContext(Context);
