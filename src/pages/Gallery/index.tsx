import {FC, PropsWithChildren} from 'react';
import {Outlet} from 'react-router';
import {Paths} from '@pages/Paths';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {Listing} from '@pages/BasePage/useListing';
import {Art} from '@components/art-gallery/museums/art';
import {maybe} from '@ryandur/sand';
import {GalleryLinks} from '@components/art-gallery/Links';
import {GalleryContext} from '@components/art-gallery/Art/Context';
import {ArtPieceContext, useArtPiece} from '@components/art-gallery/ArtPiece/Context';
import {GalleryPaths} from './GalleryRouter/GalleryPaths';

import {ArtGalleryPage} from './ArtGalleryPage';
import {ArtGalleryPiecePage} from './ArtGalleryPiecePage';
import {Search} from '@components/art-gallery/Search';
import {GalleryAside, GallerySettings} from '@components/art-gallery/Settings';
import {GalleryNav} from '@components/art-gallery/Nav';
import names from '@pages/names.json';

const GalleryProviders: FC<PropsWithChildren> = ({children}) =>
  <GalleryLinks.Provider value={{gallery: Paths.artGallery}}>
    <GalleryContext>
      <ArtPieceContext>{children}</ArtPieceContext>
    </GalleryContext>
  </GalleryLinks.Provider>;

const GalleryHeader = () =>
  <Header title="Gallery" listed={names.gallery}>
    <GallerySettings/>
  </Header>;

const listingOf = ({title, artistInfo}: Art): Listing => ({
  title: `${title} · ${names.gallery.title}`,
  description: maybe(artistInfo).map(artist => `${title}, by ${artist}, from the gallery’s wall.`).orElse(`${title}, from the gallery’s wall.`)
});

const PieceHeader = () => {
  const {easel} = useArtPiece();
  const {title, listed} = easel.reply === 'answered'
    ? {title: easel.answer.title, listed: listingOf(easel.answer)}
    : {title: 'A piece', listed: names.gallery};
  return <Header title={title} listed={listed}>
    <Search id="gallery-search" className="header-settings"/>
  </Header>;
};

const GalleryFooter = () => <GalleryNav id="gallery-nav"/>;

const GalleryHome = {
  path: GalleryPaths.home,
  handle: {
    header: GalleryHeader,
    provider: GalleryProviders,
    aside: GalleryAside,
    footer: GalleryFooter,
    mainClassName: 'in-view'
  },
  element: <ArtGalleryPage/>
};

const GalleryPiece = {
  path: GalleryPaths.piece,
  handle: {header: PieceHeader, provider: GalleryProviders, mainClassName: 'in-view'},
  element: <ArtGalleryPiecePage/>
};

export const Gallery = {
  path: Paths.artGallery,
  errorElement: <PageError/>,
  handle: {header: GalleryHeader, provider: GalleryProviders, mainClassName: 'in-view'},
  element: <Outlet/>,
  children: [GalleryHome, GalleryPiece]
};
