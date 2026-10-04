import {FC, PropsWithChildren} from 'react';
import {Figure} from './Figure';
import './Drawing.css';

export type Kind = 'piece' | 'native' | 'unseen' | 'clipped' | 'clip' | 'ring' | 'unseen-ring' | 'topmost';
export type At = {x: number; y: number};
type Sized = At & {width: number; height: number};

export const Diagram: FC<PropsWithChildren<{title: string; says: string; height: number}>> = ({title, says, height, children}) =>
  <Figure className="diagram" viewBox={`0 0 320 ${height}`} title={title} says={says}>{children}</Figure>;

export const Box: FC<Sized & {kind: Kind}> = ({x, y, width, height, kind}) =>
  <rect className={kind} x={x} y={y} width={width} height={height}/>;

export const Part: FC<Sized & {kind: Kind; name: string}> = ({name, ...box}) => <>
  <Box {...box}/>
  <text className="drawn-caption" x={box.x + box.width / 2} y={box.y + box.height / 2 + 4} textAnchor="middle">{name}</text>
</>;

export const Label: FC<At & {children: string; anchor?: 'start' | 'middle' | 'end'}> = ({x, y, anchor = 'middle', children}) =>
  <text className="drawn-caption" x={x} y={y} textAnchor={anchor}>{children}</text>;

const head = (from: At, to: At): string => {
  const angle = Math.atan2(to.y - from.y, to.x - from.x);
  const wing = (turn: number) => `${to.x - 7 * Math.cos(angle + turn)},${to.y - 7 * Math.sin(angle + turn)}`;
  return `${to.x},${to.y} ${wing(0.45)} ${wing(-0.45)}`;
};

export const Arrow: FC<{through: [At, At, ...At[]]}> = ({through}) => <>
  <polyline className="arrow" points={through.map(({x, y}) => `${x},${y}`).join(' ')}/>
  <polygon className="arrow-head" points={head(through[through.length - 2], through[through.length - 1])}/>
</>;

export const Chevron: FC<At & {turn: number}> = ({x, y, turn}) =>
  <polyline className="chevron" points="-10,-10 10,-10 10,10" transform={`translate(${x} ${y}) rotate(${turn})`}/>;
