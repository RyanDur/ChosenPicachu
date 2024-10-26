import {FC, useEffect, useState} from 'react';
import {Link, useSearchParams} from 'react-router-dom';
import {toQueryString} from '../../util/URL';
import {defaultRecordLimit} from '../../config';
import {Source} from '../../components/Gallery/resource/types/resource';
import {Paths} from '../Paths';
import {AboutTopics} from '../../components/About/types';

const AboutNav: FC = () => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab');
  const [aboutTab, updateTab] = useState('');

  useEffect(() => {
    if (tab && Object.values<string>(AboutTopics).includes(tab)) {
      updateTab(tab);
    }
  }, [tab]);

  return <Link id="navigate-about" className="path" to={`${Paths.about}?tab=${aboutTab}`}>About</Link>;
};

export const SideNav: FC = () =>
  <aside id="side-nav" data-testid="navigation">
    <nav id="app-navigation">
      <Link id="navigate-home" className="path" to={Paths.home}>Home</Link>
      <AboutNav/>
      <Link id="navigate-users" className="path" to={Paths.users}>Users</Link>
      <Link id="navigate-form" className="path"
            to={`${Paths.artGallery}${toQueryString({
              page: 1,
              size: defaultRecordLimit,
              tab: Source.AIC
            })}`}>Gallery</Link>
      <Link id="navigate-games" className="path" to={Paths.games}>Games</Link>
      <a id="navigate-repo" className="path" href={Paths.repo}
         rel="noopener noreferrer" target="_blank">Repo</a>
    </nav>

    <article className="icons borrowed-assets" tabIndex={0}>
      <h2 className="icons-title">ICONS</h2>
      <nav className="icons-content">
        <a href="https://icons8.com/icon/622/detective" rel="noopener noreferrer" target="_blank"
           className="attribution">Detective icon by Icons8</a>
        <a href="https://icons8.com/icon/j1UxMbqzPi7n/no-image" rel="noopener noreferrer" target="_blank"
           className="attribution">No Image icon by
          Icons8</a>
        <a href="https://icons8.com/icon/EJK2FdL08858/no-image-gallery" rel="noopener noreferrer"
           target="_blank" className="attribution">No Image
          Gallery icon by Icons8</a>
        <a href="https://icons8.com/icon/86209/reset" rel="noopener noreferrer" target="_blank"
           className="attribution">Reset icon by Icons8</a>
        <a href="https://icons8.com/icon/59878/search" rel="noopener noreferrer" target="_blank"
           className="attribution">Search icon by Icons8</a>
        <a href="https://icons8.com/icon/82764/cancel" className="attribution">Cancel icon by Icons8</a>
      </nav>
    </article>
  </aside>;
