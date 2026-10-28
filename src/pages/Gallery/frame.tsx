import {FC} from 'react';
import {Paths} from '@pages/Paths';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {Page} from '@pages/BasePage/Page';
import {GalleryProviders} from '@components/art-gallery';
import {GallerySettings} from '@components/art-gallery/Settings';
import names from '@pages/names.json';

export const GalleryHeader = () =>
  <Header title="Gallery" listed={names.gallery}>
    <GallerySettings/>
  </Header>;

export const GalleryError: FC = () =>
  <GalleryProviders gallery={Paths.artGallery}><Page header={<GalleryHeader/>}><PageError/></Page></GalleryProviders>;
