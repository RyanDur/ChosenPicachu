import {ArtGalleryPage} from './ArtGalleryPage';
import {ArtGalleryPiecePage} from './ArtGalleryPiecePage';
import {Paths} from '../../routes/Paths';
import {Outlet} from 'react-router-dom';
import {GalleryPaths} from './GalleryPaths';
import {GalleryContext} from './Art/Context';
import {ArtPieceContext} from './ArtPiece/Context';

const GalleryRouter = () => (
  <GalleryContext>
    <ArtPieceContext>
      <Outlet/>
    </ArtPieceContext>
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

