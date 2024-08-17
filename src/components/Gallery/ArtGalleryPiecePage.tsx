import {FC} from 'react';
import {SideNav} from '../../routes/BasePage/SideNav';
import {Search} from './Search';
import {ArtPiece} from './ArtPiece';
import {PageControl} from './PageControl';
import {GalleryNav} from './Nav';
import '../../routes/BasePage.css';
import '../../routes/BasePage.layout.css';

export const ArtGalleryPiecePage: FC = () =>
  <>
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
  </>;

