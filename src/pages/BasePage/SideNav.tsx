import {FC} from 'react';
import {NavLink} from 'react-router';
import {Paths} from '@pages/Paths';
import {toQueryString} from '@transport/url';
import {defaultRecordLimit} from '@components/art-gallery/limits';
import {Source} from '@components/art-gallery/museums/source';

const railPath = () => 'path rail-path attentive field page-joined reachable';

export const SideNav: FC = () =>
  <nav id="side-nav" className="side-nav field backdrop-separated" aria-label="site">
    <NavLink id="navigate-home" className={railPath} to={Paths.home} end>Home</NavLink>
    <NavLink id="navigate-demos" className={railPath} to={Paths.demos}>Demos</NavLink>
    <NavLink id="navigate-users" className={railPath} to={Paths.users}>Users</NavLink>
    <NavLink id="navigate-form" className={railPath}
      to={`${Paths.artGallery}${toQueryString({
        page: 1,
        size: defaultRecordLimit,
        tab: Source.AIC
      })}`}>Gallery</NavLink>
    <NavLink id="navigate-games" className={railPath} to={Paths.games}>Games</NavLink>
    <a id="navigate-repo" className="path rail-path attentive field reachable" href={Paths.repo}
      rel="noopener noreferrer" target="_blank">Repo</a>
  </nav>;
