import {FC} from 'react';
import {Paths} from '@navigation';
import {Main, PageError} from '@page';
import {GalleryProviders} from './Providers';
import {GalleryHeader} from './GalleryHeader';
import {MuseumDoors} from './MuseumDoors';

export const GalleryError: FC = () =>
  <GalleryProviders gallery={Paths.artGallery}>
    <MuseumDoors>
      <GalleryHeader/>
      <Main><PageError/></Main>
    </MuseumDoors>
  </GalleryProviders>;
