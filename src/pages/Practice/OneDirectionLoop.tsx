import {FC} from 'react';
import {Box, DrawnArrow, DrawnBox} from './drawn';
import './PracticeDrawing.css';

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
      <DrawnArrow from={{x: event.x + width, y: event.y + height / 2}} to={{x: reducer.x, y: reducer.y + height / 2}}/>
      <DrawnArrow from={{x: reducer.x + width / 2, y: reducer.y + height}} to={{x: state.x + width / 2, y: state.y}}/>
      <DrawnArrow from={{x: state.x, y: state.y + height / 2}} to={{x: page.x + width, y: page.y + height / 2}}/>
      <DrawnArrow from={{x: page.x + width / 2, y: page.y}} to={{x: event.x + width / 2, y: event.y + height}}/>
    </svg>
    <figcaption className="caption"><strong className="bold">One direction.</strong> An event goes to the reducer, the
      reducer returns the next state, the page is drawn from the state, and the page sends the next event. The shell,
      drawn apart, holds the state and runs the loop, and nothing inside the loop knows the shell is there.
    </figcaption>
  </figure>;
