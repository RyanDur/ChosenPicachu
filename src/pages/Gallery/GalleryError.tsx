import {FC} from 'react';
import {Paths} from '@navigation';
import {Page, PageError} from '@page';
import {GalleryProviders} from './Providers';
import {GalleryHeader} from './GalleryHeader';

export const GalleryError: FC = () =>
  <GalleryProviders gallery={Paths.artGallery}><Page header={<GalleryHeader/>}><PageError/></Page></GalleryProviders>;
