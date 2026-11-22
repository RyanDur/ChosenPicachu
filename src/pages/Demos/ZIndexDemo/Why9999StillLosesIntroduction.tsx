import {FC} from 'react';
import {PartLink} from './PartLink';

export const Why9999StillLosesIntroduction: FC = () =>
  <p className="paragraph">A list with a z-index of 9999 can still open under a card with a z-index of 1. This part
    shows that happen, and why no bigger number lifts the list out. It is the part of z-index where most of us get
    stuck, and it comes from contexts that sit inside other contexts. This part assumes
    what <PartLink part="why-third-is-on-top"/> and <PartLink part="how-position-places-a-box"/> give: the order
    boxes are drawn in, and what relative and absolute do.</p>;
