import {TabLink} from '@pages/Demos/TabLink';
import {DemoTopics} from '../../../demo-topics';
import {FC} from 'react';
import {Codes, Mdn, Says, Snippet, Step, Words, lines, carve} from '../../../Recipe';
import {sources} from './sources';

export const HoldTheAloft: FC = () =>
  <Step title="Keep which item is held in state, not in the drag’s payload">
    <Words want={<><Mdn path="Web/API/DataTransfer">dataTransfer</Mdn> is the object a drag event carries its data in,
      the payload. It exists to carry data between windows, and mid-drag it is locked: a handler
      for <Mdn path="Web/API/HTMLElement/dragover_event">dragover</Mdn>, the event the browser fires again and again
      on whatever the pointer is over, may not read what dragstart wrote. So the payload cannot steer the sort.</>}>
      <Says>Your first try writes the item into the payload at dragstart and reads it back in dragover, and the read
        comes back empty. That is not a bug: the browser seals the payload during the drag, so a window the pointer
        passes over cannot read data that was never dropped on it.</Says>
      <Says>Keep it in state instead. <TabLink to={DemoTopics.zIndex}>State</TabLink> is the data a render draws from.
        React keeps the list’s state and hands every change to
        a <TabLink to={DemoTopics.zIndex}>reducer</TabLink>, a function that takes the state and an action and returns
        the next state. An action is an object that names what happened, such
        as <code className="monospaced">lifted</code>. A <TabLink to={DemoTopics.zIndex}>context</TabLink> hands the
        state to every part of the list without passing it through each one.</Says>
      <Says>To <TabLink to={DemoTopics.zIndex}>dispatch</TabLink> is to send the reducer an action. The lift dispatches <code className="monospaced">lifted</code> with the item’s name, and the reducer records
        the item as <code className="monospaced">held</code>. The release clears it, and every handler in between reads
        the same value the render does. The payload is still there for the case where another window needs the
        data.</Says>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        ...carve.span(sources.dragSort, "case 'lifted':", "case 'lifted':"),
        lines.aside('// the item dispatches its lift; the reducer records which one is held')
      ]}/>
    </Codes>
  </Step>;
