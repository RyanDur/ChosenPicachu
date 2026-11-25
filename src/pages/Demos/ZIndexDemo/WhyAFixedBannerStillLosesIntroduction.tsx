import {FC} from 'react';
import {PartLink} from './PartLink';

export const WhyAFixedBannerStillLosesIntroduction: FC = () =>
  <p className="paragraph">A banner pinned to the window with a z-index of 9999 can still slide under a card as the
    page scrolls. This part shows why, and how the site makes its own banner a popover so that no card covers it. It
    assumes what <PartLink part="why-9999-still-loses"/>, <PartLink
    part="what-else-forms-a-stacking-context"/> and <PartLink part="why-the-popover-wins"/> give: a z-index compared
    only inside its own stacking context, fixed and isolation each forming one, and a popover drawn in the top layer
    above them all.</p>;
