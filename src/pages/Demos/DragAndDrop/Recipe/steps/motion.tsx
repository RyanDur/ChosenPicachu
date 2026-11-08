import {FC} from 'react';
import {TabLink} from '@pages/Demos/TabLink';
import {DemoTopics} from '../../../types';
import {MotionDial} from '../../../Controls';
import {Codes, Mdn, Sample, Says, Snippet, Step, Words, lines, carve} from '../../../Recipe';
import {sources} from './sources';

const gap = lines.plain(' ');

export const SlideCrossed: FC<{cssSource: Sample}> = ({cssSource}) =>
  <Step title="Slide the crossed item into place" dial={<MotionDial name="native-motion"/>}>
    <Words want="An eager swap that jumps is hard to follow. A view transition, the browser’s way of animating a page from one state to the next by taking a picture of both, cannot run during the drag: its capture, that picture, would swallow the drag’s own events.">
      <Says>The swap happens at once. The crossed item gets the class{' '}
        <code className="monospaced">sliding-in</code>. Its slide is a{' '}
        <Mdn path="Web/CSS/@keyframes">keyframe</Mdn> animation: an @keyframes rule names the states an element passes
        through, and the browser draws the frames between them. This one, <code className="monospaced">slide-in</code>,
        writes only its from, the starting state, so the browser draws the item where it used to be and slides it to its
        new place.</Says>
      <Says>Where it used to be is data. It sits in a custom property, a value the style sheet can read. The{' '}
        <TabLink to={DemoTopics.accordions}>accordions tab</TabLink> teaches custom properties.{' '}
        <code className="monospaced">--starts-places-right</code> says how many places to the right of its new place the
        item starts: 1 when it starts from the right, -1 when it starts from the left. The one keyframe reads the
        number with <code className="monospaced">var()</code>, so both directions share it.</Says>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        ...carve.unit(sources.slideStarts, 'const afterCrossing'), gap,
        ...carve.unit(sources.dragSort, 'const crossed')
      ]}/>
      <Snippet label="CSS" lines={[
        ...carve.unit(cssSource, '.sortable-list .sliding-in {'), gap,
        ...carve.unit(sources.sortableListCss, '@keyframes slide-in')
      ]}/>
    </Codes>
  </Step>;
