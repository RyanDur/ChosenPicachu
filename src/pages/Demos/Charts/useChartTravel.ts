import {DragEvent, KeyboardEvent, useState} from 'react';
import {Maybe, maybe, nothing} from '@ryandur/sand';
import {classNames} from '@components/class-names';
import {strayed} from '../DragAndDrop/crossing';

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

  const travel = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    aloft.map(held => {
      const slots = event.currentTarget.parentElement?.querySelectorAll(':scope > .chart-slot');
      const seat = slots?.item(held);
      if (!(seat instanceof HTMLElement)) {
        return;
      }
      const bounds = seat.getBoundingClientRect();
      const anchor = bounds.top + aloftLead;
      const third = bounds.height / 3;
      const to = strayed(event.clientY, anchor, third, false) ? held + 1
        : strayed(event.clientY, anchor, third, true) ? held - 1
          : held;
      if (to === held || to < 0 || to >= seats) {
        return;
      }
      const next = slots?.item(to);
      if (!(next instanceof HTMLElement) || (next.getAnimations?.().length ?? 0) > 0) {
        return;
      }
      const displaced = next.getBoundingClientRect();
      const landingTop = to > held
        ? bounds.top + displaced.height
        : bounds.top - displaced.height;
      setAloftLead(event.clientY - landingTop);
      setPushed({[held]: to > held ? 'up' : 'down'});
      onSeated(held, to, {replace: true});
      setAloft(maybe(to));
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
