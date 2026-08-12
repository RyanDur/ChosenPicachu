import {FC} from 'react';
import {rand, randCatchPhrase, randPhrase, randQuote} from '@ngneat/falso';
import {useBanners} from '@components/Banners';
import {classNames} from '@components/class-names';
import {PropsWithClassName} from '../types';
import './styles.css';

const news = [randPhrase, randQuote, randCatchPhrase];

export const TopLayer: FC<PropsWithClassName> = ({className}) => {
  const {raise} = useBanners();

  return <article className={classNames('top-layer', className)}>
    <p className="pitch">The cards above fight for the front with z-index. The news does not fight at all.</p>
    <button className="primary" onClick={() => raise(rand(news)())}>
      raise a banner
    </button>
  </article>;
};
