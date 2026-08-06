import {FC} from 'react';
import {Controls, ControlsProps, Copy} from '../Controls';

const cap = (word: string): string => word.charAt(0).toUpperCase() + word.slice(1);

const copy: Copy = {
  kind: 'table',
  readout: (pace, origin, motion) => `<${cap(pace)}${cap(origin)}${cap(motion)}Table/>`,
  pace: {
    eager: 'Neighbours swap the moment you drag past them, so the order is already settled when you let go.',
    lazy: 'The table holds its shape while you drag and commits the new order on drop.'
  },
  origin: {
    keep: 'The lifted row or column stays where it was, so you can see the gap it will leave.',
    hide: 'The lifted row or column blanks out at its origin; only the ghost under your pointer reads as real.'
  },
  motion: {
    animated: 'The swap itself is instant; displaced cells slide to their new seats.',
    static: 'Reorders apply in a single frame; cells cut to their new seats.'
  }
};

export const TableControls: FC<ControlsProps> = props => <Controls copy={copy} {...props}/>;
