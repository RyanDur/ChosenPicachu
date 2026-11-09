import {CSSProperties} from 'react';

type Place = {
  x: number;
  base: number;
  width: number;
  height: number;
};

const at = ({x, base, width, height}: Place): CSSProperties => ({
  '--shape-x': `${x}px`,
  '--shape-base': `${base}px`,
  '--shape-width': width,
  '--shape-height': height
});

export const shapes = {at};
