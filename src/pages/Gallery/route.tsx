import {FC} from 'react';
import {Paths} from '@pages/Paths';
import {Page} from '@pages/BasePage/Page';
import {GalleryProviders} from '@components/art-gallery';
import {GalleryAside} from '@components/art-gallery/Settings';
import {GalleryNav} from '@components/art-gallery/Nav';
import {ArtGalleryPage} from './ArtGalleryPage';
import {GalleryError, GalleryHeader} from './frame';

export const ErrorBoundary = GalleryError;

const Room: FC = () =>
  <GalleryProviders gallery={Paths.artGallery}>
    <Page header={<GalleryHeader/>} filters={<GalleryAside/>} footer={<GalleryNav id="gallery-nav"/>}>
      <ArtGalleryPage/>
    </Page>
  </GalleryProviders>;

export default Room;
