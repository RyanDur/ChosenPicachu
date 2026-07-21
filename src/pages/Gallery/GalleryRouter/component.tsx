import {ArtPieceContext, GalleryContext, Loading} from '@components/art-gallery';
import {Outlet} from 'react-router-dom';
import {Suspense} from 'react';

export const GalleryRouter = () => (
  <GalleryContext>
    <ArtPieceContext>
      <Suspense fallback={<Loading className="loader" testId="page-loading"/>}>
        <Outlet/>
      </Suspense>
    </ArtPieceContext>
  </GalleryContext>
);
