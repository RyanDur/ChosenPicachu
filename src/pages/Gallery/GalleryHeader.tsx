import {Header} from '@pages/BasePage/Header';
import {GallerySettings} from '@pages/Gallery/Settings';
import names from '@pages/names.json';

export const GalleryHeader = () =>
  <Header title="Gallery" listed={names.gallery}>
    <GallerySettings/>
  </Header>;
