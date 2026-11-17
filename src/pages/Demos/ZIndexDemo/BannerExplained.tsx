import {FC} from 'react';
import {Link} from 'react-router';
import {useSearchParamsOnceHydrated} from '@navigation/search-params';
import {carve, lines, Snippet, storyKeys} from '../Recipe';
import {BannerTrap} from './BannerTrap';
import {partHeadings} from './part-headings';
import {topLayerStory} from './top-layer-story';
import zIndexCss from './ZIndexDemo.css?sample';
import bannersSource from '@banners/Banners.tsx?sample';
import bannersCss from '@banners/Banners.css?sample';
import '../Runs.css';
import {PartLink} from './PartLink';
import {zIndexParts} from './part-pages';

export const BannerExplained: FC = () => {
  const [searchParams] = useSearchParamsOnceHydrated();

  return <section aria-labelledby={partHeadings.fixedBannerLoses} className="stacking-part">
    <h2 id={partHeadings.fixedBannerLoses} className="title bold">{zIndexParts.titleOf('fixed-banner-loses')}</h2>
    <BannerTrap/>
    <ol className="runs card rounded-corners lifted padded">
      <li className="run">
        <p className="paragraph">The old banner’s position is fixed. It is placed against the window and kept there as
          the page scrolls, here along the window’s bottom edge. Its z-index is 9999, but it is written inside card one,
          and card one forms a stacking context. So as the page scrolls, plain text passes under the banner, but card
          two, later in the code with its own z-index of 1, passes over it. It is the old menu
          in <PartLink part="why-9999-still-loses"/> again, at the window’s edge.</p>
        <Snippet label="CSS" lines={lines.fromTheExhibit([
          ...carve.unit(zIndexCss, '.old-banner {'), lines.blank,
          ...carve.unit(zIndexCss, '.forms-context {')
        ])}/>
      </li>
      <li className="run">
        <p className="paragraph">The site’s own banner is fixed too. It is written last on the page, outside the tab’s
          content. The content wears <code className="monospaced">isolation: isolate</code>,
          as <PartLink part="what-else-forms-a-stacking-context"/> shows, so no card’s z-index is ever compared with the
          banner’s. The banner’s 3 is compared with the content and with the header, the footer, the site’s navigation
          and the tabs, none of them higher than 2. It stays at the window’s edge, over every card on the page, card two
          included.</p>
        <Snippet label="HTML" lines={carve.between(bannersSource, '<section id="banners"', "className={classNames('banners'")}/>
        <Snippet label="CSS" lines={carve.between(bannersCss, '.banners {', 'z-index: 3;')}/>
      </li>
      <li className="run">
        <p className="paragraph">To build this banner yourself, go to <Link className="signpost"
          to={{search: `?${storyKeys.openedIn(searchParams, topLayerStory)}`, hash: storyKeys.anchorOf(topLayerStory)}}>the
          tutorial below</Link>. It opens at the step where the panel is written at the page’s root.</p>
      </li>
    </ol>
  </section>;
};
