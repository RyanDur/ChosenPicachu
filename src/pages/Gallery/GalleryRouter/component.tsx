import {GalleryContext} from '@components/art-gallery/Art/Context';
import {ArtPieceContext} from '@components/art-gallery/ArtPiece/Context';
import {Outlet} from 'react-router-dom';
import {Suspense} from 'react';
import {Loading} from '@components/art-gallery/Loading';

export const GalleryRouter = () => (
  <GalleryContext>
    <ArtPieceContext>
      <Suspense fallback={<Loading className="loader" testId="page-loading"/>}>
        <Outlet/>
      </Suspense>
    </ArtPieceContext>
  </GalleryContext>
);
