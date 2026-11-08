import {FC} from 'react';
import {PageControl} from '@pages/Gallery/PageControl';
import './GallerySettings.css';

export const GalleryAside: FC = () =>
  <aside id="filter" className="filter field backdrop-below settings-standing" aria-label="gallery settings">
    <PageControl/>
  </aside>;
