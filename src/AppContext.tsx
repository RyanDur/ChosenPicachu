import {FC, PropsWithChildren} from 'react';
import {ArtPieceContext, useArtPieceContext} from './components';
import {GalleryContext, useGalleryContext} from './components/Gallery/Context';
import {AllArt, Art} from './components/Gallery/resource/types/response';

export const AppContext: FC<PropsWithChildren & Partial<{
  galleryState: AllArt,
  pieceState: Partial<Art>
}>> = ({children, galleryState, pieceState}) =>
  <GalleryContext.Provider value={useGalleryContext(galleryState)}>
    <ArtPieceContext.Provider value={useArtPieceContext(pieceState)}>
      {children}
    </ArtPieceContext.Provider>
  </GalleryContext.Provider>;
