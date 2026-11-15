import {FC} from 'react';
import {Paths} from '@navigation';
import {Main, PageError} from '@page';
import {GalleryProviders} from './Providers';
import {GalleryHeader} from './GalleryHeader';

export const GalleryError: FC = () =>
  <GalleryProviders gallery={Paths.artGallery}>
    <GalleryHeader/>
    <Main><PageError/></Main>
  </GalleryProviders>;
