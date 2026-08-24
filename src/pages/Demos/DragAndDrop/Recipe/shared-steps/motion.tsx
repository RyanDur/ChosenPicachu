import {ReactNode} from 'react';
import {MotionDial} from '../../../Controls';
import {Codes, Mdn, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {gap, glideSource, marksSource, sessionSource} from './sources';

export const slideCrossed = (listSource: string, cssSource: string): ReactNode =>
  <Step title="Slide the crossed item home" dial={<MotionDial name="native-motion"/>}>
    <Words want="An eager swap that teleports is hard to follow, yet nothing can be animated mid-session by view transitions; the capture would swallow the drag’s own events.">
      <Says>The swap commits instantly and the crossed item is merely drawn where it used
        to be, sliding home on a <Mdn path="Web/CSS/@keyframes">keyframe</Mdn> whose from is one
        seat over, the same slide the tables demo plays, turned horizontal, with the direction as
        data: --toward flips the sign of one keyframe instead of naming two. The animation
        is theater: the swap has already happened, and the slide only tells you what did.</Says>
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

export const glideSettle = (listSource: string): ReactNode =>
  <Step title="Glide the settle, one tick after" dial={<MotionDial name="native-motion"/>}>
    <Words want="A lazy settle happens all at once on release, the perfect moment for a view transition, except the drag session is still alive when the drop fires, and a capture mid-session swallows its events.">
      <Says><Mdn path="Web/CSS/view-transition-name">Name each item for the transition</Mdn> and
        defer the settle one tick past the release. By the
        time <Mdn path="Web/API/Document/startViewTransition">startViewTransition</Mdn> captures
        the page, the platform has finished its ceremony, and every item glides from where the
        drag left it to where the order says it belongs. The animation is theater: the order
        has already settled, and the glide only tells you what did.</Says>
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

export const directState = (listSource: string): ReactNode =>
  <Step title="Apply the state update directly" dial={<MotionDial name="native-motion"/>}>
    <Words want="Motion is not free: it competes with the drag session, costs a frame budget, and some users ask for none at all.">
      <Says>This is the static list; no marking code exists in it. The order applies and React
        paints next frame; a keyboard walk is applied as plainly as everything else.</Says>
    </Words>
    <Codes>
      <Snippet label="TS" lines={[
        ...span(listSource, 'onArranged={(after, walker) => {', '}}/>'),
        aside('// nothing marked, nothing competing with the session')
      ]}/>
    </Codes>
  </Step>;
