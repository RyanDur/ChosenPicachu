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

    <details className="borrowed-assets icons">
      <summary className="title bold">ICONS</summary>
      <nav className="icons-content" aria-label="icon credits">
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
    </details>
  </aside>;
