import {FC} from 'react';
import {PartLink} from './PartLink';

export const Why9999StillLosesIntroduction: FC = () =>
  <p className="paragraph">A list with a z-index of 9999 can still open under a card with a z-index of 1. This part
    shows that happen, and why no bigger number lifts the list out. It
    assumes what <PartLink part="why-third-is-on-top"/> gives: positioned, auto and stacking order. The second Sort by
    opens its list in the top layer, a layer the browser draws above the whole page,
    which <PartLink part="why-the-popover-wins"/> explains.</p>;
