import {FC} from 'react';
import {ArtPieceContext, useArtPieceContext} from './components';

export const AppContext: FC = ({children}) =>
    <ArtPieceContext.Provider value={useArtPieceContext()}>{children}</ArtPieceContext.Provider>;