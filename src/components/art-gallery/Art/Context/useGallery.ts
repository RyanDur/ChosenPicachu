import {AllArt, Pagination} from '@components/art-gallery/museums/art';
import {MuseumReply, standingOf} from '@components/art-gallery/museums/reply';
import {Consumer, Maybe, maybe} from '@ryandur/sand';
import {createContext, useContext} from 'react';

export type GalleryContextState = {
  wall: MuseumReply<AllArt>;
  asked: Consumer<void>;
  answered: Consumer<AllArt>;
  refused: Consumer<void>;
  abandoned: Consumer<void>;
};

export const paginationOf = (wall: MuseumReply<AllArt>): Maybe<Pagination> =>
  maybe(standingOf(wall)).map(({pagination}) => pagination);

export const Context = createContext<GalleryContextState>({
  wall: {reply: 'unasked'},
  asked: () => void 0,
  answered: (art: AllArt) => void art,
  refused: () => void 0,
  abandoned: () => void 0
});
export const useGallery = () => useContext(Context);
