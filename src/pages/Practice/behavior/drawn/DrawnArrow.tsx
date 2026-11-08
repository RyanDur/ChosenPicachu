import {FC} from 'react';
import {Point} from './edges';

const head = 6;

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
