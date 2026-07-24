import {PropsWithChildren} from 'react';
import {Outlet} from 'react-router';
import {Paths} from '@pages/Paths';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {GalleryLinks} from '@components/art-gallery/Links';
import {GalleryContext} from '@components/art-gallery/Art/Context';
import {ArtPieceContext, useArtPiece} from '@components/art-gallery/ArtPiece/Context';
import {GalleryPaths} from './GalleryRouter/GalleryPaths';

import {ArtGalleryPage} from './ArtGalleryPage';
import {ArtGalleryPiecePage} from './ArtGalleryPiecePage';
import {Search} from '@components/art-gallery/Search';
import {PageControl} from '@components/art-gallery/PageControl';
import {GalleryNav} from '@components/art-gallery/Nav';

const GalleryProviders = ({children}: PropsWithChildren) =>
  <GalleryLinks.Provider value={{gallery: Paths.artGallery}}>
    <GalleryContext>
      <ArtPieceContext>{children}</ArtPieceContext>
    </GalleryContext>
  </GalleryLinks.Provider>;

const GalleryHeader = () =>
  <Header title="Gallery">
    <Search id="gallery-search"/>
  </Header>;

const PieceHeader = () => {
  const {piece} = useArtPiece();
  return <Header title={piece.title ?? ''}>
    <Search id="gallery-search"/>
  </Header>;
};

const GalleryFooter = () => <GalleryNav id="gallery-nav"/>;

export const Gallery = {
  path: Paths.artGallery,
  errorElement: <PageError/>,
  handle: {header: GalleryHeader, provider: GalleryProviders, mainClassName: 'in-view'},
  element: <Outlet/>,
  children: [
    {
      path: GalleryPaths.home,
      handle: {
        header: GalleryHeader,
        provider: GalleryProviders,
        aside: PageControl,
        footer: GalleryFooter,
        mainClassName: 'in-view'
      },
      element: <ArtGalleryPage/>
    },
    {
      path: GalleryPaths.piece,
      handle: {header: PieceHeader, provider: GalleryProviders, mainClassName: 'in-view'},
      element: <ArtGalleryPiecePage/>
    }
  ]
};
