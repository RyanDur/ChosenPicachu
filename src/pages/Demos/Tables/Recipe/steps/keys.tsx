import {FC} from 'react';
import {MotionDial} from '../../../Controls';
import {Codes, Reveal, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {arrowsSource, frameSettle, gap} from './sources';
import {Sample} from '@pages/Demos/Recipe/sample';

export const WalkSlides: FC<{world: World; headerSource: Sample; buildSrc: Sample}> = ({world, headerSource, buildSrc}) =>
  <Step title="Both parties slide" dial=<MotionDial name="step-motion"/>>
    <Words want="A pointer swap explains itself with the column in hand; the trader’s keyboard swap has no pointer, and if only the neighbour slid, the walked column would simply jump.">
      <Says>Both parties should explain themselves: each starts where it was and slides to
        where it now sits. A walk is a reorder, and it wears the same marks a strike does, plus
        one for the column that walked.</Says>
    </Words>
    <Reveal>
      <Says>The arrow measures the header row at the keypress, the way the lift takes its
        survey, and passes the widths to the walk. The walk dispatches the reorder with two
        marks: the neighbour is shoved by the walked column’s width, and the walked column
        settles from across the neighbour’s. The stylesheet slides both, and each clears its
        own mark when its keyframe ends, so a held key walks the column step by step, sliding
        every step.</Says>
      <Codes>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...unit(arrowsSource, 'export const columnArrows'), gap,
            ...unit(headerSource, 'const walkedTo = '), gap,
            ...span(headerSource, 'onAnimationEnd={() => dispatch(settled', 'onAnimationEnd={() => dispatch(settled'),
            aside('// the walk marks both parties; the stylesheet slides them; the keyframe’s end clears the mark')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(arrowsSource, 'export const columnArrows'), gap,
            ...unit(buildSrc, 'const columnTo = '), gap,
            ...unit(frameSettle, 'const untilSettled = '),
            aside('// the walk marks both parties; the stylesheet slides them; the keyframe’s end clears the mark')
          ]}/>}
      </Codes>
    </Reveal>
  </Step>;

export const CutKey: FC<{world: World; headerSource: Sample; buildSrc: Sample}> = ({world, headerSource, buildSrc}) =>
  <Step title="Cut on the keypress" dial=<MotionDial name="step-motion"/>>
    <Words want="Motion is not free, a held key multiplies it, and some traders ask for none at all.">
      <Says>Motion off should cost nothing extra: no waiting. The static walk should be the arrow
        handler with the slides simply absent.</Says>
    </Words>
    <Reveal>
      <Says>Apply the order; the marks still land, and the zero-length animation clears them at once,
        so the swap paints on the next frame. With no
        animation running there is nothing to pace, so a held arrow walks the column exactly as
        fast as the key repeats.</Says>
      <Codes>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...unit(arrowsSource, 'export const columnArrows'), gap,
            ...span(headerSource, 'onKeyDown={travels ? columnArrows', 'onKeyDown={travels ? columnArrows'), gap,
            ...unit(headerSource, 'const walkedTo = '),
            aside('// the whole walk; nothing marked, nothing to wait for')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(arrowsSource, 'export const columnArrows'), gap,
            ...unit(buildSrc, 'const columnTo = '), gap,
            ...span(buildSrc, "th.addEventListener('keydown', columnArrows", "th.addEventListener('keydown', columnArrows"),
            aside('// the whole walk; nothing marked, nothing to wait for')
          ]}/>}
      </Codes>
    </Reveal>
  </Step>;

export const GripArrows: FC<{world: World; rowSource: Sample; buildSrc: Sample}> = ({world, rowSource, buildSrc}) =>
  <Step title="Turn the arrows vertical">
    <Words want="A row is the same walk turned vertical, and the grip is already a button.">
      <Says>Nothing new should be needed: the grip was focusable from its first appearance, so
        up and down make the vertical walk the way left and right make the horizontal one,
        except that rows have no anchors: any row may move, and a walk stops at the table’s ends.</Says>
    </Words>
    <Reveal>
      <Says>The grip handles the arrows itself, and the walk is the column walk with the
        axis turned: the seats shuffle instead of the order, and a walk stops at the first and last seat.</Says>
      <Codes>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...span(rowSource, 'onKeyDown={rowArrows(', 'onKeyDown={rowArrows('),
            aside('// the grip handles its own arrows; the walk is shared')
          ]}/>
          : <Snippet label="TS" lines={[
            ...span(buildSrc, "grip.addEventListener('keydown'", "grip.addEventListener('keydown'"), gap,
            ...unit(buildSrc, 'const rowTo = '),
            aside('// the grip handles its own arrows; the walk is shared')
          ]}/>}
        <Snippet label="TS" lines={[
          ...unit(arrowsSource, 'export const rowArrows')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;
