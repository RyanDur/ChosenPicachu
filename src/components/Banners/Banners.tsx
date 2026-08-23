import {FC, TransitionEvent, useEffect, useState} from 'react';
import {maybe} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {useSearchParamsObject} from '@components/search-params';
import {useBanners} from './useBanners';
import {alignParam, enterParam, sideParam, stackParam} from './params';
import './Banners.css';

export const Banners: FC = () => {
  const {banners, lower} = useBanners();
  const {side = 'top', align = 'center', enter = 'above', stack = 'down'} =
    useSearchParamsObject({side: sideParam, align: alignParam, enter: enterParam, stack: stackParam});
  const [leaving, setLeaving] = useState<readonly string[]>([]);

  useEffect(() => {
    maybe(document.getElementById('banners')).map(panel => {
      if (banners.length > 0 && !panel.matches(':popover-open')) {
        panel.showPopover();
      }
      if (banners.length === 0 && panel.matches(':popover-open')) {
        panel.hidePopover();
      }
    });
  }, [banners.length]);

  useEffect(() => {
    const sideways = stack === 'left' || stack === 'right';
    const settler = new ResizeObserver(entries => entries.forEach(entry => {
      if (entry.target instanceof HTMLElement) {
        entry.target.style.blockSize = '';
        const borders = entry.target.offsetHeight - entry.target.clientHeight;
        entry.target.style.blockSize = `${entry.target.scrollHeight + borders}px`;
      }
    }));
    maybe(document.getElementById('banners')).map(panel =>
      [...panel.querySelectorAll('.news')].forEach(news => {
        if (sideways) {
          settler.observe(news);
        } else if (news instanceof HTMLElement) {
          news.style.blockSize = '';
        }
      }));
    return () => settler.disconnect();
  }, [banners, stack]);

  const dismissed = (id: string) =>
    setLeaving(standing => [...standing, id]);

  const left = (id: string) => (event: TransitionEvent<HTMLLIElement>) => {
    const slotClosed = event.target === event.currentTarget
      && ['grid-template-rows', 'grid-template-columns'].includes(event.propertyName);
    if (slotClosed && leaving.includes(id)) {
      lower(id);
      setLeaving(standing => standing.filter(going => going !== id));
    }
  };

  return <section id="banners" popover="manual" role="alert"
                  className={classNames('banners', side, align, `from-${enter}`, `stack-${stack}`)}>
    <ul className="troubles">
      {banners.map(banner =>
        <li key={banner.id} onTransitionEnd={left(banner.id)}
            className={classNames('trouble', leaving.includes(banner.id) && 'leaving')}>
          <p className="news field rounded-corners floating hairline-outline alarm-ink">
            {banner.message}
            <button type="button" className="dismiss" aria-label={`dismiss ${banner.message}`}
                    onClick={() => dismissed(banner.id)}>×</button>
          </p>
        </li>)}
    </ul>
  </section>;
};
