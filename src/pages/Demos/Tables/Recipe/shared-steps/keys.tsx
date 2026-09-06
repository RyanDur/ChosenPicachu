import {ReactNode} from 'react';
import {MotionDial} from '../../../Controls';
import {Codes, Reveal, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {frameMount, gap, glideCss, glideSource, settlesSource, travelSource} from './sources';

export const bothSlide = (world: World, headerSource: string, buildSrc: string): ReactNode =>
  <Step title="Both parties move, and the platform draws both" dial={<MotionDial name="step-motion"/>}>
    <Words want="A pointer swap explains itself with a ghost in hand; the trader’s keyboard swap has no hand, and if only the neighbour slid, the walked column would simply teleport.">
      <Says>Both parties should explain themselves: each starts where it was and slides to
        where it now sits. Nothing here is special to the keyboard; a walk is a reorder, and a
        reorder settles the same way the pointer’s crossings do.</Says>
    </Words>
    <Reveal>
      <Says>The walk is a dispatch that changes the order, so the animated table shows it through a view transition. Both
        cells are named, so both get a snapshot pair and both slide, each by exactly the other’s
        share, without a keyframe, a measurement, or a line of new CSS. The old version of this
        step measured both shares and marked both columns by hand; that work now belongs to the
        platform.</Says>
      <Codes>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...unit(travelSource, 'export const columnArrows'), gap,
            ...unit(headerSource, 'const walked = '), gap,
            ...span(headerSource, 'onKeyDown={travels ? columnArrows', 'onKeyDown={travels ? columnArrows'),
            aside('// the walk settles; the platform draws both parties')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(travelSource, 'export const columnArrows'), gap,
            ...unit(settlesSource, 'export const ordered'), gap,
            ...span(buildSrc, 'column: (mounted, held) => columnArrows', 'column: (mounted, held) => columnArrows'),
            aside('// the walk settles; the platform draws both parties')
          ]}/>}
      </Codes>
    </Reveal>
  </Step>;

export const paceKey = (): ReactNode =>
  <Step title="Let the platform pace the key">
    <Words want="The trader holds the arrow, and autorepeat must not outrun the slide.">
      <Says>The reflex fix, a timer matched to the CSS by hand, rots the day the CSS changes.
        The next fix, asking each element whether its keyframe is still running, is what this
        step used to teach. A view transition needs neither.</Says>
    </Words>
    <Reveal>
      <Says>A document runs one view transition at a time. When{' '}
        <a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition">startViewTransition</a>
        {' '}is called again while another is still drawing, the platform skips the running one to
        its end and starts the next from the true current positions; nothing is lost and nothing
        bounces. The debounce
        clock is the transition itself, and it is never out of step with the CSS because it is
        the CSS.</Says>
      <Codes>
        <Snippet label="TS" lines={[
          ...unit(glideSource, 'export const glide'),
          aside('// no guard; a newer transition supersedes a running one')
        ]}/>
        <Snippet label="CSS" lines={[
          ...unit(glideCss, '::view-transition-group(*)'),
          aside('/* the 200ms is the pace of every move, keyed or not */')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;

export const cutKey = (world: World, headerSource: string, buildSrc: string): ReactNode =>
  <Step title="Cut on the keypress" dial={<MotionDial name="step-motion"/>}>
    <Words want="Motion is not free, a held key multiplies it, and some traders ask for none at all.">
      <Says>Motion off should cost nothing extra: no marks, no waiting. The static walk should
        be the arrow handler with the slides simply absent.</Says>
    </Words>
    <Reveal>
      <Says>Apply the order and mark nothing; the swap paints on the next frame. With no
        animation running there is nothing to pace, so a held arrow walks the column exactly as
        fast as the key repeats.</Says>
      <Codes>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...unit(travelSource, 'export const columnArrows'), gap,
            ...unit(headerSource, 'const walked = '), gap,
            ...span(headerSource, 'onKeyDown={travels ? columnArrows', 'onKeyDown={travels ? columnArrows'),
            aside('// the whole walk; nothing marked, nothing to wait for')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(travelSource, 'export const columnArrows'), gap,
            ...unit(settlesSource, 'export const cut'), gap,
            ...span(buildSrc, 'column: (mounted, held) => columnArrows', 'column: (mounted, held) => columnArrows'),
            aside('// the whole walk; nothing marked, nothing to wait for')
          ]}/>}
      </Codes>
    </Reveal>
  </Step>;

export const gripArrows = (world: World, rowSrc: string, buildSrc: string, arrows: string): ReactNode =>
  <Step title="Turn the arrows vertical">
    <Words want="A row is the same walk turned vertical, and the grip is already a button under the fingers.">
      <Says>Nothing new should be needed: the grip was focusable from its first appearance, so
        up and down claim the vertical walk the way left and right claimed the horizontal one,
        with the same anchors holding and the same pacing riding whatever motion the build
        declares.</Says>
    </Words>
    <Reveal>
      <Says>The grip listens for the arrows itself, and the walk is the column walk with the
        axis turned: the seats shuffle instead of the order, the dealt edges hold, and the
        marks and pacing ride the build unchanged.</Says>
      <Codes>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...span(rowSrc, 'onArrows={', 'onArrows={'),
            aside('// the grip hears its own arrows; the walk is shared')
          ]}/>
          : <Snippet label="TS" lines={[
            ...span(frameMount, "grip.addEventListener('keydown'", "grip.addEventListener('keydown'"), gap,
            ...span(buildSrc, arrows, arrows),
            aside('// the grip hears its own arrows; the walk is shared')
          ]}/>}
        <Snippet label="TS" lines={[
          ...unit(travelSource, `export const ${arrows}`)
        ]}/>
      </Codes>
    </Reveal>
  </Step>;
