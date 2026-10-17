import {FC} from 'react';
import {Link} from 'react-router';
import {Paths} from '@pages/Paths';
import {DemoTopics} from '../../../types';
import {MotionDial} from '../../../Controls';
import {Codes, Mdn, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {gap, glideSource, marksSource, sessionSource} from './sources';
import {Sample} from '@pages/Demos/Recipe/sample';

export const SlideCrossed: FC<{listSource: Sample; cssSource: Sample}> = ({listSource, cssSource}) =>
  <Step title="Slide the crossed item into place" dial=<MotionDial name="native-motion"/>>
    <Words want="An eager swap that jumps is hard to follow. A view transition, the browser’s way of animating a page from one state to the next by taking a picture of both, cannot run during the drag: its capture, that picture, would swallow the drag’s own events.">
      <Says>The swap happens at once. The crossed item gets the class <code>pushed</code>, and its{' '}
        <Mdn path="Web/CSS/@keyframes">keyframe</Mdn>’s from, the keyframe’s starting state, is one place over: the
        browser draws the item where it used to be and slides it to its new place.</Says>
      <Says>It is the{' '}
        <Link className="signpost" to={`${Paths.demos}?tab=${DemoTopics.charts}`}>charts demo</Link>’s keyframe turned
        horizontal, with the direction as data: <code>--toward</code>, a custom property, a value given a name once and read
        back with <code>var()</code>,
        flips the sign of one keyframe instead of naming two.</Says>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        ...unit(marksSource, 'export const crossedMark'), gap,
        ...span(listSource, 'setPushed(crossedMark(item, homeward));', 'setPushed(crossedMark(item, homeward));')
      ]}/>
      <Snippet label="CSS" lines={[
        ...unit(cssSource, '.sortable-list .pushed {'), gap,
        ...unit(cssSource, '@keyframes pushed')
      ]}/>
    </Codes>
  </Step>;

export const GlideSettle: FC<{listSource: Sample}> = ({listSource}) =>
  <Step title="Glide the settle one tick after the release" dial=<MotionDial name="native-motion"/>>
    <Words want="A lazy settle happens all at once on release, which suits a view transition. A view transition is the browser’s way of animating a page from one state to the next by taking a picture of both; its capture, that picture, swallows the drag’s events if it is taken while the drag is still running, and the drag is still running when drop fires.">
      <Says><Mdn path="Web/CSS/view-transition-name">Name each item for the transition</Mdn> and run the settle a tick
        after the release, a setTimeout with no delay, which runs once the drag has ended. By the time{' '}
      <Mdn path="Web/API/Document/startViewTransition">startViewTransition</Mdn> takes its capture, the browser has
        finished the drag, and every item glides from where the drag left it to where the order puts it.</Says>
    </Words>
    <Codes>
      <Snippet label="HTML" lines={[
        ...span(listSource, 'viewTransitionName: `sort-${item}`', 'viewTransitionName: `sort-${item}`')
      ]}/>
      <Snippet label="TS" lines={[
        ...unit(sessionSource, 'export const glided'), gap,
        ...span(listSource, 'landedOrder(aloft, landing, order).map(glided(setOrder));', 'landedOrder(aloft, landing, order).map(glided(setOrder));'), gap,
        ...unit(glideSource, 'export const glide')
      ]}/>
    </Codes>
  </Step>;

export const DirectState: FC<{listSource: Sample}> = ({listSource}) =>
  <Step title="Apply the state update directly" dial=<MotionDial name="native-motion"/>>
    <Words want="Motion is not free: it competes with the drag, costs a frame, and some readers ask for none.">
      <Says>This is the static list, and it has no motion code. The handler sets the order and React draws it on the next
        frame; a keyboard move sets the order the same way.</Says>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        ...span(listSource, 'onArranged={(after, walker) => {', '}}/>'),
        aside('// nothing marked, nothing competing with the browser’s drag')
      ]}/>
    </Codes>
  </Step>;
