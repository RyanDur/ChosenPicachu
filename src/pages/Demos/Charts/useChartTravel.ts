import {DragEvent, KeyboardEvent, useState} from 'react';
import {Maybe, maybe, nothing} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {strayedTo} from '../DragAndDrop/crossing';

type Pushed = Readonly<Record<number, 'up' | 'down'>>;

type Travel = {
  seats: number;
  onSeated: (from: number, to: number, options?: {replace?: boolean}) => void;
  onRemoved: (at: number) => void;
};

export const useChartTravel = ({seats, onSeated, onRemoved}: Travel) => {
  const [armed, setArmed] = useState<Maybe<number>>(nothing());
  const [aloft, setAloft] = useState<Maybe<number>>(nothing());
  const [aloftLead, setAloftLead] = useState(0);
  const [pushed, setPushed] = useState<Pushed>({});

  const isArmed = (at: number) => armed.map(seat => seat === at).orElse(false);

  const arm = (at: number) => setArmed(maybe(at));

  const dress = (at: number) => classNames('chart-slot',
    aloft.map(seat => seat === at).orElse(false) && 'hide',
    pushed[at] && 'chart-pushed',
    pushed[at] === 'up' && 'upward',
    pushed[at] === 'down' && 'downward');

  const lift = (at: number) => (event: DragEvent<HTMLElement>) => {
    event.dataTransfer.effectAllowed = 'move';
    setAloftLead(event.clientY - event.currentTarget.getBoundingClientRect().top);
    setAloft(maybe(at));
  };

  const boundsOf = (node: Element | null | undefined) =>
    node instanceof HTMLElement ? node.getBoundingClientRect() : undefined;

  const resting = (node: Element | null | undefined) =>
    node instanceof HTMLElement && node.getAnimations().length === 0
      ? node.getBoundingClientRect()
      : undefined;

  const swap = (held: number, to: number, landingTop: number, hand: number) => {
    setAloftLead(hand - landingTop);
    setPushed({[held]: to > held ? 'up' : 'down'});
    onSeated(held, to, {replace: true});
    setAloft(maybe(to));
  };

  const travel = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    aloft.map(held => {
      const slots = event.currentTarget.parentElement?.querySelectorAll(':scope > .chart-slot');
      const seat = boundsOf(slots?.item(held));
      if (!seat) {
        return;
      }
      const to = strayedTo(event.clientY, seat.top + aloftLead, seat.height / 3, held);
      if (to === held || to < 0 || to >= seats) {
        return;
      }
      const landing = resting(slots?.item(to));
      if (landing) {
        const landingTop = to > held ? seat.top + landing.height : seat.top - landing.height;
        swap(held, to, landingTop, event.clientY);
      }
    });
  };

  const release = () => {
    setAloft(nothing());
    setArmed(nothing());
  };

  const keys = (at: number) => (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      const to = Math.min(Math.max(at + (event.key === 'ArrowDown' ? 1 : -1), 0), seats - 1);
      if (to !== at) {
        onSeated(at, to);
        const slot = event.currentTarget.closest('.chart-list')?.querySelectorAll(':scope > .chart-slot').item(to);
        const next = slot?.querySelector('.doorway');
        if (next instanceof HTMLElement) {
          next.focus();
        }
      }
    }
    if ((event.key === 'Delete' || event.key === 'Backspace') && seats > 1) {
      event.preventDefault();
      onRemoved(at);
    }
  };

  const settled = () => setPushed({});

  return {isArmed, arm, dress, lift, travel, release, keys, settled};
};
