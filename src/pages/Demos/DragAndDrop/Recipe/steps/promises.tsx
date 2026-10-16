import {FC} from 'react';
import {Motion, Origin, Pace} from '../../../Controls';
import {Tell} from '../../../Recipe';

const paces: Record<Pace, string> = {
  eager: 'The order changes as you drag, so the item’s old place stays reachable until you let go.',
  lazy: 'The order does not change until you drop, so only the destination matters.'
};

const origins: Record<Origin, string> = {
  keep: 'The card at rest stays in sight, so nothing vanishes while you decide.',
  hide: 'One card rides the pointer, so no duplicate muddies the carry.'
};

const motions: Record<Motion, Record<Pace, string>> = {
  animated: {
    eager: 'And the crossed card slides into place, so the eye keeps the story of the swap.',
    lazy: 'And the whole reorder on release glides once, so the landing explains itself.'
  },
  static: {
    eager: 'And the reorder on release lands instantly, so nothing competes with the browser’s drag.',
    lazy: 'And the reorder on release lands instantly, so nothing competes with the browser’s drag.'
  }
};

export const Promises: FC<{pace: Pace; origin: Origin; motion: Motion}> = ({pace, origin, motion}) =>
  <Tell>This particular list keeps three more
    promises. {paces[pace]} {origins[origin]} {motions[motion][pace]}</Tell>;
