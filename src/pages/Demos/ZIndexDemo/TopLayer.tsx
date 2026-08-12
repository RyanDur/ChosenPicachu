import {FC, useState} from 'react';
import {useBanners} from '@components/Banners';
import {AlignDial, EntranceDial, SideDial, StackDial} from '../Controls';
import {classNames} from '@components/class-names';
import {PropsWithClassName} from '../types';
import './styles.css';

export const TopLayer: FC<PropsWithClassName> = ({className}) => {
  const {raise} = useBanners();
  const [raised, setRaised] = useState(0);

  const raiseAnother = () => {
    setRaised(raised + 1);
    raise(`banner ${raised + 1} rides the top layer, above every z-index on the page`);
  };

  return <article className={classNames('top-layer', className)}>
    <p className="pitch">The cards above fight for the front with z-index. The news does not fight at all.</p>
    <div className="dials">
      <SideDial name="banner-side"/>
      <AlignDial name="banner-align"/>
      <EntranceDial name="banner-entrance"/>
      <StackDial name="banner-stack"/>
    </div>
    <button className="primary" onClick={raiseAnother}>
      raise a banner
    </button>
  </article>;
};
