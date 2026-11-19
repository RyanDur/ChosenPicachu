import {FC, useId} from 'react';
import {has, maybe} from '@ryandur/sand';
import {Search} from '@pages/Gallery/Search';
import {useGallery} from '@pages/Gallery/Context';
import {museums} from '@pages/Gallery/museums';
import {GallerySettingsPopover} from './GallerySettingsPopover';
import './GallerySettings.css';

const Readout: FC<{readonly popover: string}> = ({popover}) => {
  const {search, tab} = useGallery();
  const museum = maybe(tab).map(museums.named).orElse('the gallery');
  const shown = has(search) ? `${museum}, ${search}` : museum;
  return <button type="button" popoverTarget={popover} aria-label={`Gallery settings: ${shown}`}
    className="header-settings gallery-readout backdrop borderless reachable">
    <span className="gallery-readout-tile field bold attentive">
      <span className="ellipsis">{museum}</span>
      {has(search) && <span className="searched italic">“{search}”</span>}
    </span>
  </button>;
};

export const GallerySettings: FC = () => {
  const popover = useId();
  return <>
    <Search className="header-settings settings-standing"/>
    <Readout popover={popover}/>
    <GallerySettingsPopover id={popover}/>
  </>;
};
