import {FC} from 'react';
import {Tabs} from '@components/Tabs';
import {ArtGallery, Source} from '@components/art-gallery';

export const ArtGalleryPage: FC = () =>
  <>
    <Tabs
      label="museums"
      defaultTab={Source.AIC}
      values={[
        {display: 'The Art Institute of Chicago', param: Source.AIC},
        {display: 'Harvard Art Museums', param: Source.HARVARD},
        {display: 'The Victoria and Albert Museum', param: Source.VAM}
      ]}/>
    <ArtGallery/>
  </>;
