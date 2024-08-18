import {FC} from 'react';
import {SideNav} from '../../routes/BasePage/SideNav';
import {Tabs} from '../Tabs';
import {Source} from './resource/types/resource';
import {ArtGallery} from './Art';
import {Search} from './Search';
import {PageControl} from './PageControl';
import {GalleryNav} from './Nav';
import '../../routes/BasePage.css';
import '../../routes/BasePage.layout.css';

export const ArtGalleryPage: FC = () =>
  <>
    <header id="app-header" data-testid="header">
      <h1 className="title ellipsis">About</h1>
      <Search id="gallery-search"/>
    </header>

    <SideNav/>

    <main data-testid="main" className="gallery-in-view">
      <Tabs values={[
        {display: 'The Art Institute of Chicago', param: Source.AIC},
        {display: 'Harvard Art Museums', param: Source.HARVARD},
        {display: 'Rijksstudio', param: Source.RIJKS}
      ]}/>
      <ArtGallery/></main>

    <article id="filter" data-testid="filter">
      <PageControl/>
    </article>

    <footer id='app-footer' className='stick-to-bottom' data-testid="footer">
      <GalleryNav id="gallery-nav"/>
    </footer>
  </>;

