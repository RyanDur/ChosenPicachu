import {FC} from 'react';
import {MotionDial} from '../../../Controls';
import {Codes, Reveal, Says, Snippet, Step, Words, lines, carve, Sample} from '../../../Recipe';
import type {World} from '../../../Controls';
import {sources} from './sources';
import {gap} from './gap';

export const AnimatedMotion: FC<{world: World; headerSource: Sample; cssSource: Sample; buildSrc: Sample}> =
  ({world, headerSource, cssSource, buildSrc}) =>
    <Step title="Let the column settle" dial={<MotionDial name="step-motion"/>} id="step-motion">
      <Words want="The trader must see where the column went and what it pushed aside. A column that snaps back to where it started on release, over a neighbor that has already jumped, leaves the reader to work out both.">
        <Says>The reorder has to land instantly for the drag arithmetic to stay true, and the pointer
          carries nothing the moment you let go. What should move is the real thing, from where it is: the
          column you dropped starts where you dropped it and settles into its slot, and every
          column it shoved aside starts where it stood and slides one carried width over.</Says>
      </Words>
      <Reveal>
        {world === 'react'
          ? <>
            <Says>Nothing is measured after the lift. A strike knows which columns it displaces and
              which way, so the same dispatch that reorders them marks each one shoved toward the
              start or the end, by the carried column’s width from the survey. The drop marks the
              dropped column settling from the offset it was carried to, the same offset the drag already holds, so the
              drag and the settle agree to the pixel. Every cell reads its mark from the state and wears it as a class
              and a custom property, and CSS owns the motion from there: a keyframe puts the cell where it came from on
              the first frame and lets it slide into its slot.</Says>
            <Says>The direction is in the class, not the property, on purpose. A column carried
              back over the same neighbor shoves it the other way, the class changes, and the
              browser plays the new keyframe. A mark lives exactly as long as its animation: when the
              keyframe ends, the element gets its own animationend and dispatches that it has
              settled, so the same walk can play again on the next keypress. The lift clears whatever
              is still mid-flight, so a new drag starts clean.</Says>
          </>
          : <>
            <Says>Nothing is measured after the lift. A strike knows which columns it displaces and which way,
              so the same call that reorders them sets a class on each one, shoved toward the start or the end,
              and a custom property with the carried column’s width from the survey. The drop sets the dropped
              column settling from the offset it was carried to, the same offset the hand already holds, so the
              drag and the settle agree to the pixel. CSS owns the motion from there: a keyframe puts the cell
              where it came from on the first frame and lets it slide into its slot.</Says>
            <Says>The direction is in the class, not the property, on purpose. A column carried back over the
              same neighbor shoves it the other way, the class changes, and the browser plays the new keyframe.
              A class lives exactly as long as its animation: when the keyframe ends, the first cell’s
              animationend removes the class from every cell in the column, so the same walk can play again on
              the next keypress. The lift clears whatever is still mid-flight, so a new drag starts clean.</Says>
          </>}
        {world === 'react'
          ? <Says>The strike, the walk and the drop are dispatches, the slides are keyframes in
            the style sheet, and settling is a dispatch the element makes when its keyframe ends.
            The static table wears the same marks and classes; the style sheet gives them an animation
            of zero length, so the marks clear on the same animationend and nothing visibly moves.</Says>
          : <Says>The strike, the walk and the drop set the cells’ classes, and the slides are keyframes in
            the style sheet. The static build sets the same classes; the style sheet gives them an
            animation of zero length, so they clear on the same animationend and nothing visibly moves.</Says>}
        <Says>Rows are the same motion turned vertical: a shoved row slides up or down by the
          carried row’s height, and the dropped row settles from the drop height.</Says>
        <Codes>
          {world === 'react'
            ? <Snippet label="TS" lines={[
              ...carve.span(headerSource, 'onAnimationEnd={() => dispatch(settled', 'onAnimationEnd={() => dispatch(settled'), gap,
              ...carve.span(sources.reducer, "case 'columnMovedBeside':", "return unsettle(shoved, {axis: 'column', held: action.name}"), gap,
              ...carve.unit(sources.state, 'export const shoveColumns'), gap,
              ...carve.unit(sources.state, 'export const settle'),
              lines.aside('// the marks are state; the strike and the drop set them, the cells wear them, the style sheet moves them')
            ]}/>
            : <Snippet label="TS" lines={[
              ...carve.unit(buildSrc, 'const columnShoving = '), gap,
              ...carve.unit(buildSrc, 'const columnTo = '), gap,
              ...carve.unit(buildSrc, 'const drop = '), gap,
              ...carve.unit(sources.frameSettle, 'const untilSettled = '),
              lines.aside('// the marks set the cells’ classes; the style sheet moves them; the first cell’s animationend clears the column')
            ]}/>}
          <Snippet label="TS" lines={[
            ...carve.unit(sources.survey, 'export const displacedBetween'), gap,
            ...carve.unit(sources.survey, 'export const columnLeft'),
            lines.aside('// who a move displaces, and where the moved column rests, from the survey the lift already took')
          ]}/>
          <Snippet label="CSS" lines={[
            ...carve.unit(cssSource, '.sortable.animated .settling {'), gap,
            ...carve.unit(cssSource, '.sortable.animated.hide .settling {'), gap,
            ...carve.unit(cssSource, '.sortable.animated .shoved-start {'), gap,
            ...carve.unit(cssSource, '@keyframes settle {'), gap,
            ...carve.unit(cssSource, '@keyframes settle-from-pointer {'), gap,
            ...carve.unit(cssSource, '@keyframes shoved-start {'), gap,
            ...carve.unit(cssSource, '.sortable.static :is(.settling, .shoved-start, .shoved-end, .shoved-up, .shoved-down) {'),
            lines.aside('/* the only motion code there is; the table wears the word animated, and hide chooses where the settle starts */')
          ]}/>
        </Codes>
      </Reveal>
    </Step>;
