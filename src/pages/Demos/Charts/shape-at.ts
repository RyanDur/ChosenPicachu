import {CSSProperties} from 'react';

type Place = {
  x: number;
  base: number;
  width: number;
  height: number;
};

export const shapeAt = ({x, base, width, height}: Place): CSSProperties => ({
  '--shape-x': `${x}px`,
  '--shape-base': `${base}px`,
  '--shape-width': width,
  '--shape-height': height
});
