import {FC} from 'react';
import {Tabs} from '@components/Tabs';
import {ArtGallery, GalleryNav, PageControl, Search, Source} from '@components/art-gallery';

export const ArtGalleryPage: FC = () =>
  <>
    <header id="app-header" data-testid="header">
      <h1 className="title ellipsis">Gallery</h1>
      <Search id="gallery-search"/>
    </header>

    <main data-testid="main" className="in-view">
      <Tabs
        label="museums"
        defaultTab={Source.AIC}
        values={[
          {display: 'The Art Institute of Chicago', param: Source.AIC},
          {display: 'Harvard Art Museums', param: Source.HARVARD},
          {display: 'The Victoria and Albert Museum', param: Source.VAM}
        ]}/>
      <ArtGallery/></main>

    <article id="filter" data-testid="filter">
      <PageControl/>
    </article>

    <footer id='app-footer' className='stick-to-bottom' data-testid="footer">
      <GalleryNav id="gallery-nav"/>
    </footer>
  </>;

