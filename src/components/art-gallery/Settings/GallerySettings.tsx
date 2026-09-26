import {FC} from 'react';
import * as schema from 'schemawax';
import {has, maybe} from '@ryandur/sand';
import {Fold} from '@components/Fold';
import {useRoomToStandOpen} from '@components/room';
import {numberParam, useSearchParamsObject} from '@components/search-params';
import {Search} from '@components/art-gallery/Search';
import {PageControl} from '@components/art-gallery/PageControl';
import {paginationOf, useGallery} from '@components/art-gallery/Art/Context';
import {sourceParam} from '@components/art-gallery/museums/source';
import {museumNamed} from '@components/art-gallery/museums/museums';
import './GallerySettings.css';

const Readout: FC = () => {
  const {search, tab, page} = useSearchParamsObject({search: schema.string, tab: sourceParam, page: numberParam}, {page: 1});
  const pages = paginationOf(useGallery().wall).map(({totalPages}) => ` of ${totalPages}`).orElse('');
  const where = has(search) ? decodeURI(search) : maybe(tab).map(museumNamed).orElse('the gallery');
  return <span className="readout"><span className="where bold ellipsis">{where}</span><span className="page">page {page}{pages}</span></span>;
};

export const GallerySettings: FC = () => {
  const room = useRoomToStandOpen();
  if (room) return <Search id="gallery-search" className="gallery-search"/>;
  return <Fold label="gallery settings" className="gallery-search settings-fold" prompt={<Readout/>}>
    <Search id="gallery-search"/>
    <PageControl/>
  </Fold>;
};

export const GalleryAside: FC = () => {
  const room = useRoomToStandOpen();
  return room ? <PageControl/> : null;
};
