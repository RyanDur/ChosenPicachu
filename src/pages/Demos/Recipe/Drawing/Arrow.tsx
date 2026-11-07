import {FC} from 'react';
import {At} from './looks';

const head = (from: At, to: At): string => {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const wing = (turn: number) => `${to.x - 7 * Math.cos(angle + turn)},${to.y - 7 * Math.sin(angle + turn)}`;
  return `${to.x},${to.y} ${wing(0.45)} ${wing(-0.45)}`;
};

export const Arrow: FC<{through: [At, At, ...At[]]}> = ({through}) => <>
  <polyline className="arrow hollow drawn" points={through.map(({x, y}) => `${x},${y}`).join(' ')}/>
  <polygon className="drawn-filled" points={head(through[through.length - 2], through[through.length - 1])}/>
</>;
