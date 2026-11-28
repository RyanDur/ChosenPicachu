import {FC} from 'react';
import {BannerAtTheEdge} from './BannerAtTheEdge';
import {PartLink} from './PartLink';
import {WhichCardIsOnTop} from './WhichCardIsOnTop';
import '../Runs.css';

export const WhyAFixedBannerStillLoses: FC = () => <>
  <BannerAtTheEdge/>
  <ol className="runs card rounded-corners lifted padded">
    <li className="run">
      <p className="paragraph">The banner in the exhibit is the old-way menu
        in <PartLink part="what-else-forms-a-stacking-context"/> again, at the window’s edge: its 9999 counts only
        inside the card it is written in.
      </p>
    </li>
  </ol>
  <WhichCardIsOnTop/>
</>;
