import {FC, Suspense} from 'react';
import {Await} from 'react-router';
import {maybe} from '@ryandur/sand';
import {Paths} from '@navigation';
import {AppHeader, Listing, Page, PageTitle} from '@page';
import {askedPiece} from '@pages/Gallery/ArtPiece';
import {GalleryProviders} from '@pages/Gallery/Providers';
import {Search} from '@pages/Gallery/Search';
import names from '@navigation/names.json';
import {ArtGalleryPiecePage} from '../ArtGalleryPiecePage';
import {GalleryError} from '../GalleryError';
import {Art} from '@pages/Gallery/museums';

const listingOf = ({title, artistInfo}: Art): Listing => ({
  title: `${title} · ${names.gallery.title}`,
  description: maybe(artistInfo).map(artist => `${title}, by ${artist}, from the gallery’s wall.`).orElse(`${title}, from the gallery’s wall.`)
});

const Unnamed: FC = () => <PageTitle title="A piece" listed={names.gallery}/>;

const PieceTitle: FC = () =>
  <Suspense fallback={<Unnamed/>}>
    <Await resolve={askedPiece.useAsked().piece}>
      {answer => answer.either(piece => <PageTitle title={piece.title} listed={listingOf(piece)}/>, () => <Unnamed/>)}
    </Await>
  </Suspense>;

const PieceHeader: FC = () =>
  <AppHeader title={<PieceTitle/>}>
    <Search id="gallery-search" className="header-settings"/>
  </AppHeader>;

export const loader = askedPiece.loader;

export const ErrorBoundary = GalleryError;

export const Room: FC = () =>
  <GalleryProviders gallery={Paths.artGallery}>
    <Page header={<PieceHeader/>}><ArtGalleryPiecePage/></Page>
  </GalleryProviders>;
