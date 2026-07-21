import {FC} from 'react';
import {Search} from '@components/art-gallery/Search';
import {ArtPiece} from '@components/art-gallery/ArtPiece';
import {useArtPiece} from '@components/art-gallery/ArtPiece/Context';
import '../BasePage.css';
import '../BasePage.layout.css';

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

