import {createContext} from 'react';

export type Paints = Pick<Window, 'requestAnimationFrame' | 'cancelAnimationFrame'>;

const unpainted: Paints = {
  requestAnimationFrame: paint => {
    paint(0);
    return 0;
  },
  cancelAnimationFrame: () => undefined
};

export const PagePaints = createContext<Paints>(unpainted);
