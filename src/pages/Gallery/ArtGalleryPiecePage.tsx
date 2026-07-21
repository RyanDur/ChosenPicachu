import {FC} from 'react';
import {ArtPiece, Search, useArtPiece} from '@components/art-gallery';

export const ArtGalleryPiecePage: FC = () => {
    const {piece} = useArtPiece();
    return <>
        <header id="app-header" data-testid="header">
            <h1 className="title ellipsis">{piece.title}</h1>
            <Search id="gallery-search"/>
        </header>

        <main data-testid="main" className="in-view"><ArtPiece/></main>
    </>;
};

