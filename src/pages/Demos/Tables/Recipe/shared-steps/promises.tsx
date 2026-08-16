import {ReactNode} from 'react';
import {Motion, Origin, Pace} from '../../../Controls';
import {Tell} from '../../../Recipe';

const paces: Record<Pace, string> = {
  eager: 'The sort happens while you drag, so a wrong grab costs nothing.',
  lazy: 'The table holds calm and the sort lands on the drop, so only the destination matters.'
};

const origins: Record<Origin, string> = {
  keep: 'The column stays in sight while its copy travels, so nothing vanishes while you decide.',
  hide: 'A gap opens where the column left, so the landing is never a guess.'
};

const motions: Record<Motion, string> = {
  animated: 'And the swap slides into place, so the eye never loses a column.',
  static: 'And the swap lands instantly, with no motion, so nothing competes with the pointer.'
};

export const promises = (pace: Pace, origin: Origin, motion: Motion): ReactNode =>
  <Tell>This particular table keeps three more
    promises. {paces[pace]} {origins[origin]} {motions[motion]}</Tell>;
