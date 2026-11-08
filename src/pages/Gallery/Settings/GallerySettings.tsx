import {FC} from 'react';
import {has, maybe} from '@ryandur/sand';
import {Disclosure} from '@components/Disclosure';
import {Search} from '@pages/Gallery/Search';
import {PageControl} from '@pages/Gallery/PageControl';
import {useGallery} from '@pages/Gallery/Context';
import './GallerySettings.css';
import {museums} from '@pages/Gallery/museums';

const Readout: FC = () => {
  const {search, tab, page, pagination} = useGallery();
  const pages = pagination.map(({totalPages}) => ` of ${totalPages}`).orElse('');
  const where = has(search) ? search : maybe(tab).map(museums.named).orElse('the gallery');
  return <span className="readout">
    <span className="bold ellipsis">{where}</span><span className="page">, page {page}{pages}</span>
  </span>;
};

export const GallerySettings: FC = () => <>
  <Search className="header-settings settings-standing"/>
  <Disclosure label="gallery settings" className="header-settings settings-fold" prompt={<Readout/>}>
    <Search/>
    <PageControl/>
  </Disclosure>
</>;
