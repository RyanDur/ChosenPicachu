import {FC} from 'react';
import {Motion, Origin, Pace} from '../../../Controls';
import {Tell} from '../../../Recipe';

const paces: Record<Pace, string> = {
  eager: 'The order changes as you drag, so the item’s old place stays reachable until you let go.',
  lazy: 'The order does not change until you drop, so only the destination matters.'
};

const origins: Record<Origin, string> = {
  keep: 'The card at rest stays in sight, so nothing vanishes while you decide.',
  hide: 'One card rides the pointer, so you see one card, not two.'
};

const motions: Record<Motion, Record<Pace, string>> = {
  animated: {
    eager: 'And the crossed card slides into place, so you can follow the swap instead of seeing a jump.',
    lazy: 'And the whole reorder on release glides once, so you see each card travel to its new place.'
  },
  static: {
    eager: 'And the reorder lands instantly, so nothing competes with the browser’s drag.',
    lazy: 'And the reorder on release lands instantly, so nothing competes with the browser’s drag.'
  }
};

export const Promises: FC<{pace: Pace; origin: Origin; motion: Motion}> = ({pace, origin, motion}) =>
  <Tell>This particular list keeps three more
    promises. {paces[pace]} {origins[origin]} {motions[motion][pace]}</Tell>;
