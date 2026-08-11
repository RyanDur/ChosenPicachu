import {FC} from 'react';
import {useBanners} from '@components/Banners';
import {PropsWithClassName} from '../types';

export const TopLayer: FC<PropsWithClassName> = ({className}) => {
  const {raise} = useBanners();

  return <article className={className}>
    <p>The cards above fight for the front with z-index. The news does not fight at all.</p>
    <button className="primary"
            onClick={() => raise('this banner rides the top layer, above every z-index on the page')}>
      raise a banner
    </button>
  </article>;
};
