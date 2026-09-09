import {ReactNode} from 'react';
import {MotionDial} from '../../../Controls';
import {Codes, Reveal, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {frameSettle, gap, reducerSource, stateSource, surveySource} from './sources';

export const animatedMotion = (world: World, headerSource: string, cssSource: string, buildSrc: string): ReactNode =>
  <Step title="Let the column settle" dial={<MotionDial name="step-motion"/>} id="step-motion">
    <Words want="The trader must see where the column went and what it pushed aside. A column that snaps home on release, over a neighbour that has already jumped, leaves the eye to work out both.">
      <Says>The reorder has to land instantly for the drag math to stay true, and the hand is
        done the moment you let go. What should move is the real thing, from where it is: the
        column you dropped starts where you dropped it and settles into its slot, and every
        column it shoved aside starts where it stood and slides one carried width over.</Says>
    </Words>
    <Reveal>
      <Says>Nothing is measured after the lift. A strike knows which columns it displaces and
        which way, so the same dispatch that reorders them marks each one shoved toward the
        start or the end, by the carried column’s width from the survey. The drop marks the
        dropped column settling from the offset it was carried to, the same offset the drift
        slice already holds, so the hand and the settle agree to the pixel.
        Every cell reads its mark from the state and wears it as a class and a custom property,
        and CSS owns the motion from there: a keyframe puts the cell where it came from on the
        first frame and lets it slide home.</Says>
      <Says>The direction lives in the class, not the property, on purpose. A column carried
        back over the same neighbour shoves it the other way, the class changes, and the
        browser plays the new keyframe. A mark lives exactly as long as its animation: when the
        keyframe ends, the element hears its own animationend and dispatches that it has
        settled, so the same walk can play again on the next keypress. The lift clears whatever
        is still mid-flight, so a new drag starts clean.</Says>
      {world === 'react'
        ? <Says>The strike, the walk and the drop are dispatches, the slides are keyframes in
          the stylesheet, and settling is a dispatch the element makes when its keyframe ends.
          The static table dispatches the reorder and the release outright: no marks, no
          classes, nothing to animate.</Says>
        : <Says>The strike, the walk and the drop dress the cells, the slides are keyframes in
          the stylesheet, and the cells undress themselves when the keyframe ends. The static
          build releases and stops: no marks, no classes, nothing to animate.</Says>}
      <Says>Rows are the same motion turned vertical: a shoved row slides up or down by the
        carried row’s height, and the dropped row settles from the drop height.</Says>
      <Codes>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...span(headerSource, 'onAnimationEnd={() => dispatch(settled', 'onAnimationEnd={() => dispatch(settled'), gap,
            ...span(reducerSource, "case 'columnMovedBeside':", "return unsettle(shoved, {axis: 'column', held: action.name}"), gap,
            ...unit(stateSource, 'export const shoveColumns'), gap,
            ...unit(stateSource, 'export const settle'),
            aside('// the marks are state; the strike and the drop set them, the cells wear them, the stylesheet moves them')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(buildSrc, 'const columnShoving = '), gap,
            ...unit(buildSrc, 'const columnTo = '), gap,
            ...unit(buildSrc, 'const drop = '), gap,
            ...unit(frameSettle, 'const untilSettled = '),
            aside('// the marks dress the cells; the stylesheet moves them; the cells undress when the keyframe ends')
          ]}/>}
        <Snippet label="TS" lines={[
          ...unit(surveySource, 'export const displacedBetween'), gap,
          ...unit(surveySource, 'export const columnLeft'),
          aside('// who a move displaces, and where the moved column rests, from the survey the lift already took')
        ]}/>
        <Snippet label="CSS" lines={[
          ...unit(cssSource, '.sortable .settling {'), gap,
          ...unit(cssSource, '.sortable .shoved-start {'), gap,
          ...unit(cssSource, '@keyframes settle {'), gap,
          ...unit(cssSource, '@keyframes shoved-start {'),
          aside('/* the only motion code there is */')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;

export const staticMotion = (world: World, headerSource: string, buildSrc: string): ReactNode =>
  <Step title="Leave the motion out" dial={<MotionDial name="step-motion"/>} id="step-motion">
    <Words want="Motion is not free: it competes with the pointer, costs a frame budget, and some traders ask for none at all.">
      <Says>No motion should mean no motion code: not the animated table with its transition
        switched off, but a file with nothing to switch. Its release should read as the whole
        story.</Says>
    </Words>
    <Reveal>
      {world === 'react'
        ? <Says>The static table is a different file. Its release dispatches the release at
          once, and no settling exists in the file to switch off. There is real value beyond
          taste: nothing competes with the pointer, and no motion for prefers-reduced-motion
          users to endure.</Says>
        : <Says>The static build is a different file. Its drop dispatches the release at once,
          and no settling exists in the file to switch off. There is real value beyond taste:
          nothing competes with the pointer, and no motion for prefers-reduced-motion users to
          endure.</Says>}
      <Codes>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...unit(headerSource, 'const release = '),
            aside('// the whole release; no motion code exists in this table')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(buildSrc, 'const drop = '),
            aside('// the whole drop; no motion code exists in this build')
          ]}/>}
      </Codes>
    </Reveal>
  </Step>;
