import {FC} from 'react';
import {Link} from 'react-router';
import {carve, Snippet} from '../Recipe';
import {useCarriedAddress} from '@pages/Demos/useCarriedAddress';
import {BannerAtTheEdge} from './BannerAtTheEdge';
import {topLayerStoryTitleId} from './top-layer-story-title-id';
import bannersSource from '@banners/Banners.tsx?sample';
import {PartLink} from './PartLink';
import {WhichCardIsOnTop} from './WhichCardIsOnTop';
import {zIndexParts} from './part-pages';
import '../Runs.css';

export const WhyAFixedBannerStillLoses: FC = () => {
  const carried = useCarriedAddress();

  return <>
    <BannerAtTheEdge/>
    <ol className="runs card rounded-corners lifted padded">
      <li className="run">
        <p className="paragraph">The banner in the exhibit is the old-way menu
          in <PartLink part="what-else-forms-a-stacking-context"/> again, at the window’s edge: its 9999 counts only
          inside the card it is written in.
        </p>
      </li>
      <li className="run">
        <p className="paragraph">The site’s own banner sets no z-index. It is a popover, so the browser shows it in
          the top layer, above every stacking context on the page, as <PartLink part="why-the-popover-wins"/> shows.
          No z-index on the page is compared with it, so it would stay over both cards in the little window.
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
