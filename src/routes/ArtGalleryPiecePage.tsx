import {FC} from 'react';
import {ArtPiece, ArtPieceContext, GalleryNav, PageControl, Search, useArtPieceContext} from '../components';
import {SideNav} from './BasePage/SideNav';
import './BasePage.css';
import './BasePage.layout.css';
import {Art} from '../components/Gallery/resource/types/response';

export const ArtGalleryPiecePage: FC<Partial<{
  pieceState: Partial<Art>
}>> = ({pieceState}) =>
  <ArtPieceContext.Provider value={useArtPieceContext(pieceState)}>
    <header id="app-header" data-testid="header">
      <h1 className="title ellipsis">About</h1>
      <Search id="gallery-search"/>
    </header>

    <SideNav/>

    <main data-testid="main" className="gallery-in-view"><ArtPiece/></main>

    <article id="filter" data-testid="filter">
      <PageControl/>
    </article>

    <footer id={'app-footer'} className={'stick-to-bottom'} data-testid="footer">
      <GalleryNav id="gallery-nav"/>
    </footer>
  </ArtPieceContext.Provider>;

