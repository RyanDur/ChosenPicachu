import {lazy, PropsWithChildren, Suspense} from 'react';
import {Outlet} from 'react-router';
import {Paths} from '@pages/Paths';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {GalleryLinks} from '@components/art-gallery/Links';
import {GalleryContext} from '@components/art-gallery/Art/Context';
import {ArtPieceContext, useArtPiece} from '@components/art-gallery/ArtPiece/Context';
import {GalleryPaths} from './GalleryRouter/GalleryPaths';

const ArtGalleryPage = lazy(() => import('./ArtGalleryPage').then(m => ({default: m.ArtGalleryPage})));
const ArtGalleryPiecePage = lazy(() => import('./ArtGalleryPiecePage').then(m => ({default: m.ArtGalleryPiecePage})));
const Search = lazy(() => import('@components/art-gallery/Search').then(m => ({default: m.Search})));
const PageControl = lazy(() => import('@components/art-gallery/PageControl').then(m => ({default: m.PageControl})));
const GalleryNav = lazy(() => import('@components/art-gallery/Nav').then(m => ({default: m.GalleryNav})));

const GalleryProviders = ({children}: PropsWithChildren) =>
  <GalleryLinks.Provider value={{gallery: Paths.artGallery}}>
    <GalleryContext>
      <ArtPieceContext>{children}</ArtPieceContext>
    </GalleryContext>
  </GalleryLinks.Provider>;

const GalleryHeader = () =>
  <Header title="Gallery">
    <Suspense fallback={null}><Search id="gallery-search"/></Suspense>
  </Header>;

const PieceHeader = () => {
  const {piece} = useArtPiece();
  return <Header title={piece.title ?? ''}>
    <Suspense fallback={null}><Search id="gallery-search"/></Suspense>
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
