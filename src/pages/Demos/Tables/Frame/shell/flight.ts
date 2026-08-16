import {Shell} from './desk';

export type Flight<Carried> = {
  travel: (moving: PointerEvent, carried: Carried) => Carried;
  land: (carried: Carried) => void;
};

export const takeFlight = <Carried>(
  {document}: Shell,
  event: PointerEvent,
  opening: Carried,
  flight: Flight<Carried>
): void => {
  const surface = document.createElement('article');
  surface.className = 'drag-surface';
  document.body.append(surface);
  let carried = opening;
  let flown = false;
  const done = (): void => {
    if (flown) {
      return;
    }
    flown = true;
    flight.land(carried);
    surface.remove();
  };
  surface.addEventListener('pointermove', moving => {
    if (moving.buttons === 0) {
      done();
      return;
    }
    carried = flight.travel(moving, carried);
  });
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(ending =>
    surface.addEventListener(ending, done));
  surface.setPointerCapture(event.pointerId);
};
