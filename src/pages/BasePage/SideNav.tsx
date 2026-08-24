import {FC} from 'react';
import '../BasePage.css';
import {Link} from 'react-router';
import {toQueryString} from '@transport/url';
import {defaultRecordLimit} from '@components/art-gallery/limits';
import {Source} from '@components/art-gallery/museums/types/resource';
import {Paths} from '@pages/Paths';

const AboutNav: FC = () =>
  <Link id="navigate-demos" className="path attentive field" to={Paths.demos}>Demos</Link>;

export const SideNav: FC = () =>
  <aside id="side-nav" className="side-nav field" aria-label="site rail">
    <nav id="app-navigation" className="app-navigation backdrop" aria-label="site">
      <Link id="navigate-home" className="path attentive field" to={Paths.home}>Home</Link>
      <AboutNav/>
      <Link id="navigate-users" className="path attentive field" to={Paths.users}>Users</Link>
      <Link id="navigate-form" className="path attentive field"
            to={`${Paths.artGallery}${toQueryString({
              page: 1,
              size: defaultRecordLimit,
              tab: Source.AIC
            })}`}>Gallery</Link>
      <Link id="navigate-games" className="path attentive field" to={Paths.games}>Games</Link>
      <a id="navigate-repo" className="path attentive field" href={Paths.repo}
         rel="noopener noreferrer" target="_blank">Repo</a>
    </nav>
  </aside>;
