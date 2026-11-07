import {FC} from 'react';
import {Paths} from '@pages/Paths';
import {Page} from '@pages/BasePage/Page';
import {GalleryProviders} from '@pages/Gallery/Providers';
import {GalleryAside} from '@pages/Gallery/Settings';
import {GalleryNav} from '@pages/Gallery/Nav';
import {ArtGalleryPage} from './ArtGalleryPage';
import {GalleryError} from './GalleryError';
import {GalleryHeader} from './GalleryHeader';

export const ErrorBoundary = GalleryError;

const Room: FC = () =>
  <GalleryProviders gallery={Paths.artGallery}>
    <Page header={<GalleryHeader/>} filters={<GalleryAside/>} footer={<GalleryNav id="gallery-nav"/>}>
      <ArtGalleryPage/>
    </Page>
  </GalleryProviders>;

export default Room;
