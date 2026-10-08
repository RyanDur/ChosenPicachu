import {FC} from 'react';
import {Link, useSearchParams} from 'react-router';
import {plain, Snippet} from '../Recipe';
import {span, unit} from '../Recipe/carve';
import {BannerTrap} from './BannerTrap';
import {storyAnchor} from '../Recipe/story-anchor';
import {storyOpenedIn} from '../Recipe/Story';
import {topLayerStory} from './Recipe/TopLayerRecipe';
import zIndexCss from './ZIndexDemo.css?sample';
import bannersSource from '@components/Banners/Banners.tsx?sample';
import '../Recipe/Runs.css';

const gap = plain(' ');

export const BannerExplained: FC = () => {
  const [searchParams] = useSearchParams();

  return <section aria-labelledby="fixed-banner-loses-heading" className="stacking-part">
    <h3 id="fixed-banner-loses-heading" className="title bold">Why a fixed banner still loses</h3>
    <BannerTrap/>
    <ol className="runs card rounded-corners lifted padded">
      <li className="run">
        <p className="paragraph">The old banner’s position is fixed. It is placed against the window and kept there as
          the page scrolls, here along the window’s bottom edge. Its z-index is 9999, but it is written inside card one,
          and card one forms a stacking context. So as the page scrolls, plain text passes under the banner, but card
          two, later in the code with its own z-index of 1, passes over it. It is the old menu again, at the window’s
          edge.</p>
        <Snippet label="CSS" lines={[
          ...unit(zIndexCss, '.old-banner {'), gap,
          ...unit(zIndexCss, '.forms-context {')
        ]}/>
      </li>
      <li className="run">
        <p className="paragraph">The banner in the top layer is the site’s own banner. It is a popover shown in the top
          layer, so card one’s stacking context does not hold it. It stays at the window’s edge, over everything on the
          page, card two included.</p>
        <Snippet label="TS" lines={span(bannersSource, '<section id="banners"', "className={classNames('banners'")}/>
      </li>
      <li className="run">
        <p className="paragraph">To build this banner yourself, <Link className="signpost"
          to={{search: `?${storyOpenedIn(searchParams, topLayerStory)}`, hash: storyAnchor(topLayerStory)}}>the
          tutorial below</Link> opens at
          the step that does it: making the banner a popover, so it is shown in the top layer.</p>
      </li>
    </ol>
  </section>;
};
