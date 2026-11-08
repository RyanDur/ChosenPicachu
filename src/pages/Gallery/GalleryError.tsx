import {FC} from 'react';
import {Paths} from '@frame/navigation';
import {Page, PageError} from '@frame/page';
import {GalleryProviders} from './Providers';
import {GalleryHeader} from './GalleryHeader';

export const GalleryError: FC = () =>
  <GalleryProviders gallery={Paths.artGallery}><Page header={<GalleryHeader/>}><PageError/></Page></GalleryProviders>;
