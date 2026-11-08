import {FC} from 'react';
import {Link} from 'react-router';
import {useSearchParamsOnceHydrated} from '@components/search-params';
import {Snippet, lines, carve} from '../Recipe';
import {BannerTrap} from './BannerTrap';
import {fixedBannerLosesHeading} from './part-headings';
import {storyKeys} from '../Recipe';
import {topLayerStory} from './Recipe/TopLayerRecipe';
import zIndexCss from './ZIndexDemo.css?sample';
import bannersSource from '@components/Banners/Banners.tsx?sample';
import bannersCss from '@components/Banners/Banners.css?sample';
import '../Runs.css';

const gap = lines.plain(' ');

export const BannerExplained: FC = () => {
  const [searchParams] = useSearchParamsOnceHydrated();

  return <section aria-labelledby={fixedBannerLosesHeading} className="stacking-part">
    <h2 id={fixedBannerLosesHeading} className="title bold">Why a fixed banner still loses</h2>
    <BannerTrap/>
    <ol className="runs card rounded-corners lifted padded">
      <li className="run">
        <p className="paragraph">The old banner’s position is fixed. It is placed against the window and kept there as
          the page scrolls, here along the window’s bottom edge. Its z-index is 9999, but it is written inside card one,
          and card one forms a stacking context. So as the page scrolls, plain text passes under the banner, but card
          two, later in the code with its own z-index of 1, passes over it. It is the old menu again, at the window’s
          edge.</p>
        <Snippet label="CSS" lines={[
          ...carve.unit(zIndexCss, '.old-banner {'), gap,
          ...carve.unit(zIndexCss, '.forms-context {')
        ]}/>
      </li>
      <li className="run">
        <p className="paragraph">The site’s own banner is fixed too. It is written last on the page, outside every
          card, so no card’s stacking context holds it. Its z-index is compared with card two’s, at the same level, and
          it is the higher. It stays at the window’s edge, over everything on the page, card two included.</p>
        <Snippet label="TS" lines={carve.span(bannersSource, '<section id="banners"', "className={classNames('banners'")}/>
        <Snippet label="CSS" lines={carve.span(bannersCss, '.banners {', 'z-index: 3;')}/>
      </li>
      <li className="run">
        <p className="paragraph">To build this banner yourself, go to <Link className="signpost"
          to={{search: `?${storyKeys.openedIn(searchParams, topLayerStory)}`, hash: storyKeys.anchorOf(topLayerStory)}}>the
          tutorial below</Link>. It opens at the step where the panel is written at the page’s root.</p>
      </li>
    </ol>
  </section>;
};
