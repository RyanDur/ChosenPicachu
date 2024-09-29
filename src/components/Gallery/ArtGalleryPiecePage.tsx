import {FC} from 'react';
import {SideNav} from '../../routes/BasePage/SideNav';
import {Search} from './Search';
import {ArtPiece} from './ArtPiece';
import '../../routes/BasePage.css';
import '../../routes/BasePage.layout.css';
import {useArtPiece} from "./ArtPiece/Context";

export const ArtGalleryPiecePage: FC = () => {
    const {piece} = useArtPiece();
    return <>
        <header id="app-header" data-testid="header">
            <h1 className="title ellipsis">{piece.title}</h1>
            <Search id="gallery-search"/>
        </header>

        <SideNav/>

        <main data-testid="main" className="in-view"><ArtPiece/></main>
    </>;
};

