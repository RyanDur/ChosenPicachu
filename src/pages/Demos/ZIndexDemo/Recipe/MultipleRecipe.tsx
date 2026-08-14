import {FC} from 'react';
import {useSearchParamsObject} from '@components/search-params';
import {Entrance, Stack, enterParam, stackParam} from '@components/Banners/params';
import {Codes, Says, Snippet, Step, Steps, Story, Words, Tell, aside, plain} from '../../Recipe';
import {span, unit} from '../../Recipe/carve';
import {EntranceDial, StackDial} from '../../Controls';
import bannersSource from '@components/Banners/Banners.tsx?raw';
import providerSource from '@components/Banners/BannerProvider.tsx?raw';
import bannersCss from '@components/Banners/Banners.css?raw';
import '../../Recipe/Recipe.css';

const gap = plain(' ');

const stackFact: Record<Stack, string> = {
  down: 'the pile grows downward and the slot is a row: a keyframe animation opens grid-template-rows from 0fr on arrival, and the gap below rides along as a margin the banner owns itself.',
  up: 'the pile grows upward and the slot is a row: a keyframe animation opens grid-template-rows from 0fr on arrival, and the gap the banner owns rides along as a margin.',
  left: 'the pile grows leftward and the slot is a column: a keyframe animation opens grid-template-columns from 0fr on arrival, and the gap beside the banner rides along as a margin.',
  right: 'the pile grows rightward and the slot is a column: a keyframe animation opens grid-template-columns from 0fr on arrival, and the gap beside the banner rides along as a margin.'
};

const enterFact: Record<Entrance, string> = {
  above: 'This entrance starts a full viewport above the screen,',
  below: 'This entrance starts a full viewport beneath the screen,',
  left: 'This entrance starts a full viewport past the left edge,',
  right: 'This entrance starts a full viewport past the right edge,'
};

const sideways = (stack: Stack): boolean => stack === 'left' || stack === 'right';

const slotKeyframes = (stack: Stack): string => sideways(stack) ? '@keyframes open-column' : '@keyframes open-slot';

const slotRule = (stack: Stack): string => sideways(stack)
  ? '&:where(.stack-left, .stack-right) .trouble {'
  : '&:where(.stack-down, .stack-up) .trouble {';

const leavingRule = (stack: Stack): string => sideways(stack)
  ? '&:where(.stack-left, .stack-right) .trouble.leaving'
  : '&:where(.stack-down, .stack-up) .trouble.leaving';

const settleStep = (
  <Step title="Let the heights settle">
    <Words want="Sideways piles squeeze their cards, and text that rewraps changes height in a snap.">
      <Says>A ResizeObserver pins each card’s height to a measured value, so a wrap
        becomes a property change and the transition can carry it. The pin releases
        before it measures, because scrollHeight never reads below the box it is
        measuring; a pin that measures through itself can only ratchet taller.</Says>
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
);

export const MultipleRecipe: FC = () => {
  const {enter = 'above', stack = 'down'} = useSearchParamsObject({enter: enterParam, stack: stackParam});

  return <Story param="news" id="many"
         can="The user can have multiple banners"
         soThat="no message waits for another to leave">
    <Tell>News rarely arrives alone, so the banners stand in a pile. Every arrival is a
      small play in two acts: the pile opens a slot while the newcomer is still off
      screen, and only then does the newcomer fly in. Leaving runs the play
      backwards.</Tell>
    <Tell>Platform traps live here, each marked below as the wrong way: a starting style
      that silently cannot start, and a variable that silently does not resolve.</Tell>
    <Steps>
      <Step title="Refuse the duplicate">
        <Words want="Multiple means different. The second copy of the same sentence adds noise, not information.">
          <Says>raise looks for its message among the standing banners and appends only
            when it is new. Dismiss a banner and the same message may stand again; the
            pile remembers what stands, not what stood.</Says>
        </Words>
        <Codes>
          <Snippet label="JS" foil lines={[
            plain('const raise = (message) =>'),
            plain('  setBanners(standing => [...standing, {message}]);'),
            aside('// raised three times, standing three times')
          ]}/>
          <Snippet label="JS" lines={[
            ...unit(providerSource, 'const raise = useCallback(')
          ]}/>
        </Codes>
      </Step>
      <Step title="Open the slot before the flight" dial={<StackDial name="journey-stack"/>}>
        <Words want="The standing banners should glide apart while nobody is watching. The newcomer is still a full screen away.">
          <Says>Each banner is a one-track grid, and here {stackFact[stack]} It is an
            animation rather than a transition because Chrome never starts a grid-track
            transition from a starting style; keyframes always run on first
            render.</Says>
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
            ...unit(bannersCss, slotKeyframes(stack)), gap,
            ...unit(bannersCss, slotRule(stack))
          ]}/>
        </Codes>
      </Step>
      <Step title="Arrive from beyond the edge" dial={<EntranceDial name="journey-entrance"/>}>
        <Words want="Seen from the middle of the screen, a slide from beside yourself reads as a pop. The flight has to start where the screen ends.">
          <Says>{enterFact[enter]} and the four edges are written out as four literal
            rules because Chrome resolves no var() inside a starting style; hand it a
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
            ...unit(bannersCss, leavingRule(stack))
          ]}/>
          <Snippet label="JS" lines={[
            ...unit(bannersSource, 'const left = ')
          ]}/>
        </Codes>
      </Step>
      {sideways(stack) && settleStep}
    </Steps>
  </Story>;
};
