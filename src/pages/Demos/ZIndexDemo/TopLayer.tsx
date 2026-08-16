import {FC} from 'react';
import {decked, news} from '@components/fibs';
import {useBanners} from '@components/Banners';
import {classNames} from '@components/class-names';
import {PropsWithClassName} from '../types';
import './styles.css';

const nextNews = decked(news);

export const TopLayer: FC<PropsWithClassName> = ({className}) => {
  const {raise} = useBanners();

  return <article className={classNames('top-layer', className)}>
    <p className="pitch">The cards above fight for the front with z-index. The news does not fight at all.</p>
    <button className="primary" onClick={() => raise(nextNews())}>
      raise a banner
    </button>
  </article>;
};
