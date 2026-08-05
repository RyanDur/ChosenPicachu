import {FC} from 'react';
import {Controls, ControlsProps, Copy} from '../Controls';

const copy: Copy = {
  kind: 'list',
  component: 'DragSortList',
  pace: {
    eager: 'Items swap the moment the drag crosses them, so the order is already settled when you let go.',
    lazy: 'The list holds its shape while you drag and commits the new order when the drag ends.'
  },
  origin: {
    keep: 'The item you lifted stays put beneath the platform’s drag image, so there are two of it for the length of the drag.',
    hide: 'The item you lifted fades to a whisper at its origin; the drag image in your hand reads as the real thing.'
  },
  motion: {
    animated: 'Eager crossings slide the crossed item to its new seat; a lazy settle glides once the drag has ended.',
    static: 'Reorders apply in a single frame; items cut to their new seats.'
  }
};

export const ListControls: FC<ControlsProps> = props => <Controls copy={copy} {...props}/>;
