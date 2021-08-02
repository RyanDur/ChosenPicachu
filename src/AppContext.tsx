import {FC} from 'react';
import {ArtPieceContext, useArtPieceContext} from './components';
import {ArtGalleryContext, useArtGalleryContext} from './components/ArtGallery/Context';

export const AppContext: FC = ({children}) =>
    <ArtGalleryContext.Provider value={useArtGalleryContext()}>
        <ArtPieceContext.Provider value={useArtPieceContext()}>
            {children}
        </ArtPieceContext.Provider>
    </ArtGalleryContext.Provider>;