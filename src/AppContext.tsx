import {FC, PropsWithChildren} from 'react';
import {ArtPieceContext, useArtPieceContext} from './components';
import {AllArt, Art} from './components/Gallery/resource/types/response';
import {GalleryContext} from './components/Gallery/Context';

export const AppContext: FC<PropsWithChildren & Partial<{
  galleryState: AllArt,
  pieceState: Partial<Art>
}>> = ({children, pieceState}) =>
  <GalleryContext>
    <ArtPieceContext.Provider value={useArtPieceContext(pieceState)}>
      {children}
    </ArtPieceContext.Provider>
  </GalleryContext>;
