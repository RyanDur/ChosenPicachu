import {FC} from 'react';
import {PartLink} from './PartLink';

export const WhyAFixedBannerStillLosesIntroduction: FC = () =>
  <p className="paragraph">A banner pinned to the window with a z-index of 9999 can still slide under a card as the
    page scrolls. This part shows why, and what we did about it for years. It assumes
    what <PartLink part="why-9999-still-loses"/> and <PartLink part="what-else-forms-a-stacking-context"/> give: a
    z-index compared only inside its own stacking context, and fixed and isolation each forming one.</p>;
