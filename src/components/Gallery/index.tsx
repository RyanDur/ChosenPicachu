import {ArtGalleryPage} from './ArtGalleryPage';
import {ArtGalleryPiecePage} from './ArtGalleryPiecePage';
import {Paths} from '../../routes/Paths';
import {Outlet} from 'react-router-dom';
import {GalleryPaths} from './GalleryPaths';
import {GalleryContext} from './Art/Context';

const GalleryRouter = () => (
  <GalleryContext>
    <Outlet/>
  </GalleryContext>
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

