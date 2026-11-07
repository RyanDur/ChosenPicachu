import {FC} from 'react';
import {Paths} from '@pages/Paths';
import {PageError} from '@pages/PageError';
import {Header} from '@pages/BasePage/Header';
import {Page} from '@pages/BasePage/Page';
import {GalleryProviders} from '@pages/Gallery';
import {GallerySettings} from '@pages/Gallery/Settings';
import names from '@pages/names.json';

export const GalleryHeader = () =>
  <Header title="Gallery" listed={names.gallery}>
    <GallerySettings/>
  </Header>;

export const GalleryError: FC = () =>
  <GalleryProviders gallery={Paths.artGallery}><Page header={<GalleryHeader/>}><PageError/></Page></GalleryProviders>;
