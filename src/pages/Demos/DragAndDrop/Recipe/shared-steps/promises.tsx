import {ReactNode} from 'react';
import {Motion, Origin, Pace} from '../../../Controls';
import {Tell} from '../../../Recipe';

const paces: Record<Pace, string> = {
  eager: 'The list answers as they drag, so home stays reachable until they let go.',
  lazy: 'The list holds calm and settles on the drop, so only the destination matters.'
};

const origins: Record<Origin, string> = {
  keep: 'The card at rest stays in sight, so nothing vanishes while they decide.',
  hide: 'One card rides the pointer, so no duplicate muddies the carry.'
};

const motions: Record<Motion, Record<Pace, string>> = {
  animated: {
    eager: 'And the crossed card slides home, so the eye keeps the story of the swap.',
    lazy: 'And the whole settle glides once, so the landing explains itself.'
  },
  static: {
    eager: 'And the settle lands instantly, so nothing competes with the drag session.',
    lazy: 'And the settle lands instantly, so nothing competes with the drag session.'
  }
};

export const promises = (pace: Pace, origin: Origin, motion: Motion): ReactNode =>
  <Tell>This particular list keeps three more
    promises. {paces[pace]} {origins[origin]} {motions[motion][pace]}</Tell>;
