import {FC} from 'react';
import {Paths} from '@navigation';
import {Footer, Main} from '@page';
import {GalleryProviders} from '@pages/Gallery/Providers';
import {GalleryAside} from '@pages/Gallery/Settings';
import {GalleryNav} from '@pages/Gallery/Nav';
import {ArtGalleryPage} from './ArtGalleryPage';
import {GalleryError} from './GalleryError';
import {GalleryHeader} from './GalleryHeader';
import {MuseumDoors} from './MuseumDoors';

export const ErrorBoundary = GalleryError;

export const Room: FC = () =>
  <GalleryProviders gallery={Paths.artGallery}>
    <MuseumDoors>
      <GalleryHeader/>
      <GalleryAside/>
      <Main><ArtGalleryPage/></Main>
      <Footer><GalleryNav id="gallery-nav"/></Footer>
    </MuseumDoors>
  </GalleryProviders>;
