import {CSSProperties} from 'react';

type Place = {
  x: number;
  foot: number;
  width: number;
  height: number;
};

const placed = ({x, foot, width, height}: Place): CSSProperties => ({
  '--shape-x': `${x}px`,
  '--shape-base': `${foot}px`,
  '--shape-width': width,
  '--shape-height': height
});

export const shapes = {placed};
