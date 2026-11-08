import {FC} from 'react';
import {MotionDial} from '../../../Controls';
import {Codes, Mdn, Sample, Says, Snippet, Step, Words, lines, carve} from '../../../Recipe';
import {sources} from './sources';

const gap = lines.plain(' ');

export const GlideSettle: FC<{listSource: Sample}> = ({listSource}) =>
  <Step title="Glide the settle one tick after the release" dial={<MotionDial name="native-motion"/>}>
    <Words want="A lazy settle happens all at once on release, which suits a view transition. A view transition is the browser’s way of animating a page from one state to the next by taking a picture of both; its capture, that picture, swallows the drag’s events if it is taken while the drag is still running, and the drag is still running when drop fires.">
      <Says><Mdn path="Web/CSS/view-transition-name">Name each item for the transition</Mdn> and run the settle a tick
        after the release, a setTimeout with no delay, which runs once the drag has ended. By the time{' '}
      <Mdn path="Web/API/Document/startViewTransition">startViewTransition</Mdn> takes its capture, the browser has
        finished the drag, and every item glides from where the drag left it to where the order puts it.</Says>
    </Words>
    <Codes>
      <Snippet label="HTML" lines={[
        ...carve.span(listSource, 'viewTransitionName: `sort-${item}`', 'viewTransitionName: `sort-${item}`')
      ]}/>
      <Snippet label="TS" lines={[
        ...carve.unit(sources.session, 'const glided'), gap,
        ...carve.span(listSource, 'session.landedOrder(aloft, landing, order).map(session.glided(setOrder));', 'session.landedOrder(aloft, landing, order).map(session.glided(setOrder));'), gap,
        ...carve.unit(sources.glide, 'export const glide')
      ]}/>
    </Codes>
  </Step>;
