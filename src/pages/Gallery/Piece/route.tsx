import {FC} from 'react';
import {maybe} from '@ryandur/sand';
import {Paths} from '@pages/Paths';
import {Header, Listing} from '@pages/BasePage/Header';
import {Page} from '@pages/BasePage/Page';
import {Art} from '@components/art-gallery/museums/art';
import {useArtPiece} from '@components/art-gallery/ArtPiece/Context';
import {GalleryProviders} from '@components/art-gallery';
import {Search} from '@components/art-gallery/Search';
import names from '@pages/names.json';
import {ArtGalleryPiecePage} from '../ArtGalleryPiecePage';
import {GalleryError} from '../frame';

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

export const ErrorBoundary = GalleryError;

const Room: FC = () =>
  <GalleryProviders gallery={Paths.artGallery}><Page header={<PieceHeader/>}><ArtGalleryPiecePage/></Page></GalleryProviders>;

export default Room;
