import {FC} from 'react';
import '../BasePage.css';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';
import {toQueryString} from '@transport/url';
import {defaultRecordLimit} from '@components/art-gallery/limits';
import {Source} from '@components/art-gallery/museums/source';

export const SideNav: FC = () =>
  <nav id="side-nav" className="side-nav field backdrop-separated" aria-label="site">
    <Link id="navigate-home" className="path rail-path bold attentive field reachable" to={Paths.home}>Home</Link>
    <Link id="navigate-demos" className="path rail-path bold attentive field reachable" to={Paths.demos}>Demos</Link>
    <Link id="navigate-users" className="path rail-path bold attentive field reachable" to={Paths.users}>Users</Link>
    <Link id="navigate-form" className="path rail-path bold attentive field reachable"
      to={`${Paths.artGallery}${toQueryString({
        page: 1,
        size: defaultRecordLimit,
        tab: Source.AIC
      })}`}>Gallery</Link>
    <Link id="navigate-games" className="path rail-path bold attentive field reachable" to={Paths.games}>Games</Link>
    <a id="navigate-repo" className="path rail-path bold attentive field reachable" href={Paths.repo}
      rel="noopener noreferrer" target="_blank">Repo</a>
  </nav>;
