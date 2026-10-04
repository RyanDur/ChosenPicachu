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
    <ol className="trap-steps">
      <li className="paragraph">Press Raise a banner, built the old way.</li>
      <li className="paragraph">Scroll until card two reaches the bottom of the window, and watch it pass over the banner.</li>
      <li className="paragraph">Press Raise a banner, in the top layer, and scroll again.</li>
    </ol>
    <ol className="old-way-cards">
      <li className="old-way-card card rounded-corners floating forms-context">
        <p className="paragraph">Card one has z-index: 1.</p>
        <ul className="trap-ways">
          <li className="trap-way">
            <p className="caption">The old way</p>
            <button id={raiser} type="button" tabIndex={0} className="button primary reachable" aria-label="Raise a banner, the old way"
              onClick={() => updateRaised(true)}>Raise a banner</button>
          </li>
          <li className="trap-way">
            <p className="caption">The top layer</p>
            <button type="button" tabIndex={0} className="button primary reachable" aria-label="Raise a banner, in the top layer"
              onClick={() => raise(nextNews())}>Raise a banner</button>
          </li>
        </ul>
        {raised && <p role="alert" className="old-banner field rounded-corners floating hairline-outline alarm-ink">
          An old banner. It is fixed to the window, with z-index: 9999.
          <button type="button" tabIndex={0} className="dismiss borderless attentive reachable" aria-label="dismiss the old banner" onClick={dismissed}>×</button>
        </p>}
      </li>
      <li className="old-way-card card rounded-corners floating forms-context">
        <p className="paragraph">Card two has z-index: 1, and comes later in the code.</p>
      </li>
    </ol>
    <figcaption className="caption"><strong>The banners.</strong> A fixed banner with z-index: 9999 is covered by a card with z-index: 1.</figcaption>
  </figure>;
};
