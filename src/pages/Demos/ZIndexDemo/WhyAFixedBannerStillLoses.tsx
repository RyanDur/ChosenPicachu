import {FC} from 'react';
import {Link} from 'react-router';
import {carve, lines, Snippet} from '../Recipe';
import {useCarriedAddress} from '@pages/Demos/useCarriedAddress';
import {BannerAtTheEdge} from './BannerAtTheEdge';
import {BannerTrap} from './BannerTrap';
import {topLayerStoryTitleId} from './top-layer-story-title-id';
import zIndexCss from './ZIndexDemo.css?sample';
import bannersSource from '@banners/Banners.tsx?sample';
import {PartLink} from './PartLink';
import {WhichCardIsOnTop} from './WhichCardIsOnTop';
import {zIndexParts} from './part-pages';
import '../Runs.css';

export const WhyAFixedBannerStillLoses: FC = () => {
  const carried = useCarriedAddress();

  return <>
    <BannerAtTheEdge/>
    <BannerTrap/>
    <ol className="runs card rounded-corners lifted padded">
      <li className="run">
        <p className="paragraph">The old banner’s position is fixed. It is placed against the window and kept there as
          the page scrolls, here along the window’s bottom edge. Its z-index is 9999, but it is written inside card one,
          and card one forms a stacking context. So as the page scrolls, plain text passes under the banner, but card
          two, later in the code with its own z-index of 1, passes over it. It is the old-way menu
          in <PartLink part="what-else-forms-a-stacking-context"/> again, at the window’s edge.
        </p>
        <Snippet label="CSS" lines={lines.fromTheExhibit([
          ...carve.unit(zIndexCss, '.old-banner {'), lines.blank,
          ...carve.unit(zIndexCss, '.forms-context {')
        ])}/>
      </li>
      <li className="run">
        <p className="paragraph">The site’s own banner sets no z-index. It is a popover, so the browser shows it in
          the top layer, above every stacking context on the page, as <PartLink part="why-the-popover-wins"/> shows.
          No z-index on the page is compared with it. It stays over every card on the page, card two included.
        </p>
        <Snippet label="HTML"
          lines={carve.between(bannersSource, '<section id="banners"', "className={classNames('banners unfilled'")}/>
      </li>
      <li className="run">
        <p className="paragraph">To build this banner yourself, go to <Link className="signpost"
          to={carried(zIndexParts.addressOf('lets-build-this-feature'), topLayerStoryTitleId)}>
          <cite>{zIndexParts.told('lets-build-this-feature').name}</cite></Link>. It opens at the step that makes the
          panel a popover.
        </p>
      </li>
    </ol>
    <WhichCardIsOnTop/>
  </>;
};
