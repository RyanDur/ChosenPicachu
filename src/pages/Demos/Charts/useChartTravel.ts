import {DragEvent, KeyboardEvent, useReducer} from 'react';
import {Maybe, nothing, some} from '@ryandur/sand';
import {classNames} from '@components';
import {crossing} from '../DragAndDrop';
import {chartTravel} from './chart-travel';
import {chartTravelChange} from './chart-travel-change';

type Travel = {
  seats: number;
  onSeated: (from: number, to: number, options?: {replace?: boolean}) => void;
  onRemoved: (at: number, pressed: Element) => void;
};

export const useChartTravel = ({seats, onSeated, onRemoved}: Travel) => {
  const [{armed, aloft, mark, pushed}, dispatch] = useReducer(chartTravel.reduce, chartTravel.initial);

  const isArmed = (at: number) => armed.map(gripped => gripped === at).orElse(false);

  const arm = (at: number) => dispatch(chartTravelChange.armed(at));

  const disarm = () => dispatch(chartTravelChange.disarmed());

  const dress = (at: number) => classNames('chart-slot', 'focal-ringed',
    aloft.map(held => held === at).orElse(false) && 'hide',
    pushed[at] && 'chart-pushed',
    pushed[at] === 'up' && 'upward',
    pushed[at] === 'down' && 'downward');

  const lift = (at: number) => (event: DragEvent<HTMLElement>) => {
    event.dataTransfer.effectAllowed = 'move';
    dispatch(chartTravelChange.lifted(at, event.pageY));
  };

  const boundsOf = (node: Element | null | undefined): Maybe<DOMRect> =>
    node instanceof HTMLElement ? some(node.getBoundingClientRect()) : nothing();

  const resting = (node: Element | null | undefined) =>
    node instanceof HTMLElement && node.getAnimations().length === 0;

  const swap = (held: number, to: number, pointer: number) => {
    dispatch(chartTravelChange.swapped(held, to, pointer));
    onSeated(held, to, {replace: true});
  };

  const travel = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    const slots = event.currentTarget.parentElement?.children;
    aloft.map(held => boundsOf(slots?.item(held)).map(bounds => {
      const pointer = event.pageY;
      const to = crossing.strayedTo(pointer, mark, bounds.height / 3, held);
      if (to === held || to < 0 || to >= seats) {
        return;
      }
      if (resting(slots?.item(to))) {
        swap(held, to, pointer);
      }
    }));
  };

  const release = () => dispatch(chartTravelChange.released());

  const keys = (at: number) => (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      const to = Math.min(Math.max(at + (event.key === 'ArrowDown' ? 1 : -1), 0), seats - 1);
      if (to !== at) {
        onSeated(at, to);
      }
    }
    if ((event.key === 'Delete' || event.key === 'Backspace') && seats > 1) {
      event.preventDefault();
      onRemoved(at, event.currentTarget);
    }
  };

  const settled = () => dispatch(chartTravelChange.settled());

  return {isArmed, arm, disarm, dress, lift, travel, release, keys, settled};
};
