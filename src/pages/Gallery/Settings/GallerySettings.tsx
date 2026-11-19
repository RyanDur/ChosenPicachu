import {FC, useId} from 'react';
import {has, maybe} from '@ryandur/sand';
import {Search} from '@pages/Gallery/Search';
import {useGallery} from '@pages/Gallery/Context';
import {museums} from '@pages/Gallery/museums';
import {SettingsSheet} from './SettingsSheet';
import './GallerySettings.css';

const Readout: FC<{readonly sheet: string}> = ({sheet}) => {
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

export const GallerySettings: FC = () => {
  const sheet = useId();
  return <>
    <Search className="header-settings settings-standing"/>
    <Readout sheet={sheet}/>
    <SettingsSheet id={sheet}/>
  </>;
};
