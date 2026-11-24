import {FC} from 'react';
import {PartLink} from './PartLink';

export const WhatElseFormsAStackingContextIntroduction: FC = () =>
  <p className="paragraph">A card with no z-index at all can still trap the list inside it. This part shows which
    properties form a stacking context, and three common ones that do not. Its exhibit is two cards: card one
    holds a Sort by whose list has a z-index of 9999, and card two has a z-index of 1 and comes later in the code. It
    assumes what <PartLink part="why-third-is-on-top"/> and <PartLink part="why-9999-still-loses"/> give: positioned and
    auto, a stacking context, and a z-index compared only inside its own.</p>;
