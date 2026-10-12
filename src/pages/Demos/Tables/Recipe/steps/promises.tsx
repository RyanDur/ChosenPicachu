import {FC} from 'react';
import {Motion, Origin, Pace} from '../../../Controls';
import {Tell} from '../../../Recipe';

const paces: Record<Pace, string> = {
  eager: 'The sort happens while you drag, so a wrong grab costs nothing.',
  lazy: 'The table holds calm and the sort lands on the drop, so only the destination matters.'
};

const origins: Record<Origin, string> = {
  keep: 'The column stays where it stands while you drag, so nothing moves but the order while you decide.',
  hide: 'The column moves with the pointer and a gap opens where it left, so the landing is never a guess.'
};

const motions: Record<Motion, string> = {
  animated: 'And the swap slides into place, so the reader never loses a column.',
  static: 'And the swap lands instantly, with no motion, so nothing competes with the pointer.'
};

export const Promises: FC<{pace: Pace; origin: Origin; motion: Motion}> = ({pace, origin, motion}) =>
  <Tell>This particular table keeps three more
    promises. A dial’s promise is what the table guarantees under that setting. {paces[pace]} {origins[origin]} {motions[motion]}</Tell>;
