import {GalleryContext} from '../Art/Context';
import {ArtPieceContext} from '../ArtPiece/Context';
import {Outlet} from 'react-router-dom';

export const GalleryRouter = () => (
  <GalleryContext>
    <ArtPieceContext>
      <Outlet/>
    </ArtPieceContext>
  </GalleryContext>
);
