import {FC, useEffect} from 'react';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';
import {useBanners} from '@components/Banners';

const noRoom = 'There is no room at this address.';

export const NoRoom: FC = () => {
  const {raise} = useBanners();
  useEffect(() => raise(noRoom), [raise]);

  return <section className="prose" aria-labelledby="no-room">
    <h2 id="no-room" className="title bold">{noRoom}</h2>
    <p className="paragraph">Nothing was built here. The rest of the site is open.</p>
    <Link className="signpost" to={Paths.home}>Back to the front door</Link>
  </section>;
};
