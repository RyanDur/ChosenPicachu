import {ArtGalleryPage} from './ArtGalleryPage';
import {ArtGalleryPiecePage} from './ArtGalleryPiecePage';
import {Paths} from '@libraries/routing/Paths';
import {GalleryPaths, GalleryRouter} from './GalleryRouter';

export const Gallery = {
  path: Paths.artGallery,
  element: <GalleryRouter/>,
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

