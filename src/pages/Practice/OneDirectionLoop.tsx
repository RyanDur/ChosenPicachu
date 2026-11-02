import {FC} from 'react';
import {classNames} from '@components/class-names';
import './PracticeDrawing.css';
import './OneDirectionLoop.css';

type Box = {readonly label: string; readonly x: number; readonly y: number};

type Point = {readonly x: number; readonly y: number};

const width = 120;
const height = 40;
const inset = 9;
const head = 6;

const event: Box = {label: 'event', x: 6, y: 30};
const reducer: Box = {label: 'reducer', x: 186, y: 30};
const state: Box = {label: 'state', x: 186, y: 150};
const page: Box = {label: 'page', x: 6, y: 150};
const shell: Box = {label: 'shell', x: 354, y: 90};

const DrawnBox: FC<{box: Box; look: string}> = ({box: {label, x, y}, look}) => <>
  <rect className={classNames('loop-box', look)} x={x} y={y} width={width} height={height}/>
  <text className="drawn-caption" x={x + inset} y={y + inset} dominantBaseline="hanging">{label}</text>
</>;

const arrowhead = ({x, y}: Point, toward: Point): string => {
  const length = Math.hypot(toward.x - x, toward.y - y);
  const [dx, dy] = [(toward.x - x) / length, (toward.y - y) / length];
  const back = {x: toward.x - dx * head * 2, y: toward.y - dy * head * 2};
  return [toward, {x: back.x - dy * head, y: back.y + dx * head}, {x: back.x + dy * head, y: back.y - dx * head}]
    .map(point => `${point.x},${point.y}`).join(' ');
};

const Arrow: FC<{from: Point; to: Point}> = ({from, to}) => <>
  <line className="loop-arrow drawn" x1={from.x} y1={from.y} x2={to.x} y2={to.y}/>
  <polygon className="drawn-filled" points={arrowhead(from, to)}/>
</>;

export const OneDirectionLoop: FC = () =>
  <figure className="practice-drawing">
    <svg className="one-direction-loop drawing center ink-filled" viewBox="0 0 480 220" width="480" height="220" aria-hidden="true">
      <DrawnBox box={event} look="hollow drawn"/>
      <DrawnBox box={reducer} look="hollow drawn"/>
      <DrawnBox box={state} look="hollow drawn"/>
      <DrawnBox box={page} look="hollow drawn"/>
      <DrawnBox box={shell} look="hollow drawn dashed-drawn"/>
      <Arrow from={{x: event.x + width, y: event.y + height / 2}} to={{x: reducer.x, y: reducer.y + height / 2}}/>
      <Arrow from={{x: reducer.x + width / 2, y: reducer.y + height}} to={{x: state.x + width / 2, y: state.y}}/>
      <Arrow from={{x: state.x, y: state.y + height / 2}} to={{x: page.x + width, y: page.y + height / 2}}/>
      <Arrow from={{x: page.x + width / 2, y: page.y}} to={{x: event.x + width / 2, y: event.y + height}}/>
    </svg>
    <figcaption className="caption"><strong className="bold">One direction.</strong> An event goes to the reducer, the
      reducer returns the next state, the page is drawn from the state, and the page sends the next event. The shell,
      drawn apart, holds the state and runs the loop; nothing inside the loop knows it is there.
    </figcaption>
  </figure>;
