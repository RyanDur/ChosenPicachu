import {FC, PropsWithChildren, useEffect} from 'react';
import {Link} from 'react-router';
import {Paths} from '@navigation';
import {bannerChange, useBannerDispatch} from '@banners';

const closed = 'This room is closed.';

export const PageError: FC<PropsWithChildren> = ({children = 'Something in this room broke. The rest of the site is open.'}) => {
  const dispatchBanner = useBannerDispatch();
  useEffect(() => {
    const raised = bannerChange.raised(closed);
    dispatchBanner(raised);
    return () => dispatchBanner(bannerChange.lowered(raised.banner.id));
  }, [dispatchBanner]);

  return <section className="prose" aria-labelledby="closed-room">
    <h2 id="closed-room" className="title bold">{closed}</h2>
    <p className="paragraph">{children}</p>
    <Link className="signpost" to={Paths.home}>Back to the front door</Link>
  </section>;
};
