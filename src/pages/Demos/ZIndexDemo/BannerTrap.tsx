import {FC, useId, useState} from 'react';
import {maybe} from '@ryandur/sand';
import {decked, news} from '@components/fibs';
import {useBanners} from '@components/Banners';
import './ZIndexDemo.css';

const nextNews = decked(news);

export const BannerTrap: FC = () => {
  const [raised, updateRaised] = useState(false);
  const raiser = useId();
  const {raise} = useBanners();
  const dismissed = (): void => {
    updateRaised(false);
    maybe(document.getElementById(raiser)).map(button => button.focus());
  };

  return <figure className="banner-trap card rounded-corners lifted padded">
    <ol className="old-way-cards">
      <li className="old-way-card card rounded-corners floating forms-context">
        <p className="paragraph">Card one. <code>.forms-context {'{'} z-index: 1 {'}'}</code></p>
        <button id={raiser} type="button" tabIndex={0} className="button primary reachable" onClick={() => updateRaised(true)}>
          Raise the old banner
        </button>
        <button type="button" tabIndex={0} className="button primary reachable" onClick={() => raise(nextNews())}>
          Raise a banner, in the top layer
        </button>
        {raised && <p role="alert" className="old-banner field rounded-corners floating hairline-outline alarm-ink">
          An old banner. <code>.old-banner {'{'} position: fixed; z-index: 9999 {'}'}</code>
          <button type="button" tabIndex={0} className="dismiss borderless attentive reachable" aria-label="dismiss the old banner" onClick={dismissed}>×</button>
        </p>}
      </li>
      <li className="old-way-card card rounded-corners floating forms-context">
        <p className="paragraph">Card two. <code>.forms-context {'{'} z-index: 1 {'}'}</code></p>
      </li>
    </ol>
    <figcaption className="caption"><strong>The banners.</strong> Raise each banner, then scroll until the cards pass the bottom of the window.</figcaption>
  </figure>;
};
