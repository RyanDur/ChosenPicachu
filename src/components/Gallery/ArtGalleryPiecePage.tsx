import {FC} from 'react';
import {Search} from './Search';
import {ArtPiece} from './ArtPiece';
import {useArtPiece} from "./ArtPiece/Context";
import '../../routes/BasePage.css';
import '../../routes/BasePage.layout.css';

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

