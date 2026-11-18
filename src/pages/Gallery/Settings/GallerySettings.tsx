import {ChangeEvent, FC, useId} from 'react';
import {has, maybe} from '@ryandur/sand';
import {Search} from '@pages/Gallery/Search';
import {PageControl} from '@pages/Gallery/PageControl';
import {useGallery} from '@pages/Gallery/Context';
import './GallerySettings.css';
import {museums, sourceParam} from '@pages/Gallery/museums';

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

const MuseumChoice: FC = () => {
  const {tab, updateSearchParams} = useGallery();
  const choice = useId();
  const chosen = (event: ChangeEvent<HTMLSelectElement>) =>
    maybe(sourceParam.decode(event.currentTarget.value)).map(museum => updateSearchParams({tab: museum}));
  return <>
    <label className="museum-label field bold" htmlFor={choice}>Museum</label>
    <select id={choice} className="museum-choice field bold ellipsis" value={maybe(tab).orElse('')} onChange={chosen}>
      {museums.all.map(({display, param}) => <option key={param} value={param}>{display}</option>)}
    </select>
  </>;
};

export const GallerySettings: FC = () => <>
  <Search className="header-settings settings-standing"/>
  <Readout/>
  <section id={sheet} popover="auto" aria-label="gallery settings" className="settings-sheet backdrop veiled">
    <MuseumChoice/>
    <Search/>
    <PageControl/>
  </section>
</>;
