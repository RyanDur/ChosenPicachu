import {Header} from '@frame/page';
import {GallerySettings} from '@pages/Gallery/Settings';
import names from '@frame/navigation/names.json';

export const GalleryHeader = () =>
  <Header title="Gallery" listed={names.gallery}>
    <GallerySettings/>
  </Header>;
