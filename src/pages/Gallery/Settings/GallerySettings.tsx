import {FC} from 'react';
import * as schema from 'schemawax';
import {has, maybe} from '@ryandur/sand';
import {Disclosure} from '@components/Disclosure';
import {useRoomToStandOpen} from '@components/room';
import {numberParam, useSearchParamsObject} from '@components/search-params';
import {Search} from '@pages/Gallery/Search';
import {PageControl} from '@pages/Gallery/PageControl';
import {paginationOf, useGallery} from '@pages/Gallery/Art/Context';
import {sourceParam} from '@pages/Gallery/museums/source';
import {museumNamed} from '@pages/Gallery/museums/museums';
import './GallerySettings.css';

const Readout: FC = () => {
  const {search, tab, page} =
    useSearchParamsObject({search: schema.string, tab: sourceParam, page: numberParam}, {page: 1});
  const pages = paginationOf(useGallery().wall).map(({totalPages}) => ` of ${totalPages}`).orElse('');
  const where = has(search) ? search : maybe(tab).map(museumNamed).orElse('the gallery');
  return <span className="readout">
    <span className="bold ellipsis">{where}</span><span className="page">, page {page}{pages}</span>
  </span>;
};

export const GallerySettings: FC = () => {
  const room = useRoomToStandOpen();
  if (room) return <Search id="gallery-search" className="header-settings"/>;
  return <Disclosure label="gallery settings" className="header-settings settings-fold" prompt={<Readout/>}>
    <Search id="gallery-search"/>
    <PageControl/>
  </Disclosure>;
};

export const GalleryAside: FC = () => {
  const room = useRoomToStandOpen();
  return room && <aside id="filter" className="filter field backdrop-below" aria-label="gallery settings">
    <PageControl/>
  </aside>;
};
