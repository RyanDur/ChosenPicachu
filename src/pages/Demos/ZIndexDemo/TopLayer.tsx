import {FC} from 'react';
import {decked, news} from '@components/fibs';
import {useBanners} from '@components/Banners';
import {classNames} from '@components/class-names';
import {PropsWithClassName} from '../types';
import './ZIndexDemo.css';

const nextNews = decked(news);

export const TopLayer: FC<PropsWithClassName> = ({className}) => {
  const {raise} = useBanners();

  return <section aria-labelledby="top-layer-heading" className={classNames('top-layer', className)}>
    <h3 id="top-layer-heading" className="off-screen">the top layer</h3>
    <p className="pitch">The cards above fight for the front with z-index. The news does not fight at all.</p>
    <button className="button primary" onClick={() => raise(nextNews())}>
      raise a banner
    </button>
  </section>;
};
