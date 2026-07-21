import {ArtGalleryPage} from './ArtGalleryPage';
import {ArtGalleryPiecePage} from './ArtGalleryPiecePage';
import {Paths} from '@pages/Paths';
import {GalleryPaths, GalleryRouter} from './GalleryRouter';
import {GalleryLinks} from '@components/art-gallery/Links';

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

