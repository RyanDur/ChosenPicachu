import {GalleryContext} from '@components/art-gallery/Art/Context';
import {ArtPieceContext} from '@components/art-gallery/ArtPiece/Context';
import {Outlet} from 'react-router-dom';

export const GalleryRouter = () => (
  <GalleryContext>
    <ArtPieceContext>
      <Outlet/>
    </ArtPieceContext>
  </GalleryContext>
);
