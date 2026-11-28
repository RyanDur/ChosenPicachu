import {FC} from 'react';
import {Link} from 'react-router';
import {useCarriedAddress} from '@pages/Demos/useCarriedAddress';
import {BannerAtTheEdge} from './BannerAtTheEdge';
import {topLayerStoryTitleId} from './top-layer-story-title-id';
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
        <p className="paragraph">To build this banner yourself, go to <Link className="signpost"
          to={carried(zIndexParts.addressOf('lets-build-this-feature'), topLayerStoryTitleId)}>
          <cite>{zIndexParts.told('lets-build-this-feature').name}</cite></Link>.
        </p>
      </li>
    </ol>
    <WhichCardIsOnTop/>
  </>;
};
