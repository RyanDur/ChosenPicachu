import type {Paints} from './PagePaints';

export const paintsAtOnce: Paints = {
  requestAnimationFrame: paint => {
    paint(0);
    return 0;
  },
  cancelAnimationFrame: () => undefined
};
