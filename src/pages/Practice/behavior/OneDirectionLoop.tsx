import {FC} from 'react';
import {Box, DrawnArrow, DrawnBox, edges} from './drawn';
import '../PracticeDrawing.css';

const width = 120;
const height = 40;

const event: Box = {label: 'event', x: 6, y: 30, width, height};
const reducer: Box = {label: 'reducer', x: 186, y: 30, width, height};
const state: Box = {label: 'state', x: 186, y: 150, width, height};
const page: Box = {label: 'page', x: 6, y: 150, width, height};
const shell: Box = {label: 'shell', x: 354, y: 90, width, height};

export const OneDirectionLoop: FC = () =>
  <figure className="practice-drawing">
    <svg className="drawing center ink-filled" viewBox="0 0 480 220" width="480" height="220" aria-hidden="true">
      <DrawnBox box={event} look="hollow drawn"/>
      <DrawnBox box={reducer} look="hollow drawn"/>
      <DrawnBox box={state} look="hollow drawn"/>
      <DrawnBox box={page} look="hollow drawn"/>
      <DrawnBox box={shell} look="hollow drawn dashed-drawn"/>
      <DrawnArrow from={edges.rightMiddle(event)} to={edges.leftMiddle(reducer)}/>
      <DrawnArrow from={edges.bottomMiddle(reducer)} to={edges.topMiddle(state)}/>
      <DrawnArrow from={edges.leftMiddle(state)} to={edges.rightMiddle(page)}/>
      <DrawnArrow from={edges.topMiddle(page)} to={edges.bottomMiddle(event)}/>
    </svg>
    <figcaption className="caption"><strong className="bold">One direction.</strong> An event goes to the reducer, the
      reducer returns the next state, the page is drawn from the state, and the page sends the next event. The shell,
      drawn apart, holds the state and runs the loop, and nothing inside the loop knows the shell is there.
    </figcaption>
  </figure>;
