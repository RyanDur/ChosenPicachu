import {ArtGalleryPage} from './ArtGalleryPage';
import {ArtGalleryPiecePage} from './ArtGalleryPiecePage';
import {Paths} from '../../routes/Paths';
import {Outlet} from 'react-router-dom';
import {GalleryPaths} from './GalleryPaths';

const GalleryRouter = () => (
  <Outlet/>
);

export const Gallery = {
  path: `${Paths.artGallery}/*`,
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

