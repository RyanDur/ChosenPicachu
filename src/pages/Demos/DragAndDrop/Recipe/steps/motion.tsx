import {FC} from 'react';
import {TabLink} from '@pages/Demos/TabLink';
import {DemoTopics} from '../../../demo-topics';
import {MotionDial} from '../../../Controls';
import {Codes, Mdn, Says, Snippet, Step, Words, lines, carve} from '../../../Recipe';
import {sources} from './sources';

export const SlideCrossed: FC = () =>
  <Step title="Slide the crossed item into place" dial={<MotionDial name="native-motion"/>}>
    <Words want="An eager swap that jumps is hard to follow. A view transition, the browser’s way of animating a page from one state to the next by taking a picture of both, cannot run during the drag: its capture, that picture, would swallow the drag’s own events.">
      <Says>The swap happens at once. The crossed item gets the class{' '}
        <code className="monospaced">sliding-in</code>. Its slide is a{' '}
        <Mdn path="Web/CSS/@keyframes">keyframe</Mdn> animation: an @keyframes rule names the states an element passes
        through, and the browser draws the frames between them. This one, <code className="monospaced">slide-in</code>,
        writes only its from, the starting state, so the browser draws the item where it used to be and slides it to its
        new place.</Says>
      <Says>Where it used to be is data. It sits in a{' '}
        <TabLink to={DemoTopics.accordions}>custom property</TabLink>, a value the style sheet can read.{' '}
        <code className="monospaced">--starts-places-right</code> says how many places to the right of its new place the
        item starts: 1 when it starts from the right, -1 when it starts from the left. Both directions share the one
        keyframe. It reads the number with <code className="monospaced">var()</code>.</Says>
      <Says>The list wears a class for its pace, here <code className="monospaced">eager-paced</code>, and that
        class’s rule sets how long the slide runs from <code className="monospaced">--eager-slide-duration</code>, a
        custom property in the site’s timing style sheet that holds 0.15s. The <code className="monospaced">&</code>{' '}
        stands for the rule it sits inside, here <code className="monospaced">.sortable-list</code>.</Says>
      <Says>The slide has two names, <code className="monospaced">sliding-in</code> and{' '}
        <code className="monospaced">sliding-in-again</code>, and both run the same keyframes. A new start moves the item
        to the other name, so the browser starts the slide over even when the last one ended a moment before.</Says>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        ...carve.unit(sources.slideStarts, 'const afterCrossing'), lines.blank,
        ...carve.unit(sources.dragSort, 'const crossed')
      ]}/>
      <Snippet label="CSS" lines={[
        ...carve.unit(sources.sortableListCss, '.sliding-in {'), lines.blank,
        ...carve.unit(sources.sortableListCss, '.sliding-in-again {'), lines.blank,
        ...carve.unit(sources.sortableListCss, '&.eager-paced :is(.sliding-in, .sliding-in-again) {'), lines.blank,
        ...carve.unit(sources.sortableListCss, '@keyframes slide-in {'), lines.blank,
        ...carve.unit(sources.sortableListCss, '@keyframes slide-in-again {')
      ]}/>
    </Codes>
  </Step>;
