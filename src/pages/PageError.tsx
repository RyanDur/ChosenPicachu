import {FC, useEffect} from 'react';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';
import {useBanners} from '@components/Banners';
import './PageError.css';

const closed = 'This room is closed.';

export const PageError: FC = () => {
  const {raise} = useBanners();
  useEffect(() => raise(closed), [raise]);

  return <section className="closed-room" aria-labelledby="closed-room">
    <h2 id="closed-room" className="title bold">{closed}</h2>
    <p className="paragraph">Something in this room broke. The rest of the site is open.</p>
    <Link className="signpost" to={Paths.home}>Back to the front door</Link>
  </section>;
};
