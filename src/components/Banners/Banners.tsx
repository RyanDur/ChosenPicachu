import {FC, useEffect} from 'react';
import {useBanners} from './useBanners';
import './Banners.css';

export const Banners: FC = () => {
  const {banners, lower} = useBanners();

  useEffect(() => {
    const panel = document.getElementById('banners');
    if (panel === undefined || panel === null) {
      return;
    }
    if (banners.length > 0 && !panel.matches(':popover-open')) {
      panel.showPopover();
    }
    if (banners.length === 0 && panel.matches(':popover-open')) {
      panel.hidePopover();
    }
  }, [banners.length]);

  return <section id="banners" className="banners" popover="manual" role="alert">
    <ul className="troubles">
      {banners.map(banner =>
        <li key={banner.id} className="trouble">
          {banner.message}
          <button type="button" className="dismiss" aria-label="dismiss"
                  onClick={() => lower(banner.id)}>×</button>
        </li>)}
    </ul>
  </section>;
};
