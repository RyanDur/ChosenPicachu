import {ArtGalleryPage} from '@components/art-gallery/ArtGalleryPage';
import {ArtGalleryPiecePage} from '@components/art-gallery/ArtGalleryPiecePage';
import {Paths} from '@libraries/routing/Paths';
import {GalleryPaths, GalleryRouter} from '@components/art-gallery/GalleryRouter';

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

