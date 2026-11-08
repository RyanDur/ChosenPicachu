import {empty} from '@ryandur/sand';
import {survey} from './survey';

export type DragStyle = 'eager-move' | 'lazy-move' | 'hide-eager-move' | 'hide-lazy-move';

export type Drift = {
  x: number;
  y: number;
};

export type Moving = {
  readonly clientX: number;
  readonly clientY: number;
};

const still: Drift = {x: 0, y: 0};

const drifted = (moving: Moving, from: Drift): Drift =>
  ({x: moving.clientX - from.x, y: moving.clientY - from.y});

const eager = <Seat>(
  under: (x: number, y: number, held: Seat) => Seat | undefined,
  held: Seat,
  settle: (struck: Seat) => void
) => (moving: Moving): void => {
  const struck = under(moving.clientX, moving.clientY, held);
  if (survey.struckAway(held, struck)) {
    settle(struck);
  }
};

const lazy = <Seat>(under: (x: number, y: number, held: Seat) => Seat | undefined) =>
  (held: Seat, moving: Moving, landing: Seat | undefined): Seat | undefined => {
    const struck = under(moving.clientX, moving.clientY, held);
    if (empty(struck)) {
      return landing;
    }
    return survey.struckAway(held, struck) ? struck : undefined;
  };

type MoveEvent = {
  buttons: number;
  pointerId: number;
  clientX: number;
  clientY: number;
  currentTarget: EventTarget | null;
};

const pointer = (
  moved: (moving: Moving) => void,
  drop: () => void
) => (event: MoveEvent): void => {
  if (event.buttons === 0) {
    drop();
    return;
  }
  const holder = event.currentTarget;
  if (holder instanceof Element) {
    holder.setPointerCapture(event.pointerId);
  }
  moved(event);
  if (holder instanceof Element) {
    queueMicrotask(() => holder.setPointerCapture(event.pointerId));
  }
};

export const travel = {
  still,
  drifted,
  eager,
  lazy,
  pointer
};
