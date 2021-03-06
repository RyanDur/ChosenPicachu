import {FC} from 'react';
import {ArtPieceContext, useArtPieceContext} from './components';
import {GalleryContext, useGalleryContext} from './components/Gallery/Context';

export const AppContext: FC = ({children}) =>
    <GalleryContext.Provider value={useGalleryContext()}>
        <ArtPieceContext.Provider value={useArtPieceContext()}>
            {children}
        </ArtPieceContext.Provider>
    </GalleryContext.Provider>;