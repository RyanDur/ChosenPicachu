import {FC} from 'react';
import '../BasePage.css';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';
import {toQueryString} from '@transport/url';
import {defaultRecordLimit} from '@components/art-gallery/limits';
import {Source} from '@components/art-gallery/museums/source';

export const SideNav: FC = () =>
  <nav id="side-nav" className="side-nav field" aria-label="site">
    <ul id="app-navigation" className="app-navigation">
      <li><Link id="navigate-home" className="path attentive field" to={Paths.home}>Home</Link></li>
      <li><Link id="navigate-demos" className="path attentive field" to={Paths.demos}>Demos</Link></li>
      <li><Link id="navigate-users" className="path attentive field" to={Paths.users}>Users</Link></li>
      <li><Link id="navigate-form" className="path attentive field"
        to={`${Paths.artGallery}${toQueryString({
          page: 1,
          size: defaultRecordLimit,
          tab: Source.AIC
        })}`}>Gallery</Link></li>
      <li><Link id="navigate-games" className="path attentive field" to={Paths.games}>Games</Link></li>
      <li><a id="navigate-repo" className="path attentive field" href={Paths.repo}
        rel="noopener noreferrer" target="_blank">Repo</a></li>
    </ul>
  </nav>;
