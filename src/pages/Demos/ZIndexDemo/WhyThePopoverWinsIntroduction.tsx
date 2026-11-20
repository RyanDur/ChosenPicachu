import {FC} from 'react';
import {PartLink} from './PartLink';

export const WhyThePopoverWinsIntroduction: FC = () =>
  <p className="paragraph">A menu opened as a popover shows over every card, whatever stacking context sits around it.
    This part shows why, and what the menu costs to place once it leaves its card. It assumes
    what <PartLink part="why-9999-still-loses"/> gives: the Sort by built the old way, whose list opens under the next
    card, and a z-index compared only inside its own stacking context.</p>;
