import {DragEvent, useState} from 'react';
import {classNames} from '@components/class-names';
import {strayed} from '../DragAndDrop/crossing';

type Pushed = Readonly<Record<number, 'up' | 'down'>>;

export const useChartTravel = (seats: number, onSeated: (from: number, to: number) => void) => {
  const [armed, setArmed] = useState<number>();
  const [aloft, setAloft] = useState<number>();
  const [aloftLead, setAloftLead] = useState(0);
  const [pushed, setPushed] = useState<Pushed>();

  const dress = (at: number) => classNames('chart-slot',
    aloft === at && 'hide',
    pushed?.[at] !== undefined && 'chart-pushed');

  const theater = (at: number) => pushed?.[at] !== undefined
    ? {'--toward': pushed[at] === 'up' ? '1' : '-1'}
    : undefined;

  const lift = (at: number) => (event: DragEvent<HTMLElement>) => {
    event.dataTransfer.effectAllowed = 'move';
    setAloftLead(event.clientY - event.currentTarget.getBoundingClientRect().top);
    setAloft(at);
  };

  const travel = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    if (aloft === undefined) {
      return;
    }
    const slots = event.currentTarget.parentElement?.querySelectorAll(':scope > .chart-slot');
    const held = slots?.item(aloft);
    if (!(held instanceof HTMLElement)) {
      return;
    }
    const seat = held.getBoundingClientRect();
    const anchor = seat.top + aloftLead;
    const third = seat.height / 3;
    const to = strayed(event.clientY, anchor, third, false) ? aloft + 1
      : strayed(event.clientY, anchor, third, true) ? aloft - 1
        : undefined;
    if (to === undefined || to < 0 || to >= seats) {
      return;
    }
    const next = slots?.item(to);
    if (!(next instanceof HTMLElement) || (next.getAnimations?.().length ?? 0) > 0) {
      return;
    }
    const displaced = next.getBoundingClientRect();
    const landingTop = to > aloft
      ? seat.top + displaced.height
      : seat.top - displaced.height;
    setAloftLead(event.clientY - landingTop);
    setPushed({[aloft]: to > aloft ? 'up' : 'down'});
    onSeated(aloft, to);
    setAloft(to);
  };

  const release = () => {
    setAloft(undefined);
    setArmed(undefined);
  };

  return {armed, setArmed, dress, theater, lift, travel, release, settled: () => setPushed(undefined)};
};
