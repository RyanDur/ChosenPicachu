import {FC} from 'react';
import {Paths} from '@pages/Paths';
import {PageError} from '@pages/PageError';
import {Page} from '@pages/BasePage/Page';
import {GalleryProviders} from './Providers';
import {GalleryHeader} from './GalleryHeader';

export const GalleryError: FC = () =>
  <GalleryProviders gallery={Paths.artGallery}><Page header={<GalleryHeader/>}><PageError/></Page></GalleryProviders>;
