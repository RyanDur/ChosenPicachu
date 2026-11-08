import {FC} from 'react';
import {classNames} from '@components';

export type Point = {readonly x: number; readonly y: number};

export type Box = Point & {readonly label: string; readonly width: number; readonly height: number};

export const leftMiddle = ({x, y, height}: Box): Point => ({x, y: y + height / 2});
export const rightMiddle = ({x, y, width, height}: Box): Point => ({x: x + width, y: y + height / 2});
export const topMiddle = ({x, y, width}: Box): Point => ({x: x + width / 2, y});
export const bottomMiddle = ({x, y, width, height}: Box): Point => ({x: x + width / 2, y: y + height});

const inset = 9;
const head = 6;

export const DrawnBox: FC<{box: Box; look: string}> = ({box: {label, x, y, width, height}, look}) => <>
  <rect className={classNames('drawn-line', look)} x={x} y={y} width={width} height={height}/>
  <text className="drawn-caption" x={x + inset} y={y + inset} dominantBaseline="hanging">{label}</text>
</>;

const arrowhead = ({x, y}: Point, toward: Point): string => {
  const length = Math.hypot(toward.x - x, toward.y - y);
  const [dx, dy] = [(toward.x - x) / length, (toward.y - y) / length];
  const back = {x: toward.x - dx * head * 2, y: toward.y - dy * head * 2};
  return [toward, {x: back.x - dy * head, y: back.y + dx * head}, {x: back.x + dy * head, y: back.y - dx * head}]
    .map(point => `${point.x},${point.y}`).join(' ');
};

export const DrawnArrow: FC<{from: Point; to: Point}> = ({from, to}) => <>
  <line className="drawn-line drawn" x1={from.x} y1={from.y} x2={to.x} y2={to.y}/>
  <polygon className="drawn-filled" points={arrowhead(from, to)}/>
</>;
