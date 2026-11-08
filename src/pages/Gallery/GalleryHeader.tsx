import {Header} from '@page';
import {GallerySettings} from '@pages/Gallery/Settings';
import names from '@navigation/names.json';

export const GalleryHeader = () =>
  <Header title="Gallery" listed={names.gallery}>
    <GallerySettings/>
  </Header>;
