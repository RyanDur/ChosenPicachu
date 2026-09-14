import {has} from '@ryandur/sand';
import {struckAway} from './survey';

export type DragStyle = 'eager-move' | 'lazy-move' | 'hide-eager-move' | 'hide-lazy-move';

export type Drift = {
  x: number;
  y: number;
};

export type Moving = {
  readonly clientX: number;
  readonly clientY: number;
};

export const still: Drift = {x: 0, y: 0};

export const drifted = (moving: Moving, from: Drift): Drift =>
  ({x: moving.clientX - from.x, y: moving.clientY - from.y});

export const eagerTravel = <Seat>(
  under: (x: number, y: number, held: Seat) => Seat | undefined,
  held: Seat,
  settle: (struck: Seat) => void
) => (moving: Moving): void => {
  const struck = under(moving.clientX, moving.clientY, held);
  if (struckAway(held, struck)) {
    settle(struck);
  }
};

export const lazyTravel = <Seat>(under: (x: number, y: number, held: Seat) => Seat | undefined) =>
  (held: Seat, moving: Moving, landing: Seat | undefined): Seat | undefined => {
    const struck = under(moving.clientX, moving.clientY, held);
    if (!has(struck)) {
      return landing;
    }
    return struckAway(held, struck) ? struck : undefined;
  };

export const carried = (origin: Drift | undefined, moving: Moving): {origin: Drift; drift: Drift} =>
  has(origin)
    ? {origin, drift: drifted(moving, origin)}
    : {origin: {x: moving.clientX, y: moving.clientY}, drift: still};

type MoveEvent = {
  buttons: number;
  pointerId: number;
  clientX: number;
  clientY: number;
  currentTarget: EventTarget | null;
};

export const pointerTravel = (
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
