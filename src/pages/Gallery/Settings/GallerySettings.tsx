import {FC} from 'react';
import {has, maybe} from '@ryandur/sand';
import {Search} from '@pages/Gallery/Search';
import {useGallery} from '@pages/Gallery/Context';
import {museums} from '@pages/Gallery/museums';
import {SettingsSheet} from './SettingsSheet';
import './GallerySettings.css';

const sheet = 'gallery-settings';

const Readout: FC = () => {
  const {search, tab} = useGallery();
  const museum = maybe(tab).map(museums.named).orElse('the gallery');
  const shown = has(search) ? `${museum}, ${search}` : museum;
  return <button type="button" popoverTarget={sheet} aria-label={`Gallery settings: ${shown}`}
    className="header-settings gallery-readout backdrop borderless reachable">
    <span className="gallery-readout-tile field bold attentive">
      <span className="ellipsis">{museum}</span>
      {has(search) && <span className="searched italic">“{search}”</span>}
    </span>
  </button>;
};

export const GallerySettings: FC = () => <>
  <Search className="header-settings settings-standing"/>
  <Readout/>
  <SettingsSheet id={sheet}/>
</>;
