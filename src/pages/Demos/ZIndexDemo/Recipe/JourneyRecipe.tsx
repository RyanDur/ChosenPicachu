import {FC} from 'react';
import {Codes, Says, Snippet, Step, Steps, Story, Words, Tell, aside, plain} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import {AlignDial, EntranceDial, SideDial, StackDial} from '../../Controls';
import bannersSource from '@components/Banners/Banners.tsx?raw';
import bannersCss from '@components/Banners/Banners.css?raw';
import '../../Recipe/Recipe.css';

const gap = plain(' ');

export const JourneyRecipe: FC = () =>
  <Story param="news" id="journey"
         can="The news travels, and the pile makes room"
         soThat="arrival and leaving read as motion, not surprise">
    <Tell>A banner that pops into place startles; one that arrives reads as news. So
      every arrival is a small play in two acts: the pile opens a slot while the
      newcomer is still off screen, and only then does the newcomer fly in. Leaving
      runs the play backwards.</Tell>
    <Tell>Three platform traps live here, each marked below as the wrong way: a starting
      style that silently cannot start, a variable that silently does not resolve, and
      a measurement that can only grow.</Tell>
    <Steps>
      <Step title="Open the slot before the flight" dial={<StackDial name="journey-stack"/>}>
        <Words want="The standing banners should glide apart while nobody is watching. The newcomer is still a full screen away.">
          <Says>Each banner is a one-track grid, and the track is the slot: a keyframe
            animation opens it from 0fr on arrival, and the gap below rides along as a
            margin the banner owns itself. It is an animation rather than a transition
            because Chrome never starts a grid-track transition from a starting style;
            keyframes always run on first render. The stack dial turns the same trick
            sideways, where the slot is a column instead of a row.</Says>
        </Words>
        <Codes>
          <Snippet label="CSS" foil lines={[
            plain('.trouble {'),
            plain('  transition: grid-template-rows 0.3s;'),
            plain('  @starting-style {'),
            plain('    grid-template-rows: 0fr;'),
            plain('  }'),
            plain('}'),
            aside('/* parses fine, matches fine, and the transition never starts */')
          ]}/>
          <Snippet label="CSS" lines={[
            ...unit(bannersCss, '@keyframes open-slot'), gap,
            ...unit(bannersCss, '&:where(.stack-down, .stack-up) .trouble {')
          ]}/>
        </Codes>
      </Step>
      <Step title="Arrive from beyond the edge" dial={<EntranceDial name="journey-entrance"/>}>
        <Words want="Seen from the middle of the screen, a slide from beside yourself reads as a pop. The flight has to start where the screen ends.">
          <Says>The starting translate is a full viewport away, and it is written out four
            times because Chrome resolves no var() inside a starting style; hand it a
            variable and the start computes to nothing, so the banner materializes in
            place. The flight is only visible at all because the panel overrides the UA
            popover stylesheet, whose overflow would clip the whole journey to the
            panel’s own box.</Says>
        </Words>
        <Codes>
          <Snippet label="CSS" foil lines={[
            plain('.trouble {'),
            plain('  @starting-style {'),
            plain('    translate: var(--arrive);'),
            plain('  }'),
            plain('}'),
            aside('/* the var never resolves inside a starting style; nothing moves */')
          ]}/>
          <Snippet label="CSS" lines={[
            ...unit(bannersCss, '&.from-above .trouble {'), gap,
            ...unit(bannersCss, '&.from-below .trouble {'), gap,
            ...unit(bannersCss, '&.from-left .trouble {'), gap,
            ...unit(bannersCss, '&.from-right .trouble {'), gap,
            ...span(bannersCss, '/* the UA popover stylesheet', 'overflow: visible;')
          ]}/>
        </Codes>
      </Step>
      <Step title="Leave the way you came">
        <Words want="A dismissed banner should fly out first and only then let the pile close ranks.">
          <Says>The leaving class reverses the order: the flight runs at once, the slot
            and its gap close after it, and the removal itself listens for the track
            transition to end. Remove the element any earlier and the survivors
            snap.</Says>
        </Words>
        <Codes>
          <Snippet label="CSS" lines={[
            ...unit(bannersCss, '&:where(.stack-down, .stack-up) .trouble.leaving')
          ]}/>
          <Snippet label="JS" lines={[
            ...unit(bannersSource, 'const left = ')
          ]}/>
        </Codes>
      </Step>
      <Step title="Stand at your station"
            dial={<><SideDial name="journey-side"/><AlignDial name="journey-align"/></>}>
        <Words want="Nine stations, and no arithmetic: the platform already centers a popover.">
          <Says>The UA stylesheet gives every popover inset 0 and margin auto, which is
            centering. Each station just turns one auto margin into a gap, so top
            center costs one line and so does every other station.</Says>
        </Words>
        <Codes>
          <Snippet label="CSS" lines={[
            ...span(bannersCss, '&.top {', '&.right { margin-inline: auto var(--base-x-2); }')
          ]}/>
        </Codes>
      </Step>
      <Step title="Let the heights settle">
        <Words want="Sideways stacks squeeze their cards, and text that rewraps changes height in a snap.">
          <Says>A ResizeObserver pins each card’s height to a measured value, so a wrap
            becomes a property change and the transition can carry it. The pin releases
            before it measures, because scrollHeight never reads below the box it is
            measuring; a pin that measures through itself can only ratchet
            taller.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" foil lines={[
            plain('card.style.blockSize = `${card.scrollHeight}px`;'),
            aside('/* the box is the floor of its own measurement; this pin grows and never shrinks */')
          ]}/>
          <Snippet label="JS" lines={[
            ...unit(bannersSource, 'const settler = new ResizeObserver(')
          ]}/>
          <Snippet label="CSS" lines={[
            ...span(bannersCss, 'transition: block-size', 'transition: block-size 0.3s;')
          ]}/>
        </Codes>
      </Step>
    </Steps>
  </Story>;
