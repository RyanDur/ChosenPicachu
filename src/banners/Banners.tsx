import {FC, TransitionEvent} from 'react';
import {classNames} from '@components';
import {useBanners} from './useBanners';
import {useBannerDispatch} from './useBannerDispatch';
import {Banner, bannerChange} from './bannerChange';
import {has} from '@ryandur/sand';
import './Banners.css';

export const Banners: FC = () => {
  const {banners, placement: {side, align, enter, stack}} = useBanners();
  const dispatchBanner = useBannerDispatch();

  const left = ({id, leaving}: Banner) => (event: TransitionEvent<HTMLLIElement>) => {
    const slotClosed = event.target === event.currentTarget
      && ['grid-template-rows', 'grid-template-columns'].includes(event.propertyName);
    if (slotClosed && leaving) {
      dispatchBanner(bannerChange.lowered(id));
    }
  };

  return has(banners) && <section id="banners" role="alert"
    className={classNames('banners', side, align, `from-${enter}`, `stack-${stack}`)}>
    <ul className="troubles">
      {banners.map(banner =>
        <li key={banner.id} onTransitionEnd={left(banner)}
          className={classNames('trouble', banner.leaving && 'leaving')}>
          <p className="news-item">
            <span className="news field rounded-corners floating hairline-outline alarm-ink">
              {banner.message}
              <button type="button" className="dismiss borderless unfilled glyph-icon muted-ink reachable" aria-label={`dismiss ${banner.message}`}
                onClick={() => dispatchBanner(bannerChange.dismissed(banner.id))}>×</button>
            </span>
          </p>
        </li>)}
    </ul>
  </section>;
};
