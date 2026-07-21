import {lazy} from 'react';

const ArtGalleryPage = lazy(() => import('./ArtGalleryPage').then(m => ({default: m.ArtGalleryPage})));
const ArtGalleryPiecePage = lazy(() => import('./ArtGalleryPiecePage').then(m => ({default: m.ArtGalleryPiecePage})));
import {Paths} from '@pages/Paths';
import {GalleryPaths, GalleryRouter} from './GalleryRouter';
import {GalleryLinks} from '@components/art-gallery';

export const Gallery = {
  path: Paths.artGallery,
  element: <GalleryLinks.Provider value={{gallery: Paths.artGallery}}><GalleryRouter/></GalleryLinks.Provider>,
  children: [
    {
      path: GalleryPaths.home,
      element: <ArtGalleryPage/>
    },
    {
      path: GalleryPaths.piece,
      element: <ArtGalleryPiecePage/>
    }
  ]
};

