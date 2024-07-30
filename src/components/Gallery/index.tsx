import {FC} from 'react';
import {ArtGallery} from './Art';
import {GalleryTitle} from './GalleryTitle';
import {GalleryNav} from './Nav';
import {Tabs} from '../Tabs';
import {PageControl} from './PageControl';
import {Source} from '../../data/artGallery/types/resource';

const Gallery: FC = () =>
  <>
    <Tabs values={[
      {display: 'The Art Institute of Chicago', param: Source.AIC},
      {display: 'Harvard Art Museums', param: Source.HARVARD},
      {display: 'Rijksstudio', param: Source.RIJKS}
    ]}/>
    <ArtGallery/>
  </>;

export {
  Gallery,
  GalleryNav,
  GalleryTitle,
  PageControl
};
