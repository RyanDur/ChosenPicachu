import {Paths} from '@pages/Paths';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {Page} from '@pages/BasePage/Page';
import {Listing} from '@pages/BasePage/useListing';
import {Art} from '@components/art-gallery/museums/art';
import {maybe} from '@ryandur/sand';
import {useArtPiece} from '@components/art-gallery/ArtPiece/Context';
import {GalleryProviders} from '@components/art-gallery';
import {GalleryPaths} from './GalleryRouter/GalleryPaths';

import {ArtGalleryPage} from './ArtGalleryPage';
import {ArtGalleryPiecePage} from './ArtGalleryPiecePage';
import {Search} from '@components/art-gallery/Search';
import {GalleryAside, GallerySettings} from '@components/art-gallery/Settings';
import {GalleryNav} from '@components/art-gallery/Nav';
import names from '@pages/names.json';

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

const galleryError = <GalleryProviders gallery={Paths.artGallery}><Page header={<GalleryHeader/>}><PageError/></Page></GalleryProviders>;

export const Gallery = [
  {
    path: `${Paths.artGallery}${GalleryPaths.home}`,
    errorElement: galleryError,
    element: <GalleryProviders gallery={Paths.artGallery}>
      <Page header={<GalleryHeader/>} filters={<GalleryAside/>} footer={<GalleryNav id="gallery-nav"/>}>
        <ArtGalleryPage/>
      </Page>
    </GalleryProviders>
  },
  {
    path: `${Paths.artGallery}${GalleryPaths.piece}`,
    errorElement: galleryError,
    element: <GalleryProviders gallery={Paths.artGallery}><Page header={<PieceHeader/>}><ArtGalleryPiecePage/></Page></GalleryProviders>
  }
];
