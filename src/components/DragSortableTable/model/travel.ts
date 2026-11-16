import {DOMAttributes} from 'react';
import {Maybe} from '@ryandur/sand';
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
  under: (x: number, y: number, held: Seat) => Maybe<Seat>,
  held: Seat,
  settle: (struck: Seat) => void
) => (moving: Moving): void => {
  under(moving.clientX, moving.clientY, held).mBind(struck => survey.struckAway(held, struck)).map(settle);
};

const lazy = <Seat>(under: (x: number, y: number, held: Seat) => Maybe<Seat>) =>
  (held: Seat, moving: Moving, landing: Maybe<Seat>): Maybe<Seat> =>
    under(moving.clientX, moving.clientY, held).either(struck => survey.struckAway(held, struck), () => landing);

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

type HeldHandlers = Pick<DOMAttributes<Element>, 'onPointerMove' | 'onPointerUp' | 'onPointerCancel' | 'onLostPointerCapture'>;

const notHeld: HeldHandlers = {
  onPointerMove: undefined,
  onPointerUp: undefined,
  onPointerCancel: undefined,
  onLostPointerCapture: undefined
};

const whileHeld = <Drag>(
  drag: Maybe<Drag>,
  moved: (held: Drag) => (moving: Moving) => void,
  release: () => void
): HeldHandlers => drag.map((held): HeldHandlers => ({
  onPointerMove: pointer(moved(held), release),
  onPointerUp: release,
  onPointerCancel: release,
  onLostPointerCapture: pointer(moved(held), release)
})).orElse(notHeld);

export const travel = {
  still,
  drifted,
  eager,
  lazy,
  pointer,
  whileHeld
};
