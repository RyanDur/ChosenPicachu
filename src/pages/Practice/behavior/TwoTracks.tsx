import {FC} from 'react';
import {Box, DrawnArrow, DrawnBox, edges} from './drawn';
import '../PracticeDrawing.css';

const width = 90;
const height = 36;
const success = 38;
const failure = 150;
const landing = 40;

const fetch: Box = {label: 'fetch', x: 6, y: success - height / 2, width, height};
const decode: Box = {label: 'decode', x: 126, y: success - height / 2, width, height};
const trades: Box = {label: 'trades', x: 246, y: success - height / 2, width, height};
const reducer: Box = {label: 'reducer', x: 384, y: success - height / 2, width, height};
const edge: Box = {label: 'edge', x: 384, y: failure - height / 2, width, height};

const Switch: FC<{step: Box}> = ({step}) => {
  const from = edges.bottomMiddle(step);
  return <line className="drawn-line drawn" x1={from.x} y1={from.y} x2={from.x + landing} y2={failure}/>;
};

export const TwoTracks: FC = () =>
  <figure className="practice-drawing">
    <svg className="drawing center ink-filled" viewBox="0 0 480 176" width="480" height="176" aria-hidden="true">
      <text className="drawn-caption" x={6} y={4} dominantBaseline="hanging">success</text>
      <text className="drawn-caption" x={6} y={failure - 6}>failure</text>
      <DrawnBox box={fetch} look="hollow drawn"/>
      <DrawnBox box={decode} look="hollow drawn"/>
      <DrawnBox box={trades} look="hollow drawn"/>
      <DrawnBox box={reducer} look="hollow drawn"/>
      <DrawnBox box={edge} look="hollow drawn"/>
      <DrawnArrow from={edges.rightMiddle(fetch)} to={edges.leftMiddle(decode)}/>
      <DrawnArrow from={edges.rightMiddle(decode)} to={edges.leftMiddle(trades)}/>
      <DrawnArrow from={edges.rightMiddle(trades)} to={edges.leftMiddle(reducer)}/>
      <Switch step={fetch}/>
      <Switch step={decode}/>
      <DrawnArrow from={{x: 6, y: failure}} to={edges.leftMiddle(edge)}/>
    </svg>
    <figcaption className="caption"><strong className="bold">Two tracks.</strong> A result rides the success track to the
      reducer until a step fails. Then it rides the failure track to the edge, where the page decides what to say.
    </figcaption>
  </figure>;
