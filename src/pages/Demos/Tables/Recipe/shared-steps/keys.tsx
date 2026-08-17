import {ReactNode} from 'react';
import {MotionDial} from '../../../Controls';
import {Codes, Mdn, Reveal, Says, Snippet, Step, Words, aside} from '../../../Recipe';
import {span, unit} from '../../../Recipe/carve';
import {World} from '../../params';
import {Term} from '../Term';
import {gap, settlesSource, travelSource} from './sources';

export const bothSlide = (world: World, headerSource: string, buildSrc: string, cssSource: string): ReactNode =>
  <Step title="Both parties slide, each by the other’s share" dial={<MotionDial name="step-motion"/>}>
    <Words want="A pointer swap explains itself with a ghost in hand; the trader’s keyboard swap has no hand, and if only the neighbour slid, the walked column would simply teleport.">
      <Says>Both parties should explain themselves: each starts drawn where the other now sits
        and slides home. The pointer track’s slide machinery should work unchanged, handed each
        column the other’s <Term word="share">share</Term>.</Says>
    </Words>
    <Reveal>
      <Says>Mark both columns displaced. The swap still commits instantly, but each party starts
        from the seat it just left, offset by the other’s share, sliding home on the same
        keyframes. The classes arrive as the reorder moves the nodes, so both slides start fresh
        without a line of new CSS.</Says>
      <Codes>
        {world === 'react'
          ? <Snippet label="TS" lines={[
            ...unit(travelSource, 'export const animatedColumnArrows'), gap,
            ...unit(headerSource, 'const ordered = '), gap,
            ...span(headerSource, 'onKeyDown={travels ? animatedColumnArrows', 'onKeyDown={travels ? animatedColumnArrows'),
            aside('// each starts where the other now sits')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(travelSource, 'export const animatedColumnArrows'), gap,
            ...unit(settlesSource, 'export const animatedOrdered'), gap,
            ...span(buildSrc, 'column: (mounted, held) => animatedColumnArrows', 'column: (mounted, held) => animatedColumnArrows'),
            aside('// each starts where the other now sits')
          ]}/>}
        <Snippet label="CSS" lines={[
          ...unit(cssSource, '.sortable .displaced {'),
          aside('/* the pointer track’s keyframe, unchanged; --toward flips the sign */')
        ]}/>
      </Codes>
    </Reveal>
  </Step>;

export const paceKey = (cssSource: string): ReactNode =>
  <Step title="Let the slide pace the key">
    <Words want="The trader holds the arrow, and autorepeat must not outrun the slide.">
      <Says>The reflex fix, a timer matched to the CSS by hand, rots the day the CSS changes.
        Better to ask the platform for its own record of the running slide, so the animation
        itself paces the key.</Says>
    </Words>
    <Reveal>
      <Says>Before nudging, ask the element whether an animation is still
        running: <Mdn path="Web/API/Element/getAnimations">getAnimations</Mdn> is the platform’s
        own record of the slide. While one runs, the key falls silent; when it ends, the next
        repeat lands. The animation is the debounce clock, and CSS already set its
        length.</Says>
      <Codes>
        <Snippet label="TS" lines={[
          ...span(travelSource, 'if (th.getAnimations().length > 0) {', '}'),
          aside('// while the slide runs, the key falls silent')
        ]}/>
        <Snippet label="CSS" lines={[
          ...unit(cssSource, '.sortable .displaced {'),
          aside('/* the 200ms IS the debounce interval */')
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
            ...unit(travelSource, 'export const staticColumnArrows'), gap,
            ...unit(headerSource, 'const ordered = '), gap,
            ...span(headerSource, 'onKeyDown={travels ? staticColumnArrows', 'onKeyDown={travels ? staticColumnArrows'),
            aside('// the whole walk; nothing marked, nothing to wait for')
          ]}/>
          : <Snippet label="TS" lines={[
            ...unit(travelSource, 'export const staticColumnArrows'), gap,
            ...unit(settlesSource, 'export const staticOrdered'), gap,
            ...span(buildSrc, 'column: (mounted, held) => staticColumnArrows', 'column: (mounted, held) => staticColumnArrows'),
            aside('// the whole walk; nothing marked, nothing to wait for')
          ]}/>}
      </Codes>
    </Reveal>
  </Step>;
