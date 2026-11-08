import {FC, TransitionEvent, useState} from 'react';
import {classNames} from '@components/class-names';
import {useSearchParamsObject} from '@components/search-params';
import {useBanners} from './useBanners';
import {useBannerDispatch} from './useBannerDispatch';
import {bannerChange} from './raising';
import {bannerDials} from './bannerDials';
import './Banners.css';

export const Banners: FC = () => {
  const banners = useBanners();
  const dispatchBanner = useBannerDispatch();
  const {side, align, enter, stack} = useSearchParamsObject(bannerDials.decoders, bannerDials.defaults);
  const [leaving, setLeaving] = useState<readonly string[]>([]);

  const dismissed = (id: string) =>
    setLeaving(standing => [...standing, id]);

  const left = (id: string) => (event: TransitionEvent<HTMLLIElement>) => {
    const slotClosed = event.target === event.currentTarget
      && ['grid-template-rows', 'grid-template-columns'].includes(event.propertyName);
    if (slotClosed && leaving.includes(id)) {
      dispatchBanner(bannerChange.lowered(id));
      setLeaving(standing => standing.filter(going => going !== id));
    }
  };

  return banners.length > 0 && <section id="banners" role="alert"
    className={classNames('banners', side, align, `from-${enter}`, `stack-${stack}`)}>
    <ul className="troubles">
      {banners.map(banner =>
        <li key={banner.id} onTransitionEnd={left(banner.id)}
          className={classNames('trouble', leaving.includes(banner.id) && 'leaving')}>
          <p className="news-item">
            <span className="news field rounded-corners floating hairline-outline alarm-ink">
              {banner.message}
              <button type="button" className="dismiss borderless unfilled glyph-icon muted-ink reachable" aria-label={`dismiss ${banner.message}`}
                onClick={() => dismissed(banner.id)}>×</button>
            </span>
          </p>
        </li>)}
    </ul>
  </section>;
};
