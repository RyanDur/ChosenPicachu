import {FC} from 'react';
import {Gallery, GalleryNav, PageControl, Search} from '../components';
import {SideNav} from './BasePage/SideNav.tsx';
import './BasePage.css';
import './BasePage.layout.css';

export const ArtGalleryPage: FC = () =>
  <>
    <header id="app-header" data-testid="header">
      <h1 className="title ellipsis">About</h1>
      <Search id="gallery-search"/>
    </header>

    <SideNav/>

    <main data-testid="main" className="gallery-in-view"><Gallery/></main>

    <article id="filter" data-testid="filter">
      <PageControl/>
    </article>

    <footer id={'app-footer'} className={'stick-to-bottom'} data-testid="footer">
      <GalleryNav id="gallery-nav"/>
    </footer>
  </>;

