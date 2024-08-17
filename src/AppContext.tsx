import {FC, PropsWithChildren} from 'react';
import {ArtPieceContext, useArtPieceContext} from './components';
import {Art} from './components/Gallery/resource/types/response';

export const AppContext: FC<PropsWithChildren & Partial<{
  pieceState: Partial<Art>
}>> = ({children, pieceState}) =>
    <ArtPieceContext.Provider value={useArtPieceContext(pieceState)}>
      {children}
    </ArtPieceContext.Provider>;
